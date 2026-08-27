---
name: review-correctness
description: Review implementation correctness ตรวจ logic, types, edge cases, contracts, invariants, concurrency, tests
related:
  - review-quality
  - validate
  - deep-validate
  - scan-codebase
  - deep-analyze
  - run-review
  - run-verify
  - run-test
  - run-test-coverage
  - use-ast-grep
  - report-table
  - suggest-next-action
  - review-test
  - review-test-result
---

## Goal

Review implementation correctness ของ code, configuration, และ tests ว่าทำงานตรงตาม requirements, contracts, และ invariants พร้อม severity ratings และ review score

## Scope

ใช้สำหรับ review ความถูกต้องของ:

- `requirements`: expected behavior, acceptance criteria, business rules
- `contracts`: API signatures, type contracts, interface boundaries, pre/post conditions
- `types`: type safety, inference, narrowing, assertions, generic constraints
- `logic`: control flow, calculations, transformations, edge cases, invariants
- `concurrency`: race conditions, ordering, atomicity, shared state, async cancellation
- `data`: serialization, parsing, mapping, validation, sanitization
- `tests`: ว่า tests ตรวจสอบสิ่งที่ต้องการได้จริง

ไม่รวม security, performance, stability, UX/UI — ใช้ `/review-security`, `/review-performance`, `/review-stability`, `/review-uxui` ตามทีเหมาะสม

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ project, requirements, และ test setup

1. ทำ `/scan-codebase` เพื่อเข้าใจ structure, tech stack, และ conventions
2. อ่าน `README.md`, `AGENTS.md`, requirements, acceptance criteria ถ้ามี
3. ระบุ test framework, test files, และ coverage setup
4. ถ้าไม่มี code ทีต้อง review → stop และ report

### 2. Requirements And Contract Review

> Goal: ตรวจสอบว่า implementation ตรงกับ requirements และ contracts

1. เปรียบเทียบ expected behavior กับ actual behavior จาก code
2. ตรวจสอบ API signatures, preconditions, postconditions, invariants
3. ตรวจสอบ business rules, validation rules, และ state machine transitions
4. ดู `references/correctness-dimensions.md` สำหรับรายละเอียด

### 3. Type And Static Correctness

> Goal: ตรวจสอบ type safety และ static correctness

1. รัน `tsc --noEmit` หรือ typecheck ของ project
2. ตรวจสอบ `any`, `as`, non-null assertions, unsafe narrowing
3. ตรวจสอบ generic constraints, discriminated unions, exhaustive checks
4. ทำ `/use-ast-grep` เพื่อหา patterns ทีเสี่ยงต่อ type bugs

### 4. Logic And Edge Case Review

> Goal: ตรวจสอบ logic, calculations, และ edge cases

1. ตรวจสอบ control flow: `if/else`, `switch`, loops ว่าครอบคลุมทุก case
2. ตรวจสอบ calculations, transformations, data mappings, rounding, floating-point
3. ตรวจสอบ edge cases: `null`, `undefined`, empty, zero, negative, boundary values
4. ตรวจสอบ default values, fallback paths, และ error handling
5. ดู `references/correctness-dimensions.md` สำหรับ edge case checklist

### 5. Concurrency And State Correctness

> Goal: ตรวจสอบ concurrency, shared state, และ async correctness

1. ตรวจสอบ race conditions, shared mutable state, และ unsynchronized access
2. ตรวจสอบ async cancellation, timeout, และ resource cleanup
3. ตรวจสอบ ordering ของ events, messages, และ side effects
4. ถ้าไม่มี concurrency → ข้าม step นี้

### 6. Data Transformation And Serialization

> Goal: ตรวจสอบ data flow, parsing, mapping, และ serialization

1. ตรวจสอบ schema validation, input sanitization, และ type coercion
2. ตรวจสอบ serialization/deserialization ระหว่าง layers
3. ตรวจสอบ data mappings: ORM, DTO, API request/response
4. ตรวจสอบ idempotency และ consistency ของ transformations

### 7. Test Correctness

> Goal: ตรวจสอบว่า tests ตรวจสิ่งทีต้องการได้จริง

1. ทำ `/review-test` เพื่อดู test strategy
2. ตรวจสอบว่า tests ไม่ assert ผิด หรือ test happy path อย่างเดียว
3. ตรวจสอบว่า tests มี regression สำหรับ bugs ทีเคยเกิด
4. ทำ `/run-test-coverage` เพื่อดู coverage บน critical paths
5. หลัง run tests ให้ใช้ `/review-test-result` เพื่อวิเคราะห์ผล

### 8. Validate, Score And Report

> Goal: findings ถูกต้อง พร้อม review score

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ
2. ทำ `/validate` สำหรับ issues จาก scripts
3. จัดลำดับ severity: Critical → High → Medium → Low → Info
4. คำนวณ review score โดย weighted average
5. ทำ `/report` พร้อม `/report-table` — ตารางทุกใบต้องมี `No.` เป็นคอลัมน์แรก
6. สร้างตาราง Findings by Category: No., Category, Finding, Severity, Location, Recommendation
7. สร้างตาราง Recommended Actions: No., Priority, Action, Impact, Effort, Workflow
8. ทำ `/suggest-next-action`

## Rules

### 1. Scope Boundary

- เน้นความถูกต้องของ implementation ต่อ requirements และ contracts
- ไม่ซ้ำกับ `/review-security`, `/review-performance`, `/review-stability`, `/review-uxui`
- ถ้าพบ issues นอก scope → ระบุเป็น info และแนะนำ sub-skill

### 2. Severity Classification

- Critical: wrong business logic, broken invariant, data loss, `any` บน critical path, type assertion ที bypass safety, missing error handling ที lead to crash, race condition บน critical state
- High: off-by-one, missing edge case, incorrect transformation, incomplete `switch`/`if-else`, unsafe `as`/`!`, test ที assert ผิด
- Medium: implicit assumption, missing boundary check, weak validation, missing fallback บน non-critical path
- Low: cosmetic, naming ทีทำให้เข้าใจ logic ผิด, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path, line number, และ code snippet
- ระบุ expected behavior, actual behavior, และ reproduction ถ้ามี
- ใช้ `tsc`, `ast-grep`, `run-test` สำหรับ verification
- ไม่เดา

### 4. Skip Conditions

- ถ้าไม่มี type system → ข้าม type correctness checks
- ถ้าไม่มี concurrency → ข้าม concurrency checks
- ถ้าไม่มี tests → ข้าม test correctness checks แต่ flag เป็น gap
- ถ้าไม่มี explicit requirements → ข้าม requirements contract checks แต่ระบุใน report

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`
- ตารางทุกใบต้องมี `No.` เป็นคอลัมน์แรก

## Expected Outcome

- รายงาน correctness findings ครอบคลุมทุก dimension
- Review score ต่อ dimension และ overall
- Severity และ recommendations ชัดเจน
- ไม่ซ้ำซ้อนกับ review skills อื่น
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
