---
name: merge-worktree-to-main
description: Merge branch จาก worktree เข้า main branch อย่างปลอดภัย
---

## Goal

Merge branch ที่ทำงานใน worktree เข้า `main` branch โดยตรวจสอบความถูกต้อง ไม่ทำลาย history และส่งมอบได้สะอาด

## Scope

ใช้สำหรับ git repository ที่ใช้ worktree แล้วต้องการ merge feature branch เข้า `main` หรือ `master`

## Execute

### 1. Identify Branches

> Goal: ระบุ worktree branch และ target branch

1. รัน `git worktree list` เพื่อดู worktrees ทั้งหมด
2. ระบุ worktree เป้าหมายและ branch ของมัน
3. ระบุ target branch: `main` หรือ `master` (ถ้าไม่ใช่ให้ระบุ)
4. ตรวจสอบ status ของ worktree เป้าหมาย: ไม่ควรมี uncommitted changes

### 2. Update Branches

> Goal: ดึง changes ล่าสุดจาก remote

1. รัน `git fetch` เพื่ออัปเดต remote refs
2. ถ้า main มีการเปลี่ยนแปลงใน remote → อัปเดต local main
3. ใน worktree เป้าหมาย: `git pull --rebase` หรือ `git merge origin/<branch>` เพื่อ sync กับ remote ถ้าจำเป็น
4. ตรวจสอบว่า feature branch ไม่มีการเปลี่ยนแปลงที่ค้างอยู่

### 3. Prepare Main Worktree

> Goal: ย้ายไปยัง main worktree เพื่อ merge

1. cd ไปยัง main working directory หรือ worktree ที่ main branch
2. รัน `git checkout main`
3. ตรวจสอบ `git status` ว่า main worktree สะอาด
4. ถ้าไม่สะอาด → แก้ไขหรือ commit/stash ก่อน

### 4. Merge Branch

> Goal: รวม branch เข้า main

1. รัน `git merge <feature-branch>`
2. ถ้าเป็น fast-forward → ตรวจสอบและ continue
3. ถ้ามี merge conflict → ทำ `/resolve-merge-conflicts`
4. ถ้าต้องการ squash merge → ใช้ `git merge --squash <feature-branch>` แล้ว commit
5. ถ้าต้องการ rebase then merge → ใช้ `git rebase main` ใน feature worktree ก่อน

### 5. Verify And Push

> Goal: ยืนยัน merge และส่งขึ้น remote

1. รัน `git log --oneline -5` เพื่อตรวจสอบ history
2. รัน `git diff main~1..main` เพื่อตรวจสอบ changes
3. รัน `git status` เพื่อตรวจสอบว่าไม่มี leftover changes
4. ถ้าต้องการ push → รัน `git push origin main`
5. ถ้ามี CI → รอและตรวจสอบ status

### 6. Cleanup Worktree (optional)

> Goal: ลบ worktree หลัง merge ถ้าไม่ใช้

1. ถ้า user ยืนยัน → ทำ `/cleanup-worktree` เพื่อลบ feature worktree
2. ถ้าไม่ลบ → report path และ branch ที merge แล้ว

## Rules

### 1. No Force Merge

- ไม่ force push โดยไม่ได้รับ user confirmation
- ไม่ merge branch ที่ยังมี uncommitted changes
- ไม่ merge ถ้า CI หรือ test ล้มเหลวโดยไม่ได้รับการยืนยัน

### 2. Conflict Resolution

- ถ้า merge conflict → หยุดและแก้ก่อน continue
- ใช้ `/resolve-merge-conflicts` หรือ `/merge-branches` ถ้ามี
- ตรวจสอบ conflict resolution ด้วย tests หรือ typecheck ถ้ามี

### 3. Keep History Clean

- แนะนำ fast-forward หรือ merge commit ตาม project conventions
- ถ้า project ใช้ squash merge → ใช้ `git merge --squash`
- ถ้า project ใช้ rebase → rebase ก่อน merge

### 4. Verification

- ตรวจสอบ `git log` หลัง merge
- ตรวจสอบ `git status` ก่อน push
- ถ้ามี tests → รันก่อน push

## Expected Outcome

- feature branch ถูก merge เข้า main อย่างปลอดภัย
- history สะอาดตาม project conventions
- ไม่มี uncommitted changes หรือ conflict ค้าง
- ถ้าต้องการ push → สำเร็จโดยไม่ force
- รายงาน commits ที่ merge และ worktree ที่ลบหรือเหลือ
