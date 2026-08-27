---
name: improve
description: ปรับปรุงสิ่งใดๆ ใน project ตาม context โดยหา gaps แล้วแก้ไข
related:
  - loop-continuous
  - review-gaps
  - fix
  - refactor
  - realize-implementation
  - deep-validate
  - run-check
  - ask-me
---

## Goal

ปรับปรุงสิ่งใดๆ ใน project ตาม context ปัจจุบัน โดยหาจุดทีทำได้ดีขึ้น (gaps) แล้วดำเนินการแก้ไขอย่างปลอดภัย

## Scope

ใช้สำหรับ code, skills, documentation, config, tests, architecture หรือสิ่งอื่นๆ ที user ต้องการให้ดีขึ้น โดยไม่จำกัดประเภท

## Execute

### 1. Identify Target

> Goal: ระบุสิ่งทีต้องการปรับปรุง

1. ถ้า user ระบุมาแล้ว → บันทึกเป้าหมาย
2. ถ้าไม่ระบุ → ตรวจสอบ context ปัจจุบัน (open files, project state, errors)
3. ถ้ายังไม่ชัด → ทำ `/ask-me` เพื่อถามว่าต้องการ improve ส่วนไหน
4. ยืนยัน scope ว่าแก้ไขเฉพาะส่วนไหน

### 2. Review Gaps

> Goal: หาจุดทีต้องปรับปรุง

1. ทำ `/review-gaps` สำหรับเป้าหมายทีระบุ
2. ถ้าเป้าหมายเป็น code → ทำ `/review-quality`, `/review-consistency`, `/review-architecture`
3. ถ้าเป้าหมายเป็น skill → ทำ `/review-devin-global-skills`
4. ถ้าเป้าหมายเป็น docs → ทำ `/review-readme-md`, `/review-docs`
5. บันทึก gaps ทีพร้อมแก้ไข

### 3. Prioritize

> Goal: เรียงลำดับงานตาม impact

1. แยก gaps ตามประเภท: critical, high, medium, low
2. เลือกทำ critical และ high ก่อน
3. ถ้ามี dependencies → ทำ foundation ก่อน
4. ถ้า gaps เยอะ → ทำ `/create-plan-md-in-dot-devin` เพื่อวางแผน

### 4. Implement Improvements

> Goal: แก้ไขตาม gaps ทีเลือก

1. ถ้าเป็นบั๊ก → ทำ `/fix`
2. ถ้าเป็น code quality → ทำ `/refactor`
3. ถ้าเป็น missing features หรือ mock → ทำ `/realize-implementation`
4. ถ้าเป็น naming → ทำ `/review-naming` แล้วแก้ไข
5. ถ้าเป็น documentation → ทำ `/update-readme-md`
6. ถ้ามีหลายไฟล์ → ใช้ `/edit-by-use-scripts` หรือ `/refactor-all-workspace`

### 5. Validate

> Goal: ตรวจสอบว่าการปรับปรุงไม่ทำให้เกิด regression

1. ทำ `/run-check` (lint, typecheck, scan)
2. ทำ `/run-test` ถ้ามี tests
3. ทำ `/deep-validate` เพื่อ verify overall
4. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry (max 3)

### 6. Report

> Goal: สรุปผลการปรับปรุง

1. รายงาน gaps ทีแก้ไข
2. รายงานไฟล์/ skill ทีเปลี่ยนแปลง
3. รายงานผลการ validate
4. ถ้ายังมี gaps เหลือ → ระบุและทำ `/suggest-next-action`

## Rules

- ไม่ over-engineer แก้เฉพาะ gaps ทีจำเป็น
- รักษา existing behavior ถ้าไม่จำเป็นอย่าเปลี่ยน
- ถ้ามีการเปลี่ยนแปลงทีทำลายล้าง → ถาม user ก่อน
- ใช้ skills ย่อยตามประเภทของงาน ไม่ hard-code สำหรับ context เดียว
- ถ้า context ไม่ชัด → ถาม user ก่อนลงมือ
- ไม่แก้ไขนอก scope ทีตกลง

## Expected Outcome

- ระบุและแก้ไข gaps ตาม context
- Code/ skill/ docs ดีขึ้นตามมาตรฐาน project
- ผ่าน validation โดยไม่มี regression
- สรุปผลการปรับปรุงชัดเจน
