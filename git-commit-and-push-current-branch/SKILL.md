---
name: git-commit-and-push-current-branch
description: Commit, push และ resolve CI/CD บน current branch
related:
  - git-commit
  - git-push
  - resolve-cicd
  - refactor-commit
  - update-references
  - follow-monorepo
---

## Goal

Commit ไฟล์ push ไปยัง remote repository และ resolve CI/CD จนกว่าจะผ่าน live หรือ healthy

## Scope

ใช้สำหรับ commit push และ track/resolve CI/CD ในทีเดียว โดยเป็น orchestrator ที่เรียก `/git-commit`, `/git-push` และ `/resolve-cicd`

## Execute

### 1. Commit Changes

> Goal: สร้าง commit สำหรับไฟล์ที่มีการเปลี่ยนแปลง

1. ทำตาม `/git-commit`
2. ตรวจสอบด้วย `git log --oneline -3` ว่า commit ถูกสร้างถูกต้อง

### 2. Refactor Commits (Optional)

> Goal: ปรับปรุง commit history ก่อน push

1. ถ้า commit history ต้องการ refactor (break down, squash, fixup) → ทำ `/refactor-commit` ก่อน push
2. ถ้า branch ถูก share กับทีมแล้ว → หยุดและขอ user ยืนยันก่อน force push
3. ถ้าไม่ต้องการ refactor → ข้ามไป step ถัดไป

### 3. Push Changes

> Goal: Push commits ไปยัง remote repository

1. ทำตาม `/git-push`
2. ตรวจสอบด้วย `git status` ว่า local และ remote sync กัน

### 4. Resolve CI/CD

> Goal: ติดตามและ resolve CI/CD ที่ถูก trigger จาก push จนกว่าจะผ่าน

1. ทำตาม `/resolve-cicd` เพื่อ track CI/CD pipeline ที่ถูก trigger จาก push
2. ถ้า CI/CD ผ่าน → ไป step ถัดไป
3. ถ้า CI/CD ล้มเหลว → `/resolve-cicd` จะ resolve, re-run, re-deploy จนกว่าจะผ่าน (สูงสุด 5 รอบ)
4. ถ้าเกิน 5 รอบ → stop และ report พร้อม rollback recommendation

### 5. Update References

> Goal: อัปเดท references ทั้งหมดที่เกี่ยวข้อง

1. ทำตาม `/update-references`

## Rules
> Goal: ใช้เป็น orchestrator ปลอดภัยไม่ทำลาย history และ resolve CI/CD จนผ่าน

- ใช้เป็น orchestrator เท่านั้น รายละเอียดอยู่ใน `/git-commit`, `/git-push` และ `/resolve-cicd`
- ถ้า push ถูก reject ให้หยุดและแจ้งผู้ใช้ ไม่ force push
- ถ้าเป็น monorepo ให้ทำ `/follow-monorepo` ก่อน commit
- ห้าม force-push หรือ rewrite history ระหว่าง resolve CI/CD
- ถ้า resolve CI/CD ต้องแก้ code → stage เฉพาะไฟล์ที่เกี่ยวข้องกับ root cause

## Expected Outcome

1. Changes ถูก commit ตาม conventional commits
2. Changes ถูก push ไปยัง remote repository
3. CI/CD pipeline ผ่าน หรือ CD live/healthy หรือ release สำเร็จ
4. Git history สะอาดและติดตามง่าย
5. ถ้าไม่ผ่าน มี last green SHA และ rollback recommendation ชัดเจน
