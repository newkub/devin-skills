import { existsSync, readdirSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { finding } from "./catalog.ts";
import { stripInlineCode } from "./md.ts";
import { allDocs, bodyLines, relPath } from "./parse.ts";
import type { Ctx, Finding, SkillDoc } from "./types.ts";

const PKG_DIRS = [
  "references/",
  "best-practices/",
  "usecases/",
  "workflows/",
  "subagents/",
  "scripts/",
  "templates/",
  "examples/",
  "guide/",
  "src/",
];
const LINK = /!?\[[^\]]*\]\(\s*(<[^>]+>|[^)\s]+)(?:\s+["'][^"']*["'])?\s*\)/g;
const SCHEME = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\/)/i;
const SLASH_REF = /(?<![A-Za-z0-9:/._-])\/([a-z0-9]+(?:-[a-z0-9]+)+)/g;
const PLACEHOLDER_REFS = new Set(["skill-name", "plugin-name", "some-skill", "example-skill", "my-skill", "any-skill"]);
const FOREIGN_SLASH = new Set([
  "non-color", "feature-check", "edge-cases", "web-proto",
  "add-dir", "accept-edits", "rm-session", "reload-plugins",
  "seo-audit", "keyword-research", "competitor-analysis", "seo-coach",
]);
const HISTORICAL = /\bmerged\s+(?:from|into|the)\b|\bfolded into\b|\brenamed from\b|\breplaced by\b|\bdeleted without merge\b|\bwas deleted\b/i;
const URL_TOKEN = /https?:\/\/\S+/g;
const SLASH_PREV = /[\s([{:;,"\u2014\u2022*+=~`]/;

function inUrl(line: string, index: number): boolean {
  for (const match of line.matchAll(URL_TOKEN)) {
    const start = match.index ?? 0;
    if (index >= start && index < start + match[0].length) return true;
  }
  return false;
}

function slashRefs(line: string): string[] {
  const out: string[] = [];
  if (HISTORICAL.test(line)) return out;
  for (const match of line.matchAll(SLASH_REF)) {
    const name = match[1];
    const index = match.index ?? 0;
    const prev = index > 0 ? line[index - 1] : "";
    if (prev && !SLASH_PREV.test(prev)) continue;
    if (prev === "`") {
      let ticks = 0;
      for (let i = 0; i < index; i++) if (line[i] === "`") ticks++;
      if (ticks % 2 === 0) continue;
    }
    if (inUrl(line, index)) continue;
    if (PLACEHOLDER_REFS.has(name) || FOREIGN_SLASH.has(name)) continue;
    const after = line.slice(index + name.length + 1);
    if (/^[-./]/.test(after) || /^\s*\//.test(after)) continue;
    out.push(name);
  }
  return out;
}

function clean(raw: string): string {
  let target = raw.replace(/^<|>$/g, "");
  const cut = target.search(/[?#]/);
  if (cut >= 0) target = target.slice(0, cut);
  try {
    return decodeURIComponent(target);
  } catch {
    return target;
  }
}

function graph(ctx: Ctx, doc: SkillDoc, out: Finding[]): void {
  if (doc.fmError) return;
  const file = relPath(ctx.root, doc.file);
  const base = doc.dirPath;
  const seen = new Set<string>();

  for (const line of bodyLines(doc)) {
    if (line.inFence || line.isFence) continue;
    const plain = stripInlineCode(line.line);

    for (const match of plain.matchAll(LINK)) {
      const target = clean(match[1]);
      if (!target || SCHEME.test(target)) continue;
      if (!existsSync(resolve(base, target))) {
        const pkg = PKG_DIRS.some((dir) => target.startsWith(dir));
        const rule = pkg ? "graph/reference-file-exists" : "graph/relative-link-valid";
        const key = `${rule}|${target}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(finding(rule, file, line.no, `referenced file "${target}" does not exist`));
      }
    }

    for (const name of slashRefs(line.line)) {
      if (ctx.slashNames.has(name)) continue;
      const key = `slash|${name}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(finding("graph/slash-ref-resolves", file, line.no, `slash reference "/${name}" does not resolve to a skill`));
    }
  }
}

function orphans(ctx: Ctx, doc: SkillDoc, out: Finding[]): void {
  if (!doc.hasSkillMd) return;
  for (const dir of ["references", "best-practices", "usecases"]) {
    const path = resolve(doc.dirPath, dir);
    if (!existsSync(path)) continue;
    let names: string[] = [];
    try {
      names = readdirSync(path, { withFileTypes: true })
        .filter((entry) => entry.isFile() && extname(entry.name) === ".md")
        .map((entry) => entry.name)
        .sort();
    } catch {
      continue;
    }
    for (const name of names) {
      if (doc.text.includes(name) || doc.text.includes(`${dir}/${name}`)) continue;
      out.push(
        finding(
          "graph/orphan-reference",
          relPath(ctx.root, doc.file),
          1,
          `${dir}/${basename(name)} is not linked from SKILL.md`,
        ),
      );
    }
  }
}

export function runGraph(ctx: Ctx): Finding[] {
  const out: Finding[] = [];
  for (const doc of allDocs(ctx)) graph(ctx, doc, out);
  for (const doc of ctx.skills) orphans(ctx, doc, out);
  return out;
}
