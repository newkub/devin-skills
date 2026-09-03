---
name: follow-git-flow
description: ตั้งค่า git flow ใน repo ด้วย integration branch, hooks, worktree convention และอัปเดต AGENTS.md
related:
  - follow-github
  - update-agents-md
  - ship
  - report-table
  - suggest-next-action
---

## Goal

ตั้งค่า git flow ใน repo ทีมีอยู่: สร้าง integration branch, ตั้ง local hooks, worktree convention, อัปเดต `AGENTS.md` และตั้ง GitHub protection
`/follow-git-flow` ไม่ `git init`, ไม่ `git config --global`, ไม่ทำงานบน `main`

## Scope

ใช้ครั้งแรกเมื่อเริ่ม project หรือต้องการ reset git flow conventions
รองรับ solo และ team โดย block direct push ไป `main` ทัง local hooks และ GitHub protection

ถ้าต้องการแค่ remote GitHub setup → ใช้ `/follow-github`
ถ้าต้องการแค่ create integration branch → ทำตามขั้นตอน Create Integration Branch ข้างล่าง

## Execute

### 1. Pre-flight

> Goal: ยืนยันว่าอยู่ใน git repo ทีมี `main`

1. ทำ `git rev-parse --git-dir`
2. ทำ `git branch --list main` หรือ `git branch --list master`
3. ถ้าไม่มี `main` หรือ `master` → stop และ report
4. ตรวจ `git status --porcelain` ต้องว่าง
5. ถ้าไม่ว่าง → ให้ user `/ship` ก่อน

### 2. Determine Integration Branch

> Goal: รู้ชื่อ integration branch ตาม project conventions

1. อ่าน `AGENTS.md` ถ้ามี `### Ship` หรือ `### Ship Flow`
2. ถ้าไม่มี → ถาม user ด้วย `/ask-me` หรือใช้ default ว่า `integration`
3. บันทึกชื่อ integration branch เป็น `<integration-branch>`

### 3. Create Integration Branch

> Goal: ให้ integration branch พร้อมเป้น staging/integration branch

1. ตรวจ `git branch --list <integration-branch>`
2. ถ้ามีใน local → ใช้ `git switch <integration-branch>` แล้วไป Ensure Remote
3. ถ้าไม่มีใน local แต่มีบน remote → ใช้ `git switch -c <integration-branch> origin/<integration-branch>`
4. ถ้าไม่มีทั้งสอง → ใช้ `git switch -c <integration-branch> <base-branch>`
5. ทำ `git push -u origin <integration-branch>` เพื่อ ensure มีบน remote

### 4. Setup Local Hooks

> Goal: ป้องกัน direct work/push บน `main` ทัง local

1. สร้าง `.githooks/` directory ที root
2. สร้าง `.githooks/pre-commit`:
   ```sh
   #!/bin/sh
   branch=$(git rev-parse --abbrev-ref HEAD)
   if [ "$branch" = "main" ] || [ "$branch" = "master" ]; then
     echo "Do not commit directly on main. Use /ship."
     exit 1
   fi
   exit 0
   ```
3. สร้าง `.githooks/pre-push`:
   ```sh
   #!/bin/sh
   while read local_ref local_sha remote_ref remote_sha; do
     if [ "$remote_ref" = "refs/heads/main" ] || [ "$remote_ref" = "refs/heads/master" ]; then
       echo "Direct push to main is not allowed. Use /ship."
       exit 1
     fi
   done
   exit 0
   ```
4. ทำ `git config --local core.hooksPath .githooks`
5. ทำ `git config --local core.filemode false` เพื่อไม่ให้ Windows ล็อก executable bit
6. ทำ `git update-index --chmod=+x .githooks/pre-commit .githooks/pre-push` เพื่อบันทึก executable bit ใน git index
7. บน Windows ถ้าไม่ใช้ Git Bash ให้ตรวจสอบว่า `sh.exe` จาก Git for Windows อยู่ใน PATH หรือใช้ `.githooks/pre-commit.ps1` / `pre-push.ps1` แทน

### 5. Setup Worktree Convention

> Goal: กำหนดโครงสร้าง worktree สำหรับ issue branches

1. สร้าง `worktrees/` directory ที root ถ้ายังไม่มี
2. บันทึก convention: issue branch ชื่ `<integration-branch>/<number>` worktree อยู่ที `worktrees/<integration-branch>-<number>/`
3. ไม่สร้าง worktree ในขั้นตอนนี้

### 6. Setup GitHub

> Goal: ตั้ง branch protection และ GitHub metadata

1. ทำ `/follow-github`
2. ถ้า `follow-github` fail → report และ stop
3. ยืนยันว่า `main` และ `<integration-branch>` ถูก protect

### 7. Update AGENTS.md

> Goal: เขียน ship section ลง `AGENTS.md`

1. ทำ `/update-agents-md` เพื่อให้ `AGENTS.md` อัปเดต
2. ถ้า `AGENTS.md` ไม่รองรับภาษาไทย → เขียนภาษาอังกฤษตาม convention

### 8. Report

> Goal: สรุปผลการ setup

1. ใช้ `/report-table` สรุป: integration branch, hooks, worktree, GitHub protection, AGENTS.md
2. ทำ `/suggest-next-action`

## Rules

### 1. No Global Git Config

- ไม่ `git init`
- ไม่ `git config --global`
- `core.hooksPath` ต้องใช้ `--local`

### 2. No Direct main Work

- ไม่ commit บน `main`
- ไม่ push ไป `main` โดยตรง
- local hooks ต้อง block ทัง `pre-commit` และ `pre-push`

### 3. Branch Naming

- issue branch ใช้ `<integration-branch>/<number>`
- ไม่ใช้ `issue/<number>` หรือ `feature/*`
- `main` และ `<integration-branch>` เป้น long-lived branches

### 4. Safety

- ตรวจ working tree clean ก่อน setup
- ไม่ force push
- ไม่ overwrite `.github` หรือ `.githooks` โดยไม่แจ้ง
- ถ้า `gh` ไม่พร้อม → `/follow-github` จะ report

### 5. Idempotent

- รันได้ซ้ำโดยไม่เกิด side effects
- ถ้า integration branch มีอยู่ → ไม่สร้างซ้ำ
- ถ้า hooks มีอยู่ → อัปเดตเฉพาะส่วนที่ขาด

## Expected Outcome

- integration branch ถูกสร้างจาก `main` และ push ไป remote
- `.githooks/pre-commit` และ `.githooks/pre-push` block `main`
- `core.hooksPath` ตั้งเป้น `.githooks`
- `worktrees/` directory พร้อม
- GitHub `main` และ `<integration-branch>` ถูก protect
- `AGENTS.md` มี `### Ship` หรือ `### Ship Flow` ครบถ้วน
- ไม่เกิด git init หรือ global config
- มีรายงานผลและ next action
