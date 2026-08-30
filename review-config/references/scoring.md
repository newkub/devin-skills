# Config Review Score

## Goal

คำนวณ config review score สำหรับ project config coverage, consistency, security

## Scoring

- คะแนนต่อ category: pass = 1, warning = 0.5, fail = 0
- Categories: package, build, lint, test, deploy, editor, env, monorepo, docs
- Config review score = (total score / total categories) × 100%
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

- Score < 70 → แนะนำ `/update-config`
- Score < 50 → หยุดและ report

## Report Format

- `/report-table` columns: Category, File, Status, Issue, Severity, Recommendation
- `/report-file-structure` สำหรับ config tree

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % config categories and files in scope that were reviewed | reviewed / total × 100 |
| False Positive Rate | % config findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| Actionability Score | % findings with clear recommendation | actionable findings / total findings × 100 |
| Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | estimated time to fix config issues | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | score improvement over time | (after - before) / before × 100 |
| Risk Exposure Index | high-severity findings in critical config areas | count of Critical/High findings in security/build/deploy scope |
| Scope Boundary Adherence | % findings inside declared config scope | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % findings with proper location/reference | documented findings / total × 100 |
