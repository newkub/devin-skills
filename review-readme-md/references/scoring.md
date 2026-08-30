# Scoring Formula

กฎการคำนวณ review score และ grade

## Severity Weights

แต่ละ severity มี score ดังนี้:

| Severity | Score |
|---|---|
| `Critical` | 0 |
| `High` | 25 |
| `Medium` | 50 |
| `Low` | 75 |
| `Info` | 100 |

## Score Calculation

review score = weighted average ของ findings ทั้งหมด

```
review score = sum(severity_score) / count(findings)
```

- ถ้าไม่มี finding → review score = 100
- ถ้ามี finding หนึ่ง `Critical` และหนึ่ง `Info` → (0 + 100) / 2 = 50

## Grade Thresholds

| Grade | Score Range |
|---|---|
| A | 90 ขึ้นไป |
| B | 80 ถึง 89 |
| C | 70 ถึง 79 |
| D | 60 ถึง 69 |
| F | ต่ำกว่า 60 |

## Action Threshold

- Score < 70 → แนะนำให้เรียก `update-readme-md` ก่อนดำเนินการ
- Score >= 70 → สามารถดำเนินการต่อได้ พร้อมแนะนำการแก้ไข findings ที่เหลือ

## Report Format

รายงานผ่าน `/report-table` พร้อม columns:

| Category | Severity | Finding | Evidence | Action |
|---|---|---|---|---|

- Category: section ที่ finding เกี่ยวข้อง (เช่น Section Order, Tables, Content)
- Severity: `Critical`, `High`, `Medium`, `Low`, `Info`
- Finding: คำอธิบายปัญหา
- Evidence: file path และ line number
- Action: action ที่ต้องทำ (เช่น แก้ไข section order, เพิ่ม column)

## Next Action

- ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป
- ถ้า Score < 70 → แนะนำ `update-readme-md` เป็น action หลัก
- ถ้า Score >= 70 → แนะนำการแก้ไข findings ที่เหลือตาม priority

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % README sections and workspaces in scope that were reviewed | reviewed / total × 100 |
| False Positive Rate | % README findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| Actionability Score | % findings with clear README fix recommendation | actionable findings / total findings × 100 |
| Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | estimated time to fix README issues | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | score improvement over time | (after - before) / before × 100 |
| Risk Exposure Index | high-severity findings in critical README areas | count of Critical/High findings in section order/features/usage scope |
| Scope Boundary Adherence | % findings inside declared README-review scope | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % findings with proper location/reference | documented findings / total × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Section coverage | % ของ section ที่แนะนำใน README ที่มีครบ | ส่วนที่มี / ส่วนที่แนะนำ × 100 |
| 2 | Badge accuracy | % ของ badge ที่ตรงกับสถานะปัจจุบัน | badge ถูกต้อง / รวม badge × 100 |
| 3 | Install clarity | ความชัดเจนของคำแนะนำการติดตั้ง | คะแนนจาก checklist หรือ peer review |
| 4 | Example coverage | % ของ use cases ที่มีตัวอย่าง | ตัวอย่างที่มี / use cases ทั้งหมด × 100 |
