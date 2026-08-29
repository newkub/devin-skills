---
name: ship-features-implement
description: รับ user comment หรือ feature request, สร้าง plan, implement, สร้าง PR, เสนอ merge
related:
  - ship-review-fix
  - ship-github-issue
  - ship-review
  - unified-review-and-merge-pr
  - create-github-issue
  - create-github-pr
  - review-correctness
  - review-architecture
  - run-verify
  - run-check
  - run-test
  - git-commit
  - git-push
  - resolve-errors
  - ask-me
---

## Goal

รับ user comment หรือ feature request จาก issue/PR, สร้าง implementation plan, implement ทีเลือก, verify, สร้าง PR, และเสนอ merge ผ่าน review gate

## Scope

ใช้เมื่อมี feedback/comment/feature request จาก user ทีต้องการ implement
- ไม่ใช่สำหรับ fix งานหลัง review (นั่นคือ `ship-review-fix`)
- ไม่ใช่สำหรับทำงานตาม issue ทั้งหมด (นั่นคือ `ship-github-issue`)
- สร้าง plan จาก comment body
- ให้ user เลือก items หรือ implement ทั้งหมด
- implement, verify, push, สร้าง PR
- เสนอ merge ผ่าน `unified-review-and-merge-pr` ถ้า user ต้องการ

## Execute

### 1. Read User Comment

> Goal: เข้าใจ feature request จาก user

1. รับ issue number, PR number, หรือ comment URL จาก argument หรือ context
2. รัน `gh issue view <number> --json number,title,body,labels,state` หรือ `gh pr view <number> --json number,title,body,labels,state`
3. ถ้าเป็น comment → รัน `gh issue view <number> --comments` หรือ `gh pr view <number> --comments` แล้วหา comment ล่าสุด
4. ถ้าไม่มี issue/PR number → ทำ `/ask-me` หรือ `/create-github-issue` ก่อน
5. บันทึก feature description, acceptance criteria, และ referenced files

### 2. Create Implementation Plan

> Goal: แยก feature request ออกเป็น implementable items

1. วิเคราะห์ comment body แล้วสร้าง plan เป็น bullet list
2. แต่ละ item ต้องมี:
   - description สั้นๆ
   - file/path ทีเกี่ยวข้อง
   - ระดับความซับซ้อน
   - ความเสี่ยง
3. ทำ `/ask-me` ให้ user เลือก:
   - implement ทั้งหมด
   - เลือกบาง item
   - ข้าม/ยกเลิก

### 3. Create Feature Branch

> Goal: แยก feature ออกจาก main

1. รัน `git branch --show-current` กับ `git status --porcelain`
2. สร้าง branch เช่น `feature/<issue-number>-<topic>` หรือ `ship/feature-<issue-number>`
3. ถ้าอยู่บน branch ทีไม่ใช่ `main` อยู่แล้ว → ใช้ branch นั้นได้
4. รัน `git checkout -b <branch-name>`
5. ถ้ามี uncommitted changes → ทำ `/git-commit` ก่อน

### 4. Implement Features

> Goal: แก้ไขตาม plan ทีเลือก

1. ทำตาม plan ตามลำดับ: foundation → dependencies → UI/CLI → tests
2. แก้ไข code/config/test ตาม item
3. ถ้า item ไม่ชัดเจน → ถาม user ก่อน implement
4. หลังแก้ไขแต่ละ item → ทำ `/run-check` หรือ `/run-test` ถ้าจำเป็น
5. ถ้า implement ทำให้ส่วนอื่นพัง → re-verify

### 5. Verify

> Goal: ตรวจสอบว่า feature ผ่าน

1. ทำ `/run-verify`
2. ทำ `/run-test-all` ถ้ามี test suites
3. ทำ `/deep-validate`
4. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry

### 6. Review Implementation

> Goal: ตรวจสอบ feature ก่อนส่ง merge

1. ทำ `/review-correctness` บน diff ปัจจุบัน
2. ทำ `/review-architecture` บน diff ปัจจุบัน
3. บันทึก findings
4. ถ้ามี Critical findings → แก้ไขก่อน หรือทำ `/ask-me`

### 7. Commit

> Goal: commit feature บน branch

1. รัน `git status --short`
2. ถ้ามี uncommitted changes → ทำ `/git-commit`
3. ถ้าไม่มี changes → stop และ report

### 8. Push Branch

> Goal: ส่ง branch ขึ้น remote

1. รัน `/git-push` หรือ `git push -u origin <branch-name>`
2. ไม่ force push

### 9. Create or Update Pull Request

> Goal: สร้าง PR พร้อม link กลับ issue/PR

1. ถ้ามี PR อยู่แล้วที branch นี้ → อัปเดต description
2. ถ้าไม่มี → ทำ `/create-github-pr` หรือ `gh pr create`
3. ใส่ `Closes #<issue-number>` หรือ `Relates to #<issue-number>` ใน PR body
4. ใส่ labels `feature`, `enhancement`, หรือ `implement` ตาม convention
5. ไม่ merge เอง

### 10. Propose Merge

> Goal: เสนอ merge ผ่าน review gate

1. ถ้า user ต้องการ merge เลย → ทำ `/unified-review-and-merge-pr` กับ PR number
2. ถ้า user ต้องการให้ human ตรวจก่อน → สร้าง draft PR แล้ว stop
3. ถ้า `unified-review-and-merge-pr` ผ่าน → PR ถูก merge
4. ถ้าไม่ผ่าน → แก้ไขหรือ stop

### 11. Report

> Goal: สรุปผล

1. รายงาน issue/PR number, branch, PR number, merge status
2. รายงาน plan items ที implement
3. รายงาน findings หลัง implement
4. ทำ `/suggest-next-action`

## Rules

### 1. Comment-Driven

- ต้องอ่าน comment/issue ก่อน
- plan ต้องมาจาก feature request ใน comment
- ไม่ invent items นอก comment โดยไม่ถาม user

### 2. User Selects Plan

- ต้องถาม user ก่อน implement ยกเว้น user บอกให้ implement ทั้งหมด
- สามารถ skip item ทีไม่จำเป็นได้

### 3. No Direct Push to Main

- ห้าม push `main`/`master` โดยตรง
- ต้องผ่าน branch + PR

### 4. No Immediate Merge Without Review Gate

- ไม่ merge ทันที
- ต้องผ่าน `/unified-review-and-merge-pr` ก่อน

### 5. Link Back to Source

- PR ต้อง link กลับ issue/PR เสมอ
- ใช้ `Closes #<issue>` หรือ `Relates to #<issue>`

### 6. No Force Push

- ไม่ใช้ `--force` หรือ `--force-with-lease`

## Expected Outcome

- User comment ถูกอ่านและเข้าใจ
- Implementation plan ถูกสร้างและ user เลือก items แล้ว
- Feature branch ถูกสร้างและ push
- Verify ผ่าน
- GitHub PR ถูกสร้าง/อัปเดตด้วย link กลับ issue
- PR ถูก merge ผ่าน `/unified-review-and-merge-pr` ถ้าผ่านเงื่ือนไข
- ถ้าไม่ผ่าน → มี findings และ next action ชัดเจน
