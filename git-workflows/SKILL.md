---
name: git-workflows
description: Switch to a workflow branch for git operations
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
  - refactor
---

## Goal

Switch to the correct git branch for a named workflow (restructure, dev, fix, review)

## Scope

Use `git-workflows` when the user wants to move the working tree to a workflow-specific branch before executing a workflow

## Execute

### 1. Identify Workflow

> Goal: Determine which workflow branch to use
> Goal: know the correct branch name and current git state

1. ถามหรือวิเคราะห์ว่า user ต้องการ workflow ใด: `restructure`, `dev`, `fix`, `review`
2. รัน `git status --short` เพื่อตรวจสถานะปัจจุบัน
3. ถ้ามี uncommitted changes → stop และถามว่าต้องการ commit, stash หรือ reset ก่อน

### 2. Switch Branch

> Goal: Move to the workflow branch
> Goal: working tree อยู่บน branch ทีถูกต้อง

1. รัน `git branch --list` เพื่อตรวจว่า branch มีอยู่หรือไม่
2. ถ้า branch ไม่มี → สร้างด้วย `git checkout -b <workflow>`
3. ถ้า branch มีอยู่ → เปลี่ยนไปด้วย `git checkout <workflow>`
4. ตรวจสอบด้วย `git branch --show-current`

### 3. Confirm Context

> Goal: Report the new branch and next action
> Goal: ยืนยันกับ user ว่าอยู่บน branch ทีถูกต้อง

1. แสดง branch ปัจจุบัน
2. ถ้า user ต้องการทำงานต่อ เช่น restructure, dev, fix, review ให้แนะนำ skill ถัดไป

## Rules

### 1. Branch Names

- `restructure` สำหรับ restructure/refactor tasks
- `dev` สำหรับ development tasks
- `fix` สำหรับ bug fixes
- `review` สำหรับ review tasks

### 2. Safety

- ไม่เปลี่ยน branch ถ้ามี uncommitted changes ยกเว้นได้รับอนุญาต
- ไม่ลบหรือ force-push branch
- ใช้ `git checkout -b` เฉพาะเมื่อ branch ยังไม่มี

## Expected Outcome

- Working tree อยู่บน workflow branch ทีถูกต้อง
- ไม่มี uncommitted changes สูญหาย
- รายงาน branch ปัจจุบันและ next action ชัดเจน
