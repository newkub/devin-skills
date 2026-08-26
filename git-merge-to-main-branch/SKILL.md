---
name: git-merge-to-main-branch
description: Merge feature branch เข้า main ด้วย no-ff merge commit
---

## Goal

Merge feature branch เข้า `main` ด้วย `--no-ff` merge commit เพื่อรักษา branch history และ push ไป remote

## Scope

ใช้เมื่อ feature branch พร้อม merge เข้า `main` — ครอบคลุม pre-merge validation, merge execution, push และ post-merge cleanup ไม่รวม squash merge (ดู `refactor-commit`) หรือ file merge (ดู `merge-files-in`)

## Execute

### 1. Pre-Merge Check

> Goal: ยืนยันว่าพร้อม merge ไม่มี conflict หรือ uncommitted changes

1. ทำ `git branch --show-current` เพื่อดู current branch
2. ทำ `git status` เพื่อยืนยันว่า working tree clean
3. ทำ `git log --oneline main..HEAD` เพื่อดู commits ที่จะ merge
4. ทำ `git log --oneline origin/main..main` เพื่อดูว่า local main ตาม remote หรือไม่
5. ถ้ามี uncommitted changes → stop และ report
6. ถ้า local main นำหน้า origin/main → แจ้ง user ว่าจะ push รวมด้วย

### 2. Switch To Main

> Goal: ย้ายไป main branch ก่อน merge

1. ทำ `git checkout main` หรือ `git switch main`
2. ทำ `git pull --ff-only origin main` เพื่อดึง latest main
3. ถ้า pull มี conflict → stop และ report ให้ user แก้ manually

### 3. Merge Feature Branch

> Goal: ทำ no-ff merge เพื่อสร้าง merge commit

1. ทำ `git merge --no-ff <feature-branch> -m "Merge branch '<feature-branch>'"`
2. ถ้ามี conflicts:
   - ทำ `git status` เพื่อดู conflicted files
   - แจ้ง user ให้แก้ conflicts
   - หลังแก้แล้ว ทำ `git add <file>` และ `git commit`
3. ถ้า merge สำเร็จ → บันทึก merge commit hash

### 4. Validate Merge

> Goal: ยืนยันว่า merge ถูกต้อง

1. ทำ `git log --oneline -5` เพื่อดู merge commit
2. ทำ `git diff <feature-branch>..main --stat` เพื่อยืนยันว่าไม่มี unexpected changes
3. รัน `bun run typecheck` หรือ `bun run build` ถ้า project มี (best-effort)
4. ถ้า validation ไม่ผ่าน → ทำ `git reset --hard ORIG_HEAD` เพื่อ rollback merge และ report

### 5. Push Main

> Goal: push main ไป remote

1. ทำ `git push origin main`
2. ถ้า push ถูกปฏิเสธ (non-fast-forward) → ทำ `git pull --rebase origin main` แล้ว push ใหม่
3. บันทึก push result

### 6. Post-Merge Cleanup

> Goal: ลบ feature branch ที่ merge แล้ว

1. ทำ `git branch --merged main` เพื่อยืนยันว่า feature branch ถูก merge
2. ทำ `git branch -d <feature-branch>` เพื่อลบ local branch
3. ทำ `git push origin --delete <feature-branch>` เพื่อลบ remote branch
4. ทำ `git remote prune origin` เพื่อ clean tracking refs

## Rules

### 1. Safety

- ใช้ `--no-ff` เสมอเพื่อรักษา merge history
- ตรวจ working tree clean ก่อน merge
- ถ้ามี conflict → หยุดและแจ้ง user แก้ manually
- ใช้ `git reset --hard ORIG_HEAD` เพื่อ rollback ถ้า validation ไม่ผ่าน
- ห้าม force push main โดยไม่ได้รับอนุญาต

### 2. Branch Protection

- ห้าม merge branch ที่ยังไม่ผ่าน CI (ถ้ามี)
- ตรวจ `origin/main` ล่าสุดก่อน merge
- ถ้า local main นำหน้า origin/main → แจ้ง user ก่อน push รวม

### 3. Cleanup

- ลบ feature branch หลัง merge เสมอ (local + remote)
- ใช้ `git branch -d` (safe delete) ไม่ใช้ `-D`
- ทำ `git remote prune origin` หลังลบ remote branch

## Expected Outcome

- Feature branch ถูก merge เข้า main ด้วย `--no-ff` merge commit
- `main` ถูก push ไป `origin/main` สำเร็จ
- Feature branch ถูกลบจาก local และ remote
- Working tree clean หลัง merge
- ไม่มี data loss หรือ conflict ค้าง
