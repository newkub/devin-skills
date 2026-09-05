import { Glob } from "bun";
import { existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { checkFrontmatter } from "./checks/frontmatter";
import { checkLineCount } from "./checks/line-count";
import { checkParallel } from "./checks/parallel";
import { checkReferences } from "./checks/references";
import { checkSections } from "./checks/sections";
import { checkCrossSkill } from "./checks/cross-skill";
import { checkLanguage, checkStyle } from "./checks/style";
import { checkTemplate } from "./checks/template";
import { applyFixes } from "./fix";
import {
  countExecuteSteps,
  extractSectionsWithLevels,
  nonCodeLines,
  parseFrontmatter,
  stripFrontmatter,
  visibleLines,
} from "./parse";
import type { Finding, SkillMeta } from "./types";

const args = process.argv.slice(2);
const FIX = args.includes("--fix");
const CI = args.includes("--ci");
const cliRoot = args.find((a) => !a.startsWith("--")) || process.env.DEVIN_SKILLS_ROOT;
const SKILLS_ROOT = cliRoot
  ? cliRoot.replace(/%APPDATA%/g, process.env.APPDATA || "")
  : (process.env.APPDATA || "/tmp") + "\\devin\\skills";
const SELF_DIR = join(SKILLS_ROOT, "review-devin-global-skills");

const findings: Finding[] = [];
const observations: Finding[] = [];
const skills: SkillMeta[] = [];

const skillDirs = new Set<string>();
for (const d of new Glob("*/SKILL.md").scanSync(SKILLS_ROOT)) {
  skillDirs.add(dirname(d as string));
}

const ctx = {
  skillsRoot: SKILLS_ROOT,
  skillDirs,
  addFinding: (f: Omit<Finding, "skill">, skill: string) => findings.push({ ...f, skill } as Finding),
  addObservation: (f: Omit<Finding, "skill">, skill: string) => observations.push({ ...f, skill } as Finding),
};

for (const skill of skillDirs) {
  const skillPath = join(SKILLS_ROOT, skill, "SKILL.md");
  if (!existsSync(skillPath)) continue;
  const text = await Bun.file(skillPath).text();
  const body = stripFrontmatter(text);

  const allMdFiles: SkillMeta["allMdFiles"] = [];
  for (const md of new Glob(`${skill}/*.md`).scanSync(SKILLS_ROOT)) {
    const fp = join(SKILLS_ROOT, md as string);
    allMdFiles.push({ path: relative(SKILLS_ROOT, fp), lines: visibleLines(await Bun.file(fp).text()), isSkill: true });
  }
  for (const md of new Glob(`${skill}/references/*.md`).scanSync(SKILLS_ROOT)) {
    const fp = join(SKILLS_ROOT, md as string);
    allMdFiles.push({ path: relative(SKILLS_ROOT, fp), lines: visibleLines(await Bun.file(fp).text()), isSkill: false });
  }

  const meta: SkillMeta = {
    skill,
    path: skillPath,
    lineCount: visibleLines(text),
    frontmatter: parseFrontmatter(text),
    sections: extractSectionsWithLevels(text),
    executeSteps: countExecuteSteps(text),
    hasReferences: existsSync(join(SKILLS_ROOT, skill, "references")),
    hasReferencesIndex: existsSync(join(SKILLS_ROOT, skill, "references", "index.md")),
    allMdFiles,
    body,
    bodyLines: body.split(/\r?\n/),
    nonCodeLines: nonCodeLines(text),
  };
  skills.push(meta);

  checkFrontmatter(meta, ctx);
  checkSections(meta, ctx);
  checkLineCount(meta, ctx);
  checkStyle(meta, ctx);
  checkLanguage(meta, ctx);
  checkReferences(meta, ctx);
  checkParallel(meta, ctx);
  checkTemplate(meta, ctx);
}

checkCrossSkill(skills, ctx);

if (FIX) {
  const fixed = await applyFixes(findings, ctx);
  console.log(`Auto-fixed: ${fixed} finding(s)`);
}

const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3, Info: 4 };
findings.sort((a, b) => {
  if (severityOrder[a.severity] !== severityOrder[b.severity]) return severityOrder[a.severity] - severityOrder[b.severity];
  if (a.skill !== b.skill) return a.skill.localeCompare(b.skill);
  return a.line - b.line;
});

const byCategory: Record<string, number> = {};
for (const f of findings) byCategory[f.category] = (byCategory[f.category] || 0) + 1;
const bySeverity: Record<string, number> = {};
for (const f of findings) bySeverity[f.severity] = (bySeverity[f.severity] || 0) + 1;

const severityWeight = { Critical: 0, High: 25, Medium: 50, Low: 75, Info: 100 };
let score = 100;
if (findings.length > 0) {
  const avg = findings.map((f) => severityWeight[f.severity]).reduce((a, b) => a + b, 0) / findings.length;
  score = Math.round(avg);
}
let grade = "F";
if (score >= 90) grade = "A";
else if (score >= 80) grade = "B";
else if (score >= 70) grade = "C";
else if (score >= 60) grade = "D";

const report = {
  meta: {
    totalSkills: skills.length,
    skillsWithIssues: new Set(findings.map((f) => f.skill)).size,
    totalFindings: findings.length,
    totalObservations: observations.length,
    score,
    grade,
    bySeverity,
    byCategory,
  },
  findings,
  observations,
};

const outPath = join(SELF_DIR, "review-skills-report.json");
await Bun.write(outPath, JSON.stringify(report, null, 2));

console.log(`Skills reviewed: ${skills.length}`);
console.log(`Findings: ${findings.length}`);
console.log(`Observations: ${observations.length}`);
console.log(`Score: ${score} (Grade ${grade})`);
console.log(`By severity:`, bySeverity);
console.log(`By category:`, byCategory);
console.log(`Report saved to: ${outPath}`);

if (CI && (bySeverity.Critical || 0) + (bySeverity.High || 0) > 0) {
  process.exitCode = 1;
}
