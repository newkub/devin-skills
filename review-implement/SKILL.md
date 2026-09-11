---

name: review-implement
description: Review implementation readiness และ completeness ก่อน execute implement-* skills
argument-hint: "[scope]"
related:
  - scan-codebase
  - report
  - suggest-next-action
  - implement-to-production
  - implement-github-issue-by-me
  - deep-review-codebase
  - roleplay-stakeholder
  - run-review
---

## Goal

Review implementation readiness ก่อนเริ่ม execute `implement-*` skills เพื่อยืนยันความพร้อมของ plan, mock inventory, TODO inventory, queue, GitHub task, MVP scope และ realization blockers

## Scope

ใช้ก่อนเรียก `implement-to-production`, `implement-github-issue-by-me`, `implement-features-to-mvp` — ตรวจ plan completeness, mock/stub inventory, TODO/FIXME/HACK inventory, queue task validation, GitHub task clarity, MVP scope validation, realization blockers และ implementation completeness gaps (missing flows, UI, API, database — merged from: review-implement-to-production) แล้วสรุป readiness score พร้อม prioritized implementation order

## Execute

### 1. Prepare Context

> Goal: เข้าใจ project structure และ implementation scope

- ทำ `/scan-codebase` เพื่อเข้าใจ project structure, domain, และ feature scope
- ระบุ implementation targets
- ถ้า project มี `AGENTS.md` ให้อ่านและทำตาม
- ถ้าไม่พบ implementation targets → stop และ report

### 2. Review Plan Readiness

> Goal: ตรวจ plan completeness ก่อน execute `implement-to-production`

ทำตาม references/plan-readiness.md

### 3. Inventory Mocks And Stubs

> Goal: ระบุ mock/stub/placeholder ที่ต้องแปลง

ทำตาม references/mock-inventory.md

### 4. Inventory TODOs And FIXMEs

> Goal: ระบุ TODO/FIXME/HACK ที่ต้องแปลง

ทำตาม references/todo-inventory.md

### 5. Validate Queue And GitHub Tasks

> Goal: ตรวจ queue tasks ใน QUEUE.md และ GitHub tasks

ทำตาม references/queue-github-tasks.md

### 6. Validate MVP Scope

> Goal: ตรวจ MVP scope ก่อน `implement-features-to-mvp`

ทำตาม references/mvp-scope.md

### 7. Check Realization Blockers

> Goal: ระบุ blockers ก่อน `implement-to-production`

ทำตาม references/realization-blockers.md

### 8. Review Implementation Completeness (merged from: review-implement-to-production)

> Goal: หา implementation gaps — missing flows, UI, API, database, incomplete features

1. ทำตาม `references/completeness-implementation-gaps.md`
2. ตรวจ missing flows ตาม `references/completeness-missing-flows.md`, missing UI ตาม `references/completeness-missing-ui.md`, missing API ตาม `references/completeness-missing-api.md`, missing database ตาม `references/completeness-missing-database.md`
3. ระบุ severity ตาม `references/completeness-severity.md` — เรียงตาม critical path: schema → data → API → UI/flow
4. ทำ `/roleplay-stakeholder` เพื่อจำลอง user journey หา missing features ใน workflow
5. ตรวจ flow หลักมี happy path, error path, recovery, rollback, undo, confirmation
6. validate findings ตาม `references/completeness-validation.md` และคำนวณ completeness score ตาม `references/completeness-scoring.md`

### 9. Score And Report

> Goal: สรุป readiness score และ prioritized implementation order

ทำตาม references/scoring.md

- คำนวณ implementation readiness score, grade และ supplementary metrics
- ทำ `/report`
- ทำ `/suggest-next-action`

## Rules

1. Review Independence
   - ทำ review เท่านั้น ไม่แก้ไข code หรือ plan ระหว่าง review
   - ทุก finding ต้องมี file path และ evidence (implement)
2. Evidence-Based Findings
   - ใช้ `Grep` และ `scan-codebase` สำหรับ inventory
   - ทุก finding ระบุ file path, line number, context
   - จัดลำดับตาม severity
3. Scoring
   - คะแนนต่อ category: ✅ = 1, ⚠️ = 0.5, ❌ = 0
   - Readiness score = (total score / total categories) × 100%
   - Grade A-F ตาม thresholds ใน references/scoring.md
   - Score < 70 → แนะนำให้แก้ blockers ก่อน
4. Formatting
   - ห้ามใช้ bold markers — ใช้ backticks
   - รายงานเป็นตารางด้วย `/report`

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings หลังรายงาน — ข้ามถ้า scope เป็น review/report-only เช่นถูก dispatch จาก `/deep-review-codebase` หรือ `/review` (implement)

Merged from: improve-features

1. จัดลำดับ findings ตาม severity — critical ก่อน แล้วแก้ทีละรายการพร้อม verify ทันทีหลังแก้ (implement)
2. เลือก fix guide ที่ตรงกับ finding จากรายการด้านล่าง (implement)
3. ทุก fix ต้องรักษา behavior เดิม ผ่าน `/run-check` และ `/run-test` ถ้ามี แล้วสรุปผลด้วย `/report-before-after` (implement)

- `references/fix-improve-features.md` — ปรับปรุง feature ที่มีอยู่ให้สมบูรณ์ — edge cases, states, flow, polish จนพร้อม production
## References

- [Full-dimension checklist](references/checklist.md)

## Expected Outcome

- รายงาน Readiness Summary พร้อม score และ grade
- รายงาน Prioritized Implementation Order
- รายงาน Blockers พร้อม action required
- รายงาน Implementation Completeness Gaps ตาม critical path
- Implementation readiness score
- แนะนำ action ถัดไป
