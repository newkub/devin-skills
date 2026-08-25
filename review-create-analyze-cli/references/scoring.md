# Scoring Formula

อธิบายการคำนวณ review score และ grade จาก findings

## Severity Weights

แต่ละ severity มี score weight:

| Severity | Score |
|---|---|
| `Critical` | 0 |
| `High` | 25 |
| `Medium` | 50 |
| `Low` | 75 |
| `Info` | 100 |

## Score Calculation

review score = weighted average ของ findings ทั้งหมด:

```
score = sum(severity_score[f] for f in findings) / len(findings)
```

ถ้าไม่มี findings → score = 100

## Grade Thresholds

กำหนด grade จาก score:

| Grade | Score Range |
|---|---|
| `A` | 90 ขึ้นไป |
| `B` | 80 ถึง 89 |
| `C` | 70 ถึง 79 |
| `D` | 60 ถึง 69 |
| `F` | ต่ำกว่า 60 |

## Action Threshold

ถ้า score < 70 → แนะนำให้เรียก `update-create-analyze-cli` ก่อนดำเนินการต่อ

การแนะนำผ่าน `/suggest-next-action` พร้อมระบุ findings ที่ต้องแก้

## Report Format

รายงานผ่าน `/report-table` พร้อม columns:

| Column | คำอธิบาย |
|---|---|
| Category | หมวดที่พบ (workspace, architecture, analyzer, exports, integration) |
| Severity | `Critical`, `High`, `Medium`, `Low`, `Info` |
| Finding | คำอธิบายปัญหา |
| Evidence | file path และบรรทัดที่อ้างถึง |
| Action | action ที่ต้องทำ |

ดู `references/index.md` สำหรับ mapping ของ reference files ทั้งหมด
