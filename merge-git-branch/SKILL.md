---
name: merge-git-branch
description: Merge feature branch เข้า target branch ด้วย no-ff merge commit
argument-hint: "<feature-branch> [target-branch]"
related:
  - resolve-merge-conflicts
  - git-commit
  - git-push
---

## Goal

Merge feature branch เข้า target branch ด้วย `--no-ff` merge commit เพื่อรักษา branch history และ push ไป remote

## Scope

ใช้เมื่อ feature branch พร้อม merge เข้า target branch (ค่าเริ่มต้น `main`) — ครอบคลุม pre-merge validation, merge execution, push และ post-merge cleanup ไม่รวม squash merge (ดู `refactor-commit`) หรือ file merge (ดู `merge-in`)

## Execute

### 1. Pre-Merge Check

> Goal: ยืนยันว่าพร้อม merge ไม่มี conflict หรือ uncommitted changes

1. รับ `<feature-branch>` จาก argument
2. รับ `[target-branch]` จาก argument ถ้าไม่มีใช้ `main`
3. ทำ `git branch --show-current` เพื่อดู current branch
4. ทำ `git status` เพื่อยืนยันว่า working tree clean
5. ทำ `git log --oneline <target-branch>..<feature-branch>` เพื่อดู commits ที่จะ merge
6. ทำ `git log --oneline origin/<target-branch>..<target-branch>` เพื่อดูว่า local target ตาม remote หรือไม่
7. ถ้ามี uncommitted changes → stop และ report
8. ถ้า local target นำหน้า origin → แจ้ง user ว่าจะ push รวมด้วย

### 2. Switch To Target Branch

> Goal: ย้ายไป target branch ก่อน merge

1. ทำ `git checkout <target-branch>` หรือ `git switch <target-branch>`
2. ทำ `git pull --ff-only origin <target-branch>` เพื่อดึง latest target branch
3. ถ้า pull มี conflict → stop และ report ให้ user แก้ manually

### 3. Merge Feature Branch

> Goal: ทำ no-ff merge เพื่อสร้าง merge commit

1. ทำ `git merge --no-ff <feature-branch> -m "Merge branch '<feature-branch>' into '<target-branch>'"`
2. ถ้ามี conflicts:
   - ทำ `git status` เพื่อดู conflicted files
   - แจ้ง user ให้แก้ conflicts
   - หลังแก้แล้ว ทำ `git add <file>` และ `git commit`
3. ถ้า merge สำเร็จ → บันทึก merge commit hash

### 4. Validate Merge

> Goal: ยืนยันว่า merge ถูกต้อง

1. ทำ `git log --oneline -5`
2. ทำ `git diff <feature-branch>..<target-branch> --stat` เพื่อยืนยันว่าไม่มี unexpected changes
3. รัน `bun run typecheck` หรือ `bun run build` ถ้า project มี (best-effort)
4. ถ้า validation ไม่ผ่าน → ทำ `git reset --hard ORIG_HEAD` เพื่อ rollback merge และ report

### 5. Push Target Branch

> Goal: push target branch ไป remote

1. ทำ `git push origin <target-branch>`
2. ถ้า push ถูกปฏิเสธ (non-fast-forward) → ทำ `git pull --rebase origin <target-branch>` แล้ว push ใหม่
3. บันทึก push result

### 6. Post-Merge Cleanup

> Goal: ลบ feature branch ที่ merge แล้ว

1. ทำ `git branch --merged <target-branch>` เพื่อยืนยันว่า feature branch ถูก merge
2. ทำ `git branch -d <feature-branch>` เพื่อลบ local branch
3. ทำ `git push origin --delete <feature-branch>` เพื่อลบ remote branch
4. ทำ `git remote prune origin` เพื่อ clean tracking refs

## Rules

### 1. Safety

- ใช้ `--no-ff` เสมอเพื่อรักษา merge history
- ตรวจ working tree clean ก่อน merge
- ถ้ามี conflict → หยุดและแจ้ง user แก้ manually
- ใช้ `git reset --hard ORIG_HEAD` เพื่อ rollback ถ้า validation ไม่ผ่าน
- ห้าม force push โดยไม่ได้รับอนุญาต

### 2. Branch Protection

- ห้าม merge branch ที่ยังไม่ผ่าน CI (ถ้ามี)
- ตรวจ `origin/<target-branch>` ล่าสุดก่อน merge
- ถ้า local target นำหน้า origin → แจ้ง user ก่อน push รวม

### 3. Cleanup

- ลบ feature branch หลัง merge เสมอ (local + remote)
- ใช้ `git branch -d` (safe delete) ไม่ใช้ `-D`
- ทำ `git remote prune origin` หลังลบ remote branch

## Expected Outcome

- Feature branch ถูก merge เข้า target branch ด้วย `--no-ff` merge commit
- `<target-branch>` ถูก push ไป remote สำเร็จ
- Feature branch ถูกลบจาก local และ remote
- Working tree clean หลัง merge
- ไม่มี data loss หรือ conflict ค้าง
