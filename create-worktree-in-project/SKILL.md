---
name: create-worktree-in-project
description: สร้าง git worktree ใหม่ใน root ของ workspace
---

## Goal

สร้าง git worktree ใหม่ใน root ของ workspace เพื่อทำงานบน branch คู่ขนานโดยไม่กระทบ working directory หลัก

## Scope

ใช้สำหรับ git repository ที่ต้องการสร้าง worktree สำหรับ branch ใหม่หรือ branch ที่มีอยู่ โดย worktree ถูกสร้างใน root ของ workspace หรือ root ของ project

## Execute

### 1. Identify Target

> Goal: ระบุ workspace root และ branch

1. ตรวจสอบ `pwd` หรือ workspace root
2. รัน `git rev-parse --git-dir` เพื่อยืนยันว่าอยู่ใน git repo
3. ระบุ branch ที่ต้องการสร้าง worktree:
   - ถ้า branch ใหม่ → ใช้ `git worktree add -b <new-branch> <path> <base>`
   - ถ้า branch มีอยู่ → ใช้ `git worktree add <path> <branch>`
4. ตรวจสอบชื่อ worktree directory ไม่ซ้ำกับ existing directories

### 2. Choose Path

> Goal: กำหนด path ของ worktree ใน root workspace

1. Path ต้องอยู่นอก main working directory
2. ใช้ชื่อ `<workspace-root>/<worktree-name>` ถ้า root เป็น parent ของ main worktree
3. ถ้าอยู่ใน root ของ project ที่ไม่ใช่ repo root → ใช้ `../<worktree-name>` หรือ `worktrees/<worktree-name>`
4. ตรวจสอบว่า path ว่างและไม่ซ้ำ

### 3. Create Worktree

> Goal: สร้าง worktree

1. สำหรับ branch ใหม่:
   ```sh
   git worktree add -b <new-branch> <path> <base-branch>
   ```
2. สำหรับ branch มีอยู่:
   ```sh
   git worktree add <path> <existing-branch>
   ```
3. ถ้าต้องการ checkout commit แทน branch:
   ```sh
   git worktree add --detach <path> <commit>
   ```
4. รอจนกระบวนการเสร็จ

### 4. Verify Worktree

> Goal: ยืนยันว่า worktree ทำงานได้

1. รัน `git worktree list` เพื่อตรวจสอบ
2. ตรวจสอบ `git status` ภายใน worktree
3. ตรวจสอบ branch ใน worktree ถูกต้อง
4. ถ้า worktree ไม่แสดงหรือมี error → ตรวจสอบ path และ branch

### 5. Report

> Goal: สรุปผล

1. ใช้ `/report-table` แสดง: Worktree Path, Branch, Base, Status
2. ระบุคำสั่งทีใช้สร้าง
3. ทำ `/suggest-next-action`

## Rules

### 1. Path Safety

- worktree path ต้องไม่อยู่ภายใน main working directory
- ไม่สร้างทับ directory ที่มีอยู่
- ใช้ `git worktree list` ก่อนสร้างเพื่อตรวจซ้ำ

### 2. Branch Naming

- ใช้ชื่อ branch ที่สื่อความหมาย
- ถ้า branch ใหม่ ต้องระบุ base branch
- ไม่ใช้ชื่อ branch ซ้ำกับ branch ที่มีอยู่

### 3. No Uncommitted Changes

- แนะนำให้ commit หรือ stash เปลี่ยนแปลงก่อนสร้าง worktree ถ้าต้องการ base ทีสะอาด
- ถ้าไม่ commit → ระบุให้ user ทราบว่า worktree ใช้ base branch ปัจจุบัน

### 4. Cleanup

- ถ้าสร้างผิด → ใช้ `/cleanup-worktree` เพื่อลบ
- ไม่ลบ worktree โดยตรงเพราะอาจทิ้ง lock หรือ tracking

## Expected Outcome

- worktree ใหม่ถูกสร้างใน root ของ workspace
- branch ทีเกี่ยวข้องถูกต้อง
- `git worktree list` แสดง worktree ใหม่
- ไม่มี data loss หรือ directory ทับซ้อน
