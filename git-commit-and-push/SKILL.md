---
name: git-commit-and-push
description: Commit ไฟล์และ push ไปยัง remote repository
related:
  - git-commit
  - git-push
  - refactor-commit
  - update-references
  - follow-monorepo
---

## Goal

Commit ไฟล์และ push ไปยัง remote repository

## Scope

ใช้สำหรับ commit และ push การเปลี่ยนแปลงในทีเดียว โดยเป็น orchestrator ที่เรียก `/git-commit` และ `/git-push`

## Execute

### 1. Commit Changes

> Goal: สร้าง commit สำหรับไฟล์ที่มีการเปลี่ยนแปลง

1. ทำตาม `/git-commit`
2. ตรวจสอบด้วย `git log --oneline -3` ว่า commit ถูกสร้างถูกต้อง

### 2. Push Changes

> Goal: Push commits ไปยัง remote repository

1. ทำตาม `/git-push`
2. ตรวจสอบด้วย `git status` ว่า local และ remote sync กัน

### 3. Refactor Commits (Optional)

> Goal: ปรับปรุง commit history ก่อน push

1. ถ้า commit history ต้องการ refactor (break down, squash, fixup) → ทำ `/refactor-commit` ก่อน push
2. ถ้า branch ถูก share กับทีมแล้ว → หยุดและขอ user ยืนยันก่อน force push
3. ถ้าไม่ต้องการ refactor → ข้ามไป step ถัดไป

### 4. Update References

> Goal: อัปเดท references ทั้งหมดที่เกี่ยวข้อง

1. ทำตาม `/update-references`

## Rules
> Goal: ใช้เป็น orchestrator ปลอดภัยไม่ทำลาย history

- ใช้เป็น orchestrator เท่านั้น รายละเอียดอยู่ใน `/git-commit` และ `/git-push`
- ถ้า push ถูก reject ให้หยุดและแจ้งผู้ใช้ ไม่ force push
- ถ้าเป็น monorepo ให้ทำ `/follow-monorepo` ก่อน commit

## Expected Outcome

1. Changes ถูก commit ตาม conventional commits
2. Changes ถูก push ไปยัง remote repository
3. Git history สะอาดและติดตามง่าย
