---
name: follow-git-cherry-pick
description: cherry-pick commits ระหว่าง branches เพื่อนำการเปลี่ยนแปลงเฉพาะไปใช้
---

## Goal

ใช้ git cherry-pick เพื่อนำ commits เฉพาะจาก branch หนึ่งไปยังอีก branch โดยไม่ merge ทั้ง branch

## Scope

ครอบคลุม cherry-pick operations: single, multiple, range และ conflict resolution

## Execute

### 1. Prepare Cherry-Pick

1. ตรวจสอบ working tree clean ด้วย `git status`
2. ระบุ commit hash ที่ต้องการ cherry-pick ด้วย `git log`
3. Checkout branch ปลายทางที่ต้องการนำ commit ไป
4. ตรวจสอบว่า commit ไม่ได้มีอยู่แล้วใน branch ปลายทาง

### 2. Cherry-Pick Single Commit

1. รัน `git cherry-pick <commit-hash>` เพื่อ cherry-pick commit เดียว
2. ตรวจสอบว่า commit ถูกนำมาถูกต้องด้วย `git log`
3. รัน `/run-verify` เพื่อตรวจสอบว่า code ทำงานได้

### 3. Cherry-Pick Multiple Commits

1. รัน `git cherry-pick <hash1> <hash2> <hash3>` เพื่อ cherry-pick หลาย commits
2. รัน `git cherry-pick <start-hash>..<end-hash>` เพื่อ cherry-pick range
3. ใช้ `--no-commit` เพื่อ stage changes โดยไม่ commit อัตโนมัติ
4. ทำ `/git-commit` หลังจากตรวจสอบ changes แล้ว

### 4. Resolve Conflicts

1. ถ้ามี conflicts ให้แก้ไขไฟล์ที่มี conflict markers
2. รัน `git add <file>` หลังแก้ไข
3. รัน `git cherry-pick --continue` เพื่อดำเนินการต่อ
4. รัน `git cherry-pick --abort` เพื่อยกเลิก

### 5. After Cherry-Pick

1. รัน `git log --oneline` เพื่อตรวจสอบ commit history
2. ทำ `/run-verify` เพื่อตรวจสอบ code
3. ทำ `/git-push` เพื่อ push ไปยัง remote

## Rules

### 1. Cherry-Pick Discipline

- ใช้ cherry-pick เฉพาะเมื่อจำเป็น เช่น hotfix ไปหลาย release branches
- หลีกเลี่ยง cherry-pick ที่ไม่จำเป็น ควรใช้ merge หรือ rebase แทน
- ตรวจสอบว่า commit ไม่ซ้ำซ้อนกับที่มีอยู่
- ใช้ `--no-commit` เมื่อต้องการรวมหลาย commits เป็น commit เดียว

### 2. Conflict Safety

- แก้ไข conflicts ที่ root cause
- ตรวจสอบว่า code ทำงานได้หลัง resolve conflict
- ห้ามปล่อย conflict markers ค้างใน code
- ใช้ `--abort` ถ้า conflicts ซับซ้อนเกินไป

### 3. Hotfix Workflow

- สำหรับ hotfix: cherry-pick จาก `main` ไป release branch
- ทำ `/git-commit` บน `main` ก่อน แล้ว cherry-pick ไป release branch
- ตรวจสอบว่า hotfix ทำงานบน release branch ด้วย

### 4. Non-Redundancy

- รายละเอียด rebase อยู่ใน `/follow-git-rebase` แล้ว
- รายละเอียด commit อยู่ใน `/git-commit` แล้ว

## Expected Outcome

- Commits ถูกนำไปยัง branch ปลายทางอย่างถูกต้อง
- ไม่มี conflicts ค้างใน code
- Hotfixes ถูกนำไปยัง release branches ที่จำเป็น
