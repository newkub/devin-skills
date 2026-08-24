---
name: review-correctness
description: Review correctness including type safety, test coverage, tests, formal verification, and side effect
allowed-tools:
  - ask_user_question
  - edit
  - exec
  - glob
  - grep
  - read
triggers:
  - model
  - user
related:
  - review-codebase
  - review-docs
  - review-frontend
  - review-infrastructure
  - review-performance
  - review-quality
  - review-reliability
  - review-security
  - suggest-next-action
  - validate
---

## Goal

Review ความถูกต้องของ code, configuration, rule files, workflows, หรือ skills ตาม criteria, standards, และ requirements ที่ระบุ โดยเน้น correctness, logic, edge cases, และ validation พร้อมรายงาน findings และ review score Review type design, type safety, generics, type inference, narrowing, discri...

## Scope

correctness review สำหรับ: code, configuration, rule files, workflows, skills. ตรวจสอบความถูกต้องตาม criteria ที่ user กำหนด ครอบคลุม:

- correctness: การทำงานตาม requirements, calculations, transformations
- logic: control flow, conditions, type safety, ordering
- edge cases: null, empty, boundary, concurrency, unexpected states
- validation: input, output, schema, sanitization, error handling...

## Execute

### 1. Prepare And Gather Criteria

> Goal: รวบรวม criteria และ context สำหรับ review

1. อ่าน requirements, rules, standards ที่ user ระบุ
2. ถ้าเป็น skill → อ่าน `global_rules.md` และ skill conventions
3. ระบุ criteria ที่ concrete และ measurable
4. ถ้า criteria ไม่ชัด → stop และ `/ask-me`

### 2. Review Checklist

> Goal: ตรวจสอบ correctness, logic, edge cases, และ validation โดยไม่แก้ไข code

ใช้ `read`, `grep`, `exec` หรือ `/use-scripts` scan ไฟล์ที่เกี่ยวข้อง บันทึก findings พร้อม evidence

#### Correctness

- ตรวจสอบว่า code/config ทำงานตาม requirements และ criteria ที่ระบุ
- ตรวจสอบ calculations, transformations, data mappings, serialization
- ตรวจสอบ error handling, defaults, assumptions, invariants
- ตรวจสอบ references, links, และ configuration values

#### Logic

- ตรวจสอบ control flow: `if/else`, `switch`, loops ว่า complete และ correct
- ตรวจสอบ boolean expressions, conditions, short-circuit
- ตรวจสอบ ordering, sequencing, dependencies
- ตรวจสอบ type safety, narrowing, assertions
- หา non-exhaustive `switch`/`if-else` หรือ discriminated unions ที่ขาด case

#### Edge Cases

- ตรวจสอบ `null`/`undefined`, empty, zero, negative, maximum, minimum
- ตรวจสอบ concurrency, race conditions, timeouts, async cancellation
- ตรวจสอบ malformed input, boundary values, unexpected states
- ตรวจสอบ recovery paths และ fallback behavior
- หา implicit assumptions และ unsafe defaults

#### Validation

- ตรวจสอบ input validation, schema validation, output validation
- ตรวจสอบ data contracts, sanitization, type coercion
- ตรวจสอบ error messages, validation coverage across layers
- ตรวจสอบ verify ด้วย tests, commands, scripts เช่น `bun run lint`, `bun run typecheck`

### 3. Validate And Report

> Goal: ยืนยัน findings และรายงานผล

