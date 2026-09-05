---
name: ship
description: Ship code ตาม AGENTS.md โดยอัปเดต AGENTS.md, ทำตาม workflow, และใช้ subagents ถ้าจำเป็น
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
  - all-workspace
  - improve-architecture
  - improve-codebase-everything
  - optimize-codebase-everything
  - run-verify
  - deep-validate
  - create-git-branch
  - git-commit-and-push-features-branch
  - create-github-pr
  - merge-github-pr
  - merge-git-branch
  - ask-me
---

## Goal

Ship code ตาม `AGENTS.md` ของ project โดยอัปเดตเอกสารให้เป้นปัจจุบัน ดำเนินการตาม workflow ทีกำหนด และส่งมอบงานจนผ่าน CI/CD

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

### 3. Validate And Ship

> Goal: ส่งมอบ code ตาม project conventions

1. เลือก execution mode: ถ้า scope ใหญ่หรือหลายด้าน → ทำ `/ship-by-agents-swarm`; ถ้า diff เล็ก (เช่น typo, docs, config บรรทัดเดียว) → ข้ามข้อ 2-8 ไปข้อ 9 ได้เลย
2. ทำ `/improve-review-cli` เพื่อ review codebase ด้วย CLI ก่อนส่งมอบ
3. ทำ `/improve-codebase-everything` เพื่อ improve frontend, API, database, security, SEO
4. ทำ `/optimize-codebase-everything` ถ้ามี bundle ใหญ่หรือ performance issues
5. ทำ `/improve-test-everything` ถ้า tests หรือ coverage ไม่ผ่าน threshold
6. ทำ `/review-dependencies` เพื่อ audit vulnerabilities, licenses และ outdated packages
7. ทำ `/update-version-latest` เพื่ออัปเดต dependencies ตามผล audit
8. ทำ `/improve-architecture` ทุก workspace เพื่อแก้ structural findings ก่อนส่งมอบ
9. ทำ `/improve-docs` ถ้า docs/README ไม่ตรงกับ code ล่าสุด
10. ทำ `/follow-monorepo` ถ้าเป็น monorepo เพื่อ verify workspace conventions
11. ถ้าเป็น monorepo → ทำ `/all-workspace` เพื่อ ship ครอบคลุมทุก workspace
12. ทำ `/run-verify` เพื่อ verify build, lint, typecheck
13. ทำ `/deep-validate` เพื่อตรวจสอบความถูกต้องก่อน ship
14. ทำ `git pull --rebase origin main` เพื่อให้ feature branch ทัน `main` ล่าสุด ลด merge conflict
15. ทำ `/git-commit-and-push-features-branch` ถ้ามี changes ทีผ่าน validation
16. ถ้า repo มี remote และใช้ PR workflow → ทำ `/create-github-pr` ไปยัง production branch ตาม project conventions; ถ้าไม่มี remote หรือไม่ใช้ PR workflow → ข้ามไปข้อ 20
17. ทำ `/deep-review-pr` เพื่อ review PR พร้อม comment แต่ละ finding ลงใน PR
18. ถ้า deep-review ไม่ผ่าน → แก้ code แล้วกลับไปทำ `/git-commit-and-push-features-branch` ซ้ำ
19. ทำ `/watch-github-actions` หรือ `gh run watch` เพื่อรอ CI ผ่านก่อน merge
20. ถาม user ก่อน merge
21. ถ้า user ตกลง → ทำ `/merge-github-pr`; ถ้า local-only → ทำ `/merge-git-branch` เพื่อ merge feature branch เข้า `main` บน local แทน
22. ทำ `/run-deploy` เพื่อ deploy ไป production (ถ้า project ยังไม่มี Worker → ทำ `/create-cloudflare-worker-project` ก่อน)
23. ทำ `/resolve-cicd` บน production branch หลัง deploy; ถ้า merge/deploy แล้วพัง → rollback ด้วย `git revert <merge-commit>` หรือ redeploy เวอร์ชันเดิม แล้ว report
24. ลบ feature branch ที merge แล้ว ด้วย `git branch -d <feature-branch>`
25. `git switch main` หรือ production branch ตาม project conventions
26. ถ้ามี release → ทำ `/run-release --dry-run` ก่อน จากนั้นทำ `/run-release` หลัง user ยืนยัน
27. ถ้ามีงานเก่าที่ stash ไว้จาก Branch Hygiene → ทำ `git stash pop` เพื่อเอากลับมา
28. ปิด issue/task ที่เกี่ยวข้องถ้า ship นี้แก้ไขมัน (`gh issue close` หรือตาม project conventions)

### 4. Report

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
- ไม่ push ถ้า local verify ยังไม่ผ่าน
- ไม่ merge ถ้า CI/CD ยังไม่ผ่าน

### 3. User Confirmation

- ต้อง user ยืนยันก่อน merge
- ต้อง user ยืนยันก่อน release
- ถ้ามี breaking change → ทำ `/ask-me` ก่อน ship

### 4. No Bypass

- ไม่ bypass checks หรือ validation
- ไม่ force-push โดยไม่จำเป็น
- ไม่ merge โดยไม่มี review/approval

## Expected Outcome

- `AGENTS.md` อัปเดตและทำตามครบถ้วน
- code ผ่าน verify บน local และ CI/CD
- PR ถูกสร้าง รีวิว และ merge ตาม workflow
- release สำเร็จ (ถ้ามี)
- พร้อมทำงานต่อบน workspace เดิม
