---
name: ship
description: Ship code ตาม AGENTS.md โดย branch, validate, deploy staging, merge, แล้ว production
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
  - update-agents-md
  - follow-agents-md
  - ship-by-agents-swarm
  - ship-to-staging
  - ship-to-production
  - improve-codebase-everything
  - run-verify
  - deep-validate
  - create-git-branch
  - git-commit-and-push-features-branch
  - resolve-cicd
  - run-release
  - report
  - ask-me
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
3. ถ้ามีหลาย workflow/skill ทีอิสระกัน → ทำ `/consider-use-subagents` หรือ `/follow-devin-global-subagents`
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
2. ทำ `/improve-review-cli` เพื่อ review codebase ด้วย CLI
3. ทำ `/improve-codebase-everything` เพื่อ improve frontend, API, database, security, SEO
4. ทำ `/optimize-codebase-everything` ถ้ามี bundle ใหญ่หรือ performance issues
5. ทำ `/improve-test-everything` ถ้า tests หรือ coverage ไม่ผ่าน threshold
6. ทำ `/review-dependencies` เพื่อ audit vulnerabilities, licenses และ outdated packages
7. ทำ `/update-version-latest` เพื่ออัปเดต dependencies ตามผล audit
8. ทำ `/improve-architecture` ทุก workspace เพื่อแก้ structural findings
9. ทำ `/improve-docs` ถ้า docs/README ไม่ตรงกับ code ล่าสุด
10. ทำ `/follow-monorepo` ถ้าเป็น monorepo เพื่อ verify workspace conventions
11. ทำ `/run-verify` เพื่อ verify build, lint, typecheck
12. ทำ `/deep-validate` เพื่อตรวจสอบความถูกต้องก่อน ship

### 4. Stage

> Goal: deploy feature branch ไป staging และ verify

1. ทำ `git pull --rebase origin main` เพื่อให้ feature branch ทัน `main` ล่าสุด
2. ทำ `/git-commit-and-push-features-branch` ถ้ามี changes ทีผ่าน validation
3. ทำ `/ship-to-staging` เพื่อ deploy feature branch ไป staging และรัน smoke tests
4. ถ้า staging ไม่ผ่าน → แก้ code แล้วกลับไปข้อ 1 โดย retry สูงสุด 3 ครั้ง

### 5. Merge And Production

> Goal: merge และ deploy production หลัง staging ผ่าน

1. ทำ `/ship-to-production` เพื่อ create PR, review, merge, deploy production, watch และ rollback ถ้าพัง
2. ทำ `/resolve-cicd` บน production branch หลัง deploy
3. `git switch main` หรือ production branch ตาม project conventions
4. ถ้ามี release → ทำ `/run-release --dry-run` ก่อน จากนั้นทำ `/run-release` หลัง user ยืนยัน
5. ถ้ามีงานเก่าที่ stash ไว้จาก Branch Hygiene → ทำ `git stash pop`
6. ปิด issue/task ที่เกี่ยวข้อง (`gh issue close` หรือตาม project conventions)

### 6. Report

> Goal: สรุปผล และแนะนำ next action

1. ทำ `/report-progress`
2. ทำ `/report` สรุป status, PR, version
3. ทำ `/suggest-next-action`

## Rules

### 1. AGENTS.md First

- ทำตาม `AGENTS.md` ของ project นั้นๆ
- ถ้า `AGENTS.md` ไม่ชัดเจน → ทำ `/update-agents-md` ก่อน

### 2. Validation Gate

- ไม่ commit ถ้ายังไม่ผ่าน validation
- ไม่ merge ถ้า staging หรือ CI ยังไม่ผ่าน
- ไม่ deploy production โดยไม่ผ่าน staging เว้นแต่ user ยืนยัน

### 3. User Confirmation

- ต้อง user ยืนยันก่อน deploy production
- ต้อง user ยืนยันก่อน release
- ถ้ามี breaking change → ทำ `/ask-me` ก่อน ship

### 4. No Bypass

- ไม่ bypass checks หรือ validation
- ไม่ force-push โดยไม่จำเป็น
- ไม่ merge โดยไม่มี review/approval

## Expected Outcome

- `AGENTS.md` อัปเดตและทำตามครบถ้วน
- code ผ่าน verify บน local และ staging
- feature branch ถูก merge แล้ว deploy production
- release สำเร็จ (ถ้ามี)
- พร้อมทำงานต่อบน workspace เดิม
