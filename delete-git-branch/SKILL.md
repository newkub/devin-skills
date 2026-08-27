---
name: delete-git-branch
description: ลบ local หรือ remote git branch อย่างปลอดภัย
related:
  - list-git-commit
  - refactor-commit
  - resolve-github-pull-request
---

## Goal

ลบ git branch ทีระบุออกจาก local หรือ remote โดยปลอดภัย

## Scope

ใช้เมื่อต้องการทำความสะอาด branch ที่ไม่จำเป็น

## Execute

### 1. Identify Branch

> Goal: ระบุ branch ทีต้องการลบ

1. รัน `git branch --all`
2. ยื่นยันชื่อ branch
3. ตรวจสอบว่าไม่ใช่ `main`, `master`, หรือ branch ทีถูก protect

### 2. Check Merge Status

> Goal: ลบอย่างปลอดภัย

1. รัน `git branch --merged` เพื่อดู branch ที merge แล้ว
2. ถ้า branch ยังไม่ merge → ถามก่อนลบ
3. ถ้า merge แล้ว → ลบแบบ `-d` ได้

### 3. Delete Local Branch

> Goal: ลบ local branch

1. รัน `git branch -d <branch>` สำหรับ merged branch
2. ถ้าไม่ merge และ user ยื่นยัน → รัน `git branch -D <branch>`

### 4. Delete Remote Branch

> Goal: ลบ remote branch

1. รัน `git push origin --delete <branch>`
2. หรือ `git push origin :<branch>`
3. ตรวจสอบว่า remote branch ถูกลบ

### 5. Cleanup

> Goal: ทำความสะอาด local tracking

1. รัน `git fetch --prune`
2. รัน `git branch -vv` ตรวจสอบ tracking

## Rules

### 1. Protect Main

- ไม่ลบ `main`, `master`, หรือ default branch
- ไม่ลบ branch ทีมี PR เปิดโดยไม่ถาม

### 2. Confirm Unmerged

- ถ้า branch ยังไม่ merge → ถามก่อน `-D`
- บอกว่าจะสูญเสีย commits หรือไม่

### 3. Preserve Tags

- ลบ branch ไม่ลบ tags ทีชี้ไปยัง commits นั้น
- ถ้าจำเป็นให้ตรวจ tags

## Expected Outcome

- Local branch ถูกลบ
- Remote branch ถูกลบ (ถ้าขอ)
- Main/master ไม่ได้รับผลกระทบ
- ไม่มี commits สูญหายโดยไม่ได้ระบุ
