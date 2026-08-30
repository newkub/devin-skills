---
name: implement-plan-from-github-issue
description: อ่าน plan จาก GitHub issue แล้ว implement ตาม plan จนพร้อม merge
related:
  - implement-github-issue
  - create-plan-as-github-issue
  - idea-features
  - realize-implementation
  - implement-mock
  - run-verify
  - git-commit
  - git-push
  - merge-github-pr
  - resolve-errors
  - open-github-issue
  - create-github-pr
---

## Goal

อ่าน GitHub issue ทีมี plan อยู่ กรอง items ทีต้องทำ แล้ว implement จนเสร็จ พร้อมสร้าง PR หรือ commit ตาม project conventions

## Scope

ใช้สำหรับ issue ทีมี plan หรือ checklist โดย:
- สร้าง branch
- กรอง items จาก plan
- implement ตาม plan
- validate
- สร้าง PR พร้อม `Closes #<issue>`
- อัปเดต issue status

## Execute

### 1. Read Issue

> Goal: เข้าใจ issue และ plan

1. รับ issue number จาก user
2. รัน `gh issue view <issue>` เพื่อดู title, body, labels, assignees
3. บันทึก acceptance criteria และ plan items จาก checkboxes (`- [ ]`)
4. บันทึก plan table ถ้ามี
5. ถ้าไม่ชัด → ทำ `/ask-me`

### 2. Filter Plan

> Goal: เลือก items ทีต้อง implement

1. สแกน issue body หา task checkboxes
2. ระบุ items ทียังไม่ complete
3. ถ้า issue มี plan table → ใช้ task plan เป้น guide
4. ถาม user ถ้าต้องการทำเฉพาะบาง items
5. ถ้า user ไม่ระบุ → ทำทั้งหมดทียังไม่ done

### 3. Create Branch

> Goal: เตรียม branch สำหรับงาน

1. checkout base branch (เช่น `main`)
2. รัน `git pull` เพื่ออัปเดต
3. สร้าง branch `issue-<number>-<short-title>` หรือตาม project conventions
4. รัน `git switch -c <branch>`

### 4. Plan

> Goal: วางแผนการ implement

1. ทำ `/create-plan-as-github-issue` ถ้า issue ซับซ้อน
2. ระบุไฟล์และ skills ทีจำเป็น
3. วิเคราะห์ dependencies และ risk

### 5. Implement

> Goal: แก้ไขตาม issue plan

1. ทำ `/realize-implementation` สำหรับ production code
2. ถ้ามี MOCK/FAKE/STUB → ทำ `/implement-mock`
3. ถ้าต้อง refactor → ทำ `/refactor`
4. ทำการเปลี่ยนแปลงตาม plan items
5. อัปเดต checkboxes ใน plan ตามความก้าวหน้า

### 6. Verify

> Goal: ยืนยันว่า code ถูกต้อง

1. รัน `/run-verify`
2. รัน `/run-test` สำหรับ tests
3. รัน `git diff --check`
4. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry (max 3)

### 7. Commit And Push

> Goal: ส่งงานขึ้น remote

1. ทำ `/git-commit`
2. ทำ `/git-push` เพื่อ push branch
3. บันทึก commit hash

### 8. Create Pull Request

> Goal: สร้าง PR จาก branch

1. รัน `gh pr create --title "..." --body "..."`
2. ใส่ `Closes #<issue>` ใน PR body
3. เพิ่ม labels/assignees ถ้าจำเป็น
4. บันทึก PR number

### 9. Optional Merge

> Goal: ถ้า user ต้องการ merge ทันที

1. ถ้า PR พร้อม merge → ทำ `/merge-github-pr`
2. ถ้ายังไม่พร้อม → รายงาน PR number

### 10. Update Issue

> Goal: อัปเดต issue status

1. ถ้า PR merge แล้ว → รัน `gh issue close <issue>`
2. ถ้ายังไม่ merge → อัปเดต checkboxes และความคืบหน้าใน issue

## Rules

- ไม่แก้ไขเกิน scope ของ issue plan
- สร้าง branch ใหม่เสมอ
- ใช้ `/realize-implementation` สำหรับ code จริง
- ใส่ `Closes #<issue>` ใน PR body
- ตรวจสอบก่อน merge ว่า CI ผ่าน
- อัปเดต plan checkboxes ตาม progress

- ใช้ /implement-github-issue ถ้าจำเป็น
- ใช้ /idea-features ถ้าจำเป็น
- ใช้ /open-github-issue ถ้าจำเป็น
- ใช้ /create-github-pr ถ้าจำเป็น

## Expected Outcome

- Issue plan ถูก implement ครบตาม acceptance criteria
- Branch ถูก push พร้อม PR
- PR มี `Closes #<issue>`
- Issue ถูกปิดหรืออัปเดต status