1. ทำ `/validate` เพื่อตรวจ findings
2. ทำ `/deep-validate` เพื่อ validate หลายมิติถ้าจำเป็น
3. จัดลำดับ findings ตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`
### Type Safety Deep Checks

> Goal: เข้าใจ type system และ TypeScript config

1. ทำ `/scan-codebase` เพื่อเข้าใจ type patterns
2. ระบุ TypeScript version, tsconfig strictness, type utility libraries (`type-fest`, `ts-toolbelt`) ที่ใช้
3. ถ้า project ไม่มี่ TypeScript → stop และ report


> Goal: รวบรวม findings จากทุก type dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ type patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้



### Test Coverage Deep Checks

เตรียม context และ scan หา test setup

> Goal: เข้าใจ test framework, structure, และ coverage tools

1. ทำ `/scan-codebase` เพื่อหา test files, config coverage, และ test runner
2. ระบุ test framework: `vitest`, `jest`, `mocha`, `playwright`, `cypress`, หรืออื่น
3. ตรวจสอบ coverage config: provider, thresholds, reporters
4. ทำ `/run-test-coverage` เพื่อดึง coverage report ล่าสุด


ตรวจสอบ coverage ของ business logic สำคัญ

> Goal: ทุก critical path มี test ครอบคลุงหรือระบุ gaps

1. ระบุ business logic functions/classes ทีสำคัญ

### Test Deep Checks

รวบรวม context ก่อน review

> Goal: เข้าใจ test structure, framework, และ coverage ปัจจุบัน

1. ระบุ test target: unit tests, integration tests, E2E tests
2. อ่าน test configs, อ่าน test dependencies, ทำ `/scan-codebase`
3. ระบุ test framework และ runner: `Vitest`, `Jest`, `Playwright`, `Cypress`
4. ถ้าเป็น web project → เพิ่ม `/run-dev` เพื่อ verify dev server


วิเคราะห์ test quality ด้วย review CLI และ rules

> Goal: พบทุก issue พร้อม root cause และ review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ test patterns หลายมิติ

### Formal Verification Deep Checks

> Goal: เข้าใจ formal verification tools และ patterns ที่ใช้

1. ทำ `/scan-codebase` เพื่อเข้าใจ verification structure
2. ระบุ verification tools: property-based testing libraries (`fast-check`, `Hypothesis`, `QuickCheck`), assertion libraries, SMT solvers (`Z3`), static analyzers, runtime verification tools ที่ใช้
3. ระบุ verification patterns: assertions, invariants, contracts, property tests, exhaustive checks ที่มีใน codebase
4. ถ้าเป็น web project → เพิ่ม `/run-dev` เพื่อ verify dev server


> Goal: ครอบคลุมทุก formal verification dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ verification patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้


### Side Effects Deep Checks

> Goal: เข้าใจ side effects patterns ใน codebase

1. ทำ `/scan-codebase` เพื่อหา side effects
2. ระบุ patterns: database, logging, time, randomness, external APIs, file I/O, browser storage, timers, environment, global state mutations
3. ถ้า project ไม่มี side effects → stop และ report


> Goal: ครอบคลุมทุก side effect dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ side effects
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้




## Rules

### 1. Evidence First

- ห้ามเดา issues โดยไม่มี evidence
- ทุก issue ต้องระบุไฟล์ บรรทัด หรือ output
- ใช้ tools หรือ scripts ก่อน manual inspection

### 2. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- แยก review process จาก fix process
- ถ้าต้องแก้ไข ให้ทำ `/resolve-errors` หรือขออนุญาตก่อน

### 3. Scope Control

- review เฉพาะ scope ที่ระบุ
- ถ้าพบ issues นอก scope → รายงาน ไม่แก้โดยไม่ได้รับอนุญาต

### 4. Safety

- ทำ dry run ก่อน destructive fixes
- ไม่แก้ security policies, credentials, หรือ compliance controls

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

### 1. Type Safety Principles

- ไม่ควรมี่ `any` ใน production code — ใช้ `unknown` + type narrowing แทน
- ใช้ type inference จาก schema ไม่ประกาศ type ซ้ำ — ใช้ `satisfies` เมื่อต้องการ type check โดยไม่ lose inference
- ไม่ใช้ `as` assertions โดยไม่จำเป็น — ใช้ type guards, `instanceof`, หรือ proper type definitions แทน
- ไม่ใช้ `@ts-ignore` หรือ `@ts-expect-error` — ระบุ root cause แทนการ suppress
- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 2. Severity Classification

- Critical: `any` ใน critical path, type safety bypass ใน critical path, unsafe assertion ที่ก่อให้เกิด runtime error, `@ts-ignore` ใน critical path
- High: missing type constraint, poor generic design, missing discriminated union, unnecessary assertion, missing branded type for IDs, missing exhaustive check
- Medium: suboptimal inference, missing `as const`, missing `readonly`, minor `any` usage ใน non-critical path, missing type predicate
- Low: cosmetic, minor type improvement, documentation gap

### 3. Skip Conditions

- ถ้า project ไม่มี่ TypeScript → ข้ามทั้งหมด
- ถ้า project ไม่มี่ generics → ข้าม Step 4
- ถ้า project ไม่มี่ discriminated unions → ข้าม Step 5 item 1
- ถ้า project ไม่มี่ branded types/opaque types → ข้าม Step 5 item 3

### 4. Evidence-Based Findings

- ทุก finding ต้องมี่ file path และ line number
- ระบุ type, function, หรือ interface ที่เกี่ยวข้อง

### 5. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

*Some details from merged source skills were condensed to keep the skill under 250 lines.*
