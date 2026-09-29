import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const packageDir = import.meta.dir;
const data = JSON.parse(readFileSync(join(packageDir, "..", "review-skills-report.json"), "utf8"));
const now = new Date();
const time = now.toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
const outDir = join(packageDir, "..", "..", ".devin", "reports", "skills");
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, `review-devin-global-harness-${time}.md`);

const esc = (v: unknown) => String(v).replace(/\|/g, "\\|");
const rows = data.findings.map(
  (f: any, i: number) =>
    `| ${i + 1} | ${f.skill} | ${f.category} | ${f.severity} | ${f.finding} | ${esc(f.evidence)} | ${f.file} |`
);

const SEVERITIES = ["Critical", "High", "Medium", "Low", "Info"];
const categories = Object.keys(data.meta.byCategory).sort();

const sevTable = `| ${SEVERITIES.join(" | ")} |\n|${SEVERITIES.map(() => "---").join("|")}|\n| ${SEVERITIES.map((s) => data.meta.bySeverity[s] ?? 0).join(" | ")} |`;
const catTable = `| ${categories.join(" | ")} |\n|${categories.map(() => "---").join("|")}|\n| ${categories.map((c) => data.meta.byCategory[c]).join(" | ")} |`;

const md = `---
title: review-devin-global-harness
description: Review findings for devin global skills repo
status: pending
created: ${now.toISOString()}
---

## Goal

รายงานผลการ review devin global skills repo ด้วย /review-devin-global-harness CLI

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

${sevTable}

## Findings by Category

${catTable}

## Findings

| No. | Skill | Category | Severity | Finding | Evidence | File |
|---|---|---|---|---|---|---|
${rows.join("\n")}

## Observations

${data.observations.map((o: any, i: number) => `${i + 1}. [${o.severity}/${o.category}] ${o.finding} — ${o.evidence} (${o.skill})`).join("\n")}

## Next Action

1. ตรวจสอบ findings ที Critical ก่อน
2. แก้ไข frontmatter orphan related references
3. รัน /review-devin-global-harness ซ้ำเพื่อ verify
`;

writeFileSync(outFile, md);
console.log(`Report saved to: ${outFile}`);
