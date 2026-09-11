---
name: ship
description: Ship code ครบวงจร — branch, validate, staging, CI gate, open-diff merge, production, rollback
argument-hint: "[@issue-number-or-title]"
allowed-tools:
  - read
  - exec
  - skill
  - ask_user_question
  - todo_write
triggers:
  - user
  - model
related:
  - ship-rollback
  - create-github-pr
  - merge-github-pr
  - merge-git-branch
  - resolve-github-actions-fails
  - open-diff
  - run-deploy
  - watch-deploy
  - run-verify
  - create-git-branch
  - git-commit-and-push
  - resolve-cicd
  - run-check
  - run-build
  - run-test-all
---

## Goal

Ship code ตาม `AGENTS.md` ของ project โดยอัปเดตเอกสารให้เป้นปัจจุบัน สร้าง feature branch, validate, deploy staging, merge แล้ว deploy production อย่างปลอดภัย

## Scope

- ใช้กับ project ทีมี `AGENTS.md`
- รองรับ subagents สำหรับงานทีมีหลายด้านหรือหลาย workspace
- ไม่ข้าม validation หรือ workflow ที `AGENTS.md` กำหนด
- ไม่แก้ไข source code นอก scope ที `AGENTS.md` ระบุ

## Execute

### 1. Prepare

> Goal: ให้ `AGENTS.md` เป้นปัจจุบัน และเข้าใจ workflow

1. ทำ `/update-agents-md` เพื่ออัปเดต `AGENTS.md` ให้สะท้อน project ปัจจุบัน
2. ทำ `/follow-agents-md` เพื่อดำเนินการตาม `AGENTS.md`
3. ถ้ามีหลาย workflow/skill ทีอิสระกัน → ทำ `/use-subagents` หรือ `/update-devin-global-subagents`
4. ถ้าพบข้อขัดแย้งหรือต้องการ trade-off → ทำ `/ask-me`

### 2. Branch Hygiene

> Goal: `main` สะอาดและทำงานทั้งหมดบน feature branch ตั้งแต่ต้น

1. ตรวจ `git status` — ถ้ามี uncommitted งานเก่า → commit ด้วย `/git-commit` เข้า `main` หรือ `git stash` เก็บไว้ก่อน
2. ทำ `git switch main` แล้ว `git pull` ให้ `main` เป็นปัจจุบัน
3. สร้างและ switch ไป feature branch ด้วย `/create-git-branch` หรือ `git switch -c <feature-branch>`
4. ทำงานทั้งหมดใน step ถัดไปบน feature branch — ห้าม commit ตรงบน `main`

### 3. Validate

> Goal: code ผ่าน local validation

1. เลือก execution mode: ถ้า scope ใหญ่หรือหลายด้าน → ทำ `/ship-by-agents-swarm`; ถ้า diff เล็ก (เช่น typo, docs, config บรรทัดเดียว) → ข้ามข้อ 2-8 ไปข้อ 9 ได้ แต่ยังต้องทำข้อ 9-12
2. ทำ `/review-then-fix` เพื่อ review และ fix issues ก่อน ship
3. ทำ `/deep-optimize` เพื่อ optimize ครบทุก layer — frontend, API, database, SEO, bundle
4. ทำ `/review-test` ถ้า tests หรือ coverage ไม่ผ่าน threshold
5. ทำ `/review-dependencies` เพื่อ audit vulnerabilities, licenses และ outdated packages
6. ทำ `/update-version-to-latest` เพื่ออัปเดต dependencies ตามผล audit
7. ทำ `/review-architecture` ทุก workspace เพื่อแก้ structural findings
8. ทำ `/review-docs` ถ้า docs/README ไม่ตรงกับ code ล่าสุด
9. ทำ `/follow-monorepo` ถ้าเป็น monorepo เพื่อ verify workspace conventions
10. ทำ `/run-verify` เพื่อ verify build, lint, typecheck
11. ทำ `/run-test-all` เสมอ — เลือกและรัน `run-test-*` ที่เกี่ยวข้องกับ project ให้ผ่านครบก่อน ship
12. ทำ `/deep-validate` เพื่อตรวจสอบความถูกต้องก่อน ship
13. ถ้า validation หรือ staging ยังไม่ผ่าน ให้ทำ `/loop-until-complete` จนกว่าจะผ่านหรือถึง max iterations
14. ถ้าพบ TODO/MOCK/placeholder หรือ unfinished implementation → ทำ `/implement-to-production`
15. ถ้าพบ structural หรือ quality issues → ทำ `/refactor`
16. ทำ `/update-project` เพื่อ sync project files/docs กับ changes ก่อน ship
17. ทำ `/run-verify` เป็น final end-to-end verification gate ก่อน proceed ไป staging

### 4. Stage

> Goal: deploy feature branch ไป staging และ verify (merged from: ship-to-staging)

