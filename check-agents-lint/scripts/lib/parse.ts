import { existsSync, readdirSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { isSubmoduleDir, readText } from "./files.ts";
import type { Ctx, FmEntry, Frontmatter, SkillDoc } from "./types.ts";

const NON_SKILL_DIRS = new Set(["scripts", "templates", "references", "guide", "examples", "reports"]);
const FM_KEY = /^([A-Za-z0-9_-]+):\s*(.*)$/;
const LIST_ITEM = /^\s{1,}-\s+(.*)$/;
const LIST_KEYS = new Set(["related", "allowed-tools", "triggers"]);

function isQuoted(v: string): boolean {
  return v.length > 1 && ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")));
}

function scalar(raw: string): string {
  const v = raw.trim();
  if (isQuoted(v)) {
    const inner = v.slice(1, -1);
    return v.startsWith('"') ? inner.replace(/\\"/g, '"').replace(/\\\\/g, "\\") : inner.replace(/''/g, "'");
  }
  const hash = v.search(/\s#/);
  return (hash >= 0 ? v.slice(0, hash) : v).trim();
}

function splitInline(inner: string): string[] {
  const out: string[] = [];
  let buf = "";
  let quote = "";
  for (const ch of inner) {
    if (quote) {
      buf += ch;
      if (ch === quote) quote = "";
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      buf += ch;
      continue;
    }
    if (ch === ",") {
      out.push(buf);
      buf = "";
      continue;
    }
    buf += ch;
  }
  out.push(buf);
  return out;
}

export interface Parsed {
  fm: Frontmatter;
  fmLines: number;
  body: string;
  error?: string;
}

export function parseFrontmatter(text: string): Parsed {
  const lines = text.split(/\r?\n/);
  const fm: Frontmatter = new Map();
  if ((lines[0] ?? "").trim() !== "---")
    return { fm, fmLines: 0, body: text, error: "frontmatter block is missing" };
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      end = i;
      break;
    }
  }
  if (end < 0) return { fm, fmLines: 0, body: text, error: "frontmatter block has no closing ---" };

  let error: string | undefined;
  let current: FmEntry | null = null;
  for (let i = 1; i < end; i++) {
    const raw = lines[i];
    if (!raw.trim() || /^\s*#/.test(raw)) continue;
    const item = raw.match(LIST_ITEM);
    if (item && current) {
      current.items.push(scalar(item[1]));
      current.itemLines.push(i + 1);
      continue;
    }
    const kv = raw.match(FM_KEY);
    if (!kv) continue;
    const key = kv[1];
    if (fm.has(key) && !error) error = `duplicate frontmatter key "${key}"`;
    const value = kv[2].trim();
    if (/^[|>][-+]?$/.test(value)) {
      const parts: string[] = [];
      let j = i + 1;
      for (; j < end; j++) {
        const blockLine = lines[j];
        if (!blockLine.trim()) {
          parts.push("");
          continue;
        }
        if (!/^\s+/.test(blockLine)) break;
        parts.push(blockLine.replace(/^\s{1,2}/, ""));
      }
      current = { line: i + 1, value: parts.join("\n").trim(), items: [], itemLines: [] };
      fm.set(key, current);
      i = j - 1;
      continue;
    }
    const entry: FmEntry = { line: i + 1, value: scalar(value), items: [], itemLines: [] };
    if (value.startsWith("[") && value.endsWith("]") && LIST_KEYS.has(key)) {
      entry.value = value;
      entry.items = splitInline(value.slice(1, -1)).map(scalar).filter(Boolean);
      entry.itemLines = entry.items.map(() => i + 1);
    }
    fm.set(key, entry);
    current = entry;
  }
  return { fm, fmLines: end + 1, body: lines.slice(end + 1).join("\n"), error };
}

function readDoc(dir: string, dirPath: string, parent?: string): SkillDoc {
  const file = join(dirPath, "SKILL.md");
  if (!existsSync(file)) {
    return {
      dir,
      parent,
      dirPath,
      file,
      text: "",
      hasSkillMd: false,
      fm: new Map(),
      fmLines: 0,
      body: "",
    };
  }
  const text = readText(file);
  const parsed = parseFrontmatter(text);
  return {
    dir,
    parent,
    dirPath,
    file,
    text,
    hasSkillMd: true,
    fm: parsed.fm,
    fmLines: parsed.fmLines,
    fmError: parsed.error,
    body: parsed.body,
  };
}

function subdirs(path: string): string[] {
  try {
    return readdirSync(path, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.startsWith("."))
      .map((e) => e.name)
      .sort();
  } catch {
    return [];
  }
}

export function loadSkills(root: string): SkillDoc[] {
  return subdirs(root)
    .filter((name) => !NON_SKILL_DIRS.has(name))
    .map((name) => join(root, name))
    .filter((dirPath) => !isSubmoduleDir(dirPath) || existsSync(join(dirPath, "SKILL.md")))
    .map((dirPath) => readDoc(basename(dirPath), dirPath));
}

export function loadWorkflows(skills: SkillDoc[]): SkillDoc[] {
  const out: SkillDoc[] = [];
  for (const parent of skills) {
    for (const name of subdirs(join(parent.dirPath, "workflows"))) {
      const dirPath = join(parent.dirPath, "workflows", name);
      if (isSubmoduleDir(dirPath)) continue;
      out.push(readDoc(`${parent.dir}/workflows/${name}`, dirPath, parent.dir));
    }
  }
  return out.sort((a, b) => a.dir.localeCompare(b.dir));
}

export function collect(root: string, only?: string[] | null): Ctx {
  const all = loadSkills(root);
  const picked = only && only.length ? all.filter((s) => only.includes(s.dir)) : all;
  const skillNames = new Set(all.map((s) => s.dir));
  return {
    root,
    skills: picked,
    workflows: loadWorkflows(picked),
    skillNames,
    slashNames: new Set(skillNames),
    skillDirs: new Map(all.map((s) => [s.dir, s])),
  };
}

export function allDocs(ctx: Ctx): SkillDoc[] {
  return [...ctx.skills, ...ctx.workflows].filter((d) => d.hasSkillMd);
}

export function fmEntry(doc: SkillDoc, key: string): FmEntry | undefined {
  return doc.fm.get(key);
}

export function fmValue(doc: SkillDoc, key: string): string {
  return (doc.fm.get(key)?.value ?? "").trim();
}

export function entryItems(doc: SkillDoc, key: string): string[] {
  return doc.fm.get(key)?.items ?? [];
}

export function entryLine(doc: SkillDoc, key: string, index = 0): number {
  const entry = doc.fm.get(key);
  if (!entry) return doc.fmLines || 1;
  return entry.itemLines[index] ?? entry.line;
}

export function relPath(root: string, file: string): string {
  const rel = relative(root, file);
  return (rel || file).split("\\").join("/");
}

export interface BodyLine {
  line: string;
  no: number;
  inFence: boolean;
  isFence: boolean;
}

export function* bodyLines(doc: SkillDoc): Generator<BodyLine> {
  const lines = doc.body.split(/\r?\n/);
  let fence: { char: string; len: number } | null = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^\s*(`{3,}|~{3,})(.*)$/);
    yield { line, no: i + 1 + doc.fmLines, inFence: fence !== null, isFence: match !== null };
    if (!match) continue;
    const marker = match[1];
    if (!fence) {
      fence = { char: marker[0], len: marker.length };
    } else if (marker[0] === fence.char && marker.length >= fence.len && match[2].trim() === "") {
      fence = null;
    }
  }
}

