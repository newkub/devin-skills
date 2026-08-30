# Supplementary Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Review Coverage Ratio | % GitHub issue fields in scope that were reviewed | reviewed / total × 100 |
| 2 | False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| 3 | Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| 4 | Actionability Score | % findings with clear recommendation | actionable findings / total findings × 100 |
| 5 | Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| 6 | MTTR Estimate | estimated time to clarify or fix issue | Critical=1d, High=3d, Medium=7d, Low=14d average |
| 7 | Before/After Trend | score improvement over time | (after - before) / before × 100 |
| 8 | Risk Exposure Index | high-severity issues blocking implementation | count of Critical/High findings in critical scope |
| 9 | Scope Boundary Adherence | % findings inside declared issue scope | in-scope findings / total findings × 100 |
| 10 | Documentation/Report Quality | % findings with issue reference and quote | documented findings / total × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Issue Quality Score | คะแนนคุณภาพ issue จาก required fields | filled required fields / total required fields × 100 |
| 2 | Label Accuracy | % labels ที่ตรงกับ scope, severity, type | correct labels / total labels × 100 |
| 3 | Reproduction Rate | % issues ที่มี reproduction steps หรือ sample | reproducible issues / total issues × 100 |
| 4 | Time to Triage | เวลาเฉลี่ยจากเปิด issue ถึง triaged/assigned | sum triage times / issue count |
