---
name: git-commit-and-push-features-branch
description: สร้าง feature branch, commit, push และ resolve CI/CD สำหรับ feature branch
argument-hint: "[@issue-number-or-title]"
related:
  - git-commit
  - git-push
  - resolve-cicd
  - git-commit-and-push-current-branch
  - follow-git-flow
  - ship
  - create-github-pr
  - deep-review-pr
  - merge-github-pr
---

## Goal

สร้าง feature branch จาก production/integration branch, commit changes, push ไป remote, และ resolve CI/CD จนกว่าจะผ่าน

## Scope

- ใช้เมื่อต้องการเริ่มงานใหม่บน feature branch แล้วส่งไป remote
- ไม่สร้าง PR/merge เอง ให้ `/create-github-pr` และ `/deep-review-pr` จัดการต่อ
- รองรับการตั้งชื่อ branch จาก argument หรือ user

## Execute

### 1. Determine Base And Feature Branch

> Goal: รู้ว่าจะสร้าง feature branch จาก branch ไหน

1. อ่าน `AGENTS.md` หา integration branch หรือ conventions
2. ถ้าไม่มี → ใช้ `main` เป็น base branch
3. กำหนด feature branch name:
   - ถ้ามี argument `@issue-number-or-title` → ใช้เป็น `feature/<kebab-case-title>` หรือ `feature/<issue-number>`
   - ถ้าไม่มี → ถาม user ด้วย `/ask-me`
4. ตรวจสอบว่า branch ชื่อซ้ำหรือไม่

### 2. Create Feature Branch

> Goal: สร้าง feature branch ใหม่

1. ทำ `git fetch origin`
2. ทำ `git switch -c <feature-branch> origin/<base-branch>`
3. ทำ `git push -u origin <feature-branch>`

### 3. Commit And Push

> Goal: สร้าง commit และ push

1. ทำ `/git-commit`
2. ทำ `/git-push`
3. ตรวจสอบ `git status`

### 4. Resolve CI/CD

> Goal: ติดตาม CI/CD ทีถูก trigger

1. ทำ `/resolve-cicd`
2. ถ้า CI fail → resolve หรือ stop และ report

### 5. Report

> Goal: สรุปผล

1. ใช้ `/report-table` สรุป branch, commits, CI status
2. แนะนำ next action (`/create-github-pr` ถ้าพร้อม)

## Rules

### 1. Branch Naming

- ชื่อ branch ต้องเป็น `feature/<description>` หรือตาม project conventions
- ไม่ใช้ชื่อ `dev`, `develop`, `main`, `master`
- ไม่ force-push

### 2. Base Branch

- base branch จาก `AGENTS.md` หรือ project conventions
- ค่าเริ่มต้นเป้น `main`

### 3. No PR/Merge

- ไม่สร้าง PR เอง
- ไม่ merge เอง
- ส่งต่อให้ `/create-github-pr` หรือ `/ship`

### 4. Safety

- ตรวจ `git status` ก่อนและหลัง
- ไม่ overwrite branch ทีมีอยู่
- ถ้ามี uncommitted changes บน branch ปัจจุบัน → ถาม user ก่อนดำเนินการ

## Expected Outcome

- feature branch ถูกสร้างจาก base branch
- changes ถูก commit และ push ไป feature branch
- CI/CD ผ่านหรือ report status
- branch name และ status ถูกรายงาน
