---
name: ship
description: "Ship workspace from prepare through verify, CI, review, fix, release, and deploy with resolve"
argument-hint: "[issue-number-or-title]"
related:
  - ship-by-agents
  - review-codebase-everything
  - create-dev-branch
  - follow-git-flow
  - follow-github
  - setup-cicd
  - setup-package
  - setup-release
  - follow-tool-vite
  - follow-create-vite-plugins
  - run-verify
  - run-test-all
  - deep-validate
  - resolve-errors
  - git-commit
  - git-push
  - watch-cicd-and-resolve
  - review-correctness
  - review-architecture
  - create-github-issue
  - create-github-pr
  - unified-review-and-merge-pr
  - run-release
  - run-deploy
  - test-release
  - report
  - report-table
  - suggest-next-action
  - ask-me
---

## Goal

Ship workspace ตั้งแต่ prepare จนถึง production โดยเลือก path ทีเหมาะสมและ resolve errors จนกว่าจะผ่าน

## Scope

ใช้เมื่องานใน workspace เสร็จสมบูรณ์
- รองรับ path: prepare, issue+worktree, local commit, CI push, review PR, fix after review, release/deploy
- resolve errors ซ้ำจนกว่าจะผ่าน หรือครบ limit
- เรียก setup ทีจำเป็นตาม path: `/setup-cicd` ก่อน push, `/setup-package` / `/setup-release` ก่อน release/deploy
- ถ้าต้องการให้ agent รับไปทำต่อ → ใช้ `/ship-by-agents`

## Execute

### 1. Prepare

> Goal: update project ก่อน ship

1. ทำ `/update-agents-md` ถ้า `AGENTS.md` ไม่อัปเดต
2. ทำ `/follow-agents-md`
3. ทำ `/update-project` ถ้าจำเป็น
4. ทำ `/refactor` ถ้าจำเป็น
5. ทำ `/update-test-everything` ถ้ามี code changes
6. ถ้า fail → stop และ report

### 2. Identify or Create Issue

> Goal: ระบุ issue สำหรับ track

1. ถ้ามี argument เป้น number → เปิด issue
2. ถ้ามี argument เป้น title → ทำ `/create-github-issue`
3. ถ้าไม่มี argument → ทำ `/create-github-issue`
4. บันทึก `ISSUE_NUMBER`

### 3. Create Branch and Worktree (Optional)

> Goal: แยกงานออกจาก main

1. ถ้าต้องการ worktree สำหรับ issue → ทำ `/create-dev-branch`
2. สร้าง branch `dev/<number>` กับ worktree ด้วย `git worktree add worktrees/dev-<number> -b dev/<number> dev`
3. ทำงานใน worktree ถ้ามี

### 4. Decide Ship Path

> Goal: เลือก path ทีเหมาะสม

- ถ้า user ระบุชัด → ใช้ตามที user ระบุ
- local: งานเล็กน้อย low-risk ไม่ต้องการ push
- CI: งานใหญ่ high-risk ต้องการ multi-platform หรือ push branch
- review: ต้องการ human-in-the-loop ก่อน merge
- fix: มี review findings ต้อง fix
- release: merge dev → main → release/deploy
- ถ้าไม่ชัด → `/ask-me`

### 5. Verify

> Goal: verify ก่อน commit/push

1. ทำ `/run-verify`
2. ทำ `/run-test-all` ถ้ามี test suites
3. ถ้ามี `tools/review-codebase/` หรือ `AGENTS.md` ระบุ → ทำ `/review-codebase-everything`
4. ทำ `/deep-validate`
5. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 รอบ

### 6. Commit

> Goal: commit การเปลี่ยนแปลง

1. ทำ `/git-commit` (submodules first)
2. ถ้าไม่มี changes → stop และ report

### 7. Push to CI & Resolve

> Goal: push แล้ว watch CI จนผ่าน

1. ทำ `git status --porcelain`, `git branch --show-current`, `git remote -v`
2. ถ้าไม่มี remote → stop และ report
3. ทำ `/setup-cicd` ถ้ายังไม่พร้อม
4. `git push -u origin <current-branch>` (ไม่ force)
5. ถ้า push ถูก reject → resolve/rebase แล้ว push ใหม
6. ทำ `/watch-cicd-and-resolve`
7. ถ้า fail → resolve แล้ว commit/push/re-watch สูงสุด 5 รอบ

### 8. Review via PR

> Goal: ส่งงานผ่าน PR พร้อม review

