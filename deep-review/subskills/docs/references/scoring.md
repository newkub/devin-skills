# Scoring Formula

คำนวณ review score สำหรับ docs structure

## Formula

review score = weighted average ของ findings ทั้งหมด

## Severity Weights

- Critical = 0
- High = 25
- Medium = 50
- Low = 75
- Info = 100

## Grade Mapping

- A: 90+ (ยอดเยี่ยม)
- B: 80+ (ดี)
- C: 70+ (ผ่าน)
- D: 60+ (ต้องปรับปรุง)
- F: <60 (ไม่ผ่าน)

## Action Threshold

- Score < 70 → แนะนำให้เรียก `update-docs` ก่อนดำเนินการ
- Score < 50 → หยุดและ report อย่างเดียว

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % docs pages and structure checks in scope that were reviewed | reviewed / total × 100 |
| False Positive Rate | % docs findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| Actionability Score | % findings with clear docs fix recommendation | actionable findings / total findings × 100 |
| Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | estimated time to fix docs issues | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | score improvement over time | (after - before) / before × 100 |
| Risk Exposure Index | high-severity findings in critical docs areas | count of Critical/High findings in structure/nav/content scope |
| Scope Boundary Adherence | % findings inside declared docs-review scope | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % findings with proper location/reference | documented findings / total × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Doc Freshness | % of docs updated within acceptable window | fresh docs / total docs × 100 |
| 2 | Searchability | % of docs with findable structure | searchable docs / total docs × 100 |
| 3 | Example Coverage | % of documented items with examples | items with examples / total items × 100 |
| 4 | API Doc Completeness | % of APIs with complete documentation | documented APIs / total APIs × 100 |
