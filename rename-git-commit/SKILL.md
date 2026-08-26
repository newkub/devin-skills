---
name: rename-git-commit
description: แก้ไขข้อความ git commit message
related:
  - edit-git-commit
  - list-git-commit
  - git-commit
---

## Goal

แก้ไข git commit message ของ commit ล่าสุดหรือ commit ก่อนหน้าอย่างปลอดภัย

## Scope

ใช้เมื่อต้องการเปลี่ยนข้อความ commit

## Execute

### 1. Identify Target Commit

> Goal: ระบุ commit ทีต้องการ rename

1. รัน `git log --oneline -n 10`
2. ยื่นยัน commit SHA หรือว่าเป็น commit ล่าสุด
3. ตรวจสอบว่า commit ถูก push ไปแล้วหรือยัง (`git log --branches --not --remotes`)

### 2. Rename Last Unpushed Commit

> Goal: แก้ commit ล่าสุดอย่างง่าย

1. รัน `git commit --amend --message="<new-message>"`
2. ถ้าถูก push ไปแล้ว → ถามก่อน force push
3. ถ้าจำเป็น รัน `git push --force-with-lease`

### 3. Rename Older Commit

> Goal: แก้ commit ก่อนหน้า

1. หา N ของ commit นับจาก HEAD (`git log --oneline`)
2. รัน `git rebase -i HEAD~N`
3. เปลี่ยน `pick` เป็น `reword` สำหรับ target commit
4. บันทึกแล้วแก้ไข message ใน editor
5. รัน `git rebase --continue`

### 4. Resolve Conflicts

> Goal: ทำ rebase ให้เสร็จ

1. ถ้ามี conflict → แก้ไข files
2. รัน `git add <files>`
3. รัน `git rebase --continue`
4. ซ้ำจนเสร็จ

### 5. Validate

> Goal: ตรวจสอบผล

1. รัน `git log --oneline -n 10`
2. ตรวจสอบว่า message เปลี่ยน
3. ถ้า push ไปแล้วและ user ยื่นยัน → `git push --force-with-lease`

## Rules

### 1. Prefer Amend For Last

- ถ้าเป็น commit ล่าสุดและยังไม่ push → ใช้ `--amend`
- ไม่ใช้ rebase ถ้าไม่จำเป็น

### 2. Force Push With Lease

- ถ้าจำเป็น force push ให้ใช้ `--force-with-lease`
- ไม่ใช้ `--force` ธรรมดา

### 3. Delegate Complex

- ถ้าต้องแก้หลาย commit หรือ squash → ใช้ `/edit-git-commit`
- ถ้ามี PR เปิด → หลีกเลี่ยง force push

## Expected Outcome

- Commit message ถูกแก้ไขตามที่ขอ
- History สะอาด
- ไม่มี commits สูญหาย
- Push ปลอดภัย
