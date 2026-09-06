---
name: merge-all-branch-by-me-to-main
description: Merge เฉพาะ branch ที่ user สร้างเข้า main แล้วลบ branch เก่าทั้งหมด ให้เหลือเฉพาะ main
argument-hint: "[--dry-run] [--remote] [--force-unmerged]"
related:
  - list-git-branch
  - merge-git-branch
  - delete-git-branch
  - cleanup-git-branch
  - resolve-merge-conflicts
  - git-push
  - git-commit
  - follow-git-flow
  - follow-tool-git
  - report-table
  - resolve-errors
  - ask-me
---

## Goal

Merge เฉพาะ branch ที่ `git config user.name` / `user.email` หรือ committer สร้างเข้า `main` ตามลำดับ แล้วลบ branch เก่าทั้งหมดให้เหลือเฉพาะ `main`

## Scope

ใช้เมื่อต้องรวม branches ที่ตัวเองสร้างกลับ `main` และทำความสะอาด repo — เป็น destructive workflow ต้องมี dry-run และ user confirmation ก่อนลบจริง ไม่รวมการ resolve PR บน remote (ใช้ `/merge-github-pr` หรือ `/resolve-github-pr`)

หากต้องการ merge branch ที่ไม่ใช่ของตัวเอง → ต้องตรวจสอบเจ้าของ branch และขออนุญาตก่อน ไม่มี skill auto-merge ทั้งหมดให้ใช้โดย default

## Execute

### 1. Inventory Branches

> Goal: รู้ว่ามี branch อะไรบ้างและ branch ไหนเป็นของ user

1. ทำ `/list-git-branch` หรือ `git branch -a` เก็บรายชื่อทั้งหมด
2. ระบุ user identity จาก `git config user.name` / `user.email` หรือ `gh auth status`
3. ตรวจ branches ที่ merged แล้วด้วย `git branch --merged main`
4. ตรวจ unmerged branches ด้วย `git branch --no-merged main`
5. กรองเฉพาะ branches ที่เป็น user: branch tip หรือ commit ล่าสุดมี author/committer ตรงกับ user
   - ใช้ `git log -1 --format='%an <%ae>' <branch>` เปรียบเทียบกับ `git config user.name` / `user.email`
   - ถ้าไม่ชัดเจน ให้ดู commit ส่วนใหญ่บน branch ว่ามาจาก user หรือไม่

### 2. Preflight Safety Checks

> Goal: ยืนยัน repo พร้อมก่อน merge

1. ตรวจ working tree clean ด้วย `git status --porcelain` — ถ้ามี uncommitted changes → หยุดและแจ้ง
2. `git switch main` แล้ว `git pull` ให้ main เป็นปัจจุบัน
3. ตรวจว่า remote `main` ไม่ diverge จาก local

### 3. Dry Run Plan

> Goal: แสดงแผนก่อนทำจริง

1. สร้างตาราง: branch → commits ahead/behind → merged? → created by → action (merge/delete/skip)
2. ทำ `/report-table` แสดง plan พร้อม branches ที่จะถูกลบ
3. ถ้ามี unmerged branches → แจ้งว่าจะพยายาม merge และจะ conflict ตรงไหน
4. ทำ `/ask-me` ให้ user ยืนยันก่อนดำเนินการ

### 4. Merge Branches Into Main

> Goal: merge branch ของ user เข้า main ตามลำดับความเสี่ยง

1. เรียง branches: merged-already → fast-forward-able → unmerged (เสี่ยง conflict น้อย → มาก)
2. ทำ `/merge-git-branch` หรือ `git merge <branch>` ทีละ branch — ใช้ `--no-ff` ถ้า project ต้องการ history
3. ถ้า conflict → ทำ `/resolve-merge-conflicts` หรือหยุดและ report branch นั้น
4. หลังแต่ละ merge ให้ verify build/test ตาม `AGENTS.md` ถ้ากำหนดไว้

### 5. Verify Main

> Goal: main ต้องใช้งานได้หลัง merge ครบ

1. รัน tests/build ตาม project conventions (`/run-verify` หรือเทียบเท่า)
2. ถ้า fail → แก้ด้วย `/resolve-errors` หรือ rollback merge ที่ทำให้พัง
3. ยืนยัน main มี commits ของทุก branch ที่ต้องการ

### 6. Delete Old Branches

> Goal: ลบ branch เก่าของ user หลัง merge สำเร็จ

1. ลบ local branches ที่ merged แล้วด้วย `git branch -d <branch>` — ใช้ `/delete-git-branch` หรือ `/cleanup-git-branch`
2. unmerged branches ที่ merge สำเร็จแล้ว → `git branch -d` ได้; ที่ยังไม่ merge → ห้ามลบเว้นแต่ user ยืนยัน `--force-unmerged`
3. ถ้า `--remote` → ลบ remote branches ด้วย `git push origin --delete <branch>` เฉพาะที่ merged และยืนยันแล้ว
4. prune stale remote refs ด้วย `git fetch --prune`

### 7. Finalize And Report

> Goal: repo เหลือแค่ main

1. `git branch` ยืนยันเหลือเฉพาะ `main`
2. ถ้าต้องการ sync remote → `/git-push` หรือ `git push origin main`
3. ทำ `/report-table` สรุป: merged, deleted, skipped, conflicts, remaining branches

## Rules

### 1. Author Filter

- merge ได้เฉพาะ branch ที่ `git log -1` ของ branch มี author/committer ตรงกับ `git config user.name` / `user.email`
- ถ้า branch ไม่มี identity ของ user ชัดเจน → skip หรือถามก่อน
- ห้าม merge หรือลบ branch ที่คนอื่นสร้างโดยไม่มีการยืนยันแยก

### 2. Destructive Safety

- บังคับ dry-run + `/ask-me` ก่อน merge/delete จริงเสมอ
- ห้าม `git branch -D` เว้นแต่ user ยืนยัน `--force-unmerged`
- ห้ามลบ `main`, protected branches หรือ current branch
- ห้ามลบ remote branches โดยไม่ระบุ `--remote` และยืนยันแยก

### 3. No Data Loss

- ถ้า branch มี commits ที่ยังไม่ merge → ต้องแจ้ง user ไม่ลบเอง
- หลังลบทุก branch ต้อง recoverable ผ่าน `git reflog`
- ห้าม force-push `main`

### 4. Order And Atomicity

- merge ทีละ branch
- ถ้า merge ใดพัง → หยุดและ report
- ลบ branches เฉพาะหลัง main verified ผ่าน

## Expected Outcome

- ทุก branch ที่ user สร้าง merge เข้า `main` สำเร็จ หรือมีเหตุผลชัดเจน
- Branches เก่าของ user ถูกลบตามที่ยืนยัน เหลือเฉพาะ `main`
- `main` ผ่าน verification และ recoverable ผ่าน reflog
- รายงานสรุป merged/deleted/skipped พร้อม evidence
