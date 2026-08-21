---
name: follow-git
description: ใช้งาน git commands ตามสถานการณ์
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
related:
- validate
- ask-me
---

## Goal

ใช้งาน git ใน project ให้ถูกต้องและเหมาะสมกับสถานการณ์

## Scope

ใช้กับทุก project ทีใช้ git ไมว่าจะเป็น local workflow, collaboration, หรือ history investigation

## Execute

### 1. Setup Repository

เตรียม repo ให้พร้อมใช้งาน

> Goal: repo พร้อมสำหรับการพัฒนา

1. ใช้ `git clone` สำหรับ repo ทีมีอยู่
2. ใช้ `git init` สำหรับ project ใหม่
3. ทำ `git config` ตั้งค่า user, editor, aliases
4. ตรวจสอบ `git remote` และ `git status`

### 2. Daily Workflow

ทำงานประจำวันกับ branch และ commit

> Goal: สร้าง commit ทีสะอาดและ branch ทีชัดเจน

1. ใช้ `git branch` หรือ `git switch -c` สร้าง feature branch
2. ตรวจสอบ `git status` และ `git diff` ก่อน commit
3. ใช้ `git add` และ `git commit` ด้วยข้อความชัดเจน
4. ใช้ `git stash` เก็บ changes ชั่วคราว
5. ใช้ `git push` หรือ `git pull` กับ remote

### 3. History And Inspection

สำรวจประวัติและหาต้นตอของปัญหา

> Goal: เข้าใจ history และหา answers จาก git

1. ใช้ `git log` ดูประวัติ commit
2. ใช้ `git blame` หาว่าใครแก้บรรทัดไหน
3. ใช้ `git bisect` หา commit ทีทำให้เกิด bug
4. ใช้ `git reflog` กู้คืน reference ทีหายไป

### 4. Collaboration And Integration

ทำงานร่วมกับทีมและรวมงาน

> Goal: รวมงานโดยไม่ทำลาย history ของผู้อื่น

1. ใช้ `git rebase` ปรับ history ให้เป็นเส้นตรง
2. ใช้ `git merge` รวม branch
3. ใช้ `git cherry-pick` เอา commit เฉพาะอันมาใช้
4. ใช้ `git revert` ยกเลิก commit ทีผิด
5. แก้ไข `git conflict` ด้วยความระมัดระวัง

### 5. Advanced Operations

ใช้งาน git ขั้นสูงตามจำเป็น

> Goal: จัดการ repo ขนาดใหญ่และ edge cases

1. ใช้ `git submodules` สำหรับ external dependencies
2. ใช้ `git lfs` สำหรับไฟล์ใหญ่
3. ใช้ `git tags` มาร์ก release
4. ใช้ `git hooks` ตรวจสอบคุณภาพก่อน commit
5. ใช้ `git worktree` ทำงานหลาย branch พร้อมกัน
6. ใช้ `git cleanup` ลบ branches/remote refs ทีไม่ใช้

## Rules

### 1. Safety First

- ทำ dry run ก่อน rebase, reset, revert ทีอาจสูญเสียข้อมูล
- ไม่ใช้ `--force` กับ shared branches
- แก้ conflicts ด้วยสติ ตรวจสอบก่อน commit

### 2. Clean History

- commit หนึ่งอันควรทำหนึ่งอย่าง
- ใช้ commit message บอก `what` และ `why`
- rebase ก่อน merge ถ้าทีมตกลงกัน

### 3. Verification

- รัน test หลัง rebase/merge/cherry-pick
- ตรวจสอบ `git status` ให้สะอาดก่อน push
- ใช้ `git diff` ตรวจงานก่อน commit

## Expected Outcome

- สามารถใช้งาน git ได้ตามสถานการณ์ตั้งแต่ daily workflow ถึง advanced operations
- ไม่ทำลาย history ของทีม
- สามารถ trace ปัญหาได้ด้วย history tools
- repo สะอาด อ่านง่าย
