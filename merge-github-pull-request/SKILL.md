---
name: merge-github-pull-request
description: Merge pull request ด้วย strategy ทีเหมาะสม พร้อม validate ก่อน merge
related:
  - resolve-github-pull-request
  - edit-git-commit
  - git-commit
  - git-push
  - deep-validate
---

## Goal

Merge pull request ด้วยวิธีทีเหมาะสม (merge, squash, rebase) พร้อมตรวจสอบ CI, review approval และ conflicts

## Scope

ใช้เมื่อ PR พร้อม merge ต้องการเลือก strategy อย่างถูกต้องและ merge อย่างปลอดภัย

## Execute

### 1. Read PR Info

> Goal: อ่านข้อมูล PR

1. รัน `gh pr view <pr>` เพื่อดู title, body, branch, base, status
2. บันทึก PR number, branch, author
3. ถ้าไม่มี PR number → ทำ `/ask-me`

### 2. Check Merge Requirements

> Goal: ตรวจสอบเงื่ือนไขก่อน merge

1. รัน `gh pr checks <pr>` หรือ `gh pr view <pr> --json statusCheckRollup`
2. ตรวจสอบ review approval: `gh pr view <pr> --json reviews`
3. ตรวจสอบ conflicts: `gh pr view <pr> --json mergeStateStatus`
4. ถ้า CI ไม่ผ่าน → ทำ `/resolve-errors` ก่อน merge
5. ถ้ามี conflicts → ทำ `/resolve-github-pull-request` หรือ merge base branch

### 3. Choose Merge Strategy

> Goal: เลือก strategy ทีเหมาะสม

1. ดู project conventions หรือ `CONTRIBUTING.md`
2. เลือก:
   - `--merge` ถ้าต้องการเก็บ commit history
   - `--squash` ถ้าต้องการ commit เดียว (default สำหรับ feature branch)
   - `--rebase` ถ้าต้องการ linear history
3. ถ้าไม่ชัด → ถาม user ด้วย `/ask-me`

### 4. Final Checks

> Goal: ตรวจสอบครั้งสุดท้าย

1. ทำ `/run-check` (lint, typecheck, tests)
2. ทำ `/run-test` สำหรับ critical paths
3. ตรวจสอบว่า branch ที merge เป็ต สมบูรณ์

### 5. Merge

> Goal: ทำการ merge

1. รัน `gh pr merge <pr> --<strategy>`
2. ถ้าต้องใช้ admin privilege → เพิ่ม `--admin`
3. ถ้ามี auto-merge → ใช้ `gh pr merge <pr> --auto`
4. รอจน merge สำเร็จ

### 6. Verify And Cleanup

> Goal: ยืนยันและ cleanup

1. ตรวจสอบว่า PR status เป็น `merged`
2. รัน `git fetch` และ `git pull` บน base branch
3. ลบ local branch ถ้าไม่ต้องการ `git branch -d <branch>`
4. รัน `gh pr delete-branch <pr>` ถ้าต้องการ

### 7. Report

> Goal: สรุปผล

1. รายงาน PR number, strategy, final status
2. ระบุ branch ทีถูกลบหรือคงไว้

## Rules

- ไม่ merge ถ้า CI ไม่ผ่าน
- ไม่ merge ถ้ามี unresolved conflicts
- ไม่ merge โดยไม่มี approval (ยกเว้น user สั่ง)
- ใช้ strategy ตาม project conventions
- ทำ final checks ก่อน merge เสมอ

## Expected Outcome

- PR ถูก merge สำเร็จ
- Base branch อัปเดต
- Branch ทีใช้งานเสร็จถูก cleanup
- สรุปผลชัดเจน