1. ตรวจ `git status` — ทุก change ต้อง committed บน feature branch (`/git-commit` ถ้าค้าง), บันทึก branch + commit hash
2. ทำ `git pull --rebase origin main` เพื่อให้ feature branch ทัน `main` ล่าสุด
3. ถ้า commit history ต้องการ cleanup (break down, squash, fixup) → ทำ `/refactor-commit` ก่อน push
4. ทำ `/git-commit-and-push` ถ้ามี changes ทีผ่าน validation
5. ตรวจ staging env จาก `AGENTS.md`/`package.json` scripts (`deploy:staging` ฯลฯ) — ถ้าไม่มี staging → ทำ `/ask-me` ก่อน deploy production โดยตรง
6. deploy ไป staging ด้วย `/run-deploy` หรือ command ตาม project; บันทึก deploy URL, commit hash, deploy time
7. ทำ `/watch-deploy` + smoke tests: critical flows, API health, DB connectivity; ถ้ามี `/run-test-e2e` สำหรับ critical routes → รันด้วย; ถ้ามี e2e/integration tests สำหรับ staging → `/run-test-e2e`, `/run-test-integration`
8. ถ้า staging ไม่ผ่าน → แก้ code แล้วกลับไปข้อ 1 โดย retry สูงสุด 3 ครั้ง — staging ผ่านเท่านั้นถึงไปต่อ (`ready-for-production`)

### 5. Merge

> Goal: merge เมื่อ CI ผ่านครบและ user confirm (merged from: ship-to-production)

1. ถ้า repo มี remote ใช้ PR workflow และยังไม่มี PR → ทำ `/create-github-pr`; ทำ `/review-github-pr` review พร้อม comment แต่ละ finding
2. ถ้า `/deep-review-codebase` ไม่ผ่าน → แก้ code แล้วกลับไปข้อ 1
3. CI gate: รอ CI status ผ่านทั้งหมดก่อน merge — ทำ `/resolve-github-actions-fails` หรือ `gh pr checks <n> --watch` จนเขียวครบ; ห้าม merge ถ้ายังมี check fail/pending
4. เมื่อ CI เขียวครบ → ทำ `/open-diff pr <n>` เปิด diff UI ให้ user review ละกด `Merge ▾` (merge/squash/rebase) — merge log stream ไปที่ terminal ระหว่าง `run dev` server
5. ถ้า user ไม่กดเอง → AI merge ให้เลยด้วย `/merge-github-pr` (หรือ `/merge-git-branch` สำหรับ local ที่ไม่มี remote) หลัง user confirm
6. ยืนยัน `main` หรือ production branch เป็นปัจจุบันหลัง merge

### 6. Production Deploy And Verify

> Goal: production มี version ล่าสุดและ healthy (merged from: ship-to-production)

1. user ต้อง confirm ก่อน deploy production — แสดง commit hash, changes, staging result; ถ้า breaking change → `/ask-me`
2. บันทึก version เดิมก่อน deploy (rollback target) แล้วทำ `/deep-validate` เป็น production gate
3. รัน production deploy command ตาม `AGENTS.md`/`package.json` — ใช้ `/run-deploy` ถ้ามี skill สำหรับ target; บันทึก deploy URL, commit hash, deploy time
4. ทำ `/watch-deploy` + health check endpoints + smoke tests บน critical paths; ตรวจ error rate/latency ถ้ามี observability
5. ถ้า health check fail → ทำ `/ship-rollback` ทันที (`git revert <merge-commit>` หรือ redeploy เวอร์ชันเดิม)
6. ถ้าปกติ → ลบ feature branch แล้ว `git switch main`
7. ทำ `/resolve-cicd` บน production branch หลัง deploy

### 7. Wrap Up And Report

> Goal: สรุปผล และแนะนำ next action

1. ทำ `/report-progress`
2. ทำ `/report` สรุป status, PR, version
3. ทำ `/report-scan-todo` เพื่อตรวจ pending items ใน `TODO.md` ที่เหลือหลัง ship
4. ถ้ามี release → ทำ `/run-release --dry-run` ก่อน จากนั้นทำ `/run-release` หลัง user ยืนยัน
5. ถ้ามีงานเก่าที่ stash ไว้จาก Branch Hygiene → ทำ `git stash pop`
6. ปิด issue/task ที่เกี่ยวข้อง (`gh issue close` หรือตาม project conventions)
7. ทำ `/suggest-next-action`

## Rules

### 1. AGENTS.md First

- ทำตาม `AGENTS.md` ของ project นั้นๆ
- ถ้า `AGENTS.md` ไม่ชัดเจน → ทำ `/update-agents-md` ก่อน

### 2. Validation Gate

- ไม่ commit ถ้ายังไม่ผ่าน validation
- ไม่ merge ถ้า staging ยังไม่ผ่าน หรือ CI ยังไม่เขียวครบทุก check
- ไม่ deploy production โดยไม่ผ่าน staging เว้นแต่ user ยืนยัน

### 3. User Confirmation

- ต้อง user ยืนยันก่อน deploy production
- ต้อง user ยืนยันก่อน release
- ถ้ามี breaking change → ทำ `/ask-me` ก่อน ship

### 4. No Bypass

- ไม่ bypass checks หรือ validation
- ไม่ force-push โดยไม่จำเป็น, ไม่ rewrite history (`git revert` เท่านั้น)
- ไม่ merge โดยไม่มี review/approval — merge ผ่าน `open-diff` button หรือ AI หลัง CI เขียวครบ
- ใช้ /run-check ถ้าจำเป็น
- ใช้ /run-build ถ้าจำเป็น

## Expected Outcome

- `AGENTS.md` อัปเดตและทำตามครบถ้วน
- code ผ่าน verify บน local และ staging (`ready-for-production`)
- CI เขียวครบทุก check ก่อน merge — merge ผ่าน open-diff Merge button (log stream ไป terminal) หรือ AI merge
- feature branch ถูก merge แล้ว deploy production ผ่าน health check — rollback ถ้าพัง
- release สำเร็จ (ถ้ามี) และ issue ปิด
- พร้อมทำงานต่อบน workspace เดิม
