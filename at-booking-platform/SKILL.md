---
name: at-booking-platform
project-root: "D:\saas\booking-platform"
description: แก้ไข files ใน project booking-platform
---

## Goal

แก้ไข files ใน project `D:\saas\booking-platform` อย่างปลอดภัย มีขอบเขตชัดเจน และ validate

## Scope

ใช้เมื่องานต้องแก้ไข source code, config, docs, หรือ skills ใน `booking-platform`

## Execute

### 1. Set Project Root

> Goal: ทำงานใน project path

1. ตรวจสอบ `project-root: D:\saas\booking-platform`
2. ใช้ `workdir = D:\saas\booking-platform` สำหรับทุก command
3. รัน `git status` ใน project root
4. ระบุ files เป้าหมาย

### 2. Read Before Edit

> Goal: ไม่แก้ไขโดยไม่เข้าใจเนื้อหา

1. อ่าน target files ทั้งหมดก่อนแก้ไข
2. อ่าน related files หรือ tests
3. ถ้าไฟล์ยาว >250 บรรทัด → ทำ `/refactor` ก่อน
4. บันทึก intent เดิม

### 3. Edit Minimally

> Goal: เปลี่ยนแปลงน้อยที่สุด

1. ใช้ `edit` สำหรับการเปลี่ยนแปลงเฉพาะจุด
2. หลีกเลี่ยง `write` ทั้งไฟล์ถ้าไม่จำเป็น
3. รักษา style, formatting, encoding เดิม
4. แก้เฉพาะส่วนที่ user ขอ

### 4. Validate Changes

> Goal: ตรวจสอบว่าแก้ไขไม่พัง

1. รัน `git diff`
2. รัน `git diff --check`
3. ถ้ามี tests/lint → รัน
4. ถ้ามี build/typecheck → รันตาม ecosystem

### 5. Commit

> Goal: เก็บ changes

1. ทำ `/git-commit`
2. ไม่ stage files ที่ไม่เกี่ยวข้อง

## Rules

### 1. Stay In Project Root

- ใช้ `workdir = D:\saas\booking-platform` เสมอ
- ไม่แก้ไข files นอก project root
- ถ้า action เสี่ยง → ทำ dry run ก่อน

### 2. Minimal Scope

- แก้เฉพาะสิ่งที่ user ขอ
- ไม่ refactor นอก scope
- ไม่เพิ่ม features ถ้าไม่จำเป็น

### 3. Verify

- ตรวจ diff ก่อน `git add`
- รัน lint/test/build ถ้ามี
- ห้าม commit untracked files ทีไม่เกี่ยวข้อง

## Expected Outcome

- Target files ถูกแก้ไขตามที่ขอ
- ไม่มี broken references
- ผ่าน validation
- มี commit ทีสะอาด
