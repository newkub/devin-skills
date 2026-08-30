# Implementation Readiness Score And Metrics

## Goal

คำนวณ score และ metrics สำหรับ implement review

## Scope

ใช้หลังจบ `review-implement`

## Score Formula

ดูรายละเอียดสูตรคะแนนใน [readiness-score.md](readiness-score.md)

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % implementation readiness items in scope that were reviewed | reviewed / total × 100 |
| False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| Actionability Score | % findings with clear recommendation | actionable findings / total findings × 100 |
| Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | estimated time to fix | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | score improvement over time | (after - before) / before × 100 |
| Risk Exposure Index | high-severity findings in critical areas (plan, MVP, or blockers) | count of Critical/High findings in critical scope |
| Scope Boundary Adherence | % findings inside declared scope | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % findings with proper location/reference | documented findings / total × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Requirement Coverage | % requirements ที่ implement และ verify ครบ | implemented requirements / total requirements × 100 |
| 2 | Implementation Gap | % หรือจำนวน items ที่ยังไม่ได้ implement | missing items / total items × 100 |
| 3 | Test Pass Rate | % tests ที่ผ่านหลัง implement | passed tests / total tests × 100 |
