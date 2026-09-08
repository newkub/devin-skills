---
name: validate-then-apply
description: ตรวจสอบ/validate ก่อน แล้วค่อย apply ตาม context
argument-hint: "[action-or-context]"
related:
  - deep-validate
  - run-check
  - then-apply
  - follow-your-suggestion
  - report-in-table
  - report-progress
  - suggest-next-action
  - ask-me
---

## Goal

ตรวจสอบหรือ validate ก่อนทำการ apply ทุกครั้ง โดยไม่ apply ถ้ายังไม่ผ่านเกณฑ์

## Scope

ใช้เมื่อต้องการ apply อะไรบางอย่าง แต่ต้องการยืนยันก่อนว่าถูกต้อง ปลอดภัย และไม่มี regression

- รับ context หรือ action ทีจะ apply
- เลือกวิธี validate ตาม nature ของงาน
- ถ้า validation ผ่าน → apply
- ถ้า validation ไม่ผ่าน → แก้ไขหรือถาม user ก่อน

## Execute

### 1. Capture Context

> Goal: รู้ว่าต้อง validate และ apply อะไร

1. รับ action หรือ context จาก argument หรือข้อความล่าสุด
2. ถ้าไม่ชัด → ทำ `/ask-me`
3. ระบุ scope, dependencies, และ expected outcome

### 2. Select Validation Method

> Goal: เลือก validation ทีเหมาะสม

1. ถ้าเป็น code → ทำ `/run-check` (lint, typecheck, tests)
2. ถ้าเป็น skill/rules/config → ทำ `/deep-validate`
3. ถ้าเป็น reference/path → ทำ `/check-reference` หรือ `/check-broken-skills-references`
4. ถ้าเป็น architecture/design → ทำ `/review` ทีเหมาะสม
5. ถ้าเป็นการตัดสินใจ → ทำ `/rethink`

### 3. Run Validation

> Goal: ตรวจสอบให้ผ่านก่อน apply

1. รัน validation ทีเลือก
2. บันทึกผล: passed/failed, findings, warnings
3. ถ้ามี findings → จัดลำดับตาม severity
4. ทำ `/report-in-table` สรุป: `No.`, `Check`, `Status`, `Findings`

### 4. Decide Apply

> Goal: ตัดสินใจว่าจะ apply ไหม

1. ถ้าผ่านทั้งหมด → apply
2. ถ้ามี warning ต่ำ → แจ้ง user แล้ว apply ถ้า user ยืนยัน
3. ถ้ามี error/blocker → ไม่ apply ถ้าไม่แก้ให้ผ่าน
4. ถ้าไม่แน่ใจ → ใช้ `/ask-me`

### 5. Apply

> Goal: ดำเนินการตาม context หลัง validate ผ่าน

1. ถ้าเป็น action ต่อเนื่อง → ใช้ `/then-apply`
2. ถ้ามี suggestion เฉพาะ → ใช้ `/follow-your-suggestion`
3. ถ้าเป็น file ops หลายที่ → ใช้ `/all-this-patterns`
4. ถ้าต้องจัดการหลาย step → ใช้ `/manage`

### 6. Re-validate And Report

> Goal: ยืนยันว่า apply สำเร็จและไม่พัง

1. รัน validation อีกครั้งหลัง apply
2. ทำ `/report-in-table` สรุป: `No.`, `Step`, `Validation`, `Apply`, `Status`
3. ถ้ามีหลาย step ค้าง → ทำ `/report-progress`
4. ทำ `/suggest-next-action`

## Rules

- ไม่ apply โดยไม่ผ่าน validation
- ไม่ข้าม validation เพราะ user เร่ง
- ถ้า validation ไม่ผ่านต้องระบุเหตุผลและแนวทางแก้
- เก็บผล validation ไว้ report ก่อน/หลัง apply
- ถ้ามี high-risk ต้อง user confirm ก่อน apply

## Expected Outcome

- ตรวจสอบก่อน apply ทุกครั้ง
- ไม่ apply ถ้ายังมี blocker
- รายงาน validation + apply ครบถ้วน
- ทราบ next action
