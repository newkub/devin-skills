import { ALLOWED_NON_KEBAB_NAMES } from "./constants.ts";
import type { Frontmatter } from "./types.ts";

function cleanValue(v: string): string {
  return v.replace(/#.*$/, "").trim();
}

export function parseFrontmatter(content: string): Frontmatter | null {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;
  const raw = match[1];
  const body = match[2].trimStart();
  const lines = raw.split(/\r?\n/);
  const data: Record<string, unknown> = {};
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
      const nested: Record<string, unknown> = {};
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

export function bodyOffset(raw: string): number {
  return raw.split(/\r?\n/).length + 3;
}

export function normalizeRef(ref: string): string {
  return ref.replace(/\s+/g, "").replace(/#.*$/, "").replace(/^\//, "");
}

export function lineOf(raw: string, key: string): number {
  const lines = raw.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(`${key}:`)) return i + 2;
  }
  return 1;
}
