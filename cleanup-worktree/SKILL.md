---
name: cleanup-worktree
description: ลบ git worktree ที่ไม่ใช้ และ prune worktree tracking ที่ตกค้าง
argument-hint: "[scope]"
related:
  - suggest-next-action
  - report-table
---

## Goal

ลบ git worktree ที่ไม่ใช้งาน คืนพื้นที่ และลบ tracking ที่ตกค้างอย่างปลอดภัย

## Scope

ใช้สำหรับ git repository ที่มีหลาย worktrees ต้องการลบ worktree ทีไม่ต้องการ หรือ prune worktree ทีถูกลบไปแล้วแต่ยัง tracking อยู่

## Execute

### 1. List Worktrees

> Goal: รู้ว่ามี worktree ใดบ้าง

1. รัน `git worktree list`
2. บันทึก path, branch, commit, และ status
3. ระบุ worktree หลัก (main working directory)
4. ระบุ worktree ทีอาจลบได้: ไม่มี uncommitted changes, ไม่ใช่ main

### 2. Check Worktree Status

> Goal: ยืนยันว่า worktree ปลอดภัยที่จะลบ

1. cd เข้า worktree เป้าหมายแล้วรัน `git status --short`
2. ถ้ามี uncommitted changes → report และหยุด ถ้า user ไม่ confirm
3. ตรวจสอบว่า branch ของ worktree ไม่ได้ push สิ่งสำคัญ หรือถ้า push แล้ว branch ยังอยู่ใน remote
4. ถ้ามีความเสี่ยง → ใช้ `/suggest-next-action`

### 3. Remove Worktree

> Goal: ลบ worktree

1. รัน `git worktree remove <path>`
2. ถ้า worktree ถูกลบไปแล้วด้วยตรงจาก filesystem → ใช้ `git worktree remove <path>` หรือ `git worktree prune`
3. ถ้ามี lock หรือ tracking ค้าง → ใช้ `git worktree unlock <path>` ก่อน
4. ตรวจสอบ `git worktree list` อีกครั้ง

### 4. Prune Orphaned Tracking

> Goal: ลบ tracking ที่ตกค้าง

1. รัน `git worktree prune --dry-run` เพื่อดู worktree ทีจะถูก prune
2. ถ้าเหมาะสม → รัน `git worktree prune`
3. ตรวจสอบ `git worktree list` อีกครั้ง

### 5. Verify And Report

> Goal: สรุปผล

1. ใช้ `/report-table` แสดง: Path, Branch, Action, Status
2. ยืนยันว่า main working directory ไม่ได้รับผลกระทบ
3. ทำ `/suggest-next-action`

## Rules

### 1. Safety

- ไม่ลบ main working directory
- ไม่ลบ worktree ที่มี uncommitted changes โดยไม่ได้ user confirmation
- ไม่ลบ branch ใน remote โดยไม่ได้ instruction ชัดเจน

### 2. Force When Needed

- ถ้า `git worktree remove <path>` ไม่ผ่าน → ใช้ `git worktree remove --force <path>` ด้วย confirmation
- ใช้ `--force` สำหรับ worktree ที่มี uncommitted changes เท่านั้นเมื่อ user ยอมรับ

### 3. No Data Loss

- ตรวจสอบ `git status` ใน worktree ก่อนลบ
- ถ้ามี changes สำคัญ → แนะนำ commit, stash, หรือย้ายก่อน
- ตรวจสอบว่า branch ยังมีอยู่ใน remote หรือ local หลังลบ

### 4. Cleanup Scope

- prune orphaned tracking ทั้งหมดที่ไม่มี worktree จริง
- ไม่ prune worktree ที่ยังใช้งานอยู่

## Expected Outcome

- worktree ที่ไม่ใช้ถูกลบ
- tracking ที่ตกค้างถูก prune
- main working directory ยังทำงานปกติ
- รายงาน worktree ที่เหลืออยู่
