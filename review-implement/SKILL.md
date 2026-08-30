---
name: review-implement
description: Review implementation readiness ก่อน execute implement-* skills
related:
  - scan-codebase
  - report-table
  - suggest-next-action
  - realize-implementation
  - implement-plan
  - implement-mock
  - implement-github-task
---

## Goal

Review implementation readiness ก่อนเริ่ม execute `implement-*` skills เพื่อยืนยันความพร้อมของ plan, mock inventory, TODO inventory, queue, GitHub task, MVP scope และ realization blockers

## Scope

ใช้ก่อนเรียก `realize-implementation`, `implement-plan`, `implement-mock`, `implement-github-task`, `implement-features-to-mvp` — ตรวจ plan completeness, mock/stub inventory, TODO/FIXME/HACK inventory, queue task validation, GitHub task clarity, MVP scope validation, realization blockers แล้วสรุป readiness score พร้อม prioritized implementation order

## Execute

### 1. Prepare Context

> Goal: เข้าใจ project structure และ implementation scope

- ทำ `/scan-codebase` เพื่อเข้าใจ project structure, domain, และ feature scope
- ระบุ implementation targets
- ถ้า project มี `AGENTS.md` ให้อ่านและทำตาม
- ถ้าไม่พบ implementation targets → stop และ report

### 2. Review Plan Readiness

> Goal: ตรวจ plan completeness ก่อน execute `implement-plan`

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

> Goal: ระบุ blockers ก่อน `realize-implementation`

ทำตาม references/realization-blockers.md

### 8. Score And Report

> Goal: สรุป readiness score และ prioritized implementation order

ทำตาม references/scoring.md

- คำนวณ implementation readiness score, grade และ supplementary metrics
- ทำ `/report-table`
- ทำ `/suggest-next-action`

## Rules

1. Review Independence
   - ทำ review เท่านั้น ไม่แก้ไข code หรือ plan ระหว่าง review
   - ทุก finding ต้องมี file path และ evidence
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
   - รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน Readiness Summary พร้อม score และ grade
- รายงาน Prioritized Implementation Order
- รายงาน Blockers พร้อม action required
- Implementation readiness score
- แนะนำ action ถัดไป
