import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".devin", ".next", "target", "vendor"]);

export interface WalkOptions {
  exts?: string[];
  maxDepth?: number;
  skipDirs?: Set<string>;
}

export function isSubmoduleDir(path: string): boolean {
  const git = join(path, ".git");
  return existsSync(git) && statSync(git).isFile();
}

export function walkFiles(dir: string, opts: WalkOptions = {}): string[] {
  const out: string[] = [];
  const skip = opts.skipDirs ?? SKIP_DIRS;
  const maxDepth = opts.maxDepth ?? 8;
  const exts = opts.exts ? new Set(opts.exts.map((e) => e.toLowerCase())) : null;
  function walk(path: string, depth: number) {
    if (depth > maxDepth) return;
    let entries: ReturnType<typeof readdirSync>;
    try {
      entries = readdirSync(path, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const full = join(path, entry.name);
      if (entry.isDirectory()) {
        if (skip.has(entry.name) || isSubmoduleDir(full)) continue;
        walk(full, depth + 1);
      } else if (entry.isFile()) {
        if (!exts) {
          out.push(full);
          continue;
        }
        const dot = entry.name.lastIndexOf(".");
        if (dot >= 0 && exts.has(entry.name.slice(dot).toLowerCase())) out.push(full);
      }
    }
  }
  walk(dir, 0);
  return out;
}

const TEXT_EXTS = [
  ".md", ".ts", ".js", ".mjs", ".cjs", ".tsx", ".jsx", ".sh", ".ps1", ".py",
  ".json", ".yml", ".yaml", ".toml", ".txt", ".rs", ".go", ".lua", ".kt", ".swift", ".zig",
];

const textCache = new Map<string, string>();
const listCache = new Map<string, string[]>();

export function readText(file: string): string {
  const hit = textCache.get(file);
  if (hit !== undefined) return hit;
  let text = "";
  try {
    if (statSync(file).size <= 2 * 1024 * 1024) text = readFileSync(file, "utf8");
  } catch {
    text = "";
  }
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  textCache.set(file, text);
  return text;
}

export function packageFiles(dirPath: string, kind: "all" | "text" = "text"): string[] {
  const key = `${dirPath}|${kind}`;
  const hit = listCache.get(key);
  if (hit) return hit;
  const files = walkFiles(dirPath, kind === "text" ? { exts: TEXT_EXTS } : {});
  listCache.set(key, files);
  return files;
}

export function lineOfOffset(text: string, offset: number): number {
  let line = 1;
  const end = Math.min(offset, text.length);
  for (let i = 0; i < end; i++) if (text.charCodeAt(i) === 10) line++;
  return line;
}

export function lineAtByteOffset(buffer: Buffer, offset: number): number {
  let line = 1;
  const end = Math.min(offset, buffer.length);
  for (let i = 0; i < end; i++) if (buffer[i] === 0x0a) line++;
  return line;
}

export function countLines(text: string): number {
  if (!text) return 0;
  const n = text.split(/\r?\n/).length;
  return text.endsWith("\n") || text.endsWith("\r") ? n - 1 : n;
}
