---
name: create-git-worktree-in-project
description: สร้าง git worktree ใน `worktrees/` ที root ของ project
argument-hint: "[branch-name] [base-branch]"
related:
  - list-git-worktree
  - delete-git-worktree
  - cleanup-worktree
  - merge-worktree-to-main
---

## Goal

สร้าง git worktree ใน `worktrees/` directory ที root ของ project เพื่อทำงานหลาย branches พร้อมกันโดยไม่ต้อง clone repository หลายครั้ง

## Scope

สร้าง worktree สำหรับ branch ที่ต้องการ ภายใน `worktrees/` ที root ของ project ไม่ใช่ภายใน workspace ย่อยหรือ main working tree

## Execute

### 1. Prepare Worktrees Directory

> Goal: เตรียม `worktrees/` directory ที root

1. หา project root ด้วย `git rev-parse --show-toplevel`
2. ตรวจสอบว่า `worktrees/` directory มีอยู่ใน project root หรือไม่
3. ถ้าไม่มีให้สร้าง `worktrees/` directory
4. ตรวจสอบว่า `worktrees/` ไม่ได้อยู่ใน `.gitignore`

### 2. Check Current State

> Goal: ตรวจสอบสถานะก่อนสร้าง

1. รัน `git branch --show-current` เพื่อดู branch ปัจจุบัน
2. รัน `git status` เพื่อตรวจสอบ working tree
3. ถ้ามี uncommitted changes ที่ไม่ต้องการให้ commit หรือ stash ก่อน
4. ตรวจสอบว่า branch name ทีต้องการไม่ซ้ำกับ branch ทีมีอยู่

### 3. Choose Branch And Base

> Goal: ระบุ branch และ base branch

1. รับ `[branch-name]` จาก argument หรือถาม user
2. รับ `[base-branch]` ถ้ามี ถ้าไม่มีใช้ branch ปัจจุบัน
3. ถ้า branch ใหม่ → ใช้ `git worktree add worktrees/<branch-name> -b <branch-name> <base-branch>`
4. ถ้า branch มีอยู่ → ใช้ `git worktree add worktrees/<branch-name> <existing-branch>`
5. ถ้าต้องการ checkout commit แทน branch → ใช้ `git worktree add --detach worktrees/<name> <commit>`

### 4. Create Worktree

> Goal: สร้าง worktree

1. รันคำสั่ง `git worktree add` ตามทีเลือกไว้
2. ตรวจสอบว่า worktree ถูกสร้างด้วย `git worktree list`
3. ตรวจสอบว่า `worktrees/<branch-name>/` มีไฟล์ครบถ้วน

### 5. Verify Worktree

> Goal: ยืนยันว่า worktree ทำงานได้

1. รัน `git status` ภายใน worktree เพื่อตรวจสอบ branch ถูกต้อง
2. ตรวจสอบว่าสามารถทำงานได้ปกติใน worktree
3. ใช้ `/report-table` แสดง: Worktree Path, Branch, Base, Status

## Rules

### 1. Worktrees Directory Structure

- เก็บ worktrees ใน `worktrees/` directory ที project root เท่านั้น
- ใช้ชื่อ directory ตรงกับ branch name
- หลีกเลี่ยงชื่อทีซับซ้อนหรือมี spaces

### 2. Branch Naming

- ใช้ branch name ทีสื่อความหมาย เช่น `feature/`, `bugfix/`, `hotfix/`
- ตรวจสอบว่า branch name ไม่ซ้ำกับ branch ทีมีอยู่แล้ว
- ถ้า branch ใหม่ ต้องระบุ base branch ทีชัดเจน

### 3. Working Tree Clean

- แนะนำให้ commit หรือ stash uncommitted changes ก่อนสร้าง worktree
- ถ้าไม่ commit ให้ระบุให้ user ทราบว่า worktree ใช้ base branch ปัจจุบัน
- ห้ามสร้าง worktree ทับ directory ทีมีอยู่

### 4. Worktree Management

- ลบ worktree หลังจากเสร็จงานด้วย `/delete-git-worktree`
- รัน `git worktree prune` อย่างสม่ำเสมอเพื่อลบ worktrees ทีไม่มี directory
- หลีกเลี่ยงการสร้าง worktree จำนวนมากโดยไม่จำเป็น

## Expected Outcome

- Worktree ถูกสร้างใน `worktrees/<branch-name>/` ที project root
- Worktree อยู่ใน branch ทีต้องการและพร้อมทำงาน
- สามารถทำงานหลาย branches พร้อมกันโดยไม่ต้อง clone repository หลายครั้ง
