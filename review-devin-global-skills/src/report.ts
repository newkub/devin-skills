import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const data = JSON.parse(readFileSync("review-skills-report.json", "utf8"));
const now = new Date();
const time = now.toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
const outDir = join("..", "..", ".devin", "reports", "skills");
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, `review-devin-global-skills-${time}.md`);

const rows = data.findings.map(
  (f: any, i: number) =>
    `| ${i + 1} | ${f.skill} | ${f.category} | ${f.severity} | ${f.finding} | ${String(f.evidence).replace(/\|/g, "\\|")} | ${f.file} |`
);

const md = `---
title: review-devin-global-skills
description: Review findings for devin global skills repo
status: pending
created: ${now.toISOString()}
---

## Goal

รายงานผลการ review devin global skills repo ด้วย /review-devin-global-skills CLI

## Scope

รวม findings, observations, score, grade และสรุปจำนวน issues ตาม category

## Meta

| Metric | Value |
|---|---|
| Total skills | ${data.meta.totalSkills} |
| Skills with issues | ${data.meta.skillsWithIssues} |
| Total findings | ${data.meta.totalFindings} |
| Observations | ${data.meta.totalObservations} |
| Score | ${data.meta.score} |
| Grade | ${data.meta.grade} |

## Findings by Severity

| Critical | Medium | Low |
|---|---|---|
| ${data.meta.bySeverity.Critical} | ${data.meta.bySeverity.Medium} | ${data.meta.bySeverity.Low} |

## Findings by Category

| frontmatter | style | references |
|---|---|---|
| ${data.meta.byCategory.frontmatter} | ${data.meta.byCategory.style} | ${data.meta.byCategory.references} |

## Findings

| No. | Skill | Category | Severity | Finding | Evidence | File |
|---|---|---|---|---|---|---|
${rows.join("\n")}

## Observations

${data.observations.map((o: any, i: number) => `${i + 1}. ${o}`).join("\n")}

## Next Action

1. ตรวจสอบ findings ที Critical ก่อน
2. แก้ไข frontmatter orphan related references
3. รัน /review-devin-global-skills ซ้ำเพื่อ verify
`;

writeFileSync(outFile, md);
console.log(`Report saved to: ${outFile}`);
