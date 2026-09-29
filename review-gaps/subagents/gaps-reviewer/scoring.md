# Supplementary Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Review Coverage Ratio | % dimensional reviews in scope that were aggregated | aggregated / total × 100 |
| 2 | False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| 3 | Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| 4 | Actionability Score | % findings with clear recommendation | actionable findings / total findings × 100 |
| 5 | Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| 6 | MTTR Estimate | estimated time to close gaps | Critical=1d, High=3d, Medium=7d, Low=14d average |
| 7 | Before/After Trend | score improvement over time | (after - before) / before × 100 |
| 8 | Risk Exposure Index | high-severity gaps in critical dimensions | count of Critical/High findings in critical scope |
| 9 | Scope Boundary Adherence | % gaps inside declared scope | in-scope findings / total findings × 100 |
| 10 | Documentation/Report Quality | % gaps with source dimension and location | documented findings / total × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Coverage Gap Count | จำนวน coverage dimensions หรือ items ที่ขาดหาย | total missing items |
| 2 | Deduplication Rate | % findings ที่เป็น duplicate ถูกรวมหรือลบออก | removed duplicates / total findings × 100 |
| 3 | Finding-to-action Conversion | % findings ที่มี action ชัดเจนและถูก assign | findings with actions / total findings × 100 |
