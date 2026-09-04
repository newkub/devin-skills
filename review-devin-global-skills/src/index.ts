import { Glob } from "bun";
import { existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const cliRoot = process.argv[2] || process.env.DEVIN_SKILLS_ROOT;
const SKILLS_ROOT = cliRoot
  ? cliRoot.replace(/%APPDATA%/g, process.env.APPDATA || "")
  : (process.env.APPDATA || "/tmp") + "\\devin\\skills";

interface Finding {
  skill: string;
  file: string;
  line: number;
  category: string;
  severity: "Critical" | "High" | "Medium" | "Low" | "Info";
  finding: string;
  evidence: string;
}

interface SkillMeta {
  skill: string;
  path: string;
  lineCount: number;
  frontmatter: {
    name?: string;
    description?: string;
    related: string[];
  } | null;
  sections: string[];
  executeSteps: number;
  hasReferences: boolean;
  hasReferencesIndex: boolean;
  allMdFiles: { path: string; lines: number; isSkill: boolean }[];
}

const findings: Finding[] = [];
const observations: Finding[] = [];
const skills: SkillMeta[] = [];

const skillDirs = new Set<string>();
for (const d of new Glob("*/SKILL.md").scanSync(SKILLS_ROOT)) {
  skillDirs.add(dirname(d as string));
}

function addFinding(f: Omit<Finding, "skill">, skill: string) {
  findings.push({ ...f, skill } as Finding);
}

function parseFrontmatter(text: string): SkillMeta["frontmatter"] | null {
  const fmMatch = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return null;
  const fm = fmMatch[1];
  const nameMatch = fm.match(/^name:\s*(.+)$/m);
  const descMatch = fm.match(/^description:\s*(.+)$/m);
  const related: string[] = [];
  const lines = fm.split(/\r?\n/);
  let inRelated = false;
  for (const line of lines) {
    if (/^\S/.test(line)) {
      inRelated = line.startsWith("related:");
    } else if (inRelated && line.startsWith("  - ")) {
      related.push(line.slice(4).trim());
    }
  }
  return {
    name: nameMatch?.[1].trim(),
    description: descMatch?.[1].trim(),
    related,
  };
}

function extractSectionsWithLevels(text: string): string[] {
  const body = text.replace(/^---[\s\S]*?---\r?\n/, "");
  const sections: string[] = [];
  for (const m of body.matchAll(/^(#{2,3})\s+(.+)$/gm)) {
    sections.push(`${m[1]} ${m[2].trim()}`);
  }
  return sections;
}

function countExecuteSteps(text: string): number {
  const body = text.replace(/^---[\s\S]*?---\r?\n/, "");
  const execMatch = body.match(/## Execute[\s\S]*?(?=## |\z)/);
  if (!execMatch) return 0;
  let count = 0;
  for (const _ of execMatch[0].matchAll(/^###\s+\d+\.\s+/gm)) {
    count++;
  }
  return count;
}

function getBodyChunks(text: string): { isCode: boolean; text: string }[] {
  // Return chunks of body (excluding frontmatter) split by code blocks
  const body = text.replace(/^---[\s\S]*?---\r?\n/, "");
  const chunks: { isCode: boolean; text: string }[] = [];
  let inCode = false;
  let current = "";
  const lines = body.split(/\r?\n/);
  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      chunks.push({ isCode, text: current });
      inCode = !inCode;
      current = "";
    } else {
      current += line + "\n";
    }
  }
  chunks.push({ isCode, text: current });
  return chunks;
}

function nonCodeText(text: string): string {
  const body = text.replace(/^---[\s\S]*?---\r?\n/, "");
  let out = "";
  let inCode = false;
  for (const line of body.split(/\r?\n/)) {
    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (!inCode) out += line + "\n";
  }
  return out;
}

function textOutsideInlineCode(line: string): string {
  // Concatenate chunks outside backticks, separated by space
  const chunks = line.split("`");
  let out = "";
  for (let i = 0; i < chunks.length; i += 2) {
    out += chunks[i] + " ";
  }
  return out;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isPlaceholderMarker(line: string): boolean {
  // Consider a marker if the word appears as a task/unfinished item, not as an instruction reference.
  const t = textOutsideInlineCode(line);
  if (/(?:^|\s)(?:TODO|MOCK|placeholder)\s*[:：]/.test(t)) return true;
  if (/^\s*[-*]\s+(?:TODO|MOCK|placeholder)\b/i.test(t)) return true;
  return false;
}

function isProhibitedOrLegit(line: string): boolean {
  // Thai phrases that indicate the line is about forbidding or checking placeholders, not an actual placeholder.
  const t = textOutsideInlineCode(line).toLowerCase();
  if (/\b(todo|mock|placeholder)\b/.test(t)) {
    if (/ห้าม|ไม่มี|ตรวจ|ใช้|แปลง|production code|report-scan-todo|update-todo-md|implement-todo-md/.test(t)) return true;
  }
  return false;
}

function findBoldMarkers(line: string, globalLine: number): number[] {
  const outside = textOutsideInlineCode(line);
  const positions: number[] = [];
  const regex = /\*\*[^*]+\*\*/g;
  let m;
  while ((m = regex.exec(outside)) !== null) {
    positions.push(globalLine);
  }
  return positions;
}

for (const skill of skillDirs) {
  const skillPath = join(SKILLS_ROOT, skill, "SKILL.md");
  if (!existsSync(skillPath)) continue;
  const file = Bun.file(skillPath);
  const text = await file.text();
  const visibleLines = (s: string) => s.trimEnd().split(/\r?\n/).length;
  const lineCount = visibleLines(text);
  const frontmatter = parseFrontmatter(text);
  const sections = extractSectionsWithLevels(text);
  const executeSteps = countExecuteSteps(text);
  const hasReferences = existsSync(join(SKILLS_ROOT, skill, "references"));
  const hasReferencesIndex = existsSync(join(SKILLS_ROOT, skill, "references", "index.md"));

  // All .md files in package for line count check (only root and references, no submodules/deps)
  const allMdFiles: { path: string; lines: number; isSkill: boolean }[] = [];
  for (const md of new Glob(`${skill}/*.md`).scanSync(SKILLS_ROOT)) {
    const fp = join(SKILLS_ROOT, md as string);
    const lt = await Bun.file(fp).text();
    allMdFiles.push({ path: relative(SKILLS_ROOT, fp), lines: visibleLines(lt), isSkill: true });
  }
  for (const md of new Glob(`${skill}/references/*.md`).scanSync(SKILLS_ROOT)) {
    const fp = join(SKILLS_ROOT, md as string);
    const lt = await Bun.file(fp).text();
    allMdFiles.push({ path: relative(SKILLS_ROOT, fp), lines: visibleLines(lt), isSkill: false });
  }

  skills.push({
    skill,
    path: skillPath,
    lineCount,
    frontmatter,
    sections,
    executeSteps,
    hasReferences,
    hasReferencesIndex,
    allMdFiles,
  });

  const rpath = relative(SKILLS_ROOT, skillPath);
  const body = text.replace(/^---[\s\S]*?---\r?\n/, "");

  // Frontmatter
  if (!frontmatter) {
    addFinding({ file: rpath, line: 1, category: "frontmatter", severity: "Critical", finding: "missing frontmatter", evidence: "no --- frontmatter block" }, skill);
  } else {
    if (!frontmatter.name) {
      addFinding({ file: rpath, line: 1, category: "frontmatter", severity: "Critical", finding: "missing name", evidence: "frontmatter has no name" }, skill);
    } else if (frontmatter.name !== skill) {
      addFinding({ file: rpath, line: 2, category: "frontmatter", severity: "Critical", finding: "name mismatch", evidence: `name: ${frontmatter.name}, directory: ${skill}` }, skill);
    }
    if (frontmatter.description !== undefined) {
      const descLen = [...frontmatter.description].length;
      if (descLen > 100) {
        addFinding({ file: rpath, line: 3, category: "frontmatter", severity: "Low", finding: "description over 100 chars", evidence: `length: ${descLen}` }, skill);
      }
      if (descLen < 20) {
        addFinding({ file: rpath, line: 3, category: "frontmatter", severity: "Info", finding: "description too short", evidence: `length: ${descLen}` }, skill);
      }
    } else {
      addFinding({ file: rpath, line: 3, category: "frontmatter", severity: "Critical", finding: "missing description", evidence: "frontmatter has no description" }, skill);
    }
    for (const ref of frontmatter.related) {
      if (!skillDirs.has(ref)) {
        addFinding({ file: rpath, line: 1, category: "frontmatter", severity: "High", finding: "missing related skill", evidence: `related: ${ref}` }, skill);
      } else {
        const mention = new RegExp(`(?:\\b|/)${escapeRegExp(ref)}\\b`).test(body);
        if (!mention) {
          addFinding({ file: rpath, line: 1, category: "frontmatter", severity: "Medium", finding: "orphan related reference", evidence: `related: ${ref} not mentioned in body` }, skill);
        }
      }
    }
  }

  // Line count for all package .md files
  for (const mdf of allMdFiles) {
    if (mdf.lines > 250) {
      let sev: Finding["severity"];
      if (mdf.isSkill) {
        sev = mdf.lines > 300 ? "Critical" : mdf.lines <= 260 ? "Low" : "Medium";
      } else {
        sev = mdf.lines <= 260 ? "Low" : "Medium";
      }
      addFinding({ file: mdf.path, line: mdf.lines, category: "line-count", severity: sev, finding: "file exceeds 250 lines", evidence: `lines: ${mdf.lines}` }, skill);
    }
  }

  // Sections
  const h2s = sections.filter(l => l.startsWith("## ")).map(l => l.slice(3));
  const required = ["Goal", "Scope", "Execute", "Rules", "Expected Outcome"];
  for (const m of required) {
    if (!h2s.includes(m)) {
      addFinding({ file: rpath, line: 1, category: "sections", severity: "Critical", finding: `missing section: ${m}`, evidence: `h2 sections: [${h2s.join(", ")}]` }, skill);
    }
  }
  const indices = required.map(r => h2s.indexOf(r));
  const sorted = [...indices].sort((a, b) => a - b);
  if (indices.every(i => i >= 0) && JSON.stringify(indices) !== JSON.stringify(sorted)) {
    addFinding({ file: rpath, line: 1, category: "sections", severity: "High", finding: "section order incorrect", evidence: `indices: ${indices.join(",")}` }, skill);
  }
  if (executeSteps > 10) {
    addFinding({ file: rpath, line: 1, category: "sections", severity: "Medium", finding: "Execute has more than 10 steps", evidence: `steps: ${executeSteps}` }, skill);
  }

  // Step Goal check: > Goal: must appear somewhere between this ### step and the next ###/##
  const bodyLines = body.split(/\r?\n/);
  let inExecute = false;
  const executeStart = bodyLines.findIndex(l => l.startsWith("## Execute"));
  const executeEndIdx = bodyLines.findIndex((l, idx) => idx > executeStart && l.startsWith("## "));
  for (let i = 0; i < bodyLines.length; i++) {
    const l = bodyLines[i];
    if (l.startsWith("## Execute")) { inExecute = true; continue; }
    if (l.startsWith("## ") && inExecute) { inExecute = false; continue; }
    if (inExecute && /^###\s+\d+\.\s+/.test(l)) {
      let found = false;
      for (let j = i + 1; j < bodyLines.length; j++) {
        const next = bodyLines[j];
        if (next.startsWith("### ") || next.startsWith("## ")) break;
        if (next.trim().startsWith("> Goal:")) { found = true; break; }
      }
      if (!found) {
        addFinding({ file: rpath, line: i + 1, category: "sections", severity: "High", finding: "step missing > Goal:", evidence: l }, skill);
      }
    }
  }

  // Style: bold markers and TODO/MOCK/placeholder (outside code blocks and inline code)
  const nonCode = nonCodeText(text);
  const nonCodeLines = nonCode.split(/\r?\n/);
  for (let i = 0; i < nonCodeLines.length; i++) {
    const l = nonCodeLines[i];
    const outside = textOutsideInlineCode(l);
    if (/\*\*[^*]+\*\*/.test(outside)) {
      addFinding({ file: rpath, line: i + 1, category: "style", severity: "Medium", finding: "uses bold markers **", evidence: l.trim() }, skill);
      break; // one per skill
    }
  }

  for (let i = 0; i < nonCodeLines.length; i++) {
    const l = nonCodeLines[i];
    const outside = textOutsideInlineCode(l).toLowerCase();
    if (/\b(todo|mock|placeholder)\b/.test(outside) && isPlaceholderMarker(l) && !isProhibitedOrLegit(l)) {
      observations.push({ file: rpath, line: i + 1, category: "content", severity: "Info", finding: "contains TODO/MOCK/placeholder mention", evidence: l.trim(), skill });
      break;
    }
  }

  // Heading Title Case check (English headings that are not Title Case)
  for (let i = 0; i < bodyLines.length; i++) {
    const l = bodyLines[i];
    if (/^#{2,3}\s+[a-z]/.test(l)) {
      const heading = l.replace(/^#{2,3}\s+/, "");
      // skip if it is just a code snippet inline
      if (!/^`.*`$/.test(heading)) {
        addFinding({ file: rpath, line: i + 1, category: "style", severity: "Low", finding: "heading is not Title Case", evidence: l }, skill);
      }
    }
  }

  // Parallel markers in wrong sections
  const rulesIdx = body.indexOf("## Rules");
  const expectedIdx = body.indexOf("## Expected Outcome");
  const ruleRegion = rulesIdx >= 0 ? body.slice(rulesIdx, expectedIdx >= 0 ? expectedIdx : undefined) : "";
  const expectedRegion = expectedIdx >= 0 ? body.slice(expectedIdx) : "";
  if (/[∥]/.test(ruleRegion)) {
    addFinding({ file: rpath, line: 1, category: "parallel", severity: "High", finding: "parallel marker in Rules", evidence: "contains ∥ in Rules section" }, skill);
  }
  if (/[∥]/.test(expectedRegion)) {
    addFinding({ file: rpath, line: 1, category: "parallel", severity: "High", finding: "parallel marker in Expected Outcome", evidence: "contains ∥ in Expected Outcome" }, skill);
  }

  // References directory
  if (hasReferences && !hasReferencesIndex) {
    addFinding({ file: rpath, line: 1, category: "file-structure", severity: "Medium", finding: "references/ exists without index.md", evidence: "missing references/index.md" }, skill);
  }
}

// Cross-skill consistency: AGENTS.md family counts
const agentsFamilyCounts: Record<string, number> = {
  "follow-*": 241,
  "review-*": 57,
  "list-*": 49,
  "report-*": 38,
  "update-*": 35,
  "run-*": 34,
  "deep-*": 24,
  "create-*": 20,
  "check-*": 19,
  "open-*": 19,
};
const prefixToFamily: Record<string, string> = {
  follow: "follow-*",
  review: "review-*",
  list: "list-*",
  report: "report-*",
  update: "update-*",
  run: "run-*",
  deep: "deep-*",
  create: "create-*",
  check: "check-*",
  open: "open-*",
};
const actualCounts: Record<string, number> = {};
for (const f of Object.keys(prefixToFamily)) actualCounts[prefixToFamily[f]] = 0;
for (const s of skills) {
  const first = s.skill.split("-")[0];
  const key = prefixToFamily[first];
  if (key) actualCounts[key] = (actualCounts[key] || 0) + 1;
}
for (const [family, expected] of Object.entries(agentsFamilyCounts)) {
  const actual = actualCounts[family] ?? 0;
  if (actual !== expected) {
    addFinding({ file: "AGENTS.md", line: 1, category: "cross-skill-consistency", severity: "Medium", finding: "AGENTS.md skill family count out of sync", evidence: `${family}: actual ${actual}, expected ${expected}` }, "_repo");
  }
}

// Circular related dependencies (limit to 2-node cycles to avoid explosion)
const relatedMap: Record<string, Set<string>> = {};
for (const s of skills) {
  relatedMap[s.skill] = new Set(s.frontmatter?.related ?? []);
}
const twoNodeCycles: string[] = [];
for (const a of Object.keys(relatedMap)) {
  for (const b of relatedMap[a]) {
    if (relatedMap[b]?.has(a) && a < b) {
      twoNodeCycles.push(`${a} <-> ${b}`);
    }
  }
}
// Circular `related` is allowed as symmetric see-also per frontmatter.md update

// Scoring
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

const totalSkills = skills.length;
const skillsWithIssues = new Set(findings.map(f => f.skill)).size;

const severityWeight = { Critical: 0, High: 25, Medium: 50, Low: 75, Info: 100 };
let score = 100;
if (findings.length > 0) {
  const weights = findings.map(f => severityWeight[f.severity]);
  const avg = weights.reduce((a, b) => a + b, 0) / weights.length;
  score = Math.round(avg);
}

let grade = "F";
if (score >= 90) grade = "A";
else if (score >= 80) grade = "B";
else if (score >= 70) grade = "C";
else if (score >= 60) grade = "D";

const report = {
  meta: {
    totalSkills,
    skillsWithIssues,
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

const outPath = join(process.cwd(), "review-skills-report.json");
await Bun.write(outPath, JSON.stringify(report, null, 2));

console.log(`Skills reviewed: ${totalSkills}`);
console.log(`Findings: ${findings.length}`);
console.log(`Observations: ${observations.length}`);
console.log(`Score: ${score} (Grade ${grade})`);
console.log(`By severity:`, bySeverity);
console.log(`By category:`, byCategory);
console.log(`Report saved to: ${outPath}`);
