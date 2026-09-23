# Supplementary Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Review Coverage Ratio | % files or sections in scope that were reviewed for readability | reviewed / total × 100 |
| 2 | False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| 3 | Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| 4 | Actionability Score | % findings with clear recommendation | actionable findings / total findings × 100 |
| 5 | Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| 6 | MTTR Estimate | estimated time to improve readability | Critical=1d, High=3d, Medium=7d, Low=14d average |
| 7 | Before/After Trend | score improvement over time | (after - before) / before × 100 |
| 8 | Risk Exposure Index | high-severity readability issues in core files | count of Critical/High findings in critical scope |
| 9 | Scope Boundary Adherence | % readability findings inside declared scope | in-scope findings / total findings × 100 |
| 10 | Documentation/Report Quality | % findings with file, section, and recommendation | documented findings / total × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Readability score | คะแนนความง่ายต่อการอ่าน code | ประเมินด้วย readability index หรือ manual check |
| 2 | Complexity score | ค่าความซับซ้อนเฉลี่ยต่อ function | รวม cyclomatic/cognitive complexity / จำนวน function |
| 3 | Comment quality | % ของ comment ที่อธิบาย why ไม่ใช่ what | comment ที่มีประโยชน์ / รวม comment × 100 |
| 4 | One-liner density | % ของ one-liner functions/expressions | one-liners / รวม functions × 100 |
