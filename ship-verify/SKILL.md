---
name: ship-verify
description: Verify gate ก่อน ship — review, validate, tests, dev run และ usage check จนพร้อม push
argument-hint: "[scope]"
related:
  - follow-agents-md
  - update-agents-md
  - deep-review
  - deep-review-then-fix
  - deep-validate
  - run-check
  - update-tests
  - run-test-all
  - run-dev
  - test-usage
  - ship-to-dev-branch
  - git-commit-and-push
  - report
---

## Goal

Verification gate เดียวก่อน ship งานใดๆ — ตรวจ `AGENTS.md`, review changes, validate correctness, tests ผ่าน, dev server รันได้ และ usage examples ทำงานจริง — ผ่านครบแล้วค่อย push ผ่าน `/ship-to-dev-branch`

## Scope

- ใช้เป็น gate สุดท้ายก่อน commit/push — ทุก project ที่จะ ship ต้องผ่าน skill นี้
- **Verify only** — ห้าม commit/push ใน skill นี้ (push ทำใน `/ship-to-dev-branch` หรือ `/git-commit-and-push`)
- canonical ของทุก verify step — skill อื่น (เช่น `/update-agents-md`, `/new-skills`) reference ที่นี่ ห้าม duplicate verify workflow

## Execute

### 1. Follow AGENTS.md

> Goal: `AGENTS.md` สดและเป็น source of truth ก่อน verify

1. ทำ `/follow-agents-md` — ถ้า `AGENTS.md` ไม่มีหรือ stale → `/update-agents-md` ก่อนเสมอ
2. อ่าน ship/validate rules ที่ `AGENTS.md` ของ project กำหนดเพิ่มเติม

### 2. Review Changes

> Goal: changes และ `AGENTS.md` ผ่าน review ก่อน ship

1. ทำ `/deep-review` เฉพาะ scope ที่เปลี่ยน + `AGENTS.md`
2. ถ้ามี findings → ทำ `/deep-review-then-fix` แก้จนผ่าน
3. ทำ `/review-devin-global-harness` เพิ่มเมื่อแก้ devin skills repo

### 3. Validate

> Goal: correctness ผ่านทุกมิติ

1. ทำ `/deep-validate` — cross-reference, type safety, conventions
2. ทำ `/run-check` — lint + typecheck ต้องผ่าน

### 4. Tests

> Goal: tests ครบและผ่านจริง

1. ทำ `/update-tests` — test specs ครบทุก layer ตาม changes
2. ทำ `/run-test-all` — ทุก suite ต้องผ่าน; fail → แก้ root cause แล้วรันใหม่

### 5. Runtime And Usage

> Goal: app รันจริงและ docs ตรงกับความจริง

1. ทำ `/run-dev` — dev server ต้อง healthy ไม่มี error
2. ทำ `/test-usage` — usage examples จาก README/docs/`AGENTS.md` ต้องทำงานได้จริง

### 6. Report

> Goal: สรุปผล verify พร้อม ship หรือไม่

1. ทำ `/report` — table: `No. | Gate | Result | Evidence`
2. ผ่านครบ → แนะนำ `/ship-to-dev-branch` (push `dev`) หรือ `/git-commit-and-push` เป็น next action
3. ไม่ผ่าน → report blockers ชัดเจน ห้าม ship

## Rules

- Verify only — ห้าม `git commit`, `git push`, merge หรือ release ใน skill นี้
- ทุก gate ต้องผ่านจริง — ห้ามข้าม gate ที่ fail; fix loop สูงสุด 3 รอบแล้ว stop + report
- ข้าม gate ที่ไม่ apply ได้เฉพาะเมื่อ project ไม่มี artifact นั้นจริง (เช่น ไม่มี dev server → ข้าม `/run-dev`) — ต้องระบุเหตุผลใน report
- ห้าม duplicate verify steps ใน skill อื่น — reference `/ship-verify` เท่านั้น

## Expected Outcome

- `AGENTS.md` สด, review/validate/check ผ่าน, tests เขียว, dev run ได้, usage ตรงจริง
- Report ชัดเจนว่า ready-to-ship หรือมี blockers อะไร
- พร้อม `/ship-to-dev-branch` ต่อได้ทันทีเมื่อผ่านครบ
