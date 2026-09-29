---
name: review-gaps
description: Meta-review รวบรวม findings จาก dimensional reviews เป็น prioritized improvement list
argument-hint: "[scope]"
related:
  - prioritize
  - report
  - dont-over-engineer
  - suggest-next-action
  - run-review

  - use-subagents
---

## Goal

Meta-review ที่รวบรวม findings จาก dimensional reviews มา deduplicate, prioritize, และแนะนำ action skill ต่อ opportunity

## Scope

ใช้เมื่อต้องการรวม findings จากหลาย dimensional reviews เป็นรายการเดียวที่เรียงลำดับแล้ว ไม่ทำ dimensional review เอง — รวบรวม ตัดซ้ำ และจัดลำดับเท่านั้น

- ถ้าต้องสแกนกว้างหา "improve อะไรได้บ้าง" โดยยังไม่มี findings → ใช้ [../shared/dimension-map.md](../shared/dimension-map.md) สแกนแต่ละ dimension แบบเบาแล้ว map ไป `## Fix` ของ `review-*`

## Execute

### 1. Prepare

> Goal: ระบุ review reports ที่จะรวม

1. ดูรายละเอียดใน [subagents/gaps-reviewer/prepare.md](subagents/gaps-reviewer/prepare.md)
2. บันทึก findings พร้อม severity และ evidence

### 2. Collect

> Goal: รวม findings จากทุก dimensional review

1. ดูรายละเอียดใน [subagents/gaps-reviewer/collect.md](subagents/gaps-reviewer/collect.md)
2. บันทึก findings พร้อม severity และ evidence

### 3. Deduplicate

> Goal: ตัด findings ที่ซ้ำกันข้าม dimensions

1. ดูรายละเอียดใน [subagents/gaps-reviewer/deduplicate.md](subagents/gaps-reviewer/deduplicate.md)
2. บันทึก findings พร้อม severity และ evidence

### 4. Prioritize

> Goal: จัดลำดับ opportunities ตาม impact และ effort

1. ดูรายละเอียดใน [subagents/gaps-reviewer/prioritize.md](subagents/gaps-reviewer/prioritize.md)
2. บันทึก findings พร้อม severity และ evidence

### 5. Report

> Goal: ส่งมอบ prioritized list พร้อม action skill

1. ดูรายละเอียดใน [subagents/gaps-reviewer/report.md](subagents/gaps-reviewer/report.md)
2. บันทึก findings พร้อม severity และ evidence

## Rules

### 1. Meta-Review Only

- ทำ aggregation เท่านั้น ไม่ทำ dimensional review เอง
- ใช้ findings จาก `/review-*` skills ที่ run แล้ว
- ถ้าไม่มี report ให้ run dimensional review ก่อน แล้วค่อย aggregate

### 2. Apply /dont-over-engineer

- ใช้ minimal changes เมื่อรายงานและแนะนำ
- ไม่สร้าง abstraction, schema, หรือ workflow ที่ไม่จำเป็น
- ใช้ simple scoring (impact / effort) แทน multi-factor formula
- หยุดเมื่องานเสร็จ ไม่ทำลึกเกินกว่าที่จำเป็น

### 3. Evidence-Based

- ทุก gap ต้อง trace กลับไปยัง dimensional review finding
- ระบุ source dimension และ location
- ห้ามสร้าง gap ที่ไม่มีใน report

### 4. No Implementation

- ทำ review และ recommend เท่านั้น ไม่ implement
- แนะนำ action skill แต่ไม่ execute
- ถ้า user ต้องการ implement → ส่งต่อผ่าน `/suggest-next-action`

### 5. Simple Output

- ตอบในแชทเท่านั้น ไม่สร้างไฟล์แยก
- ใช้ `/report` สำหรับตาราง
- ระบุ quick wins และ top 3-5 opportunities เท่าที่จำเป็น

## Metrics

- ดู metrics สำหรับ review ใน [subagents/gaps-reviewer/scoring.md](subagents/gaps-reviewer/scoring.md) (gaps)

- ใช้ /review-code-quality ถ้าจำเป็น
- ใช้ /review-risk ถ้าจำเป็น

## References

- [Full-dimension checklist](subagents/gaps-reviewer/checklist.md)
- [Dimension map](../shared/dimension-map.md)
- [Scoring](subagents/gaps-reviewer/scoring.md)
- ใช้ /run-review ถ้าจำเป็น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

1. ส่งแต่ละ gap ที่ confirm ไปยัง `## Fix` ของ `review-*` ที่ตรง domain หรือ `/deep-review-then-fix`
2. gap ที่ไม่มี owner skill → `/new-skills` หรือ `/idea-merge` ตามประเภท
3. verify: re-aggregate gaps หลัง fix — matrix ต้องไม่มี gap เดิมเหลือ
- ใช้ /use-subagents ถ้าจำเป็น

## Expected Outcome

- ตาราง prioritized improvement list พร้อม category, score, action skill
- รายการ quick wins
- รายการ coverage gaps (ถ้ามี)
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
