# Scoring Formula

formula สำหรับให้คะแนน improvement opportunities

## Formula

opportunity score = impact × effort × criticality

## Impact (1-5)

ผลกระทบต่อ project และ users:

- 5: blocking production, security risk, data loss
- 4: core functionality at risk, high user impact
- 3: moderate impact, quality or efficiency
- 2: minor impact, limited users
- 1: cosmetic, nice-to-have

## Effort (1-5)

ความยากและเวลาที่ต้องใช้ (คะแนนต่ำ = ทำง่าย):

- 1: quick fix, < 1 hour
- 2: small change, < 1 day
- 3: moderate, < 1 week
- 4: large, < 1 sprint
- 5: major, multi-sprint

## Criticality (1-3)

ความจำเป็นเร่งด่วน:

- 3: critical path, blocker ของงานอื่น
- 2: important, ควรทำเร็วๆ
- 1: non-urgent, ทำเมื่อมีเวลา

## Score Range

- minimum: 1 × 1 × 1 = 1
- maximum: 5 × 5 × 3 = 75

## Priority Tiers

| Score | Tier | Label |
|-------|------|-------|
| 50-75 | P0 | critical, do now |
| 30-49 | P1 | high, do soon |
| 15-29 | P2 | medium, plan |
| 1-14 | P3 | low, when time |

## Quick Win Detection

quick win = impact ≥ 4 และ effort ≤ 2

- ทำก่อนเสมอแม้ score ไม่ใช่สูงสุด
- แสดงแยกจาก roadmap หลัก

## Reproducibility

- บันทึก impact, effort, criticality ต่อ opportunity
- คะแนนเดียวกันต้องได้ tier เดียวกันเสมอ
- ถ้า reviewer คนละคนให้คะแนนต่าง → ใช้ค่ากลาง
