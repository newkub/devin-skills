---
name: review-implement
description: Review implementation readiness ก่อน execute implement-* skills
---

## Goal

Review implementation readiness ก่อนเริ่ม execute `implement-*` skills เพื่อยืนยันว่า plan, mock inventory, TODO inventory, queue, GitHub task, MVP scope และ realization blockers พร้อมสำหรับ implementation

## Scope

ใช้ก่อนเรียก `realize-implementation`, `implement-plan`, `implement-mock`, `implement-github-task`, `implement-features-to-mvp` — ตรวจ plan completeness, mock/stub inventory, TODO/FIXME/HACK inventory, queue task validation, GitHub task clarity, MVP scope validation, realization blockers แล้วสรุป readiness score พร้อม prioritized implementation order

## Execute

### 1. Prepare Context

> Goal: เข้าใจ project structure และ implementation scope

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure, domain, และ feature scope
2. ระบุ implementation targets: plan files, queue files, GitHub tasks, TODO markdown, MVP checklist
3. ถ้า project มี `AGENTS.md` ให้อ่านและทำตาม
4. ถ้าไม่พบ implementation targets → stop และ report

### 2. Review Plan Readiness

> Goal: ตรวจ plan completeness ก่อน execute `implement-plan`

1. ตรวจสอบไฟล์ใน `.devin/plan/` ว่ามี task table, execution order, status tracking
2. ตรวจแต่ละ task มี single responsibility, clear acceptance criteria, และ testable
3. ตรวจ dependencies ระหว่าง tasks ไม่มี circular หรือ missing
4. ตรวจ critical path: schema → data → API → UX/UI
5. ดูรายละเอียดใน [references/plan-readiness.md](references/plan-readiness.md)

### 3. Inventory Mocks And Stubs

> Goal: ระบุ mock/stub/placeholder ที่ต้องแปลงก่อน `implement-mock`

1. ทำ `/review-realize-implementation` เพื่อหา MOCK, FAKE, STUB, placeholder ทั้งหมด
2. จัดกลุ่มตามประเภท: database, API, service, external dependency
3. ระบุแต่ละ mock มี file path, line number, และ replacement plan
4. ตรวจสอบว่า mock อยู่ใน production path หรือ test-only
5. ดูรายละเอียดใน [references/mock-inventory.md](references/mock-inventory.md)

### 4. Inventory TODOs And FIXMEs

> Goal: ระบุ TODO/FIXME/HACK ที่ต้องแปลงก่อน `realize-implementation`

1. ทำ `/review-realize-implementation` เพื่อหา TODO, FIXME, XXX, HACK ทั้งใน source และ markdown
2. จัดกลุ่มตาม priority และ dependencies
3. ระบุแต่ละ TODO มี file path, line number, และ context
4. ดูรายละเอียดใน [references/todo-inventory.md](references/todo-inventory.md)

### 5. Validate Queue And GitHub Tasks

> Goal: ตรวจ queue tasks ใน `QUEUE.md` และ GitHub tasks ก่อน `realize-implementation` และ `implement-github-task`

1. อ่าน `QUEUE.md` ตรวจสอบ pending requests มี title, description, priority, และ status
2. ตรวจ dependencies ระหว่าง queue items
3. รัน `gh issue view` หรือ `gh project item-list` เพื่อตรวจ GitHub tasks
4. ตรวจแต่ละ GitHub task มี acceptance criteria และ scope ชัดเจน
5. ระบุ tasks ที่ ambiguous หรือขาด context

### 6. Validate MVP Scope

> Goal: ตรวจ MVP scope ก่อน `implement-features-to-mvp`

1. ตรวจสอบ MVP checklist มี must-have, should-have, nice-to-have
2. ตรวจ must-have features มี acceptance criteria และ testable
3. ตรวจ scope ไม่เกิน timeframe และไม่ขาด critical features
4. ตรวจไม่มี over-engineering ใน MVP scope
5. ดูรายละเอียดใน [references/mvp-scope.md](references/mvp-scope.md)

### 7. Check Realization Blockers

> Goal: ระบุ blockers ก่อน `realize-implementation`

1. ทำ `/review-realize-implementation` เพื่อหา implementation gaps
2. ตรวจ infrastructure readiness: database, API server, environment variables, external services
3. ตรวจ type flow: schema → validation → API types → UI types
4. ระบุ blockers ที่ต้องแก้ก่อนเริ่ม implementation
5. ถ้า infrastructure ไม่พร้อม → flag เป็น critical blocker

### 8. Score And Report

> Goal: สรุป readiness score และ prioritized implementation order

1. คำนวณ implementation readiness score จาก [references/readiness-score.md](references/readiness-score.md)
2. ทำ `/report` พร้อม `/report-markdown-table`
3. สร้างตาราง Readiness Summary: Category, Status, Findings, Score
4. สร้างตาราง Prioritized Implementation Order: Priority, Skill, Target, Blockers, Effort
5. สร้างตาราง Blockers: Blocker, Severity, Action Required, Skill
6. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code หรือ plan ระหว่าง review
- ถ้าต้อง implement ให้ใช้ `implement-*` skills หลัง review
- ทุก finding ต้องมี file path และ evidence

### 2. Evidence-Based Findings

- ใช้ `Grep` และ `scan-codebase` สำหรับ inventory ไม่เดา
- ทุก finding ระบุ file path, line number, และ context
- จัดลำดับตาม severity: Critical → High → Medium → Low

### 3. Scoring

- คะแนนต่อ category: ✅ = 1, ⚠️ = 0.5, ❌ = 0
- Readiness score = (total score / total categories) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Score < 70 → แนะนำให้แก้ blockers ก่อนเริ่ม implementation

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-markdown-table`

## Expected Outcome

- รายงาน Readiness Summary พร้อม score และ grade
- รายงาน Prioritized Implementation Order พร้อม skill ที่ควรเรียก
- รายงาน Blockers พร้อม action required
- Implementation readiness score พร้อม progress bar
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
