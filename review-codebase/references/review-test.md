---
name: review-test
description: Review test coverage, test quality, test patterns และ testing strategy
---

## Goal

Review test coverage, test quality, test patterns, และ testing strategy พร้อม severity ratings และ review score

## Scope

ใช้สำหรับ test review ในทุก workspace — ครอบคลุม unit tests, integration tests, E2E tests, test fixtures, mocking, coverage analysis — ไม่รวม code quality review (อยู่ใน `/review-codebase`)

## Execute

### 1. Gather Context

รวบรวม context ก่อน review

> Goal: เข้าใจ test structure, framework, และ coverage ปัจจุบัน

1. ระบุ test target: unit tests, integration tests, E2E tests
2. อ่าน test configs, อ่าน test dependencies, ทำ `/scan-codebase`
3. ระบุ test framework และ runner: `Vitest`, `Jest`, `Playwright`, `Cypress`
4. ถ้าเป็น web project → เพิ่ม `/run-dev` เพื่อ verify dev server

### 2. Deep Analyze

วิเคราะห์ test quality ด้วย review CLI และ rules

> Goal: พบทุก issue พร้อม root cause และ review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ test patterns หลายมิติ
2. ทำ `/update-review-cli` — เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต `ast-grep` rules
3. ถ้า `/update-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง review report พร้อม test metrics
6. จับ findings เป็น list พร้อม evidence (file, line, code snippet)

### 3. Coverage Analysis

วิเคราะห์ test coverage และ identify gaps

> Goal: รู้ coverage percentage และ areas ที่ขาด tests

1. รัน coverage tool: `bunx vitest run --coverage` หรือเทียบเท่า
2. ตรวจสอบ coverage thresholds: statements, branches, functions, lines — ระบุ areas ต่ำกว่า threshold
3. ตรวจสอบ untested critical paths: error handlers, edge cases, boundary conditions
4. ตรวจสอบ untested public API: exported functions, API endpoints, component props
5. ระบุ dead tests: tests ที่ไม่ match code ปัจจุบัน, skipped tests, todo tests

### 4. Test Quality Review

ตรวจสอบคุณภาพของ tests ที่มีอยู่

> Goal: tests มีคุณภาพ ไม่ใช่แค่มีจำนวนมาก

1. ตรวจสอบ test naming: descriptive names, follow AAA pattern (Arrange-Act-Assert)
2. ตรวจสอบ test isolation: ไม่ depend on execution order, ไม่ share state, proper setup/teardown
3. ตรวจสอบ test assertions: single responsibility per test, meaningful assertions, ไม่ assert แค่ truthy
4. ตรวจสอบ test fixtures: reusable fixtures, ไม่ hardcoded data, factory patterns
5. ตรวจสอบ mocking strategy: mock เฉพาะ external dependencies, ไม่ over-mock, spy vs mock usage
6. ตรวจสอบ test performance: ไม่ช้าเกินไป, ไม่ unnecessary waits, parallel execution

### 5. Test Patterns Review

ตรวจสอบ test patterns และ anti-patterns

> Goal: tests ใช้ patterns ที่ดี ไม่มี anti-patterns

1. ตรวจสอบ test structure: describe/it nesting, shared setup, helper extraction
2. ตรวจสอบ E2E patterns: Page Object Model, selectors stability, wait strategies
3. ตรวจสอบ integration patterns: database setup/teardown, API mocking, contract tests
4. ตรวจสอบ snapshot testing: ใช้เมื่อเหมาะสม, ไม่ overuse, review snapshots
5. ตรวจสอบ parameterized tests: ใช้เมื่อมีหลาย input combinations, ไม่ duplicate test cases

### 6. Validate Findings

ตรวจสอบ findings ลด false positives

> Goal: findings ที่ผ่าน validation เท่านั้น

1. cross-check แต่ละ finding มี evidence ชัดเจน (file, line, code)
2. ถ้าไม่มี evidence → discard
3. ถ้า finding ซ้อนทับกับ review อื่น → อ้างอิงแทน ไม่ duplicate

### 7. Rate Severity And Health Score

ให้คะแนนและคำนวณ review score

> Goal: รู้ลำดับความสำคัญและ overall health

1. ให้ severity: Critical (untested critical paths), High (low coverage), Medium (test quality), Low (naming/style), Info (suggestions)
2. คำนวณ review score ต่อ dimension: coverage, quality, patterns, performance

### 8. Recommend

แนะนำ actions ที่ actionable

> Goal: รู้ว่าทำอะไรก่อน พร้อม estimated effort

1. จัดกลุ่ม: immediate (critical path tests), short-term (coverage gaps), long-term (test refactoring)
2. ทำ `/report-review`, ทำ `/report-table`
3. ทำ `/suggest-next-action`

## Rules

### 1. Objectivity
- ให้คะแนนตาม criteria ไม่ตามความชอบ
- ระบุ evidence ทุก finding

### 2. Actionable
- ทุก finding ต้องมี recommendation
- ถ้า recommendation คือ "เพิ่ม test" → ระบุว่า test อะไรที่ไหน

### 3. Evidence Quality
- แต่ละ finding ต้องมี file path, line number, code snippet

### 4. Scope
- ไม่ review production code quality — อยู่ใน `/review-codebase`
- ถ้าพบ production code issue → ระบุเป็น info เท่านั้น

### 5. Formatting
- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- Review report พร้อม severity ratings, review score, และ recommendations
- Coverage analysis พร้อม gaps และ untested critical paths
- Test quality assessment พร้อม actionable improvements
- ทุก finding มี evidence และ actionable fix
