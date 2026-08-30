---
name: use-git-worktrees
description: "ใช้ git worktrees ครบวงจร: สร้าง ทำงาน merge กลับ และ cleanup"
argument-hint: "[branch-name] [base-branch]"
related:
  - list-git-worktree
  - delete-git-worktree
  - cleanup-worktree
  - resolve-merge-conflicts
  - report-table
  - suggest-next-action
---

## Goal

ใช้ git worktrees ครบวงจร: สร้าง worktree ใน `worktrees/` ที root ทำงานบน branch คู่ขนาน แล้ว merge กลับเข้า branch ต้นทางเมื่องานเสร็จ

## Scope

ใช้สำหรับ git repository ที่ต้องการทำงานหลาย branches พร้อมกันโดยไม่กระทบ main working tree ครอบคลุมตั้งแต่สร้าง worktree ทำงาน merge กลับ และ cleanup

## Execute

### 0. Setup

> Goal: ตรวจสอบ git worktrees พร้อมใช้งาน

1. ตรวจสอบ git: `git --version` (แนะนำ 2.15+ สำหรับ worktree ทีเสถียร)
2. ถ้ายังไม่มี git → ติดตั้งตาม OS:
   - macOS: `mise use -g git` หรือ `brew install git`
   - Windows: `winget install Git.Git` หรือ `scoop install git`
   - Linux: `apt install git`
3. ตรวจสอบ repository มี remote ทีถูกต้อง: `git remote -v`
4. Verify worktree: `git worktree list`

### 1. Create Worktree

> Goal: สร้าง worktree สำหรับ branch ใหม่

1. หา project root ด้วย `git rev-parse --show-toplevel`
2. สร้าง `worktrees/` directory ที root ถ้ายังไม่มี
3. รับ `[branch-name]` จาก argument หรือถาม user
4. รับ `[base-branch]` ถ้ามี ถ้าไม่มีใช้ branch ปัจจุบัน
5. ตรวจสอบ working tree สะอาดหรือระบุให้ user ทราบ
6. รัน `git worktree add worktrees/<branch-name> -b <branch-name> <base-branch>`
7. ตรวจสอบด้วย `git worktree list`

### 2. Do Work In Worktree

> Goal: ทำงานใน worktree จนเสร็จ

1. เปลี่ยน directory ไปยัง `worktrees/<branch-name>/`
2. ทำงานตาม task ทีได้รับมอบหมาย
3. รัน checks/tests ตามเกณฑ์ของ project
4. commit การเปลี่ยนแปลงใน worktree
5. ถ้า base branch มีการเปลี่ยนแปลงใหม่ → `git pull --rebase` หรือ `git merge origin/<base-branch>`

### 3. Prepare To Merge Back

> Goal: เตรียม merge กลับ branch ต้นทาง

1. รัน `git fetch` เพื่ออัปเดต remote refs
2. ใน worktree ตรวจสอบ `git status` ว่าไม่มี uncommitted changes
3. ระบุ target branch: `main`, `master` หรือ base branch เดิม
4. ถ้ามีการเปลี่ยนแปลงใน target branch → rebase หรือ merge ก่อน

### 4. Merge Back

> Goal: รวมงานกลับเข้า branch ต้นทาง

1. cd ไปยัง main working tree หรือ worktree ที target branch
2. `git switch <target-branch>`
3. รัน `git status` ให้สะอาด
4. `git merge <feature-branch>`
5. ถ้ามี conflict → ใช้ `/resolve-merge-conflicts`
6. ถ้าต้องการ squash → `git merge --squash <feature-branch>`
7. ถ้าต้องการ rebase → rebase ใน feature worktree ก่อน merge

### 5. Verify Merge

> Goal: ยืนยัน merge ถูกต้อง

1. รัน `git log --oneline -5`
2. รัน `git diff <target-branch>~1..<target-branch>`
3. รัน `git status`
4. รัน tests/lint/typecheck ถ้ามี
5. ถ้าทุกอย่างผ่าน → commit ถ้า squash merge ยังไม่ commit

### 6. Cleanup

> Goal: ลบ worktree หลัง merge ถ้าไม่ใช้

1. ถ้า merge สำเร็จ → ลบ worktree ด้วย `git worktree remove worktrees/<branch-name>`
2. ถ้า directory ยังอยู่ → ลบ directory ด้วย
3. รัน `git worktree prune`
4. ถ้าต้องการ push → ใช้ `git push` (ไม่ push โดยอัตโนมัติ)

### 7. Report

> Goal: สรุปผล

1. ใช้ `/report-table` แสดง: Worktree Path, Branch, Target Branch, Merge Status, Cleanup Status
2. ทำ `/suggest-next-action`

## Rules

### 1. Worktree Directory Structure

- สร้าง worktree ใน `worktrees/<branch-name>/` ที project root
- ใช้ชื่อ directory ตรงกับ branch name
- หลีกเลี่ยงชื่อทีซับซ้อนหรือมี spaces

### 2. Working Tree Clean

- ต้อง commit หรือ stash uncommitted changes ก่อน merge
- ไม่ merge branch ทียังมี uncommitted changes
- ตรวจสอบ status ก่อนทุกขั้นตอนสำคัญ

### 3. No Force Merge

- ไม่ force push โดยไม่ได้รับ user confirmation
- ไม่ merge ถ้า CI หรือ test ล้มเหลวโดยไม่ได้รับการยืนยัน
- ถ้ามี conflict → หยุดและแก้ก่อน continue

### 4. Merge Strategy

- ใช้ fast-forward หรือ merge commit ตาม project conventions
- ถ้า project ใช้ squash merge → `git merge --squash`
- ถ้า project ใช้ rebase → rebase ก่อน merge

### 5. Cleanup

- ลบ worktree หลัง merge ถ้าไม่ใช้งานต่อ
- รัน `git worktree prune` เพื่อลบ tracking ทีตกค้าง
- ไม่ลบ worktree โดยตรงเกินไปก่อน `git worktree remove`

- ใช้ /list-git-worktree ถ้าจำเป็น
- ใช้ /delete-git-worktree ถ้าจำเป็น
- ใช้ /cleanup-worktree ถ้าจำเป็น

## Expected Outcome

- Worktree ถูกสร้างใน `worktrees/<branch-name>/`
- งานถูกทำและ commit บน feature branch
- feature branch ถูก merge กลับ target branch อย่างปลอดภัย
- history สะอาดตาม project conventions
- worktree ถูกลบและ prune หลัง merge ถ้าไม่ใช้งานต่อ
- ไม่มี uncommitted changes หรือ conflict ค้าง
