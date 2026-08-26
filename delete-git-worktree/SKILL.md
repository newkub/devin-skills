---
name: delete-git-worktree
description: ลบ git worktree ทีระบุอย่างปลอดภัย
related:
  - list-git-worktree
  - create-worktree-in-project
  - cleanup-worktree
---

## Goal

ลบ git worktree ทีระบุออก โดยไม่ทำลาย parent repository

## Scope

ใช้เมื่อต้องการลบ worktree เฉพาะตัว

## Execute

### 1. Identify Worktree

> Goal: ระบุ worktree ทีต้องการลบ

1. รัน `git worktree list`
2. หรือทำ `/list-git-worktree`
3. ยื่นยัน path ของ worktree ทีต้องการลบ

### 2. Check Status

> Goal: ไม่ลบ worktree ทีมี changes

1. รัน `git -C <worktree-path> status --porcelain`
2. ถ้ามี uncommitted/untracked changes → หยุดและถามก่อน
3. ถ้าต้องการลบทั้ง changes → ใช้ `--force`

### 3. Remove Worktree

> Goal: ลบ worktree

1. รัน `git worktree remove <path>`
2. ถ้า lock หรือมีปัญหา → รัน `git worktree remove --force <path>`
3. ตรวจสอบ `git worktree list` อีกครั้ง

### 4. Prune

> Goal: ทำความสะอาด tracking

1. รัน `git worktree prune`
2. ตรวจสอบว่า tracking references ถูกลบ

## Rules

### 1. Confirm Before Delete

- ถาม user ก่อนลบ
- ไม่ลบ worktree ทีมี uncommitted changes โดยไม่ถาม
- ไม่ลบ main working tree

### 2. Force With Caution

- `--force` ใช้เมื่อไม่สามารถ remove ปกติได้
- ระบุเหตุผลก่อน force

### 3. Preserve Branches

- ลบ worktree ไม่ลบ branch
- ถ้าต้องการลบ branch ด้วย → ทำ `/delete-git-branch`

## Expected Outcome

- Worktree ถูกลบ
- `git worktree list` ไม่แสดง worktree นั้น
- Branch ยังคงมีอยู่
- ไม่มี uncommitted changes สูญหาย
