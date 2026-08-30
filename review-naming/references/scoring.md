# Supplementary Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Review Coverage Ratio | % identifiers, files, and skills in scope that were reviewed | reviewed / total × 100 |
| 2 | False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| 3 | Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| 4 | Actionability Score | % findings with clear recommendation | actionable findings / total findings × 100 |
| 5 | Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| 6 | MTTR Estimate | estimated time to rename or fix naming issues | Critical=1d, High=3d, Medium=7d, Low=14d average |
| 7 | Before/After Trend | score improvement over time | (after - before) / before × 100 |
| 8 | Risk Exposure Index | high-severity naming issues in public API or skill names | count of Critical/High findings in critical scope |
| 9 | Scope Boundary Adherence | % naming findings inside declared scope | in-scope findings / total findings × 100 |
| 10 | Documentation/Report Quality | % findings with file path/line and suggested name | documented findings / total × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Naming Convention Coverage | % identifiers/files ที่เป็นไปตาม naming convention | conforming names / total names × 100 |
| 2 | Conflict Count | จำนวน naming conflicts หรือ duplicate names | duplicate or conflicting names |
| 3 | Clarity Score | % names ที่สื่อ intent ได้ชัดเจนไม่กำกวม | clear names / total names × 100 |
