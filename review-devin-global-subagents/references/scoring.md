---
title: Scoring Formula
description: สูตรคำนวณ review score และ grade
---

# Scoring Formula

## Severity Weights

แต่ละ finding มี weight ตาม severity:

| Severity | Weight |
|---|---|
| Critical | 0 |
| High | 25 |
| Medium | 50 |
| Low | 75 |
| Info | 100 |

## Score Calculation

review score = weighted average ของ findings ทั้งหมด

```
score = sum(weight of each finding) / count of findings
```

### Example

- 1 Critical (0) + 1 High (25) + 1 Info (100) = 125 / 3 = 41.67 → Grade F

## Grade Mapping

| Grade | Score Range |
|---|---|
| A | 90 ขึ้นไป |
| B | 80 ถึง 89 |
| C | 70 ถึง 79 |
| D | 60 ถึง 69 |
| F | ต่ำกว่า 60 |

## Action Threshold

- Score < 70 → แนะนำให้เรียก `update-devin-global-subagents` ก่อนดำเนินการ
- Score >= 70 → ผ่าน review สามารถดำเนินการต่อได้

## Report Format

รายงานผ่าน `/report-markdown-table` พร้อม columns:

- Category — หมวด review เช่น Frontmatter, Sections, Style, Safety
- Severity — Critical, High, Medium, Low, Info
- Finding — ปัญหาที่พบ
- Evidence — file path และ line number
- Action — สิ่งที่ต้องทำ

## Next Action

หลัง report ให้ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไปตาม score และ grade
