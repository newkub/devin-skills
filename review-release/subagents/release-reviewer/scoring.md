# Release Review Score And Metrics

## Goal

คำนวณ score และ metrics สำหรับ release review

## Scope

ใช้หลังจบ `review-release`

## Score Formula

ดูรายละเอียดสูตรคะแนนใน [release-readiness-score.md](release-readiness-score.md)

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % release checklist items in scope that were reviewed | reviewed / total × 100 |
| False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| Actionability Score | % findings with clear recommendation | actionable findings / total findings × 100 |
| Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | estimated time to fix | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | score improvement over time | (after - before) / before × 100 |
| Risk Exposure Index | high-severity findings in critical areas (version, changelog, breaking changes, or platform config) | count of Critical/High findings in critical scope |
| Scope Boundary Adherence | % findings inside declared scope | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % findings with proper location/reference | documented findings / total × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Release Note Coverage | % ของ version/change ที่มี release notes ครบ | changes with notes / total changes × 100 |
| 2 | Rollback Readiness | % ของ release ที่มี rollback plan พร้อมใช้ | releases with rollback plan / total releases × 100 |
| 3 | Changelog Accuracy | % ของ changelog entries ที่ตรงกับ actual changes | accurate entries / total entries × 100 |
