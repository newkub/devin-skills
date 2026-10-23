#!/usr/bin/env bun
import { Glob } from "bun";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

interface Finding {
  skill: string;
  file: string;
  line: number;
  ref: string;
  type: "related" | "body";
  severity: "Critical" | "Warning";
}

const args = Bun.argv.slice(2);
const rawPath = args[0];

const skillsRoot = rawPath
  ? resolve(rawPath)
  : resolve(`${Bun.env.USERPROFILE || Bun.env.HOME}/.agents/skills`);

if (!existsSync(skillsRoot)) {
  console.error(`Skills root not found: ${skillsRoot}`);
  process.exit(1);
}

const skillDirs = new Set<string>();
for (const d of new Glob("*/SKILL.md").scanSync(skillsRoot)) {
  skillDirs.add(dirname(d as string));
}

const gitmodulesPath = join(skillsRoot, ".gitmodules");
const gitmodulesFile = Bun.file(gitmodulesPath);
if (await gitmodulesFile.exists()) {
  const gitmodulesText = await gitmodulesFile.text();
  for (const match of gitmodulesText.matchAll(/^\s*path\s*=\s*(.+)$/gm)) {
    skillDirs.add(match[1].trim());
  }
}

const findings: Finding[] = [];

const urlRegex = /https?:\/\/\S+/g;
const placeholderRegex = /^(skill-name|plugin-name|some-skill|example-skill|my-skill|any-skill)$/;
const fileExtRegex = /\.(md|ts|tsx|js|jsx|json|toml|yaml|yml|lock|rs|go|py|txt|svg|png|jpg|jpeg|webp|gif|pdf)$/i;
// Slash commands of other products, and slash-list words in prose.
const FOREIGN_SLASH_TOKENS = new Set([
  "non-color", "feature-check", "edge-cases", "web-proto",
  "add-dir", "accept-edits", "rm-session", "reload-plugins", "agents", "workspace", "title", "ls",
  "seo-audit", "keyword-research", "competitor-analysis", "seo-coach",
]);
// Historical notes keep a deleted skill's old name on purpose (`merged from \`/x\``).
const historicalRegex = /merged\s+(?:from|into|the|`)|folded into|renamed from|replaced by|deleted without merge|was deleted/;

// Single-word nouns that often appear as false positives after a slash.
// We still only report if the match is a command-like reference, so lowercase single
// words that are not existing skills are generally filtered out below.

function isUrl(line: string, index: number): boolean {
  for (const m of line.matchAll(urlRegex)) {
    const start = m.index!;
    const end = start + m[0].length;
    if (index >= start && index < end) return true;
  }
  return false;
}

function looksLikeFilePath(before: string, after: string): boolean {
  // references/foo.md, src/main.ts, ../config, ...
  if (/(\.{1,2}|references|src|dist|node_modules|\w)\s*$/i.test(before)) return true;
  if (/^[./]/.test(after)) return true;
  if (fileExtRegex.test(after)) return true;
  return false;
}

function isSkillRef(ref: string): boolean {
  // A real skill reference either exists or is hyphenated (command-like).
  // We allow generic placeholders even if not a real skill.
  if (placeholderRegex.test(ref)) return true;
  if (skillDirs.has(ref)) return true;
  if (ref.includes("-")) return true;
  // Single-word lowercase references are only considered skills if they exist.
  return false;
}

function findBodyRefs(text: string, file: string, skill: string): void {
  const lines = text.split(/\r?\n/);
  let inCode = false;
  let inFrontmatter = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === "---") {
      inFrontmatter = !inFrontmatter;
      continue;
    }
    if (inFrontmatter) continue;

    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    if (historicalRegex.test(line)) continue;

    // Scan the whole line: skill refs live inside backticks, which the old
    // chunk-based walk skipped entirely. Parity tells opening from closing.
    for (const m of line.matchAll(/\/([a-zA-Z][a-zA-Z0-9]*(?:-[a-zA-Z0-9]+)*)(?![-\w/])/g)) {
      const ref = m[1];
      const slashIndex = m.index!;
      const prevChar = slashIndex > 0 ? line[slashIndex - 1] : "";

      if (prevChar === "`") {
        let ticks = 0;
        for (let k = 0; k < slashIndex; k++) if (line[k] === "`") ticks++;
        // Even = the slash follows a CLOSING backtick, i.e. a prose slash-list.
        if (ticks % 2 === 0) continue;
      } else if (prevChar && !/[\s([{:;,"\u2014\u2022*+=~-]/.test(prevChar)) continue;

      const after = line.slice(slashIndex + ref.length + 1);
      const before = line.slice(0, slashIndex);

      if (isUrl(line, slashIndex)) continue;
      if (placeholderRegex.test(ref)) continue;
      if (FOREIGN_SLASH_TOKENS.has(ref)) continue;
      if (looksLikeFilePath(before, after)) continue;
      if (ref.endsWith("-")) continue;
      if (ref.startsWith("-")) continue;

      // Skip A / B / C separator lists by looking ahead
      const nextNonSpace = after.match(/^\s*(.)/);
      if (nextNonSpace && nextNonSpace[1] === "/") continue;

      if (!isSkillRef(ref)) continue;

      if (!skillDirs.has(ref)) {
        findings.push({
          skill,
          file,
          line: i + 1,
          ref,
          type: "body",
          severity: "Warning",
        });
      }
    }
  }
}

function parseRelated(text: string): { skill: string; refs: { ref: string; line: number }[] }[] {
  const results: { skill: string; refs: { ref: string; line: number }[] }[] = [];
  const fmMatch = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return results;
  const fm = fmMatch[1];
  const nameMatch = fm.match(/^name:\s*(.+)$/m);
  if (!nameMatch) return results;
  const name = nameMatch[1].trim();
  const lines = fm.split(/\r?\n/);
  let inRelated = false;
  const refs: { ref: string; line: number }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\S/.test(line)) {
      inRelated = line.startsWith("related:");
      continue;
    }
    if (inRelated && line.startsWith("  - ")) {
      refs.push({ ref: line.slice(4).trim(), line: i + 2 });
    }
  }
  return refs.length ? [{ skill: name, refs }] : [];
}

