import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";

const SKILLS_ROOT = "C:\\Users\\Veerapong\\AppData\\Roaming\\devin\\skills";
const CONCURRENCY = 3;
const CRW_TIMEOUT_MS = 30000;
const MAX_ROUTES_PER_GROUP = 3;
const MAX_GROUPS = 20;

interface Result {
  skill: string;
  status: "updated" | "skipped" | "crw-failed" | "crw-timeout" | "parse-failed" | "no-change";
  note: string;
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

function sameHostname(a: string, b: string): boolean {
  return getHostname(a) === getHostname(b);
}

function parseWebsiteUrl(text: string): string | null {
  const match = text.match(/- \[Website\]\(([^)]+)\)/);
  if (!match) return null;
  const url = match[1].trim();
  if (!url.startsWith("http")) return null;
  return url;
}

function parseDocumentationUrl(text: string): string | null {
  const match = text.match(/- \[Documentation\]\(([^)]+)\)/);
  return match ? match[1].trim() : null;
}

function normalizePath(url: string): string {
  try {
    const u = new URL(url);
    let p = u.pathname.replace(/\/$/, "");
    if (!p) return "/";
    return p;
  } catch {
    return "/";
  }
}

function groupRoutes(paths: string[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  for (const p of paths) {
    const first = p === "/" ? "/" : p.split("/").filter(Boolean)[0] ?? "/";
    const arr = groups.get(first) ?? [];
    if (!arr.includes(p)) arr.push(p);
    groups.set(first, arr);
  }
  return groups;
}

async function runCrwMap(url: string): Promise<{ json: any; error?: string }> {
  try {
    const proc = Bun.spawn({
      cmd: ["crw", "map", url, "--format", "json"],
      stdout: "pipe",
      stderr: "pipe",
      timeout: CRW_TIMEOUT_MS,
    });
    const exitCode = await proc.exited;
    const out = await new Response(proc.stdout).text();
    const err = await new Response(proc.stderr).text();
    if (exitCode !== 0) return { json: null, error: err || `crw exit ${exitCode}` };
    try {
      return { json: JSON.parse(out) };
    } catch (e) {
      return { json: null, error: `json parse: ${e}` };
    }
  } catch (e: any) {
    return { json: null, error: e.message || String(e) };
  }
}

class Semaphore {
  private queue: (() => void)[] = [];
  private count: number;
  constructor(n: number) {
    this.count = n;
  }
  acquire() {
    return new Promise<void>((resolve) => {
      if (this.count > 0) {
        this.count--;
        resolve();
      } else {
        this.queue.push(resolve);
      }
    });
  }
  release() {
    const next = this.queue.shift();
    if (next) {
      next();
    } else {
      this.count++;
    }
  }
}

async function processFile(filePath: string, skill: string, results: Result[], limiter: Semaphore) {
  await limiter.acquire();
  try {
    const text = await Bun.file(filePath).text();
    const websiteUrl = parseWebsiteUrl(text);
    if (!websiteUrl) {
      results.push({ skill, status: "skipped", note: "no [Website] link" });
      return;
    }

    const crw = await runCrwMap(websiteUrl);
    if (!crw.json) {
      if (crw.error?.toLowerCase().includes("timeout")) {
        results.push({ skill, status: "crw-timeout", note: crw.error });
      } else {
        results.push({ skill, status: "crw-failed", note: crw.error });
      }
      return;
    }

    const links: string[] = crw.json.links || [];
    const paths = links
      .filter((l) => sameHostname(websiteUrl, l))
      .map(normalizePath)
      .filter((p, i, arr) => arr.indexOf(p) === i)
      .sort();

    if (paths.length === 0) {
      results.push({ skill, status: "skipped", note: "no same-origin routes" });
      return;
    }

    const groups = groupRoutes(paths);
    const sortedGroups = [...groups.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(0, MAX_GROUPS);

    const docUrl = parseDocumentationUrl(text);
    const heading = skill
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const lines: string[] = [];
    lines.push(`# ${heading} Route Map`);
    lines.push("");
    lines.push(`- Website: <${websiteUrl}>`);
    if (docUrl) lines.push(`- Documentation: <${docUrl}>`);
    lines.push(`- Total routes discovered: ${paths.length}`);
    lines.push("");
    lines.push("## Top routes by section");
    lines.push("");

    for (const [group, routes] of sortedGroups) {
      lines.push(`### ${group}`);
      const examples = routes.slice(0, MAX_ROUTES_PER_GROUP);
      for (const r of examples) {
        lines.push(`- ${r}`);
      }
      if (routes.length > MAX_ROUTES_PER_GROUP) {
        lines.push(`- ... and ${routes.length - MAX_ROUTES_PER_GROUP} more`);
      }
      lines.push("");
    }

    const outPath = join(SKILLS_ROOT, skill, "references", "routes.md");
    const existing = await Bun.file(outPath).exists();
    const existingText = existing ? await Bun.file(outPath).text() : "";
    const outText = lines.join("\n").trim() + "\n";

    if (existingText.trim() === outText.trim()) {
      results.push({ skill, status: "no-change", note: `up to date` });
      return;
    }

    mkdirSync(dirname(outPath), { recursive: true });
    await Bun.write(outPath, outText);
    results.push({ skill, status: "updated", note: `${paths.length} routes` });
  } catch (e: any) {
    results.push({ skill, status: "parse-failed", note: e.message || String(e) });
  } finally {
    limiter.release();
  }
}

async function main() {
  const glob = new Bun.Glob("*/references/website.md");
  const files: string[] = [];
  for await (const f of glob.scan({ cwd: SKILLS_ROOT, absolute: true })) {
    files.push(f);
  }

  const limiter = new Semaphore(CONCURRENCY);
  const results: Result[] = [];

  await Promise.all(
    files.map((f) => {
      const skill = f.replace(SKILLS_ROOT + "\\", "").split("\\")[0];
      return processFile(f, skill, results, limiter);
    })
  );

  const counts = results.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log("Summary:", counts);
  console.log("Details:");
  for (const r of results) {
    if (r.status !== "updated" && r.status !== "no-change") {
      console.log(`- ${r.skill}: ${r.status} (${r.note})`);
    }
  }
}

main();
