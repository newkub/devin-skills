---
name: review-correctness
description: Review implementation correctness ตรวจ logic, types, edge cases, contracts, concurrency, tests
related:
  - review-quality
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

ไม่รวม security, performance, stability, UX/UI — ใช้ `/review-security`, `/review-performance`, `/review-stability`, `/review-uxui` ตามที่เหมาะสม

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ project, requirements, และ test setup

ทำตาม `references/correctness-dimensions.md#prepare-and-scan`

### 2. Requirements And Contract Review

> Goal: ตรวจสอบว่า implementation ตรงกับ requirements และ contracts

ทำตาม `references/correctness-dimensions.md#requirements-and-contracts`

### 3. Type And Static Correctness

> Goal: ตรวจสอบ type safety และ static correctness

ทำตาม `references/correctness-dimensions.md#type-and-static-correctness`

### 4. Logic And Edge Case Review

> Goal: ตรวจสอบ logic, calculations, และ edge cases

ทำตาม `references/correctness-dimensions.md#logic-and-edge-cases`

### 5. Concurrency And State Correctness

> Goal: ตรวจสอบ concurrency, shared state, และ async correctness

ทำตาม `references/correctness-dimensions.md#concurrency-and-state`

### 6. Data Transformation And Serialization

> Goal: ตรวจสอบ data flow, parsing, mapping, และ serialization

ทำตาม `references/correctness-dimensions.md#data-transformation-and-serialization`

### 7. Test Correctness

> Goal: ตรวจสอบว่า tests ตรวจสิ่งที่ต้องการได้จริง

ทำตาม `references/correctness-dimensions.md#test-correctness`

### 8. Validate Score And Report

> Goal: findings ถูกต้อง พร้อม review score

1. ทำ `/deep-validate`
2. ทำตาม `references/validate-score-and-report.md`
3. คำนวณ metrics ตาม `references/scoring.md`
4. ทำ `/report` พร้อม `/report-table` และ `/suggest-next-action`

## Rules

### 1. Scope Boundary

- เน้นความถูกต้องของ implementation ต่อ requirements และ contracts
- ไม่ซ้ำกับ `/review-security`, `/review-performance`, `/review-stability`, `/review-uxui`
- ถ้าพบ issues นอก scope → ระบุเป็น info และแนะนำ sub-skill

### 2. Severity Classification

- `Critical`: wrong business logic, broken invariant, data loss, `any` บน critical path, type assertion ที่ bypass safety, missing error handling ที่ lead to crash, race condition บน critical state
- `High`: off-by-one, missing edge case, incorrect transformation, incomplete `switch`/`if-else`, unsafe `as`/`!`, test ที่ assert ผิด
- `Medium`: implicit assumption, missing boundary check, weak validation, missing fallback บน non-critical path
- `Low`: cosmetic, naming ที่ทำให้เข้าใจ logic ผิด, documentation gap

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
