---
name: git-worktree
description: จัดการ git worktrees — ทำงานหลาย branch พร้อมกันโดยไม่ต้อง stash/switch
argument-hint: "[add|list|remove] [path] [branch]"
related:
  - git-branch
  - cleanup-worktree
  - delete-git-worktree
  - git-stash
  - ask-me
---

## Goal

ใช้ `git worktree` checkout หลาย branches พร้อมกันใน directories แยก — parallel work โดยไม่ต้อง stash/switch

## Scope

- `git worktree add/list/remove/move/lock`
- ใช้เมื่อต้องทำงาน >1 branch พร้อมกัน (review PR ขณะทำ feature, hotfix ระหว่างงานค้าง)
- cleanup worktrees เก่า → `/cleanup-worktree`; ลบ → `/delete-git-worktree`

## Execute

### 1. Decide Need

> Goal: worktree เหมาะกับงานนี้จริง

1. ต้องการ run/test branch อื่นขณะ working tree ปัจจุบันมีงานค้าง → worktree
2. แค่ดูไฟล์ชั่วคราว → `git show <branch>:<path>` พอ ไม่ต้อง worktree
3. แต่ละ worktree = directory จริง + disk space เต็ม copy — พิจารณาขนาด repo

### 2. Add Worktree

> Goal: worktree ใหม่ถูกสร้างที่ path และ branch ถูกต้อง

```bash
git worktree add ../<repo>-<branch-name> <branch>      # branch มีอยู่
git worktree add -b <new-branch> ../<repo>-<name> <base>  # สร้าง branch ใหม่พร้อมกัน
git worktree add --detach ../<repo>-review <sha>        # detached สำหรับ review
```

1. naming: `<repo>-<purpose>` ที่ sibling dir — ห้าม nest worktree ใน worktree
2. branch ที่ checkout อยู่ที่อื่น checkout ซ้ำไม่ได้ — detached หรือสร้าง branch ใหม่
3. worktree ใหม่ไม่มี ignored files (`.env`, `node_modules`) — copy/install ตามต้องการ

### 3. Work In Worktree

> Goal: ทำงานใน worktree เหมือน repo ปกติ

1. `cd <worktree>` แล้วทำงานปกติ — git commands ทั้งหมดทำงานใน context ของ branch นั้น
2. commits ใน worktree เข้า branch ตรงๆ — ไม่มี sync step
3. `.env`/deps ต้องตั้งเอง — worktree ไม่ copy ignored files

### 4. Remove

> Goal: worktree ถูกลบอย่างถูกต้องเมื่อจบ

1. `git worktree remove <path>` — ลบได้เมื่อ clean (ไม่มี changes ค้าง)
2. changes ค้าง → commit หรือ `/git-stash` ใน worktree นั้นก่อน — หรือ `--force` (destructive, confirm)
3. `git worktree list` + `git worktree prune` — เคลียร์ metadata ของ worktrees ที่ถูกลบมือเอง

## Rules

- worktree = working directory จริง — changes ในนั้นเป็น uncommitted work จริง ไม่ใช่ sandbox
- ห้าม checkout branch เดียวกันใน 2 worktrees — git block อยู่แล้ว ใช้ detached แทน
- ลบ worktree dir ด้วยมือ → ต้อง `git worktree prune` เคลียร์ metadata
- worktree ค้าง → `/cleanup-worktree` เป็นระยะ
- ใช้ /ask-me ถ้าจำเป็น

## Expected Outcome

- ทำงานหลาย branches พร้อมกันโดยไม่ต้อง stash/switch
- worktrees ถูก track ใน `git worktree list` และ cleanup เมื่อจบ
