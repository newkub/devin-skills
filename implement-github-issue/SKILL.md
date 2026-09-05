---
name: implement-github-issue
description: นำ GitHub issue ไป implement จนพร้อม merge
related:
  - create-plan-as-github-issue
  - productionize-implementation
  - implement-mock
  - run-verify
  - git-commit
  - git-push
  - merge-github-pr
  - resolve-errors
---

## Goal

อ่าน GitHub issue แล้ว implement จนเสร็จ พร้อมสร้าง PR หรือ commit ตาม project conventions

## Scope

ใช้สำหรับ issue ทีต้องการเปลี่ยน code หรือ docs บน branch ทีเหมาะสม โดย implement, validate, แล้วสร้าง PR

## Execute

### 1. Read Issue

> Goal: เข้าใจ issue

1. รับ issue number จาก user
2. รัน `gh issue view <issue>` เพื่อดู title, body, labels, assignees
3. บันทึก acceptance criteria ถ้ามี
4. ถ้าไม่ชัด → ทำ `/ask-me`

### 2. Plan

> Goal: วางแผนการ implement

1. ทำ `/create-plan-as-github-issue` ถ้า issue ซับซ้อน
2. ระบุไฟล์และ skills ทีจำเป็น
3. วิเคราะห์ dependencies และ risk

### 3. Implement

> Goal: แก้ไขตาม issue

1. ทำ `/productionize-implementation` สำหรับ production code
2. ถ้ามี MOCK/FAKE/STUB → ทำ `/implement-mock`
3. ถ้าต้อง refactor → ทำ `/refactor`
4. ทำการเปลี่ยนแปลงตาม acceptance criteria

### 4. Verify

> Goal: ยืนยันว่า code ถูกต้อง

1. รัน `/run-verify`
2. รัน `/run-test` สำหรับ tests
3. รัน `git diff --check`
4. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry (max 3)

### 5. Commit And Push

> Goal: ส่งงานขึ้น remote

1. ทำ `/git-commit`
2. ทำ `/git-push` เพื่อ push branch
3. บันทึก commit hash

### 6. Create Pull Request

> Goal: สร้าง PR จาก branch

1. รัน `gh pr create --title "..." --body "..."`
2. ใส่ `Closes #<issue>` ใน PR body
3. เพิ่ม labels/assignees ถ้าจำเป็น
4. บันทึก PR number

### 7. Optional Merge

> Goal: ถ้า user ต้องการ merge ทันที

1. ถ้า PR พร้อม merge → ทำ `/merge-github-pr`
2. ถ้ายังไม่พร้อม → รายงาน PR number

### 8. Update Issue

> Goal: อัปเดต issue status

1. ถ้า PR merge แล้ว → รัน `gh issue close <issue>`
2. ถ้ายังไม่ merge → อัปเดตความคืบหน้าใน issue

## Rules

- ไม่แก้ไขเกิน scope ของ issue
- ทำงานบน branch ทีเหมาะสม
- ใช้ `/productionize-implementation` สำหรับ code จริง
- ใส่ `Closes #<issue>` ใน PR body
- ตรวจสอบก่อน merge ว่า CI ผ่าน

## Expected Outcome

- Issue ถูก implement ครบตาม acceptance criteria
- Branch ถูก push พร้อม PR
- PR มี `Closes #<issue>`
- Issue ถูกปิดหรืออัปเดต status
