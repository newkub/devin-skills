import { $ } from "bun";
import { join } from "node:path";

const SKILLS_ROOT = "C:\\Users\\Veerapong\\AppData\\Roaming\\devin\\skills";
const CONCURRENCY = 5;
const CRW_TIMEOUT_MS = 30000;

const DOC_PATHS = ["doc", "guide", "getting-started", "learn", "intro", "manual", "reference", "tutorial"];

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

function sameSite(a: string, b: string): boolean {
  const ha = getHostname(a);
  const hb = getHostname(b);
  if (!ha || !hb) return false;
  if (ha === hb) return true;
  // allow www / non-www only
  const normalA = ha.replace(/^www\./, "");
  const normalB = hb.replace(/^www\./, "");
  return normalA === normalB;
}

function isSameOrigin(a: string, b: string): boolean {
  return getHostname(a) === getHostname(b);
}

function pickDocumentation(websiteUrl: string, links: string[]): string | null {
  const candidates = links.filter((l) => {
    if (!isSameOrigin(websiteUrl, l)) return false;
    if (l.toLowerCase().includes("docs.github.com")) return false;
    const lower = l.toLowerCase();
    return DOC_PATHS.some((p) => lower.includes(`/${p}`));
  });
  // Prefer /docs then /guide then the shortest with getting-started/learn
  for (const c of candidates) {
    if (/\/docs\/?$/i.test(c)) return c;
  }
  for (const c of candidates) {
    if (/\/guide(?:s)?\/?$/i.test(c)) return c;
  }
  for (const c of candidates) {
    if (/getting-started/i.test(c)) return c;
  }
  return candidates[0] ?? null;
}

function pickRepository(links: string[]): string | null {
  for (const l of links) {
    if (l.toLowerCase().includes("github.com") || l.toLowerCase().includes("gitlab.com")) return l;
  }
  return null;
}

function cleanDescription(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/Contribute to [^\.]+ by creating an account on GitHub\./i, "")
    .replace(/\n/g, " ")
    .trim();
}

function isDocUrl(websiteUrl: string, url: string): boolean {
  if (!isSameOrigin(websiteUrl, url)) return false;
  if (url.toLowerCase().includes("docs.github.com")) return false;
  const lower = url.toLowerCase();
  return DOC_PATHS.some((p) => lower.includes(`/${p}`));
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 3) + "...";
}

function parseWebsiteUrl(text: string): string | null {
  const match = text.match(/- \[Website\]\(([^)]+)\)/);
  if (!match) return null;
  const url = match[1].trim();
  if (url.startsWith("..") || url.startsWith("/") || !url.startsWith("http")) return null;
  return url;
}

function parseExistingValue(text: string, label: string): string | null {
  const regex = new RegExp(`- \\[${label}\\]\\(([^)]+)\\)`);
  const m = text.match(regex);
  return m ? m[1].trim() : null;
}

function parseAbout(text: string): string | null {
  const match = text.match(/- About:\s*(.+?)(?:\r?\n|$)/);
  return match ? match[1].trim() : null;
}

async function runCrw(url: string): Promise<{ json: any; error?: string }> {
  try {
    const proc = Bun.spawn({
      cmd: ["crw", url, "--format", "json"],
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

async function processFile(filePath: string, skill: string, results: Result[], limiter: Semaphore) {
  await limiter.acquire();
  try {
    const text = await Bun.file(filePath).text();
    const websiteUrl = parseWebsiteUrl(text);
    if (!websiteUrl) {
      results.push({ skill, status: "skipped", note: "no [Website] link" });
      return;
    }

    const crw = await runCrw(websiteUrl);
    if (!crw.json) {
      if (crw.error?.toLowerCase().includes("timeout")) {
        results.push({ skill, status: "crw-timeout", note: crw.error });
      } else {
        results.push({ skill, status: "crw-failed", note: crw.error });
      }
      return;
    }

    const meta = crw.json.metadata || {};
    const rawDescription = (meta.description || meta.ogDescription || "").toString();
    const description = cleanDescription(rawDescription);
    const finalWebsiteUrl = websiteUrl.replace(/\/$/, "");
    const canonicalUrl = (meta.canonicalUrl || meta.sourceURL || finalWebsiteUrl).replace(/\/$/, "");
    // If canonical points to a sub-path, keep the original website root for the Website link
    const websiteForFile = getHostname(finalWebsiteUrl) === getHostname(canonicalUrl) ? finalWebsiteUrl : canonicalUrl;
    const links: string[] = crw.json.links || [];

    const existingDoc = parseExistingValue(text, "Documentation");
    const newDoc = pickDocumentation(websiteForFile, links);
    const docUrl = newDoc || (existingDoc && isDocUrl(websiteForFile, existingDoc) ? existingDoc : null);
    const repoUrl = parseExistingValue(text, "Repository") || pickRepository(links);
    const pkgUrl = parseExistingValue(text, "Package Registry");
    const existingAbout = parseAbout(text);

    const cleanedAbout = description ? truncate(description, 140) : "";
    const aboutText = cleanedAbout || existingAbout || "";

    const lines = text.split(/\r?\n/);
    const heading = lines[0].startsWith("#") ? lines[0].trim() : `# ${skill} Official Resources`;

    const parts: string[] = [];
    parts.push(heading);
    parts.push("");
    parts.push(`- [Website](${websiteForFile})`);
    if (docUrl) parts.push(`- [Documentation](${docUrl})`);
    if (repoUrl) parts.push(`- [Repository](${repoUrl})`);
    if (pkgUrl) parts.push(`- [Package Registry](${pkgUrl})`);
    if (aboutText) parts.push(`- About: ${aboutText}`);

    const changed =
      text.trim() !== parts.join("\n").trim();

    if (!changed) {
      results.push({ skill, status: "no-change", note: "up to date" });
      return;
    }

    await Bun.write(filePath, parts.join("\n") + "\n");
    results.push({ skill, status: "updated", note: description ? "fetched metadata" : "restructured" });
  } catch (e: any) {
    results.push({ skill, status: "parse-failed", note: e.message || String(e) });
  } finally {
    limiter.release();
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

async function main() {
  const glob = new Bun.Glob("*/references/website.md");
  const files: string[] = [];
  for await (const f of glob.scan({ cwd: SKILLS_ROOT, absolute: true })) {
    files.push(f);
  }

  const limiter = new Semaphore(CONCURRENCY);
  const results: Result[] = [];

  const promises = files.map((f) => {
    const skill = f.replace(SKILLS_ROOT + "\\", "").split("\\")[0];
    return processFile(f, skill, results, limiter);
  });

  await Promise.all(promises);

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
