import { readdirSync, readFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");

export const SKILLS_ROOT = resolve(__dirname, "..", "..", "..");

export const KNOWN_TOP_KEYS = new Set([
  "name",
  "description",
  "argument-hint",
  "model",
  "subagent",
  "agent",
  "allowed-tools",
  "permissions",
  "triggers",
  "related",
]);

export const EXCLUDED_DIRS = new Set([
  "node_modules",
  ".git",
  ".turbo",
  ".solid",
  "dist",
  "build",
  ".output",
  "coverage",
  ".wrangler",
]);

export const ALLOWED_NON_KEBAB_NAMES = new Set([
  "SKILL.md",
  "README.md",
  "AGENTS.md",
  "LICENSE",
  "CONTRIBUTING.md",
  ".gitignore",
  "package.json",
  "package-lock.json",
  "bun.lockb",
  "tsconfig.json",
  "Cargo.toml",
  "go.mod",
]);

export interface Frontmatter {
  raw: string;
  data: Record<string, any>;
  body: string;
}

export function getSkillDirNames(): string[] {
  return readdirSync(SKILLS_ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name)
    .sort();
}

export function skillPath(skillName: string): string {
  return join(SKILLS_ROOT, skillName, "SKILL.md");
}

export function readSkillFile(skillName: string): string | null {
  const path = skillPath(skillName);
  if (!existsSync(path)) return null;
  try {
    return readFileSync(path, "utf-8");
  } catch {
    return null;
  }
}

function cleanValue(v: string): string {
  return v.replace(/#.*$/, "").trim();
}

export function parseFrontmatter(content: string): Frontmatter | null {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;
  const raw = match[1];
  const body = match[2].trimStart();
  const lines = raw.split(/\r?\n/);
  const data: Record<string, any> = {};
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "" || line.trimStart().startsWith("#")) {
      i++;
      continue;
    }
    const keyMatch = line.match(/^([a-zA-Z][-\w]*):\s*(.*)$/);
    if (!keyMatch) {
      i++;
      continue;
    }
    const key = keyMatch[1];
    let value = keyMatch[2].trim();
    if (value === "[]") {
      data[key] = [];
      i++;
      continue;
    }
    if (value === "{}") {
      data[key] = {};
      i++;
      continue;
    }
    if (value === "" && i + 1 < lines.length && /^\s+\w/.test(lines[i + 1])) {
      i++;
      const nested: Record<string, any> = {};
      while (i < lines.length && (/^\s/.test(lines[i]) || lines[i].trim() === "")) {
        if (lines[i].trim() === "" || lines[i].trimStart().startsWith("#")) {
          i++;
          continue;
        }
        const subMatch = lines[i].match(/^\s+([a-zA-Z][-\w]*):\s*(.*)$/);
        if (subMatch) {
          const subKey = subMatch[1];
          const subValue = subMatch[2].trim();
          if (subValue === "") {
            i++;
            const subList: string[] = [];
            while (i < lines.length && /^\s+\s+-\s/.test(lines[i])) {
              const m = lines[i].match(/^\s+\s+-\s*(.*)$/);
              if (m) subList.push(cleanValue(m[1]));
              i++;
            }
            nested[subKey] = subList;
            continue;
          }
          nested[subKey] = subValue;
        }
        i++;
      }
      data[key] = nested;
      continue;
    }
    if (value === "") {
      i++;
      const list: string[] = [];
      while (i < lines.length) {
        const listMatch = lines[i].match(/^(\s*)-\s*(.*)$/);
        if (!listMatch || !lines[i].startsWith(" ")) break;
        list.push(cleanValue(listMatch[2]));
        i++;
      }
      data[key] = list;
    } else {
      data[key] = cleanValue(value);
      i++;
    }
  }
  return { raw, body, data };
}

export function isKebabCase(name: string, allowKnown = true): boolean {
  if (allowKnown && ALLOWED_NON_KEBAB_NAMES.has(name)) return true;
  if (name.startsWith(".")) return true;
  return /^[a-z0-9]+(-[a-z0-9]+)*(\.[a-z0-9]+(-[a-z0-9]+)*)*$/.test(name);
}

export function listMarkdownFiles(dir: string): string[] {
  const out: string[] = [];
  const stack: string[] = [dir];
  while (stack.length) {
    const current = stack.pop()!;
    let entries;
    try {
      entries = readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      if (e.isDirectory()) {
        if (EXCLUDED_DIRS.has(e.name) || e.name.startsWith(".")) continue;
        stack.push(join(current, e.name));
      } else if (e.isFile() && e.name.endsWith(".md")) {
        out.push(join(current, e.name));
      }
    }
  }
  return out.sort();
}

export function countLines(filePath: string): number {
  try {
    const content = readFileSync(filePath, "utf-8");
    return content.split(/\r?\n/).length;
  } catch {
    return 0;
  }
}

export function normalizeRef(ref: string): string {
  return ref.replace(/\s+/g, "").replace(/#.*$/, "").replace(/^\//, "");
}

export function formatIssue(file: string, line: number, message: string): string {
  const rel = file.replace(SKILLS_ROOT + "\\", "").replace(SKILLS_ROOT + "/", "");
  return `${rel}:${line}: ${message}`;
}
