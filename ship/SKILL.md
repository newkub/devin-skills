---
name: ship
description: Ship code ผ่าน AGENTS.md workflow — entry point เดียว ไม่มี logic เอง
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
  - update-docs
  - follow-agents-md
  - deep-plan
  - ship-by-agents-swarm
  - use-subagents
  - follow-parallel
  - run-verify
  - deep-validate
---

## Goal

Ship code ผ่าน `AGENTS.md` ของ project — skill นี้เป็น entry point เท่านั้น ไม่มี ship logic เอง; workflow ทั้งหมด (branch, validate, staging, CI gate, merge, production, rollback) อยู่ใน `### 8. Ship` ของ `/update-docs agents-md` (merged from: ship, ship-to-staging, ship-to-production)

## Scope

- ใช้กับ project ที่มี `AGENTS.md` (สร้าง/อัปเดตผ่าน `/update-docs agents-md` ก่อนเสมอ)
- ทุก ship action ทำผ่าน workflow ใน `AGENTS.md` ตาม `/follow-agents-md`
- งานใหญ่หลายด้าน (multi-workspace, multi-concern) → ใช้ swarm flow ใน Step 4 (merged from: `ship-by-agents-swarm`); งานเล็ก/lane เดียว → sequential ตาม `AGENTS.md`
- Local-only ship (ไม่มี staging/production deploy target — เช่น skills repo, dotfiles, config-only changes) → ข้าม Step 2–3 ได้: verify + `/git-commit` ตรงๆ แล้ว report

## Execute

### 1. Deep Plan

> Goal: วางแผนก่อนลงมือ ship

1. ทำ `/deep-plan` เพื่อวางแผน scope ของ ship (changes, issues, target branches) ก่อนเริ่ม workflow

### 2. Update AGENTS.md

> Goal: `AGENTS.md` สดและมี ship workflow ครบ

1. ทำ `/update-docs agents-md` — สร้าง/อัปเดต `AGENTS.md` ของ project พร้อม `### 8. Ship` workflow (รวม `/deep-review-then-fix` เป็น canonical fix pass ก่อน ship)

### 3. Follow AGENTS.md

> Goal: ทำงานตาม `AGENTS.md` เท่านั้น

1. ทำ `/follow-agents-md` — execute ship workflow ที่ `AGENTS.md` กำหนด ตั้งแต่ branch hygiene จนถึง production + rollback

### 4. Swarm Mode (Optional)

> Goal: งานใหญ่ ship เร็วขึ้นด้วย parallel lanes — ไม่ลด validation gates

ถ้า ship scope ใหญ่และแตกเป็น independent lanes ได้ (1 ไฟล์ = 1 lane owner):

1. แตก lanes ตาม `references/swarm-plan.md` และ `references/swarm-lanes.md` — lane types: verify, test, review, docs, deps, fix, ship-ops
2. Preflight ตาม `references/swarm-plan.md#preflight` — git clean, deps, env พร้อม
3. Fan-out ตาม `references/swarm-fan-out.md` — mechanical → `/use-scripts`/`/use-astgrep`, judgment → subagents ผ่าน `/use-subagents`, read-only → parallel tool calls ตาม `/follow-parallel`
4. Merge results และผ่าน ship gates ตาม `references/swarm-merge-and-gate.md` — `/run-verify` + `/deep-validate` + `/run-check` ครบ, user confirm ก่อน merge/release เหมือน sequential

## Rules

### 1. AGENTS.md First

- ห้ามข้าม `/update-docs agents-md` — `AGENTS.md` ต้อง fresh ก่อน ship เสมอ
- ห้าม hardcode ship steps ใน skill นี้ — workflow อยู่ใน `update-docs agents-md`/`AGENTS.md` เท่านั้น

### 2. User Confirmation

- merge, production deploy, release → ต้องมี user confirm เสมอ (ตาม workflow ใน `AGENTS.md`)
- swarm mode ห้ามข้าม gates — parallel ใช้กับความเร็วเท่านั้น ไม่ใช่ shortcut

## Expected Outcome

- `AGENTS.md` สดและครบ — ship workflow execute ผ่าน `/follow-agents-md`
- code ผ่าน verify ทั้ง local และ staging, production healthy พร้อม rollback path
