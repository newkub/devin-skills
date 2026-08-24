---
name: update-spec-md
description: อัปเดต spec/SPEC.md ให้สอดคล้องกับ tests และ code ปัจจุบัน
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - update-test
  - follow-content-quality
  - validate
  - check-reference
  - write-explicit
---

## Goal

อัปเดต `spec/SPEC.md` หรือเอกสาร test plan ให้ตรงกับ tests และ code ปัจจุบัน ไม่ซ้ำซ้อน และอ่านง่าย

## Scope

ใช้หลังจากเขียนหรือแก้ไข tests แล้ว หรือเมื่อ `spec/SPEC.md` ล้าหลัง

## Execute

### 1. Read Current State

> Goal: รู้ว่า spec บอกอะไร กับ tests บอกอะไร

1. อ่าน `spec/SPEC.md` หรือ `spec/overview.md`
2. อ่าน test files ทั้งหมดใน `tests/`
3. อ่าน source code หลักที่เกี่ยวข้อง
4. บันทึกส่วนทีตรงกัน ขาด หรือล้าหลัง

### 2. Update Spec

> Goal: spec สะท้อน tests และ code ปัจจุบัน

1. เพิ่ม test cases ใหม่ทีเขียนแล้ว
2. ลบ test cases ทีเลิกใช้
3. แก้ status ของ test cases (todo/in-progress/done)
4. อัปเดต coverage targets ถ้ามีการเปลี่ยน

### 3. Improve Clarity

> Goal: spec อ่านง่าย ไม่ซ้ำซ้อน

1. ทำ `/write-explicit` เพื่อตรวจความชัดเจน
2. รวม test cases ซ้ำซ้อน
3. ใช้ backticks สำหรับ `file paths`, `commands`, `test names`
4. แยกไฟล์ถ้า `spec/SPEC.md` เกิน 250 บรรทัด

### 4. Validate

> Goal: spec ถูกต้องและ references ครบ

1. ทำ `/validate` เพื่อตรวจ structure
2. ทำ `/check-reference` เพื่อยืนยันไฟล์ทีอ้างถึงมีอยู่จริง
3. เปรียบเทียบกับ tests อีกครั้งว่าไม่ขาด category

## Rules

### 1. Sync After Tests

- spec ต้องอัปเดตหลัง tests เปลี่ยนเสมอ
- ไม่อัปเดต spec ก่อน test ลอยๆ

### 2. No Duplication

- ไม่คัดลอกเนื้อหา tests มาทั้งหมด
- สรุป test cases ในรูปแบบกระชับ

### 3. Concise And Under 250

- `spec/SPEC.md` ไม่เกิน 250 บรรทัด
- ถ้าใหญ่กว่านั้น แยกเป็นไฟล์ย่อย

### 4. Link To Tests

- ระบุ test file หรือ test name ที่เกี่ยวข้อง
- ใช้ directory หรือ file path ใน backticks

## Expected Outcome

- `spec/SPEC.md` ตรงกับ tests และ code
- ไม่มี test cases ล้าหลังหรือซ้ำซ้อน
- ผ่าน `/validate` และ `/check-reference`
- ไฟล์ไม่เกิน 250 บรรทัด
