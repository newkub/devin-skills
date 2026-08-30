---
name: ship-release
description: Release branch ไปสู่ production โดย merge เข้า dev สร้าง PR ไป main และ release/deploy
argument-hint: "[issue-number]"
related:
  - ship-code
  - ship-local
  - ship-ci
  - ship-github-issue
  - create-dev-branch
  - follow-git-flow
  - follow-github
  - setup-package
  - setup-release
  - test-release
  - run-release
  - run-deploy
  - watch-cicd-and-resolve
  - report-table
  - suggest-next-action
---

## Goal

นำงานจาก branch ปัจจุบันไปสู่ production ตาม flow: `branch` → `dev` → `main` → release/deploy
`/ship-release` รวม merge เข้า `dev`, promote ไป `main`, release/deploy, และ cleanup

## Scope

ใช้เมื่อ branch ผ่าน cloud verify แล้วและต้องการ release/deploy บน production
รองรับการเริ่มจาก `dev/<number>`, `dev` หรือ `main`

ถ้าต้องการแค่ commit ใน local → ใช้ `/ship-local`
ถ้าต้องการ push + verify อย่างเดียว → ใช้ `/ship-ci`
ถ้าต้องการทำงานตาม issue ทั่งหมด → ใช้ `/ship-github-issue`

## Execute

### 1. Pre-flight

> Goal: เตรียมข้อมูลก่อน release

1. ทำ `git branch --show-current` เก็บเป็น `CURRENT_BRANCH`
2. ทำ `git status --porcelain` ต้องว่าง
3. ตรวจ issue number จาก argument หรือจาก `CURRENT_BRANCH` (`dev/<number>`)
4. บันทึก `ISSUE_NUMBER` เพื่อใช้ close issue
5. หา `REPO_ROOT` จาก `git worktree list` (path ทีไม่อยู่ใน `worktrees/`) หรือ `dirname` ของ `git rev-parse --git-common-dir`
6. ถ้า `dev` ยังไม่มี → ทำ `/create-dev-branch`

### 2. Ship To Cloud First

> Goal: ensure branch ปัจจุบันถูก push และผ่าน cloud verify

1. ทำ `/ship-ci`
2. ถ้า fail → stop และ report
3. ถ้า `CURRENT_BRANCH` คือ `dev` หรือ `main` → ข้าม merge step และไป step สร้าง PR หรือ release
4. `cd $REPO_ROOT` เพื่อทำ PR, release และ cleanup จาก main working tree

### 3. Merge dev/<number> Into dev

> Goal: merge issue branch เข้า `dev` ด้วย PR

1. สร้าง PR จาก `dev/<number>` ไป `dev`:
   ```bash
   gh pr create --head dev/<number> --base dev --fill
   ```
2. ดึง PR number ล่าสุด:
   ```bash
   PR_NUMBER=$(gh pr list --head dev/<number> --base dev --limit 1 --json number --jq '.[0].number')
   ```
   ถ้า `PR_NUMBER` ว่าง → retry สูงสุด 3 ครั้ง (รอ 2 วินาที) แล้วดึงใหม
3. รอ CI บน PR ผ่าน:
   ```bash
   gh pr checks $PR_NUMBER --watch
   ```
   ถ้า fail → หยุด และทำ `/resolve-errors` แล้ว retry
4. Merge PR:
   ```bash
   gh pr merge $PR_NUMBER --merge
   ```
5. ถ้า merge ไม่สำเร็จ → ทำ `/resolve-errors` แล้ว retry
6. `git fetch origin dev` เพื่ออัปเดต local `dev`

### 4. Promote dev To main

> Goal: merge `dev` เข้า `main` ผ่าน PR

1. ตรวจสอบว่า `dev` มี commits นำหน้า `main`:
   ```bash
   git log --oneline main..origin/dev
   ```
2. ถ้าไม่มี diff → ข้ามไป step Release
3. สร้าง PR จาก `dev` ไป `main`:
   ```bash
   gh pr create --head dev --base main --fill
   ```
4. ดึง PR number ล่าสุด:
   ```bash
   PR_NUMBER=$(gh pr list --head dev --base main --limit 1 --json number --jq '.[0].number')
   ```
   ถ้า `PR_NUMBER` ว่าง → retry สูงสุด 3 ครั้ง (รอ 2 วินาที) แล้วดึงใหม
5. รอ CI บน PR ผ่าน:
   ```bash
   gh pr checks $PR_NUMBER --watch
   ```
   ถ้า fail → หยุด และทำ `/resolve-errors` แล้ว retry
6. ตรวจ review:
   ```bash
   REVIEW=$(gh pr view $PR_NUMBER --json reviewDecision --jq '.reviewDecision')
   ```
   - ถ้า `REVIEW` = `CHANGES_REQUESTED` → stop และ report
   - ถ้า `REVIEW` = `REVIEW_REQUIRED` และ branch protection ต้องการ review → stop และ report
   - ถ้า `REVIEW` = `APPROVED` หรือไม่ต้องการ review → ไปขั้นตอนถัดไป
7. Merge PR:
   ```bash
   gh pr merge $PR_NUMBER --merge
   ```
8. ถ้า merge ไม่สำเร็จ → ทำ `/resolve-errors` แล้ว retry
9. `git fetch origin main` เพื่ออัปเดต local `main`

