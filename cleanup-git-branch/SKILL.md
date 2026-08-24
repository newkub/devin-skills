---
name: cleanup-git-branch
description: ลบ git branches เก่าที merge แล้วหรือไม่ใช้แล้ว
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
---

## Goal

ทำความสะอาด branches เก่าออกจาก repository

## Scope

ใช้เมื่อ local หรือ remote มี branches ที่ merge แล้วหรือ abandoned

## Execute

### 1. Identify Candidates
> Goal: Identify Candidates

1. `git branch --merged main` สำหรับ local
2. `git branch -r --merged main` สำหรับ remote
3. ตรวจสอบ branches ที่ไม่มี commit นาน
4. ยกเว้น `main`, `master`, `develop`, release branches

### 2. Confirm With Team
> Goal: Confirm With Team

1. ถ้า shared repo ให้ confirm ก่อนลบ
2. ตรวจสอบว่า branch ไม่มี unmerged commits
3. สำรอง ref ถ้ามีความเสี่ยง

### 3. Delete
> Goal: Delete

1. `git branch -d <branch>` สำหรับ local (merged)
2. `git branch -D <branch>` ถ้าบังคับ
3. `git push origin --delete <branch>` สำหรับ remote
4. `git remote prune origin` เพื่อ clean tracking

## Rules

- ไม่ลบ default branch
- ตรวจสอบ merge status ก่อน
- ขอ confirm ก่อนลบ shared branches
- เก็บ release/hotfix branches ตาม policy

## Expected Outcome

- Branches เก่าถูกลบ
- Repository สะอาด
- ไม่มี data loss
