import { extname } from "node:path";
import { finding } from "./catalog.ts";
import { chunk, firstLine, run, which } from "./exec.ts";
import { normalizeFile, type EngineRun } from "./engines.ts";
import { missing, skipped } from "./engines-shared.ts";
import { packageFiles, readText } from "./files.ts";
import type { Ctx, Finding, RuleMeta } from "./types.ts";

const URL_CHUNK = 100;
const URL_LIMIT = 500;
const URL_RE = /https?:\/\/[^\s<>()[\]"'`]+/g;
const FAILED_URL_RE = /error sending request for url \(([^)\s]+)\)/g;
const MAX_RETRIES = 20;

interface UrlRef {
  file: string;
  line: number;
}

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function collectUrls(ctx: Ctx): { index: Map<string, UrlRef>; truncated: boolean } {
  const index = new Map<string, UrlRef>();
  for (const skill of ctx.skills) {
    for (const file of packageFiles(skill.dirPath, "all")) {
      if (extname(file).toLowerCase() !== ".md") continue;
      const rel = normalizeFile(ctx.root, file);
      const lines = readText(file).split(/\r?\n/);
      let fence = false;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/^\s*(```|~~~)/.test(line)) {
          fence = !fence;
          continue;
        }
        if (fence) continue;
        for (const match of line.matchAll(URL_RE)) {
          const url = match[0].replace(/[.,;:!?]+$/, "");
          if (!url || index.has(url)) continue;
          index.set(url, { file: rel, line: i + 1 });
        }
      }
    }
  }
  return { index, truncated: index.size > URL_LIMIT };
}

interface LycheeEntry {
  url?: string;
  status?: { text?: string; code?: number } | string;
  message?: string;
}

interface LycheeReport {
  fail_map?: Record<string, LycheeEntry[] | LycheeEntry>;
  error_map?: Record<string, LycheeEntry | string>;
}

function detailOf(entry: LycheeEntry | undefined): string {
  if (!entry) return "unreachable";
  if (typeof entry.status === "string") return entry.status;
  if (entry.status?.text) return entry.status.text;
  if (typeof entry.status?.code === "number") return `HTTP ${entry.status.code}`;
  return entry.message?.trim() || "unreachable";
}

function collectLycheeFailures(report: LycheeReport): Array<{ url: string; detail: string }> {
  const out: Array<{ url: string; detail: string }> = [];
  for (const [key, value] of Object.entries(report.fail_map ?? {})) {
    if (Array.isArray(value)) {
      for (const entry of value) out.push({ url: entry.url ?? key, detail: detailOf(entry) });
    } else {
      out.push({ url: key, detail: detailOf(value) });
    }
  }
  for (const [key, value] of Object.entries(report.error_map ?? {})) {
    out.push({ url: key, detail: typeof value === "string" ? value : detailOf(value) });
  }
  return out;
}

function failedUrls(stderr: string): string[] {
  const out = new Set<string>();
  for (const match of stderr.matchAll(FAILED_URL_RE)) out.add(match[1]);
  return [...out];
}

function lookup(index: Map<string, UrlRef>, url: string): UrlRef | undefined {
  return index.get(url) ?? index.get(url.replace(/\/+$/, "")) ?? index.get(`${url.replace(/\/+$/, "")}/`);
}

export function runLychee(ctx: Ctx, rules: RuleMeta[]): EngineRun {
  if (!rules.some((rule) => rule.id === "graph/external-link-dead"))
    return skipped("lychee", "no selected rules");
  if (!which("lychee")) return missing("lychee", "lychee is not installed");
  if (!ctx.skills.length) return skipped("lychee", "no skills selected");

  const { index, truncated } = collectUrls(ctx);
  if (!index.size) return skipped("lychee", "no external links");
  const urls = [...index.keys()].slice(0, URL_LIMIT);
  const byNormalized = new Map(urls.map((url) => [normalizeUrl(url), url]));

  const findings: Finding[] = [];
  const seen = new Set<string>();
  const failures: string[] = [];

  const emit = (url: string, detail: string): void => {
    const original = byNormalized.get(normalizeUrl(url)) ?? url;
    if (seen.has(original)) return;
    const ref = lookup(index, original);
    if (!ref) return;
    seen.add(original);
    findings.push(finding("graph/external-link-dead", ref.file, ref.line, `external link is unreachable (${detail})`));
  };

  for (const group of chunk(urls, URL_CHUNK)) {
    let pending = group;
    for (let attempt = 0; pending.length; attempt++) {
      if (attempt > MAX_RETRIES) {
        failures.push(`gave up after ${MAX_RETRIES} network failures in one chunk`);
        break;
      }
      const result = run(
        "lychee",
        ["--format", "json", "--no-progress", "--timeout", "20", "--max-concurrency", "8", ...pending],
        { cwd: ctx.root, timeoutMs: 240_000 },
      );
      if (result.missing) return missing("lychee", "lychee disappeared");
      let report: LycheeReport | null = null;
      try {
        report = JSON.parse(result.stdout) as LycheeReport;
      } catch {
        const dead = failedUrls(result.stderr);
        const known = dead.filter((url) => byNormalized.has(normalizeUrl(url)));
        if (!known.length) {
          failures.push(firstLine(result.stderr) || `exit ${result.status}`);
          break;
        }
        for (const url of known) emit(url, "connection failed");
        const drop = new Set(known.map(normalizeUrl));
        const next = pending.filter((url) => !drop.has(normalizeUrl(url)));
        if (next.length === pending.length) break;
        pending = next;
        continue;
      }
      for (const { url, detail } of collectLycheeFailures(report)) emit(url, detail);
      break;
    }
  }

  const scope = `${urls.length}${truncated ? ` of ${index.size} (capped)` : ""} urls`;
  const note = failures.length ? `failed on ${failures.length} chunk(s): ${failures[0]}` : scope;
  return {
    findings,
    status: { name: "lychee", status: "ok", note, findings: findings.length },
    error: failures.length && !findings.length ? note : undefined,
  };
}
