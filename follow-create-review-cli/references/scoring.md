# Scoring Formula And Grading

## Severity Weights

แต่ละ severity มี score weight ดังนี้:

- `Critical` = 0
- `High` = 25
- `Medium` = 50
- `Low` = 75
- `Info` = 100

## Score Calculation

review score = weighted average ของ findings ทั้งหมด:

```
score = sum(severity_weight * count) / total_findings
```

ตัวอย่าง:

- 1 Critical, 1 High, 1 Medium → (0 + 25 + 50) / 3 = 25
- 2 Low, 1 Info → (75 + 75 + 100) / 3 = 83.3

## Grade Thresholds

กำหนด grade ตาม score:

- `A` — score 90 ขึ้นไป
- `B` — score 80 ถึง 89
- `C` — score 70 ถึง 79
- `D` — score 60 ถึง 69
- `F` — score ต่ำกว่า 60

## Action On Low Score

ถ้า score < 70:

- แนะนำให้เรียก `update-review-cli-and-run` ก่อนดำเนินการ
- ระบุ findings ที่ต้องแก้ไข
- ทำ `/suggest-next-action` เพื่อแนะนำขั้นตอนถัดไป

## Report Format

รายงานผลด้วย `/report-table`:

| Category | Severity | Finding | Evidence | Action |
|----------|----------|---------|----------|--------|

- Category — ประเภทการตรวจสอบ
- Severity — `Critical` | `High` | `Medium` | `Low` | `Info`
- Finding — ปัญหาที่พบ
- Evidence — file path, line number, code snippet
- Action — action ที่ต้องทำ

## Evidence Format

ทุก finding ต้องมี:

- file path
- line number
- code snippet ที่เป็นปัญหา
