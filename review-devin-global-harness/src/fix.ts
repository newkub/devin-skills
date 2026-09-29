import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Context, Finding } from "./types";

function removeFromRelated(content: string, target: string): string {
  const targetLine = `  - ${target}`;
  return content
    .split(/\r?\n/)
    .filter((line) => line.trim() !== targetLine.trim())
    .join("\n");
}

function fixUnknownSlashRef(content: string, evidence: string): string {
  if (evidence.includes("/update-devin-global")) {
    return content.replace(/\/update-devin-global(?!-skills)/g, "/update-devin-global-skills");
  }
  return content;
}

function fixLine(content: string, lineNum: number, transformer: (line: string) => string): string {
  const lines = content.split(/\r?\n/);
  if (lineNum >= 0 && lineNum < lines.length) {
    lines[lineNum] = transformer(lines[lineNum]);
  }
  return lines.join("\n");
}

function truncateRelated(content: string, max = 15): string {
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return content;
  const lines = fmMatch[1].split(/\r?\n/);
  const out: string[] = [];
  let inRelated = false;
  let kept = 0;
  for (const line of lines) {
    if (line.startsWith("related:")) {
      inRelated = true;
      out.push(line);
    } else if (inRelated && /^\s*- /.test(line)) {
      if (kept++ < max) out.push(line);
    } else {
      inRelated = false;
      out.push(line);
    }
  }
  return content.replace(fmMatch[1], out.join("\n"));
}

// Auto-fix safe findings in-place: orphan related refs, related >15, bold markers, stale slash refs.
export async function applyFixes(findings: Finding[], ctx: Context): Promise<number> {
  let changed = 0;
  for (const f of findings) {
    const skillPath = join(ctx.skillsRoot, f.skill, "SKILL.md");
    let content: string;
    try {
      content = readFileSync(skillPath, "utf8");
    } catch {
      console.log(`Skip ${f.skill}: file not found`);
      continue;
    }
    let next = content;

    if (f.finding === "orphan related reference") {
      const m = f.evidence.match(/related:\s*(.+?)\s+not mentioned/);
      if (m) next = removeFromRelated(next, m[1].trim());
    } else if (f.finding === "related exceeds 15 skills") {
      next = truncateRelated(next);
    } else if (f.finding === "uses bold markers **") {
      next = fixLine(next, f.line - 1, (l) => l.replace(/\*\*/g, ""));
    } else if (f.finding === "slash reference to unknown skill") {
      next = fixUnknownSlashRef(next, f.evidence);
    } else if (f.finding === "unclosed frontmatter") {
      console.log(`Manual check needed: ${f.file} unclosed frontmatter`);
    }

    if (next !== content) {
      writeFileSync(skillPath, next);
      changed++;
      console.log(`Fixed ${f.skill}: ${f.finding}`);
    }
  }
  return changed;
}
