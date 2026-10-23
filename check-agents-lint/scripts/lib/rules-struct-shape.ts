import { basename } from "node:path";
import { finding } from "./catalog.ts";
import { countLines, packageFiles, readText } from "./files.ts";
import { headings, sectionEnd, stripInlineCode, tableIssues, type Heading } from "./md.ts";
import { allDocs, bodyLines, relPath } from "./parse.ts";
import type { Ctx, Finding, SkillDoc } from "./types.ts";

const REQUIRED = [
  { key: "goal", label: "## Goal" },
  { key: "scope", label: "## Scope" },
  { key: "execute", label: "## Execute" },
  { key: "rules", label: "## Rules" },
  { key: "expected outcome", label: "## Expected Outcome" },
];

const STEP_HEADING = /^(?:\d+[.)]|step\s+\d+)(?:\s|$)/i;

function norm(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function h2(heads: Heading[], key: string): number {
  return heads.findIndex((h) => h.level === 2 && norm(h.text) === key);
}

function shape(ctx: Ctx, doc: SkillDoc, out: Finding[]): void {
  if (doc.fmError) return;
  const file = relPath(ctx.root, doc.file);
  const heads = headings(doc);

  for (const issue of tableIssues(doc.body, doc.fmLines))
    out.push(finding("struct/table-cells", file, issue.line, issue.message));

  const found = new Map<string, number>();
  for (const req of REQUIRED) {
    const index = h2(heads, req.key);
    if (index < 0) out.push(finding("struct/section-required", file, 1, `missing required section "${req.label}"`));
    else found.set(req.key, index);
  }

  let last = -1;
  let lastLabel = "";
  for (const req of REQUIRED) {
    const index = found.get(req.key);
    if (index === undefined) continue;
    if (index < last) {
      out.push(
        finding("struct/section-order", file, heads[index].line, `section "${req.label}" appears after "${lastLabel}"`),
      );
      break;
    }
    last = index;
    lastLabel = req.label;
  }

  const seen = new Set<string>();
  for (const head of heads) {
    const key = `${head.level}|${norm(head.text)}`;
    if (seen.has(key))
      out.push(
        finding("struct/heading-unique", file, head.line, `duplicate heading "${"#".repeat(head.level)} ${head.text}"`),
      );
    else seen.add(key);
  }

  const count = countLines(doc.text);
  if (count > 250) out.push(finding("struct/line-limit", file, 1, `SKILL.md is ${count} lines (limit 250)`));

  const executeIndex = h2(heads, "execute");
  if (executeIndex >= 0) {
    const end = sectionEnd(heads, executeIndex);
    const steps: number[] = [];
    for (let i = executeIndex + 1; i < end; i++) {
      const head = heads[i];
      if (head.level === 3 && STEP_HEADING.test(head.text.trim())) steps.push(i);
    }
    if (steps.length > 10)
      out.push(
        finding("struct/execute-steps", file, heads[executeIndex].line, `Execute has ${steps.length} steps (limit 10)`),
      );
    const lines = [...bodyLines(doc)];
    for (const index of steps) {
      const head = heads[index];
      let stop = end;
      for (let j = index + 1; j < end; j++) {
        if (heads[j].level <= 3) {
          stop = j;
          break;
        }
      }
      const until = stop < heads.length ? heads[stop].line : Number.POSITIVE_INFINITY;
      const hasGoal = lines.some(
        (line) =>
          line.no > head.line && line.no < until && !line.inFence && !line.isFence && /^\s*>\s*Goal:/.test(line.line),
      );
      if (!hasGoal)
        out.push(finding("struct/execute-step-goal", file, head.line, `step "${head.text}" has no "> Goal:" line`));
    }
  }

  for (const line of bodyLines(doc)) {
    if (line.inFence || line.isFence) continue;
    const bold = stripInlineCode(line.line).match(/\*\*([^*\n]+)\*\*/);
    if (bold)
      out.push(finding("struct/bold-outside-code", file, line.no, `"**" bold is not allowed outside code: "${bold[0]}"`));
  }

  for (const line of bodyLines(doc)) {
    if (!line.isFence || line.inFence) continue;
    const info = line.line.match(/^\s*(?:```|~~~)(.*)$/)?.[1]?.trim() ?? "";
    if (!info) out.push(finding("struct/fence-language", file, line.no, "code fence has no language"));
  }

  for (const head of heads) {
    if (head.level !== 2 && head.level !== 3) continue;
    const plain = stripInlineCode(head.text);
    if (!/[A-Za-z]/.test(plain)) continue;
    const leading = plain.split(/\s+—\s+/)[0].replace(/^\d+[.)]\s*/, "").trim();
    if (!/\s/.test(leading)) continue;
    if (plain === plain.toLowerCase())
      out.push(
        finding(
          "struct/heading-title-case",
          file,
          head.line,
          `heading "${"#".repeat(head.level)} ${head.text}" is not Title Case`,
        ),
      );
  }
}

export function runShape(ctx: Ctx): Finding[] {
  const out: Finding[] = [];
  for (const doc of ctx.skills) {
    if (doc.hasSkillMd) continue;
    out.push(finding("struct/skill-md-exists", relPath(ctx.root, doc.dirPath), 1, "skill directory has no SKILL.md"));
  }
  for (const doc of allDocs(ctx)) {
    shape(ctx, doc, out);
    for (const path of packageFiles(doc.dirPath, "text")) {
      if (basename(path) === "SKILL.md") continue;
      const count = countLines(readText(path));
      if (count > 250)
        out.push(
          finding(
            "struct/file-line-limit",
            relPath(ctx.root, path),
            1,
            `${basename(path)} is ${count} lines (limit 250)`,
          ),
        );
    }
  }
  return out;
}
