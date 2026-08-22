import { IGNORE_PATTERNS } from "../../shared/index.js";
import { join, relative } from "node:path";
import { statSync, readdirSync, readFileSync, existsSync } from "node:fs";

const CODE_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".vue", ".css", ".scss",
  ".less", ".html", ".json", ".jsonc", ".md",
]);

export function shouldIgnore(name: string): boolean {
  return (IGNORE_PATTERNS as readonly string[]).includes(name);
}

export function walkFiles(dir: string, basePath: string = dir): string[] {
  if (!existsSync(dir)) return [];
  const results: string[] = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      if (shouldIgnore(entry)) continue;
      const fullPath = join(dir, entry);
      try {
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          results.push(...walkFiles(fullPath, basePath));
        } else if (CODE_EXTENSIONS.has(getExtension(entry))) {
          results.push(relative(basePath, fullPath));
        }
      } catch {
      }
    }
  } catch {
    return [];
  }
  return results;
}

export function getExtension(filename: string): string {
  const idx = filename.lastIndexOf(".");
  return idx >= 0 ? filename.slice(idx) : "";
}

export function readLines(filePath: string): string[] {
  try {
    return readFileSync(filePath, "utf-8").split("\n");
  } catch {
    return [];
  }
}

export function countLines(filePath: string): number {
  return readLines(filePath).length;
}

export function readFileContent(filePath: string): string {
  try {
    return readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
}

export function findFilesByPattern(dir: string, pattern: RegExp): string[] {
  return walkFiles(dir).filter((f) => pattern.test(f));
}

export function findFilesByExtension(dir: string, ext: string): string[] {
  return walkFiles(dir).filter((f) => f.endsWith(ext));
}

export function getRelativePath(projectPath: string, filePath: string): string {
  return relative(projectPath, filePath);
}
