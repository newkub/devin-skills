# Workspace Review Score And Metrics

## Goal

คำนวณ score และ metrics สำหรับ workspace review

## Scope

ใช้หลังจบ `review-workspace`

## Score Formula

- คำนวณ score จาก weighted average ของ findings ตาม severity
- Critical = 0, High = 25, Medium = 50, Low = 75, Info = 100
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % workspace dimensions in scope that were reviewed | reviewed / total × 100 |
| False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| Actionability Score | % findings with clear recommendation | actionable findings / total findings × 100 |
| Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | estimated time to fix | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | score improvement over time | (after - before) / before × 100 |
| Risk Exposure Index | high-severity findings in critical areas (manifest, dependencies, or config) | count of Critical/High findings in critical scope |
| Scope Boundary Adherence | % findings inside declared scope | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % findings with proper location/reference | documented findings / total × 100 |