### 5. Release And Deploy

> Goal: release หรือ deploy บน `main`

1. ยืนยันว่าอยู่ใน `REPO_ROOT` หรือ worktree ที `main` ถูก checkout
2. ถ้า `main` ไม่ถูก checkout ที่ไหน → `git switch main` ใน `REPO_ROOT`
3. ถ้า `main` ถูก checkout ทีอื่น → `cd` ไป worktree นั้น
4. ตรวจ package manifest และ release config ก่อน release:
   - ถ้า `package.json`/`Cargo.toml` ขาด fields สำหรับ publish → `/setup-package`
   - ถ้าไม่มี release workflow หรือ release tool → `/setup-release`
5. `git pull origin main` เพื่ออัปเดต
6. รอ `main` CI ผ่านก่อน release/deploy:
   - หา `MAIN_SHA` จาก `git rev-parse main`
   - วนดึง `gh run list --branch main --limit 5 --json databaseId,headSha` จนกว่า `headSha == MAIN_SHA` (สูงสุด 10 รอบ)
   - ถ้าเจอ → `gh run watch <run-id>`
   - ถ้า fail → หยุด และทำ `/resolve-errors` แล้ว retry
7. ถ้า project ต้องการ release:
   1. ดึง version จาก `package.json` หรือ `Cargo.toml` หรือ `manifest.json` ตาม platform
   2. ถ้า `HEAD` ยังไม่มี tag → สร้าง annotated tag `v<version>` แล้ว `git push origin v<version>`
   3. ทำ `/test-release` ก่อน ถ้าผ่านค่อยทำ `/run-release`
8. ถ้า project ต้องการ deploy → ทำ `/run-deploy` แล้ว `/watch-cicd-and-resolve`
9. ถ้าไม่ต้องการ release/deploy → report และไป step Cleanup

### 6. Close Issue And Cleanup

> Goal: ปิด issue และลบ branch/worktree ทีหมดบทบาท

1. `cd $REPO_ROOT`
2. ถ้ามี `ISSUE_NUMBER` → `gh issue close <ISSUE_NUMBER>`
3. ตรวจ worktree ก่อนลบ:
   ```bash
   git -C worktrees/dev-<number> status --porcelain
   ```
   ถ้ามี uncommitted changes → stop และ report ให้ `/ship-ci` ใน worktree ก่อน
4. ลบ worktree ถ้ามี:
   ```bash
   git worktree remove worktrees/dev-<number>
   ```
   ถ้า worktree ไม่มี → ข้าม
5. ลบ local branch ถ้ามี (safe delete):
   ```bash
   git branch --list dev/<number> && git branch -d dev/<number>
   ```
   ถ้า fail เนื่องจากยังไม่ถูก merge → หยุดและ report
6. ลบ remote branch ถ้ายังเหลือ:
   ```bash
   git ls-remote --heads origin dev/<number> && git push origin --delete dev/<number>
   ```
7. `git remote prune origin`

### 7. Report

> Goal: สรุปผล release

1. ใช้ `/report-table` สรุป: branch, PRs, release/deploy, issue status, cleanup
2. ทำ `/suggest-next-action`

## Rules

### 1. No Direct main Merge

- ห้าม merge โดยตรงเข้า `main` โดยไม่ผ่าน PR
- งานต้องผ่าน `dev` ก่อนเข้า `main` (ห้าม hotfix โดยตรง)
- ถ้าเริ่มจาก `main` ให้ข้าม merge step และ release/deploy ถ้า `main` CI ผ่าน
- `main` ต้อง merge ผ่าน PR เท่านั้น

### 2. PR Discipline

- สร้าง PR ด้วย `gh pr create --fill` เพื่อใช้ commit messages
- merge ด้วย `gh pr merge --merge`
- ไม่ squash หรือ rebase โดยอัตโนมัติถ้า project ไม่ระบุ
- รอ CI ผ่านก่อน merge

### 3. No Force Push

- ไม่ใช้ `--force` หรือ `--force-with-lease`
- ถ้า push ถูก reject → ใช้ PR หรือ rebase

### 4. No Global Git Config

- ไม่ทำ `git init`
- ไม่ทำ `git config --global`
- ไม่เปลี่ยน global git settings

### 5. Branch State

- ต้อง `git status` ว่างก่อนเริ่ม
- ถ้ามี uncommitted changes → ให้ user `/ship-local` หรือ `/ship-ci` ก่อน
- ตรวจสอบ branch ก่อนสร้าง PR

### 6. Optional Release/Deploy

- release/deploy เกิดขึ้นตาม project config เท่านั้น
- ถ้าไม่มี config → skip และ report
- ไม่ release ถ้า `main` CI ยังไม่ผ่าน

## Expected Outcome

- Issue branch ถูก merge เข้า `dev` ผ่าน PR
- `dev` ถูก promote ไป `main` ผ่าน PR
- `main` CI ผ่าน
- Release/deploy เกิดขึ้น (ถ้ามี config)
- Issue ถูกปิด
- Branch `dev/<number>` และ worktree ถูกลบ
- ไม่มี force push หรือ direct merge บน `main`
- มีรายงานผล release ครบถ้วน
