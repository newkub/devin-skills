---
name: follow-git-flow
description: ตั้งค่า git flow ใน repo สร้าง `dev` branch, hooks, worktree convention และอัปเดต AGENTS.md
related:
  - create-dev-branch
  - follow-github
  - update-agents-md
  - ship
  - ship-github-issue
  - ship-release
  - report-table
  - suggest-next-action
---

## Goal

ตั้งค่า git flow ใน repo ทีมีอยู่: สร้าง `dev`, ตั้ง local hooks, worktree convention, อัปเดต `AGENTS.md` และตั้ง GitHub protection
`/follow-git-flow` ไม่ `git init`, ไม่ `git config --global`, ไม่ทำงานบน `main`

## Scope

ใช้ครั้งแรกเมื่อเริ่ม project หรือต้องการ reset git flow conventions
รองรับ solo และ team โดย block direct push ไป `main` ทัง local hooks และ GitHub protection

ถ้าต้องการแค่ remote GitHub setup → ใช้ `/follow-github`
ถ้าต้องการแค่ create `dev` → ใช้ `/create-dev-branch`

## Execute

### 1. Pre-flight

> Goal: ยืนยันว่าอยู่ใน git repo ทีมี `main`

1. ทำ `git rev-parse --git-dir`
2. ทำ `git branch --list main` หรือ `git branch --list master`
3. ถ้าไม่มี `main` หรือ `master` → stop และ report
4. ตรวจ `git status --porcelain` ต้องว่าง
5. ถ้าไม่ว่าง → ให้ user `/ship` ก่อน

### 2. Create dev Branch

> Goal: ให้ `dev` พร้อมเป้น integration branch

1. ทำ `/create-dev-branch`
2. ถ้า fail → stop และ report
3. `dev` ต้องพร้อมทั้ง local และ remote

### 3. Setup Local Hooks

> Goal: ป้องกัน direct work/push บน `main` ทัง local

1. สร้าง `.githooks/` directory ที root
2. สร้าง `.githooks/pre-commit`:
   ```sh
   #!/bin/sh
   branch=$(git rev-parse --abbrev-ref HEAD)
   if [ "$branch" = "main" ] || [ "$branch" = "master" ]; then
     echo "Do not commit directly on main. Use /ship-github-issue or /ship --cloud."
     exit 1
   fi
   exit 0
   ```
3. สร้าง `.githooks/pre-push`:
   ```sh
   #!/bin/sh
   while read local_ref local_sha remote_ref remote_sha; do
     if [ "$remote_ref" = "refs/heads/main" ] || [ "$remote_ref" = "refs/heads/master" ]; then
       echo "Direct push to main is not allowed. Use /ship-release."
       exit 1
     fi
   done
   exit 0
   ```
4. ทำ `git config --local core.hooksPath .githooks`
5. ทำ `git config --local core.filemode false` เพื่อไม่ให้ Windows ล็อก executable bit
6. ทำ `git update-index --chmod=+x .githooks/pre-commit .githooks/pre-push` เพื่อบันทึก executable bit ใน git index
7. บน Windows ถ้าไม่ใช้ Git Bash ให้ตรวจสอบว่า `sh.exe` จาก Git for Windows อยู่ใน PATH หรือใช้ `.githooks/pre-commit.ps1` / `pre-push.ps1` แทน

### 4. Setup Worktree Convention

> Goal: กำหนดโครงสร้าง worktree สำหรับ issue branches

1. สร้าง `worktrees/` directory ที root ถ้ายังไม่มี
2. บันทึก convention: issue branch ชื่ `dev/<number>` worktree อยู่ที `worktrees/dev-<number>/`
3. ไม่สร้าง worktree ในขั้นตอนนี้

### 5. Setup GitHub

> Goal: ตั้ง branch protection และ GitHub metadata

1. ทำ `/follow-github`
2. ถ้า `follow-github` fail → report และ stop
3. ยืนยันว่า `main` และ `dev` ถูก protect

### 6. Update AGENTS.md

> Goal: เขียน ship-flow section ลง `AGENTS.md`

1. ทำ `/update-agents-md` เพื่อให้ `AGENTS.md` อัปเดต
2. เพิ่มหรืออัปเดต section `### Ship Flow` ใน `AGENTS.md` ด้วยเนื้อหา:
   - Branch model: `main` (production), `dev` (staging), `dev/<n>` (short-lived issue branches)
   - Flow: `dev/<n>` → `dev` → `main`
   - Worktree: `worktrees/dev-<n>/`
   - Local hooks: block `main` commits/pushes
   - GitHub protection: PR + status checks on `main`, status checks on `dev`
   - Skill mapping: `/ship`, `/ship-github-issue`, `/ship-release`, `/ship-continuous`
3. ถ้า `AGENTS.md` ไม่รองรับภาษาไทย → เขียนภาษาอังกฤษตาม convention

### 7. Report

> Goal: สรุปผลการ setup

1. ใช้ `/report-table` สรุป: `dev` branch, hooks, worktree, GitHub protection, AGENTS.md
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

- issue branch ใช้ `dev/<number>`
- ไม่ใช้ `issue/<number>` หรือ `feature/*`
- `main` และ `dev` เป้น long-lived branches

### 4. Safety

- ตรวจ working tree clean ก่อน setup
- ไม่ force push
- ไม่ overwrite `.github` หรือ `.githooks` โดยไม่แจ้ง
- ถ้า `gh` ไม่พร้อม → `/follow-github` จะ report

### 5. Idempotent

- รันได้ซ้ำโดยไม่เกิด side effects
- ถ้า `dev` มีอยู่ → ไม่สร้างซ้ำ
- ถ้า hooks มีอยู่ → อัปเดตเฉพาะส่วนที่ขาด

## Expected Outcome

- `dev` branch ถูกสร้างจาก `main` และ push ไป remote
- `.githooks/pre-commit` และ `.githooks/pre-push` block `main`
- `core.hooksPath` ตั้งเป้น `.githooks`
- `worktrees/` directory พร้อม
- GitHub `main` และ `dev` ถูก protect
- `AGENTS.md` มี `### Ship Flow` ครบถ้วน
- ไม่เกิด git init หรือ global config
- มีรายงานผลและ next action
