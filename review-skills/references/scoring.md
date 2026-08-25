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

- Score < 70 → แนะนำให้เรียก `update-skills` ก่อนดำเนินการ
- Score < 50 → หยุดและ report อย่างเดียว

## Report Format

- ทำ `/report-table` พร้อม columns: Skill, Category, Severity, Finding, Evidence, Action
- ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป
- ทุก finding ต้องมี skill name, file path และ evidence
