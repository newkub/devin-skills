---
name: ship-review-fix
description: รับ issue review findings, สร้าง fix plan, implement, ส่ง merge ผ่าน review gate
related:
  - ship-review
  - unified-review-and-merge-pr
  - review-correctness
  - review-architecture
  - create-github-issue
  - create-github-pr
  - run-verify
  - run-check
  - run-test
  - git-commit
  - git-push
  - resolve-errors
  - ask-me
---

## Goal

รับ review issue แล้วสร้าง fix plan, implement ทีเลือก, verify, สร้าง PR, และส่งต่อ merge ผ่าน review gate

## Scope

ใช้หลังจาก `ship-review` หรือ `review-*` ทำให้เกิด issue ทีมี findings/acceptance criteria
- ไม่ใช่สำหรับ ship งานใหม่ แต่สำหรับ `fix งานหลัง review`
- สร้าง plan จาก issue body
- ให้ user เลือก items หรือ implement ทั้งหมด
- implement, verify, push, สร้าง PR
- ส่ง merge ผ่าน `unified-review-and-merge-pr` ไม่ merge เองทันที

## Execute

### 1. Read Issue

> Goal: เข้าใจ review findings จาก issue

1. รับ issue number จาก argument หรือ context
2. รัน `gh issue view <number> --json number,title,body,labels,state`
3. ถ้าไม่มี issue number → ทำ `/ask-me`
4. ตรวจ labels ว่ามี `review` หรือ `implement` หรือไม่
5. บันทึก findings, acceptance criteria, และ referenced files

### 2. Create Fix Plan

> Goal: แยก findings ออกเป็น implementable items

1. วิเคราะห์ issue body แล้วสร้าง plan เป็น bullet list
2. แต่ละ item ต้องมี:
   - description สั้นๆ
   - file/path ทีเกี่ยวข้อง
   - severity
   - ความเสี่ยง/ความซับซ้อน
3. ทำ `/ask-me` ให้ user เลือก:
   - implement ทั้งหมด
   - เลือกบาง item
   - ข้าม/ยกเลิก

### 3. Create Fix Branch

> Goal: แยก fix ออกจาก main

1. รัน `git branch --show-current` กับ `git status --porcelain`
2. สร้าง branch เช่น `fix/<issue-number>-<topic>` หรือ `ship/fix-<issue-number>`
3. ถ้าอยู่บน branch ทีไม่ใช่ `main` อยู่แล้ว → ใช้ branch นั้นได้
4. รัน `git checkout -b <branch-name>`
5. ถ้ามี uncommitted changes → ทำ `/git-commit` ก่อน

### 4. Implement Fixes

> Goal: แก้ไขตาม plan ทีเลือก

1. ทำตาม plan ตามลำดับ severity: Critical → High → Medium → Low
2. แก้ไข code/config/test ตาม item
3. ถ้า item ไม่ชัดเจน → ถาม user ก่อน implement
4. หลังแก้ไขแต่ละ item → ทำ `/run-check` หรือ `/run-test` ถ้าจำเป็น
5. ถ้าแก้ไขทำให้ review findings อื่นพัง → re-verify

### 5. Verify

> Goal: ตรวจสอบว่า fix ผ่าน

1. ทำ `/run-verify`
2. ทำ `/run-test-all` ถ้ามี test suites
3. ทำ `/deep-validate`
4. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry

### 6. Review Fix

> Goal: ตรวจสอบ fix ก่อนส่ง merge

1. ทำ `/review-correctness` บน diff ปัจจุบัน
2. ทำ `/review-architecture` บน diff ปัจจุบัน
3. บันทึก findings
4. ถ้ามี Critical findings → แก้ไขก่อน หรือทำ `/ask-me`

### 7. Commit

> Goal: commit fix บน branch

1. รัน `git status --short`
2. ถ้ามี uncommitted changes → ทำ `/git-commit`
3. ถ้าไม่มี changes → stop และ report

### 8. Push Branch

> Goal: ส่ง branch ขึ้น remote

1. รัน `/git-push` หรือ `git push -u origin <branch-name>`
2. ไม่ force push

### 9. Create or Update Pull Request

> Goal: สร้าง PR พร้อม link กลับ issue

1. ถ้ามี PR อยู่แล้วที branch นี้ → อัปเดต description
2. ถ้าไม่มี → ทำ `/create-github-pr` หรือ `gh pr create`
3. ใส่ `Closes #<issue-number>` หรือ `Relates to #<issue-number>` ใน PR body
4. ใส่ labels `review`, `implement`, หรือ `fix` ตาม convention
5. ไม่ merge เอง

### 10. Merge via Review Gate

> Goal: ส่ง merge ผ่าน review gate

1. ถ้า user ต้องการ merge เลย → ทำ `/unified-review-and-merge-pr` กับ PR number
2. ถ้า user ต้องการให้ human ตรวจก่อน → สร้าง draft PR แล้ว stop
3. ถ้า `unified-review-and-merge-pr` ผ่าน → PR ถูก merge
4. ถ้าไม่ผ่าน → แก้ไขหรือ stop

### 11. Report

> Goal: สรุปผล

1. รายงาน issue number, branch, PR number, merge status
2. รายงาน plan items ที implement
3. รายงาน findings หลัง fix
4. ทำ `/suggest-next-action`

## Rules

### 1. Issue-Driven

- ต้องอ่าน issue ก่อน
- plan ต้องมาจาก findings ใน issue
- ไม่ invent items นอก issue โดยไม่ถาม user

### 2. User Selects Plan

- ต้องถาม user ก่อน implement ยกเว้น user บอกให้ implement ทั้งหมด
- สามารถ skip item ทีไม่จำเป็นได้

### 3. No Direct Push to Main

- ห้าม push `main`/`master` โดยตรง
- ต้องผ่าน branch + PR

### 4. No Immediate Merge Without Review Gate

- ไม่ merge ทันที
- ต้องผ่าน `/unified-review-and-merge-pr` ก่อน

### 5. Link Back to Issue

- PR ต้อง link กลับ issue เสมอ
- ใช้ `Closes #<issue>` หรือ `Relates to #<issue>`

### 6. No Force Push

- ไม่ใช้ `--force` หรือ `--force-with-lease`

## Expected Outcome

- Review issue ถูกอ่านและเข้าใจ
- Fix plan ถูกสร้างและ user เลือก items แล้ว
- Fix branch ถูกสร้างและ push
- Verify ผ่าน
- GitHub PR ถูกสร้าง/อัปเดตด้วย link กลับ issue
- PR ถูก merge ผ่าน `/unified-review-and-merge-pr` ถ้าผ่านเงื่ือนไข
- ถ้าไม่ผ่าน → มี findings และ next action ชัดเจน
