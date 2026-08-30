# Structure Health Score

## Goal

คำนวณ structure health score ก่อน restructure

## Scoring

- 5 metrics หลัก: file naming, folder grouping, barrel exports, import complexity, nesting depth
- คะแนนต่อ metric: pass = 1, warning = 0.5, fail = 0
- Structure health score = (total score / 5) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)

## Severity Weights

| Severity | Weight |
|----------|--------|
| Critical | 0 |
| High | 25 |
| Medium | 50 |
| Low | 75 |
| Info | 100 |

## Action Threshold

- Score < 70 → แนะนำ `restructure` หรือ `relocation`
- Score < 50 → หยุดและ report

## Report Format

- Structure Health Metrics columns: Metric, Count, Threshold, Status
- Relocation Plan columns: File, Old Path, New Path, Reason, Priority

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % structure metrics and relocation candidates in scope that were reviewed | reviewed / total × 100 |
| False Positive Rate | % restructure findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with evidence (file/folder path) | findings with evidence / total findings × 100 |
| Actionability Score | % findings with clear restructure recommendation | actionable findings / total findings × 100 |
| Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | estimated time to fix | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | score improvement over time | (after - before) / before × 100 |
| Risk Exposure Index | high-severity findings in critical structure areas | count of Critical/High findings in core folders |
| Scope Boundary Adherence | % findings inside declared restructure-review scope | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % findings with proper location/reference | documented findings / total × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Structure Maturity | % ของ structure rules ที่ผ่านเกณฑ์ | passed structure rules / total rules × 100 |
| 2 | Coupling Score | % ของ modules ที่มี import/dependency น้อย | low-coupling modules / total modules × 100 |
| 3 | Cohesion Score | % ของ modules ที่มี responsibilities สอดคล้องกัน | cohesive modules / total modules × 100 |