1. สร้าง branch `ship/review-<topic>` ถ้าจำเป็น
2. ทำ `/review-correctness` และ `/review-architecture`
3. ถ้ามี Critical findings → แก้ไขก่อนหรือระบุใน issue
4. ทำขั้นตอน Commit แล้ว Push
5. ทำ `/create-github-issue` ด้วย labels `review`, `implement`
6. ทำ `/create-github-pr` พร้อม link issue
7. watch CI แล้ว resolve สูงสุด 5 รอบ
8. stop ที PR ไม่ merge เอง

### 9. Fix After Review

> Goal: แก้ไขตาม review findings

1. อ่าน review issue ด้วย `gh issue view <number>`
2. สร้าง fix branch `fix/<issue-number>-<topic>`
3. สร้าง fix plan แล้วถาม user เลือก items
4. implement ตาม severity: Critical → High → Medium → Low
5. ทำขั้นตอน Verify แล้ว Commit แล้ว Push
6. สร้าง/อัปเดต PR พร้อม link กลับ issue
7. ถ้า user ต้องการ merge → ทำ `/unified-review-and-merge-pr`

### 10. Release and Deploy

> Goal: promote ไป production

1. ตรวจ `git status --porcelain` ต้องว่าง
2. ทำขั้นตอน Push to CI ให้ผ่านก่อน
3. ถ้าอยู่บน issue branch → สร้าง PR ไป `dev` ด้วย `gh pr create --head <branch> --base dev --fill`
   - รอ `gh pr checks` ผ่าน แล้ว `gh pr merge --merge`
4. ถ้า `dev` นำหน้า `main` → สร้าง PR จาก `dev` ไป `main`
   - รอ CI และ review ผ่าน แล้ว merge
5. ตรวจ package/release config ถ้าขาด → ทำ `/setup-package` หรือ `/setup-release`
6. ถ้าต้องการ release → ทำ `/test-release` แล้ว `/run-release`
7. ถ้าต้องการ deploy → ทำ `/run-deploy` แล้ว `/watch-cicd-and-resolve`
8. ถ้า fail → ทำ `/resolve-errors` แล้ว retry

### 11. Close Issue and Cleanup

> Goal: ปิด issue และลบ branch/worktree

1. ถ้ามี `ISSUE_NUMBER` → `gh issue close <number>`
2. ตรวจ worktree ว่างแล้วลบ `git worktree remove worktrees/dev-<number>`
3. ลบ local branch `git branch -d dev/<number>`
4. ลบ remote branch `git push origin --delete dev/<number>` ถ้ายังเหลือ
5. `git remote prune origin`

### 12. Report

> Goal: สรุปผลการ ship

1. ทำ `/report` พร้อม `/report-table`
2. สรุป path, status, PRs, release/deploy, issue, cleanup
3. ทำ `/suggest-next-action`

## Rules

### 1. No Force Push

- ไม่ใช้ `--force` หรือ `--force-with-lease`
- ถ้า push ถูก reject → resolve หรือ rebase ก่อน

### 2. No Direct main Merge

- ห้าม merge โดยตรงเข้า `main`
- งานต้องผ่าน `dev` ก่อน (หรือ PR) เว้นแต่ user ระบุ hotfix flow

### 3. Verify Before Commit

- ต้องผ่าน `/run-verify` ก่อน commit/push
- ถ้า local verify ไม่ผ่าน → resolve ก่อน commit

### 4. No Auto-Merge

- ไม่ merge เองยกเว้น `/unified-review-and-merge-pr` ผ่าน review gate

### 5. Resolve Errors First

- resolve errors ก่อนขั้นตอนถัดไปเสมอ
- loop สูงสุด 3 สำหรับ local verify, 5 สำหรับ CI/review/release

### 6. No Release/Deploy Without Green CI

- ไม่ release หรือ deploy ถ้า `main` CI ยังไม่ผ่าน
- release/deploy ตาม project config เท่านั้น

### 7. Preserve User Choice

- ถ้า user ระบุ path ชัดเจน → ใช้ตามที user ระบุ

## Expected Outcome

- Workspace ถูก prepare และ verify
- เลือก path ชัดเจน (local/CI/review/fix/release)
- ผ่าน verify/CI/review gate หรือมี root cause + next action
- PR/branch/worktree ถูกจัดการถูกต้อง
- Release/deploy เกิดขึ้นถ้าผ่านเงื่อนไข
- Issue ถูกปิดและ cleanup ครบถ้วน
- รายงาน status, path, next action ครบถ้วน
