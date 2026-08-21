---
name: follow-git-branch
description: จัดการ git branches ทั้งหมดใน repository
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related:
  - follow-git
  - create-git-branch
  - cleanup-git-branch
  - git-merge-commit
---

## Goal

จัดการ git branches อย่างเป็นระบบ (list, switch, rename, merge, delete)

## Scope

ใช้กับ repository ใดๆ ที่ต้องการจัดการ branches

## Execute

### 1. List Branches
> Goal: List Branches

1. `git branch` สำหรับ local
2. `git branch -r` สำหรับ remote
3. `git branch -a` สำหรับทั้งหมด
4. `git branch --list <pattern>` เพื่อ filter

### 2. Switch Branch
> Goal: Switch Branch

1. `git switch <branch>` หรือ `git checkout <branch>`
2. ตรวจสอบ working tree สะอาด
3. ถ้ามี uncommitted changes → stash หรือ commit ก่อน

### 3. Rename Branch
> Goal: Rename Branch

1. `git branch -m <old> <new>` สำหรับ local
2. `git branch -m <new>` สำหรับ current
3. `git push origin :<old> <new>` สำหรับ remote
4. อัปเดต tracking ด้วย `git branch -u origin/<new>`

### 4. Delete Branch
> Goal: Delete Branch

1. `git branch -d <branch>` ลบหลัง merge
2. `git branch -D <branch>` บังคับลบ
3. `git push origin --delete <branch>` สำหรับ remote

### 5. Merge Branch
> Goal: Merge Branch

1. switch ไป target branch
2. `git merge <source>`
3. แก้ไข conflicts ถ้ามี
4. ทดสอบหลัง merge

## Rules

- ไม่ลบ main/master โดยไม่ได้ตั้งใจ
- ตรวจสอบว่า branch ถูก merge ก่อนลบ
- ใช้ `switch` แทน `checkout` เมื่อเป็นไปได้
- เก็บชื่อ branch สื่อความหมาย

## Expected Outcome

- Branches ถูกจัดการตามต้องการ
- History คงที่
- ไม่มี branch เกินความจำเป็น
