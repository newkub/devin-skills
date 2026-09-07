const splitPath = (p: string) => p.replace(/\\/g, "/").split("/");

const locateSkillsRoot = (): string => {
  const parts = splitPath(import.meta.dir);
  const idx = parts.lastIndexOf("update-devin-global-skills");
  if (idx < 0) throw new Error("Cannot locate devin skills root from " + import.meta.dir);
  return parts.slice(0, idx).join("\\");
};

export const SKILLS_ROOT = locateSkillsRoot();

export const CONCURRENCY = 4;
export const ROUTE_CONCURRENCY = 8;
export const CRW_MAP_TIMEOUT_MS = 60000;
export const CRW_FALLBACK_TIMEOUT_MS = 20000;
export const FETCH_TIMEOUT_MS = 12000;
export const MAX_TOTAL_ROUTES = 100;
export const MAX_PATH_SEGMENTS = 4;
export const MAX_DESC_LEN = 120;

export interface Result {
  skill: string;
  status: "updated" | "skipped" | "crw-failed" | "crw-timeout" | "parse-failed" | "no-change";
  note: string;
}

export interface RouteEntry {
  url: string;
  description: string;
}

export function getSkillName(filePath: string): string {
  return filePath.replace(SKILLS_ROOT + "\\", "").split("\\")[0];
}

export function getHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

export function sameHostname(a: string, b: string): boolean {
  return getHostname(a) === getHostname(b);
}

export function normalizePath(url: string): string {
  try {
    const u = new URL(url);
    const p = u.pathname.replace(/\/+$/, "");
    return p || "/";
  } catch {
    return "/";
  }
}

export function isLocale(seg: string): boolean {
  return /^[a-z]{2}(-[A-Z]{2})?$/.test(seg);
}

export function getSegments(path: string, max: number): string {
  const segs = path === "/" ? [] : path.split("/").filter(Boolean);
  return "/" + segs.slice(0, max).join("/");
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 3) + "...";
}

export function cleanDescription(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/Contribute to [^\.]+ by creating an account on GitHub\./i, "")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function decodeHtmlEntities(text: string): string {
  try {
    return text
      .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
      .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&nbsp;/g, " ");
  } catch {
    return text;
  }
}

export function parseHtmlMeta(text: string): { title: string; description: string } {
  const titleMatch = text.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? cleanDescription(decodeHtmlEntities(titleMatch[1].trim())) : "";

  const metaTags = text.match(/<meta[^>]*>/gi) || [];
  let description = "";
  for (const tag of metaTags) {
    const nameMatch = tag.match(/(?:name|property)=["']([^"']+)["']/i);
    const contentMatch = tag.match(/content=["']([^"']*)["']/i);
    if (nameMatch && contentMatch) {
      const name = nameMatch[1].toLowerCase();
      if (name === "description" || name === "og:description") {
        description = cleanDescription(decodeHtmlEntities(contentMatch[1].trim()));
        if (name === "description") break;
      }
    }
  }

  if (!description) description = title;
  return { title, description };
}

export function parseWebsiteUrl(text: string): string | null {
  const match = text.match(/- \[Website\]\(([^)]+)\)/);
  if (!match) return null;
  const url = match[1].trim();
  if (!url.startsWith("http")) return null;
  return url;
}

export function parseDocumentationUrl(text: string): string | null {
  const match = text.match(/- \[Documentation\]\(([^)]+)\)/);
  return match ? match[1].trim() : null;
}

export function parseExistingValue(text: string, label: string): string | null {
  const regex = new RegExp(`- \\[${label}\\]\\(([^)]+)\\)`);
  const m = text.match(regex);
  return m ? m[1].trim() : null;
}

export function parseAbout(text: string): string | null {
  const match = text.match(/- About:\s*(.+?)(?:\r?\n|$)/);
  return match ? match[1].trim() : null;
}

export class Semaphore {
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
    if (next) next();
    else this.count++;
  }
}

export async function runCrwMap(url: string, noSitemap: boolean): Promise<{ json: any; error?: string }> {
  const args = noSitemap
    ? ["crw", "map", url, "--no-sitemap", "--format", "json"]
    : ["crw", "map", url, "--format", "json"];
  try {
    const proc = Bun.spawn({
      cmd: args,
      stdout: "pipe",
      stderr: "pipe",
      timeout: CRW_MAP_TIMEOUT_MS,
    });
    const exitCode = await proc.exited;
    const out = await Bun.readableStreamToText(proc.stdout);
    const err = await Bun.readableStreamToText(proc.stderr);
    if (exitCode !== 0) return { json: null, error: err || `crw exit ${exitCode}` };
    try {
      return { json: JSON.parse(out) };
    } catch (e: any) {
      return { json: null, error: `json parse: ${e}` };
    }
  } catch (e: any) {
    if (e?.name === "TimeoutError" || String(e).toLowerCase().includes("timeout")) {
      return { json: null, error: "timeout" };
    }
    return { json: null, error: e.message || String(e) };
  }
}

export async function runCrwScrape(url: string): Promise<{ json: any; error?: string }> {
  try {
    const proc = Bun.spawn({
      cmd: ["crw", url, "--format", "json"],
      stdout: "pipe",
      stderr: "pipe",
      timeout: CRW_FALLBACK_TIMEOUT_MS,
    });
    const exitCode = await proc.exited;
    const out = await Bun.readableStreamToText(proc.stdout);
    const err = await Bun.readableStreamToText(proc.stderr);
    if (exitCode !== 0) return { json: null, error: err || `crw exit ${exitCode}` };
    try {
      return { json: JSON.parse(out) };
    } catch (e: any) {
      return { json: null, error: `json parse: ${e}` };
    }
  } catch (e: any) {
    if (e?.name === "TimeoutError" || String(e).toLowerCase().includes("timeout")) {
      return { json: null, error: "timeout" };
    }
    return { json: null, error: e.message || String(e) };
  }
}

export async function fetchDescription(url: string, maxLen = 140): Promise<string> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DevinRoutesBot/1.0)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(id);
    if (!res.ok) return "";
    const text = await res.text();
    const head = text.slice(0, 25000);
    const meta = parseHtmlMeta(head);
    return truncate(meta.description, maxLen) || "";
  } catch {
    return "";
  }
}
