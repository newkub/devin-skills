# Supplementary Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Review Coverage Ratio | % reviewed items in scope that were fixed and verified | fixed / total × 100 |
| 2 | False Positive Rate | % fixes reverted or not accepted | reverted fixes / total fixes × 100 |
| 3 | Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| 4 | Actionability Score | % findings with clear recommendation | actionable findings / total findings × 100 |
| 5 | Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| 6 | MTTR Estimate | estimated time to fix and verify | Critical=1d, High=3d, Medium=7d, Low=14d average |
| 7 | Before/After Trend | score improvement over time | (after - before) / before × 100 |
| 8 | Risk Exposure Index | high-severity unfixed issues in critical areas | count of Critical/High findings in critical scope |
| 9 | Scope Boundary Adherence | % fixed issues inside declared scope | in-scope findings / total findings × 100 |
| 10 | Documentation/Report Quality | % fixes with file/line and reason | documented findings / total × 100 |
