---
name: implement-github-issue
description: นำ GitHub issue ไป implement จนพร้อม merge
related:
  - create-plan-in-dot-devin
  - realize-implementation
  - implement-mock
  - run-verify-on-local
  - git-commit
  - git-push
  - merge-github-pr
  - resolve-errors
---

## Goal

อ่าน GitHub issue แล้ว implement จนเสร็จ พร้อมสร้าง PR หรือ commit ตาม project conventions

## Scope

ใช้สำหรับ issue ทีต้องการเปลี่ยน code หรือ docs โดยสร้าง branch, implement, validate, แล้วสร้าง PR

## Execute

### 1. Read Issue

> Goal: เข้าใจ issue

1. รับ issue number จาก user
2. รัน `gh issue view <issue>` เพื่อดู title, body, labels, assignees
3. บันทึก acceptance criteria ถ้ามี
4. ถ้าไม่ชัด → ทำ `/ask-me`

### 2. Create Branch

> Goal: เตรียม branch สำหรับงาน

1. checkout base branch (เช่น `main`)
2. รัน `git pull` เพื่ออัปเดต
3. สร้าง branch `issue-<number>-<short-title>` หรือตาม project conventions
4. รัน `git switch -c <branch>`

### 3. Plan

> Goal: วางแผนการ implement

1. ทำ `/create-plan-in-dot-devin` ถ้า issue ซับซ้อน
2. ระบุไฟล์และ skills ทีจำเป็น
3. วิเคราะห์ dependencies และ risk

### 4. Implement

> Goal: แก้ไขตาม issue

1. ทำ `/realize-implementation` สำหรับ production code
2. ถ้ามี MOCK/FAKE/STUB → ทำ `/implement-mock`
3. ถ้าต้อง refactor → ทำ `/refactor`
4. ทำการเปลี่ยนแปลงตาม acceptance criteria

### 5. Verify

> Goal: ยืนยันว่า code ถูกต้อง

1. รัน `/run-verify-on-local`
2. รัน `/run-test` สำหรับ tests
3. รัน `git diff --check`
4. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry (max 3)

### 6. Commit And Push

> Goal: ส่งงานขึ้น remote

1. ทำ `/git-commit`
2. ทำ `/git-push` เพื่อ push branch
3. บันทึก commit hash

### 7. Create Pull Request

> Goal: สร้าง PR จาก branch

1. รัน `gh pr create --title "..." --body "..."`
2. ใส่ `Closes #<issue>` ใน PR body
3. เพิ่ม labels/assignees ถ้าจำเป็น
4. บันทึก PR number

### 8. Optional Merge

> Goal: ถ้า user ต้องการ merge ทันที

1. ถ้า PR พร้อม merge → ทำ `/merge-github-pr`
2. ถ้ายังไม่พร้อม → รายงาน PR number

### 9. Update Issue

> Goal: อัปเดต issue status

1. ถ้า PR merge แล้ว → รัน `gh issue close <issue>`
2. ถ้ายังไม่ merge → อัปเดตความคืบหน้าใน issue

## Rules

- ไม่แก้ไขเกิน scope ของ issue
- สร้าง branch ใหม่เสมอ
- ใช้ `/realize-implementation` สำหรับ code จริง
- ใส่ `Closes #<issue>` ใน PR body
- ตรวจสอบก่อน merge ว่า CI ผ่าน

## Expected Outcome

- Issue ถูก implement ครบตาม acceptance criteria
- Branch ถูก push พร้อม PR
- PR มี `Closes #<issue>`
- Issue ถูกปิดหรืออัปเดต status
