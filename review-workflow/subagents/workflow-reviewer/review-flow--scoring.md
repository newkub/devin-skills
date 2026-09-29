# Supplementary Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Review Coverage Ratio | % workflow steps in scope that were reviewed | reviewed / total × 100 |
| 2 | False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| 3 | Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| 4 | Actionability Score | % findings with clear recommendation | actionable findings / total findings × 100 |
| 5 | Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| 6 | MTTR Estimate | estimated time to improve workflow | Critical=1d, High=3d, Medium=7d, Low=14d average |
| 7 | Before/After Trend | score improvement over time | (after - before) / before × 100 |
| 8 | Risk Exposure Index | high-severity flow issues in critical paths | count of Critical/High findings in critical scope |
| 9 | Scope Boundary Adherence | % flow findings inside declared scope | in-scope findings / total findings × 100 |
| 10 | Documentation/Report Quality | % findings with workflow step and reference | documented findings / total × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Flow Coverage | % flow steps ใน scope ที่ถูก review | reviewed steps / total steps × 100 |
| 2 | Drop-off Points | จำนวน flow steps ที่มีอัตรา drop-off สูง | steps with high drop-off / total steps × 100 |
| 3 | Completion Rate | % users ที่ทำ flow ให้สำเร็จจากต้นจนจบ | completed / started × 100 |
| 4 | Step Latency | เวลาเฉลี่ยที่ใช้ในแต่ละ flow step | total flow time / number of steps |
