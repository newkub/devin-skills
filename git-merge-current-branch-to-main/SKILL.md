---
name: git-merge-current-branch-to-main
description: Merge branch ปัจจุบันเข้า main หรือ default branch
triggers:
  - user
  - model
related:
  - follow-git
  - follow-git-branch
  - idea-merge
---

## Goal

รวมงานจาก branch ปัจจุบันเข้าสู่ default branch อย่างปลอดภัย

## Scope

ใช้เมื่อ feature/bugfix branch พร้อม merge

## Execute

### 1. Prepare

1. ตรวจสอบว่าอยู่บน feature branch
2. fetch ล่าสุดจาก remote
3. รีวิว commits และ diff
4. รัน tests บน feature branch

### 2. Update Main

1. `git switch main`
2. `git pull origin main`
3. กลับมา feature branch
4. `git rebase main` หรือ `git merge main` เพื่อ resolve conflicts

### 3. Merge

1. `git switch main`
2. `git merge --no-ff <feature-branch>` (หรือ fast-forward/squash ตาม convention)
3. แก้ไข conflicts ถ้ามี
4. รัน tests หลัง merge

### 4. Push And Cleanup

1. `git push origin main`
2. ลบ feature branch ถ้า merge เสร็จ
3. อัปเดท PR/issue ถ้ามี

## Rules

- ไม่ force push main
- รองรับ CI checks ก่อน merge
- ใช้ `--no-ff` สำหรับ feature branch ตาม convention
- ลบ branch หลัง merge

## Expected Outcome

- Current branch ถูก merge ใน main
- Main ทำงานได้
- Branch ถูกลบหรือเก็บตาม policy
