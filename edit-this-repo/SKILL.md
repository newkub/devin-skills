---
name: edit-this-repo
description: แก้ไข files ใน repository ปัจจุบันอย่างปลอดภัย minimal และ validate
---

## Goal

แก้ไข files ใน repository ปัจจุบันอย่างปลอดภัย มีขอบเขตชัดเจน ไม่ทำลายข้อมูล ตรวจสอบผลได้

## Scope

ใช้เมื่องานต้องแก้ไข source code, config, docs, หรือ skills ใน repo ที่กำลังทำงานอยู่

## Execute

### 1. Identify Scope And Guardrails

> Goal: รู้ว่าแก้อะไร และห้ามแก้อะไร

1. ถามหรือตรวจสอบ files เป้าหมายจาก user หรือ context
2. รัน `git status` เพื่อดู staged/unstaged/tracked/untracked
3. ระบุ files ที่ห้ามแก้ หรือ dependencies ที่อาจกระทบ
4. ถ้าเป็น destructive change → ทำ dry run ก่อน

### 2. Read Before Edit

> Goal: ไม่แก้ไขโดยไม่เข้าใจเนื้อหา

1. อ่าน target files ทั้งหมดก่อนแก้ไข
2. อ่าน related files หรือ tests ที่ reference ไปยัง target
3. ถ้าไฟล์ยาว >250 บรรทัด → ทำ `/refactor` ก่อน หรือแก้เฉพาะส่วนที่จำเป็น
4. บันทึก intent เดิมของ target

### 3. Edit Minimally

> Goal: เปลี่ยนแปลงน้อยที่สุดที่ตอบสนองงาน

1. ใช้ `edit` สำหรับการเปลี่ยนแปลงเฉพาะจุด
2. หลีกเลี่ยงการ `write` ทั้งไฟล์ ถ้าไม่จำเป็น
3. ถ้าต้อง `write` → สร้างไฟล์สำรองหรือ verify ก่อน
4. รักษา style, formatting, encoding เดิม
5. แก้เฉพาะส่วนที่ user ขอ ไม่ขยาย scope เอง

### 4. Validate Changes

> Goal: ตรวจสอบว่าแก้ไขไม่พัง

1. รัน `git diff` เพื่อตรวจสอบ changes
2. รัน `git diff --check` เพื่อดู whitespace errors
3. ถ้ามี tests หรือ lint → รันก่อนจบ
4. ถ้ามี build/typecheck → รันตาม ecosystem ที่ตรวจพบ

### 5. Commit

> Goal: เก็บ changes ไว้อย่างชัดเจน

1. ทำ `/git-commit` สำหรับ changes ทีสำคัญ
2. ใช้ `/ship-code` เมื่องานเสร็จ
3. ไม่ stage files ที่ไม่เกี่ยวข้อง

## Rules

### 1. Safety First

- ไม่ลบ ย้าย หรือ overwrite ถ้าไม่ได้รับ confirmation
- ตรวจสอบ `git status` ก่อนและหลังแก้ไข
- ถ้า action เสี่ยง → ทำ dry run ก่อน

### 2. Minimal Scope

- แก้เฉพาะสิ่งที่ user ขอ
- ไม่ refactor หรือ rename นอก scope
- ไม่เพิ่ม features ใหม่ ถ้าไม่จำเป็น

### 3. Verify Before Commit

- ตรวจ diff ก่อน `git add`
- รัน lint/test/build ถ้ามี
- ห้าม commit untracked files ทีไม่เกี่ยวข้อง

### 4. Preserve Intent

- รักษา semantics ของไฟล์เดิม
- ถ้าต้องเปลี่ยน API หรือ structure → ระบุเหตุผลใน commit
- ไม่เปลี่ยนภาษาหรือ terminology โดยไม่จำเป็น

## Expected Outcome

- Target files ถูกแก้ไขตามที่ขอ
- ไม่มี broken references หรือ missing files
- ผ่าน validation ทีเกี่ยวข้อง
- มี commit ที่สะอาดและชัดเจน
