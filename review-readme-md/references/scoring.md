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
