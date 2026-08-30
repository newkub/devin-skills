# Scoring Formula

คำนวณ review score สำหรับ skill package

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

- Score < 70 → แนะนำให้เรียก `update-all-devin-global-skills` ก่อนดำเนินการ
- Score < 50 → หยุดและ report อย่างเดียว

## Report Format

- ทำ `/report-table` พร้อม columns: Skill, Category, Severity, Finding, Evidence, Action
- ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป
- ทุก finding ต้องมี skill name, file path และ evidence

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % skill packages and sections in scope that were reviewed | reviewed / total × 100 |
| False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| Actionability Score | % findings with clear recommendation | actionable findings / total findings × 100 |
| Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | estimated time to fix | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | score improvement over time | (after - before) / before × 100 |
| Risk Exposure Index | high-severity findings in critical skill areas | count of Critical/High findings in frontmatter/sections/score scope |
| Scope Boundary Adherence | % findings inside declared skills-repo scope | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % findings with proper location/reference | documented findings / total × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Cross-Skill Consistency Score | คะแนนความสอดคล้องระหว่าง skills | consistent cross-skill items / total cross-skill items × 100 |
| 2 | Duplicate Pattern Count | จำนวน pattern ที่ซ้ำซ้อนระหว่าง skills | count of duplicate patterns |
| 3 | Reference Coverage | % ของ references ที่มีครบถ้วน | valid references / total references × 100 |
| 4 | Template Compliance | % ของ skills ที่ปฏิบัติตาม template | compliant skills / total skills × 100 |
