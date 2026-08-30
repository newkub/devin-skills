---
name: follow-tool-git-branch
description: จัดการ git branches ทั้งหมดใน repository
related:
  - cleanup-git-branch
  - create-git-branch
  - delete-git-branch
  - follow-tool-usage
  - follow-best-practice
  - setup-cicd
---

## Goal

จัดการ git branches อย่างเป็นระบบ (list, switch, rename, merge, delete)

## Scope

ใช้กับ repository ใดๆ ที่ต้องการจัดการ branches

## Execute

### 0. Setup

> Goal: ตรวจสอบและตั้งค่า git

1. ตรวจสอบ git: `git --version` (แนะนำ 2.30+)
2. ถ้ายังไม่มี git → ติดตั้งตาม OS:
   - macOS: `mise use -g git` หรือ `brew install git`
   - Windows: `winget install Git.Git` หรือ `scoop install git`
   - Linux: `apt install git`
3. ตั้งค่า default branch: `git config --global init.defaultBranch main`
4. ตั้งค่า alias ถ้าจำเป็น: `git config --global alias.<name> <command>`
5. Verify: `git config --list`

### 1. List Branches

> Goal: แสดงรายการ branches ทั้ง local และ remote

1. `git branch` สำหรับ local
2. `git branch -r` สำหรับ remote
3. `git branch -a` สำหรับทั้งหมด
4. `git branch --list <pattern>` เพื่อ filter

### 2. Switch Branch

> Goal: สลับ branch อย่างปลอดภัย

1. `git switch <branch>`
2. ตรวจสอบ working tree สะอาด
3. ถ้ามี uncommitted changes → stash หรือ commit ก่อน

### 3. Rename Branch

> Goal: เปลี่ยนชื่อ branch ทั้ง local และ remote

1. `git branch -m <old> <new>` สำหรับ local
2. `git branch -m <new>` สำหรับ current
3. `git push origin :<old> <new>` สำหรับ remote
4. อัปเดต tracking ด้วย `git branch -u origin/<new>`

### 4. Delete Branch

> Goal: ลบ branch ที่ไม่จำเป็นอย่างปลอดภัย

1. `git branch -d <branch>` ลบหลัง merge
2. `git branch -D <branch>` บังคับลบ
3. `git push origin --delete <branch>` สำหรับ remote

### 5. Merge Branch

> Goal: รวม branch และแก้ไข conflicts

1. switch ไป target branch
2. `git merge <source>`
3. แก้ไข conflicts ถ้ามี
4. ทดสอบหลัง merge

## Rules

### 1. Safety

- ไม่ลบ main/master โดยไม่ได้ตั้งใจ
- ตรวจสอบว่า branch ถูก merge ก่อนลบ
- ใช้ `switch` แทน `checkout` เมื่อเป็นไปได้

### 2. Naming

- เก็บชื่อ branch สื่อความหมาย
- ใช้ kebab-case สำหรับ branch names

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- Branches ถูกจัดการตามต้องการ
- History คงที่
- ไม่มี branch เกินความจำเป็น