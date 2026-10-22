import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { relativePath, textOutsideInlineCode } from "../parse";
import type { Context, SkillMeta } from "../types";

// Only concrete package paths: template guidance (`references/<topic>.md`) and
// provenance prose (`merged from \`references/tdd.md\``) are not links to resolve.
const PKG_PATH_RE = /`((?:usecases|best-practices)\/[\w.-]+\.md)`/g;
const ACCESSED_RE = /https?:\/\/\S+.*\(accessed \d{4}-\d{2}-\d{2}\)/;

const usecaseIssues = (text: string) => {
  const lines = text.split(/\r?\n/);
  const issues: { line: number; severity: "Medium" | "Low"; finding: string }[] = [];
  if (!/^# Use Case — /.test(lines[0] ?? "")) {
    issues.push({ line: 1, severity: "Low", finding: "use case title is not `# Use Case — <Scenario>`" });
  }
  const quote = lines.findIndex((l) => l.startsWith("> "));
  if (quote < 0 || quote > 4) {
    issues.push({ line: Math.max(quote + 1, 1), severity: "Medium", finding: "use case is missing the source quote line near the top" });
  } else if (!ACCESSED_RE.test(lines[quote])) {
    issues.push({ line: quote + 1, severity: "Medium", finding: "use case quote lacks an official source URL + `(accessed YYYY-MM-DD)`" });
  }
  if (!/^## Pitfalls$/m.test(text)) issues.push({ line: lines.length, severity: "Medium", finding: "use case has no `## Pitfalls` section" });
  if (!/^## Related$/m.test(text)) issues.push({ line: lines.length, severity: "Medium", finding: "use case has no `## Related` section" });
  if (lines.length > 250) issues.push({ line: lines.length, severity: "Medium", finding: "use case exceeds 250 lines" });
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(```|~~~)/.test(lines[i])) { inFence = !inFence; continue; }
    if (inFence) continue;
    if (/\*\*[^*]+\*\*/.test(textOutsideInlineCode(lines[i]))) {
      issues.push({ line: i + 1, severity: "Medium", finding: "use case uses bold markers **" });
      break;
    }
  }
  return issues;
};

export function checkPackageFiles(m: SkillMeta, ctx: Context) {
  const dir = join(ctx.skillsRoot, m.skill);
  const rpath = relativePath(m.path, ctx.skillsRoot);
  const referenced = new Set<string>();
  for (const line of m.bodyLines) {
    for (const mm of line.matchAll(PKG_PATH_RE)) referenced.add(mm[1]);
  }

  for (const target of referenced) {
    if (!existsSync(join(dir, target))) {
      ctx.addFinding({ file: rpath, line: 1, category: "references", severity: "High", finding: "package file link points to a missing file", evidence: `link: ${target}` }, m.skill);
    }
  }

  const ucDir = join(dir, "usecases");
  if (existsSync(ucDir)) {
    for (const file of readdirSync(ucDir).filter((f) => f.endsWith(".md"))) {
      const rel = `usecases/${file}`;
      const text = readFileSync(join(ucDir, file), "utf8");
      if (!referenced.has(rel)) {
        ctx.addFinding({ file: `${m.skill}/${rel}`, line: 1, category: "references", severity: "Medium", finding: "use case is not listed in SKILL.md `### Use Cases`" }, m.skill);
      }
      for (const issue of usecaseIssues(text)) {
        ctx.addFinding({ file: `${m.skill}/${rel}`, line: issue.line, category: "references", severity: issue.severity, finding: issue.finding, evidence: file }, m.skill);
      }
    }
  }

  for (const sub of ["usecases", "best-practices"]) {
    const subDir = join(dir, sub);
    if (!existsSync(subDir)) continue;
    for (const file of readdirSync(subDir).filter((f) => f.endsWith(".md"))) {
      const rel = `${sub}/${file}`;
      const text = readFileSync(join(subDir, file), "utf8");
      for (const mm of text.matchAll(PKG_PATH_RE)) {
        if (!existsSync(join(dir, mm[1]))) {
          ctx.addFinding({ file: `${m.skill}/${rel}`, line: 1, category: "references", severity: "High", finding: "package file link points to a missing file", evidence: `link: ${mm[1]}` }, m.skill);
        }
      }
    }
  }
}