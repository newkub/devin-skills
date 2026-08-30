---
name: unified-review-and-merge-pr
description: Review pull request ทีหนึ่ง แล้ว merge ถ้าผ่าน หรือ request changes ถ้าไม่ผ่าน
related:
  - merge-github-pr
  - review-correctness
  - review-architecture
  - watch-cicd-and-resolve
  - resolve-github-pr
  - run-check
  - run-test
  - deep-validate
---

## Goal

Review pull request อย่างครบถ้วน แล้ว merge ถ้าผ่าน หรือ stop พร้อมความเห็นถ้าไม่ผ่าน

## Scope

ใช้เมื่อ PR พร้อม merge และต้องการ review ก่อน merge แบบ automated + human-like
- ตรวจสอบ CI, approval, conflicts
- รีวิว correctness และ architecture
- Merge ถ้าผ่านทุกเงื่ือนไข
- ถ้าไม่ผ่าน → request changes หรือ comment แล้ว stop
- ใช้งานร่วมกับ `/ship` ได้โดยตรง

## Execute

### 1. Read PR Info

> Goal: เข้าใจ PR ก่อน review

1. รัน `gh pr view <pr> --json number,title,body,headRefName,baseRefName,state,mergeStateStatus,statusCheckRollup,reviews`
2. บันทึก PR number, title, branch, base, author
3. ตรวจสอบ status: open, draft, has conflicts
4. ถ้า PR เป็น draft → ถาม user ว่าต้องการ merge หรือไม่ (ยกเว้น user สั่ง)
5. ถ้าไม่มี PR number → ทำ `/ask-me`

### 2. Check CI

> Goal: CI ต้องผ่านก่อน review และ merge

1. รัน `gh pr checks <pr>` หรือ `gh pr view <pr> --json statusCheckRollup`
2. ถ้า CI กำลังรัน → ทำ `/watch-cicd-and-resolve` หรือ `/watch-github-actions` จนจบ
3. ถ้า CI ไม่ผ่าน → ทำ `/resolve-errors` หรือ stop และ report
4. ไม่ merge ถ้า CI ไม่ผ่าน

### 3. Check Conflicts and Approval

> Goal: ตรวจสอบ merge readiness

1. รัน `gh pr view <pr> --json mergeStateStatus`
2. ถ้า `mergeStateStatus` = `CONFLICTING` → ทำ `/resolve-github-pr` หรือ stop
3. ตรวจ review approval: `gh pr view <pr> --json reviews`
4. ถ้าไม่มี approval และ repo ต้องการ approval → ถาม user ก่อน merge
5. ไม่ merge ถ้ามี unresolved conflicts

### 4. Review Code

> Goal: review คุณภาพก่อน merge

1. ตรวจ diff: `gh pr diff <pr>`
2. ทำ `/review-correctness` สำหรับ logic, types, edge cases, tests
3. ทำ `/review-architecture` สำหรับ patterns, boundaries, coupling
4. บันทึก findings พร้อม severity
5. ถ้ามี Critical findings → ทำ `/ask-me` หรือสร้าง review comment แล้ว stop
6. ถ้ามี High findings → ถาม user ว่าจะ merge ไหมหรือ request changes

### 5. Run Final Checks

> Goal: double-check ก่อน merge

1. ทำ `/run-check` (lint, typecheck, scan)
2. ทำ `/run-test` สำหรับ critical paths
3. ทำ `/deep-validate` ถ้าจำเป็น
4. ถ้าไม่ผ่าน → แก้ไขหรือ stop

### 6. Choose Merge Strategy

> Goal: เลือกวิธี merge ทีเหมาะสม

1. ดู project conventions หรือ `CONTRIBUTING.md`
2. เลือก:
   - `--squash` ถ้าเป็น feature branch (default)
   - `--merge` ถ้าต้องการเก็บ commit history
   - `--rebase` ถ้าต้องการ linear history
3. ถ้าไม่ชัด → ถาม user ด้วย `/ask-me`

### 7. Merge

> Goal: merge PR

1. รัน `gh pr merge <pr> --<strategy>`
2. ถ้าต้อง admin privilege → เพิ่ม `--admin` (ห้ามโดย default)
3. รอจน merge สำเร็จ
4. ตรวจสอบว่า PR status เป็น `MERGED`

### 8. Cleanup

> Goal: ทำความสะอาดหลัง merge

1. รัน `git fetch` และ `git pull` บน base branch
2. ลบ local branch ถ้าไม่ต้องการ: `git branch -d <branch>`
3. รัน `gh pr delete-branch <pr>` ถ้าต้องการลบ remote branch
4. ถ้า PR มี linked issue และต้องปิด → ตรวจสอบ issue status

### 9. Report

> Goal: สรุปผล

1. รายงาน PR number, strategy, final status
2. รายงาน review findings สั้นๆ
3. รายงาน branch ทีถูกลบหรือคงไว้
4. ทำ `/suggest-next-action`

## Rules

### 1. No Merge Without CI Pass

- ไม่ merge ถ้า CI ไม่ผ่าน
- ไม่ merge ถ้า CI ยังรันอยู่

### 2. No Merge With Conflicts

- ไม่ merge ถ้ามี unresolved conflicts
- ถ้า conflict → resolve ก่อนหรือส่งต่อ `/resolve-github-pr`

### 3. No Merge Without Review

- ต้อง review ก่อน merge เสมอ
- ถ้ามี Critical findings → ต้อง resolve ก่อน merge
- ถ้ามี High findings → ต้องได้รับ explicit approval จาก user

### 4. Approval Policy

- ถ้า repo ต้องการ approval → ไม่ merge โดยไม่มี approval
- ยกเว้น user สั่ง merge โดยตรง

### 5. Merge Strategy

- default: `--squash` สำหรับ feature branch
- ใช้ `--merge` หรือ `--rebase` ตาม project conventions
- ถ้าไม่ชัด → ถาม user

### 6. No Force

- ไม่ใช้ `--force` หรือ `--force-with-lease`
- ไม่ rewrite history

## Expected Outcome

- PR ถูก review ครบถ้วน
- CI ผ่านก่อน merge
- ไม่มี unresolved conflicts
- PR ถูก merge ด้วย strategy ทีเหมาะสม ถ้าผ่านเงื่ือนไข
- ถ้าไม่ผ่าน → มี comments หรือ review findings ชัดเจน
- Base branch อัปเดต
- Branch ทีใช้งานเสร็จถูก cleanup ถ้าต้องการ
- สรุปผลชัดเจน
