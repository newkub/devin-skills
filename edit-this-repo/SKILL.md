---
name: edit-this-repo
description: Edit files in the current repository safely with scope checks and validation
argument-hint: "[file-or-pattern]"
related:
  - at-this-repo
  - update-agents-md
  - git-commit
  - deep-validate
  - report
  - ask-me
---

## Goal

Edit files in the current repository safely, with clear scope, minimal changes, and validation

## Scope

- ใช้กับ repo ปัจจุบัน (current working directory)
- แก้ไข source code, config, docs, skills ตามที user ขอ
- ไม่แตะไฟล์นอก scope โดยไม่ได้รับอนุญาต

## Execute

### 1. Identify Scope

> Goal: Know what to edit and what to protect

1. รัน `git status` เพื่อดู state
2. รับ target files จาก argument หรือ user
3. ระบุ files ทีห้ามแก้ (secrets, generated files, lock files)
4. ถ้า destructive change → dry run ก่อน

### 2. Read Before Edit

> Goal: Understand before changing

1. อ่าน target files ทั้งหมด
2. อ่าน related files/tests ทีอ้างอิง
3. ถ้าไฟล์ยาว >250 บรรทัด → `/refactor` ก่อนหรือแก้เฉพาะส่วน
4. บันทึก intent เดิม

### 3. Edit Minimally

> Goal: Smallest change that satisfies the task

1. ใช้ `edit` สำหรับการเปลี่ยนแปลงเฉพาะจุด
2. หลีกเลี่ยง `write` ทั้งไฟล์ ถ้าไม่จำเป็น
3. รักษา style, formatting, encoding
4. ถ้า `AGENTS.md` ถูกแก้ → ทำ `/update-agents-md`

### 4. Validate

> Goal: Make sure nothing is broken

1. รัน `git diff`
2. รัน `git diff --check`
3. รัน lint/test/build ตาม ecosystem
4. ตรวจ broken references

### 5. Commit And Report

> Goal: Keep changes clean

1. ทำ `/git-commit` สำหรับ changes
2. ทำ `/report` สรุปสิ่งทีแก้
3. ถ้าไม่แน่ใจ → `/ask-me`

## Rules

- ไม่ลบ/ย้าย/overwrite โดยไม่ได้รับ confirmation
- ตรวจสอบ `git status` ก่อนและหลัง
- ไม่ stage untracked files ที่ไม่เกี่ยวข้อง
- ถ้า AGENTS.md เปลี่ยน → `/update-agents-md` ทันที
- แก้เฉพาะสิ่งที่ user ขอ

## Expected Outcome

- Target files ถูกแก้ไขตามทีขอ
- ไม่มี broken references
- ผ่าน validation
- มี commit สะอาดพร้อมรายงาน
