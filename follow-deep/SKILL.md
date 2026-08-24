---
name: follow-deep
description: พิจารณาและเรียก deep- workflows ที่เกี่ยวข้องตาม context ของ task
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - review
---

## Goal

พิจารณาและเรียก `deep-*` workflows ที่เกี่ยวข้องตาม context ของ task เพื่อให้การทำงานมีความลึกซึ้งครบทุกมิติ

## Scope

ใช้เป็น sub-workflow สำหรับพิจารณาว่า task ปัจจุบันควรเรียก `deep-*` workflows ใดบ้าง — ไม่ใช่ workflow หลักที่รันแยกต่างหาก

## Execute

### 1. Identify Task Context

> Goal: ระบุ context ของ task ปัจจุบันเพื่อพิจารณา deep- workflows ที่เกี่ยวข้อง
> Goal: รู้ว่า task ต้องการ deep analysis ในมิติใดบ้าง

1. ระบุประเภทของ task: analyze, review, plan, refactor, test, validate, secure, optimize, research
2. ระบุความซับซ้อน: low, medium, high
3. ระบุ risk level: low, medium, high
4. ถ้า task มีความซับซ้อนหรือ risk ต่ำ → ไม่ต้องเรียก deep- workflows

### 2. Select Deep Workflows

> Goal: เลือก deep- workflows ที่เกี่ยวข้องกับ task context
> Goal: เลือก deep- workflows ที่จำเป็นและเกี่ยวข้องจริง

1. Analysis → `deep-analyze` หรือ `deep-analyze-by-use-scripts` (ถ้าต้อง scripts/review CLI)
2. Review → `deep-review` (comprehensive) หรือ `/review-*` (specific dimension)
3. Planning → `deep-plan`
4. Refactoring → `refactor`
5. Testing → `run-test`
6. Validation → `deep-validate` (comprehensive) หรือ `validate` (simple)
7. Security → `review-security`
8. Performance → `/review-codebase` (comprehensive) หรือ `review-performance` (specific)
9. Research → `deep-research` (multi-source) หรือ `learn-from-web` (single-source)
10. Thinking → `deep-thinking` (systematic) หรือ `pondering` (reflective)

### 3. Execute Selected Workflows

> Goal: ทำตาม deep- workflows ที่เลือก ใช้ parallel execution เมื่อเป็นไปได้
> Goal: deep- workflows ถูก execute อย่างมีประสิทธิภาพ

1. ถ้าเลือกหลาย workflows และเป็น independent → ใช้ `follow-parallel` สำหรับ parallel execution
2. ถ้าเลือกหลาย workflows และมี dependency → ทำตามลำดับ
3. ถ้าเลือก workflow เดียว → ทำโดยตรง
4. บันทึกผลลัพธ์จากแต่ละ workflow

### 4. Apply Deep Follow If Needed

> Goal: ถ้า task ต้องการการทำตามแบบ recursive ใช้ `deep-follow`
> Goal: ทุก step ของ deep- workflows ถูก execute และ verify ครบถ้วน

1. ถ้า deep- workflows ที่เลือกมี sub-workflows ซับซ้อน → ทำ `deep-follow`
2. ถ้า deep- workflows ที่เลือกตรงไปตรงมา → ไม่ต้องใช้ `deep-follow`
3. บันทึกผลลัพธ์สรุป

## Rules

### 1. When To Use Deep Workflows

- ใช้ `deep-*` workflows เมื่อ task มีความซับซ้อนสูง หรือ risk สูง
- ไม่ใช้ `deep-*` workflows สำหรับ task ง่ายๆ ที่ทำได้โดยตรง
- ถ้าไม่แน่ใจ → ทำ `pondering` เพื่อพิจารณาก่อนเลือก

### 2. Selection Criteria

- เลือกเฉพาะ deep- workflows ที่เกี่ยวข้องกับ task จริง
- ไม่เรียกทุก deep- workflows เสมอ — เลือกตาม context
- ถ้า task เกี่ยวกับ review → ใช้ `deep-review` ไม่ใช่ `deep-analyze`
- ถ้า task เกี่ยวกับ analysis ที่ต้อง scripts → ใช้ `deep-analyze-by-use-scripts` ไม่ใช่ `deep-analyze`

### 3. Parallel Execution

- ถ้าเลือกหลาย deep- workflows ที่ independent → ใช้ `follow-parallel`
- จำกัด parallel operations ไม่เกิน 10 ต่อ batch
- ถ้า deep- workflows มี dependency → ทำตามลำดับ

### 4. Deep Follow Integration

- ใช้ `deep-follow` เมื่อ deep- workflows มี sub-workflows ซับซ้อน
- ไม่ใช้ `deep-follow` สำหรับ deep- workflows ที่ตรงไปตรงมา
- `deep-follow` รองรับทั้ง workflows และ skills แบบ recursive

## Expected Outcome

- deep- workflows ที่เกี่ยวข้องถูกเลือกและ execute อย่างมีประสิทธิภาพ
- ไม่เรียก deep- workflows ที่ไม่จำเป็น
- Independent deep- workflows รัน parallel ลด total execution time
- ผลลัพธ์จาก deep- workflows ถูกบันทึกและสรุป
