---
name: merge-git-branch
description: Merge feature branch เข้า target branch ด้วย no-ff merge commit
argument-hint: "<feature-branch|verify> [target-branch]"
related:
  - resolve-merge-conflicts
  - git-commit
  - git-push
  - refactor-commit
  - merge
---

## Goal

Merge feature branch เข้า target branch ด้วย `--no-ff` merge commit เพื่อรักษา branch history และ push ไป remote

## Scope

ใช้เมื่อ feature branch พร้อม merge เข้า target branch (ค่าเริ่มต้น `main`) — ครอบคลุม pre-merge validation, merge execution, push และ post-merge cleanup ไม่รวม squash merge (ดู `refactor-commit`) หรือ file merge (ดู `merge`)

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

1. ทำ `git switch <target-branch>`
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

### Workflows

> Goal: dispatch post-merge verification แยกจาก merge flow

| Argument | Workflow |
|----------|----------|
| `verify`, `verify-merge` | `workflows/verify-merge/SKILL.md` — merge commit ถูกต้อง, ไม่มี conflict residue, build/test ผ่าน |

1. ถ้า argument เป็น `verify` → อ่าน `workflows/verify-merge/SKILL.md` แล้วทำตาม flow — ไม่ merge ใหม่
2. ถ้าไม่ระบุ → ทำ Steps 1-6 ตามปกติ โดย Step 4 อ่าน workflow `verify-merge` มา execute

### 4. Validate Merge

> Goal: ยืนยันว่า merge ถูกต้อง

ทำตาม `workflows/verify-merge/SKILL.md` — ถ้า verdict `broken` → ทำ `git reset --hard ORIG_HEAD` เพื่อ rollback merge และ report

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

- ใช้ /resolve-merge-conflicts ถ้าจำเป็น
- ใช้ /git-commit ถ้าจำเป็น
- ใช้ /git-push ถ้าจำเป็น

## Merged Details

### verify-merge

##### Goal

ยืนยันหลัง merge ว่า merge commit ถูกต้อง ไม่มี conflict residue และ project ยัง build/test ผ่าน — เรียก standalone หลัง merge เสร็จหรือเมื่อสงสัยว่า merge สะอาดไหม

##### Scope

- ใช้เมื่อ `/merge-git-branch` dispatch มาที่ `verify` หรือเรียกหลัง merge
- ครอบคลุม: merge commit, conflict markers, tree state, build/test green, branch state
- Read-only: ตรวจสอบ — ไม่ re-merge หรือ reset

##### Execute

###### 1. Verify Merge Commit

> Goal: merge commit อยู่และถูก structure

1. `git log --oneline -5` — merge commit ล่าสุดมี 2 parents (`git cat-file -p HEAD` ดู `parent` lines)
2. `git diff <feature-branch>..<target> --stat` → ควรว่างเปล่า (merge ครบ)
3. flag ถ้า merge commit ไม่ใช่ `--no-ff` (parent เดียว) หรือ diff ยังเหลือ

###### 2. Check Conflict Residue

> Goal: ไม่มี conflict markers หลุมใน tree

1. `rg '^(<<<<<<<|=======|>>>>>>>)'` ทั้ง working tree — ต้องไม่เจอ
2. `git status` → clean, ไม่มี unmerged paths
3. `git diff --check` → ไม่มี whitespace/conflict artifacts

###### 3. Verify Project Still Green

> Goal: code หลัง merge ใช้งานได้

1. รัน `bun run typecheck` หรือ build ของ project (best-effort)
2. ถ้า merge แตะ critical paths → ทำ `/run-verify`
3. ถ้า fail → report พร้อมระบุ `git reset --hard ORIG_HEAD` เป็น rollback option — ไม่รันเอง

###### 4. Report

> Goal: สรุป merge health

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `clean` / `suspicious` / `broken` พร้อม rollback option ถ้า broken

##### Rules

- conflict marker พบจริง = broken — report ทันทีพร้อม rollback command
- ไม่ reset/revert ใน workflow นี้ — decision เป็นของ caller
- ระบุ merge commit hash ในรายงานเสมอ

##### Expected Outcome

- ยืนยัน merge สะอาด หรือรายการปัญหาพร้อม rollback option

## Expected Outcome

- Feature branch ถูก merge เข้า target branch ด้วย `--no-ff` merge commit
- `<target-branch>` ถูก push ไป remote สำเร็จ
- Feature branch ถูกลบจาก local และ remote
- Working tree clean หลัง merge
- ไม่มี data loss หรือ conflict ค้าง