for (const skill of skillDirs) {
  const skillPath = join(skillsRoot, skill, "SKILL.md");
  const file = Bun.file(skillPath);
  if (!(await file.exists())) continue;
  const text = await file.text();

  const relatedInfo = parseRelated(text);
  for (const info of relatedInfo) {
    for (const { ref, line } of info.refs) {
      if (!skillDirs.has(ref)) {
        findings.push({
          skill: info.skill,
          file: skillPath,
          line,
          ref,
          type: "related",
          severity: "Critical",
        });
      }
    }
  }

  findBodyRefs(text, skillPath, skill);
}

// Deduplicate
const seen = new Set<string>();
const unique: Finding[] = [];
for (const f of findings) {
  const key = `${f.skill}|${f.file}|${f.line}|${f.ref}|${f.type}`;
  if (!seen.has(key)) {
    seen.add(key);
    unique.push(f);
  }
}

unique.sort((a, b) => {
  if (a.severity !== b.severity) return a.severity === "Critical" ? -1 : 1;
  if (a.skill !== b.skill) return a.skill.localeCompare(b.skill);
  return a.line - b.line;
});

const critical = unique.filter((f) => f.severity === "Critical").length;
const warning = unique.filter((f) => f.severity === "Warning").length;

if (unique.length === 0) {
  console.log("no broken references found");
  process.exit(0);
}

console.log(`| Severity | Skill | Type | Ref | File | Line |`);
console.log(`|---|---|---|---|---|---|`);
for (const f of unique) {
  console.log(
    `| ${f.severity} | ${f.skill} | ${f.type} | ${f.ref} | ${f.file.replace(skillsRoot + "/", "")} | ${f.line} |`
  );
}

console.log(`\nTotal: ${unique.length} broken references (Critical: ${critical}, Warning: ${warning})`);
process.exit(critical > 0 ? 1 : 0);
