---
name: follow-git-rebase
description: ใช้ git rebase สำหรับ rebase, squash, interactive rebase และ resolve conflicts
---

## Goal

ใช้ git rebase อย่างถูกต้องสำหรับ rebase branches, squash commits และ resolve conflicts

## Scope

ครอบคลุม git rebase operations: interactive rebase, squash, rebase onto และ conflict resolution

## Execute

### 1. Prepare Rebase

1. ตรวจสอบ working tree clean ด้วย `git status`
2. ตรวจสอบ branch ปัจจุบันและ target branch
3. ทำ `/git-commit` หรือ stash uncommitted changes ก่อน
4. ตรวจสอบว่าไม่ได้ rebase branch ที่ shared กับผู้อื่น

### 2. Interactive Rebase

1. รัน `git rebase -i <base-commit>` เพื่อเปิด interactive rebase
2. เลือก action สำหรับแต่ละ commit: `pick`, `squash`, `fixup`, `reword`, `drop`, `edit`
3. ใช้ `squash` เพื่อรวม commits หลายตัวเป็น commit เดียว
4. ใช้ `reword` เพื่อแก้ commit message โดยไม่เปลี่ยน content
5. ใช้ `drop` เพื่อลบ commit ที่ไม่จำเป็น

### 3. Rebase Onto

1. รัน `git rebase --onto <new-base> <old-base> <branch>` เพื่อ rebase ไปยัง base ใหม่
2. ใช้เมื่อต้องการย้าย branch ไปยัง base ที่แตกต่างกัน
3. ตรวจสอบว่า commits ที่ย้ายไม่ทำลาย functionality

### 4. Resolve Conflicts

1. ถ้ามี conflicts ให้แก้ไขไฟล์ที่มี conflict markers
2. รัน `git add <file>` หลังแก้ไข conflict
3. รัน `git rebase --continue` เพื่อดำเนินการต่อ
4. ถ้าต้องการยกเลิกให้รัน `git rebase --abort`
5. ทำ `/resolve-errors` ถ้าเกิดปัญหาซับซ้อน

### 5. After Rebase

1. รัน `git log --oneline` เพื่อตรวจสอบ commit history ใหม่
2. ทำ `/run-verify` เพื่อตรวจสอบว่า code ยังทำงานได้
3. ถ้าจำเป็นต้อง force push ให้ใช้ `git push --force-with-lease` เพื่อความปลอดภัย

## Rules

### 1. Rebase Safety

- ห้าม rebase branches ที่ shared กับผู้อื่น โดยไม่แจ้งทีม
- ใช้ `--force-with-lease` แทน `--force` เสมอ
- ตรวจสอบ working tree clean ก่อน rebase
- มี rollback plan: `git rebase --abort` หรือ `git reflog`

### 2. Squash Discipline

- Squash commits ที่เกี่ยวข้องกันเป็น commit เดียวเท่านั้น
- ห้าม squash commits ที่เป็น logical changes คนละเรื่อง
- ใช้ `fixup` แทน `squash` ถ้าไม่ต้องการเก็บ commit message เดิม
- เขียน commit message ใหม่หลัง squash ให้สื่อความหมาย

### 3. Conflict Resolution

- แก้ไข conflicts ที่ root cause ไม่ใช่แค่ลบ markers
- ตรวจสอบว่า code ที่แก้ไขทำงานได้หลัง resolve conflict
- ถ้า conflicts ซับซ้อนให้ทำ `/resolve-errors`
- ห้ามปล่อย conflict markers ค้างใน code

### 4. Non-Redundancy

- รายละเอียด commit format อยู่ใน `/git-commit` แล้ว
- รายละเอียด merge strategies อยู่ใน `/git-merge-commit` แล้ว

## Expected Outcome

- Commit history สะอาดและอ่านง่าย
- ไม่มี unnecessary commits หรือ WIP commits
- Conflicts ได้รับการแก้ไขอย่างถูกต้อง
- Code ยังทำงานได้หลัง rebase
