---
name: write-test
description: เขียน test ที่มีคุณภาพสูง ครอบคลุมทุกกรณีใช้งาน ใช้ได้กับทุกภาษา
---

## Goal

เขียน test ที่มีคุณภาพสูง ครอบคลุมทุกกรณีใช้งาน ตรงตาม location ที่กำหนด ใช้ได้กับทุก programming language

## Scope

เขียน test files ทั้งหมดใน workspace ตาม test pyramid, conventions, และความปลอดภัย — ใช้ `/follow-content-quality` เพื่อคุณภาพเนื้อหา

## Execute

### 1. Detect Test Framework And Define Strategy

> Goal: ตรวจสอบ test framework และกำหนด testing strategy ก่อนเขียน spec

1. ตรวจสอบ `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod` หรือ manifest ทั้งหมดสำหรับ test dependencies (`vitest`, `jest`, `pytest`, `go test`)
2. ตรวจสอบ config files (`vitest.config.ts`, `jest.config.js`, `pytest.ini`)
3. ตรวจสอบ coverage tools ที่ framework รองรับ (`c8`, `istanbul`, `coverage.py`, `go test -cover`)
4. กำหนด test pyramid ที่เหมาะสม (unit, integration, e2e)
5. กำหนด test types ที่จำเป็น (unit, integration, e2e, contract, property-based, mutation, performance, security, accessibility, visual regression)
6. กำหนด coverage targets สำหรับแต่ละ test type
7. กำหนด test priorities ตาม criticality
8. กำหนด test environments (local, staging, production)
9. กำหนด test data strategy: `factories` สำหรับ dynamic data, `fixtures` สำหรับ static data, `builders` สำหรับ complex objects
10. กำหนด mock strategy: mock external dependencies (DB, API, email) แต่ใช้ real implementations สำหรับ internal pure functions

### 2. Analyze Source Code

> Goal: อ่านและวิเคราะห์ source code ที่จะ test ก่อนเขียน

1. อ่าน source file ทั้งหมดที่เกี่ยวข้อง (handler, service, utils, types)
2. ระบุทุก branch และ code path (`if/else`, `try/catch`, `switch`, ternary, optional chaining)
3. ระบุ external dependencies ที่ต้อง mock (database, API, auth, email, payment)
4. ระบุ input parameters และ validation rules (Zod schemas, type constraints)
5. ระบุ output shapes และ error response patterns
6. ระบุ security-critical logic (auth checks, permission checks, userId injection, sanitization)
7. ระบุ async patterns (promises, streams, generators, event emitters) ที่ต้อง test
8. สร้าง branch map: นับจำนวน branches ทั้งหมดเพื่อคำนวณ minimum test cases ที่จำเป็น

### 3. Organize, Write Spec, And Improve Naming

> Goal: ย้าย test files ไว้ใน location ที่ถูกต้อง สร้าง spec และปรับปรุง naming ก่อนเขียน test

1. ย้าย test files ที่กระจัดกระจายมาไว้ใน location ที่ถูกต้องตาม Rule 3
2. ทำ `/review-codebase` เพื่อตรวจ naming และ structure
3. ถ้า fail → retry (max 3 → stop/report)

### 4. Write Spec

> Goal: เขียน spec files ใน `spec/` ตาม test files ที่มีอยู่

1. อ่าน test files ทั้งหมดใน `tests/`
2. สร้าง `spec/overview.md` ระบุ framework, coverage threshold และ structure
3. แยก spec เป้นไฟล์ย่อยๆ ตาม modules/features
4. บันทึก test cases ทั้งหมดแบบกระชับ พร้อม status tracking
5. แต่ละ spec file ไม่เกิน 250 บรรทัด — ถ้าเกินให้ refactor แยกไฟล์

### 5. Write Tests

> Goal: เขียน test ตามประเภทและ conventions ของภาษาที่ใช้ ครอบคลุมทุก category — reminder: workflow goal คือ test ที่มีคุณภาพสูงครอบคลุมทุกกรณี

Required categories (ทุก handler/function):

1. Happy path: input ที่ถูกต้อง -> expected output
2. Error path: dependency throw -> error response ที่ถูกต้อง
3. Edge cases: empty input, null/undefined, boundary values (min, max, min-1, max+1)
4. Unauthorized: auth missing หรือ invalid -> throw หรือ error response
5. Input validation: invalid input ที่ผิด schema -> validation error

Conditional categories (เมื่อมี logic ที่เกี่ยวข้อง):

6. Permission/RBAC: user ไม่มี permission -> deny
7. IDOR/Ownership: user เข้าถึง resource ของ user อื่น -> deny
8. Sanitization: user input ที่มี malicious content -> sanitized output
9. userId injection: ตรวจสอบว่า userId มาจาก auth ไม่ใช่จาก input (security)
10. Empty results: query return empty array/undefined -> handle ถูกต้อง
11. Boundary values: ค่า min/max ของ numeric input
12. Optional fields: ส่งและไม่ส่ง optional fields -> ทำงานถูกต้องทั้งคู่
13. Concurrency: race conditions, parallel calls (เฉพาะ stateful operations)
14. Snapshot: UI component output, serialized data ที่เปลี่ยนน้อย — ใช้ sparingly
15. Regression: bug fix ต้องมี test ป้องกัน recurrence
16. Contract: API compatibility ระหว่าง services
17. Property-based: invariants ที่ต้องเป็นจริงทุก input (เช่น `forall x: f(g(x)) = x`)
18. Accessibility: UI components ต้องผ่าน WCAG, ARIA, keyboard nav
19. Performance: critical paths ต้องไม่ช้ากว่า threshold

Use `parameterized tests` (`it.each`, `table-driven`) สำหรับ:

- Boundary values หลายค่า (เช่น rating 1, 2, 3, 4, 5)
- Input validation หลายกรณี (เช่น missing required fields แต่ละ field)
- Permission matrix (role x action)

### 6. Run Tests

> Goal: รัน tests หลังเขียนเสร็จเพื่อ verify ว่าผ่านทั้งหมด

1. รัน test script ตาม ecosystem (`bun|npm run test`, `cargo test`, `pytest`, `go test ./...`)
2. แก้ไข failing tests จนผ่านทั้งหมด — retry max 3 → stop/report
3. ตรวจสอบว่าไม่มี test ที่ pass เพราะเหตุผลผิด (false positive)
4. ตรวจสอบว่า error path tests จริงๆ ทดสอบ error ไม่ใช่แค่ทดสอบว่าไม่ throw

### 7. Verify Coverage

> Goal: ตรวจสอบ coverage และเขียน tests ที่ขาดเพิ่มเติม

1. ทำ `/review-codebase` เพื่อวิเคราะห์ coverage gaps และบรรลุ 100%
2. ทำ `/run-test-coverage` เพื่อ verify coverage ทุก category (lines, branches, functions, statements)
3. ถ้าพบ gaps ให้ทำ `/review-quality` เพื่อเขียน tests ที่ขาด

### 8. Sync And Verify

> Goal: อัพเดท SPEC.md ด้วย test cases ที่เขียนแล้ว

1. อัพเดท `spec/SPEC.md` หรือเอกสาร test plan ด้วย test cases ที่เขียนแล้ว
2. ถ้า fail → retry (max 3 → stop/report)

## Rules

### 1. Test Principles

- ตั้งชื่อ test: `should [expected behavior] when [condition]`
- Follow `AAA` pattern (`Arrange`, `Act`, `Assert`)
- Test แค่สิ่งเดียวต่อ test case (`Single Responsibility`)
- ไม่แชร์ state ระหว่าง tests (`isolated`)
- Test ทั้ง `happy path`, `edge cases`, `error cases`, `boundary conditions`
- ใช้ `parameterized tests` สำหรับกรณีที่ test ซ้ำๆ กันหลายค่า

### 2. Language Conventions

ทำตาม conventions ของภาษาที่ใช้: TypeScript ใช้ `vitest/jest`, Go ใช้ `*_test.go` table-driven, Python ใช้ `pytest`, Rust ใช้ `#[test]`, Java ใช้ `JUnit`, C# ใช้ `xUnit`, Ruby ใช้ `rspec`, PHP ใช้ `PHPUnit`

### 3. File Organization

- Unit tests: ใน `tests/unit/` หรือ `__tests__/` ข้าง source
- Integration tests: ใน `tests/integration/`
- E2E tests: ใน `tests/e2e/`
- Test utilities: ใน `tests/utils/` (helpers, mocks, setup, assertions)
- Test data: ใน `tests/fixtures/` (data, factories, snapshots)
- Follow existing pattern: ถ้า project มี colocated tests อยู่แล้ว ให้ตาม pattern นั้น
- Don't mix: อย่ามีทั้ง colocated และ separate สำหรับ unit tests ในหลายระดับ

### 4. Naming And Data

- Test files: ใช้ชื่อเดียวกับ source ต่อท้ายด้วย `.test`, `.spec`, หรือ `_test`
- ใช้ `factories`, `fixtures`, `builders` สร้าง test data
- Clean up test data หลังแต่ละ test (`afterEach`, `teardown`)
- ไม่ hardcode sensitive data (passwords, API keys, tokens)

### 5. Mocking and Security

- Mock external dependencies เฉพาะที่จำเป็น
- ใช้ interfaces/ports สำหรับ test doubles
- Restore/cleanup mocks หลังแต่ละ test
- ไม่ hardcode credentials ใน test files
- ใช้ environment variables สำหรับ secrets
- ใช้ `test databases` แยกจาก production

### 6. Performance

- Unit tests: `< 10ms` ต่อ test
- Integration tests: `< 100ms` ต่อ test
- ใช้ `parallel execution` เมื่อ tests ไม่ dependent กัน
- Coverage verification และ 100% enforcement อยู่ใน `/review-codebase` และ `/run-test-coverage`

### 7. Testing Strategy Per Type

- Unit (70%): pure functions, handlers, utils — mock dependencies — `< 10ms` ต่อ test
- Integration (20%): API endpoints, DB queries, service interactions — real or test DB — `< 100ms` ต่อ test
- E2E (10%): user flows, critical paths — real browser/environment — ใช้ `Playwright` หรือเทียบเท่า
- Contract: API schema compatibility ระหว่าง services — ใช้ `pact` หรือ schema validation
- Property-based: invariants ที่ต้องเป็นจริงทุก input — ใช้ `fast-check` หรือ `hypothesis`
- Mutation: ตรวจสอบ test quality — ใช้ `stryker` หรือ `cargo-mutants` — รันใน CI
- Performance: critical paths ไม่ช้ากว่า threshold — รันใน CI เพื่อจับ regressions
- Security: auth bypass, IDOR, injection, rate limiting — รันใน CI
- Accessibility: WCAG, ARIA, keyboard nav — รันใน CI สำหรับ UI components

### 8. Test Code Quality And Assertions

- DRY: extract repeated test setup เป็น helper functions ใน `test-utils.ts`
- No type casting: หลีกเลี่ยง `as unknown as` ซ้ำๆ สร้าง typed helper แทน
- Descriptive assertions: ใช้ `expect.objectContaining` และ `expect.arrayContaining`
- Assert behavior ไม่ใช่ implementation: ตรวจสอบ output/result ไม่ใช่ว่าเรียก function อะไร
- Assert error shape: ตรวจสอบ error message และ structure ไม่ใช่แค่ว่ามี error
- Assert side effects: ถ้า function มี side effect ต้อง assert ด้วย
- Avoid fragile assertions: ไม่ assert ค่าที่ non-deterministic ใช้ `expect.any(Date)` หรือ `expect.any(String)`
- Avoid test interdependence: แต่ละ test ต้องรันได้อิสระ

### 9. Security And Handler Test Patterns

- Auth bypass: ส่ง request โดยไม่มี auth -> ต้อง reject
- IDOR: user A เข้าถึง resource ของ user B -> ต้อง deny
- userId injection: ตรวจสอบว่า userId มาจาก `auth.userId` ไม่ใช่จาก `input.userId`
- Sanitization: ส่ง XSS/malicious input -> ต้อง sanitized ก่อนเก็บ
- Permission matrix: ทุก role x action ต้องมี test (ใช้ `it.each`)
- Extract handler: ดึง handler จาก router object แล้วเรียกโดยตรงใน test
- Mock dependencies: mock service layer, auth, database, external APIs
- Test input -> output mapping: ส่ง input ผ่าน handler แล้วตรวจสอบ output
- Test error fallback: เมื่อ service throw ต้อง return fallback ที่ถูกต้อง

## Expected Outcome

- Test files อยู่ใน location ที่ถูกต้องตาม conventions
- Tests ครอบคลุมทุก category และ test type (unit, integration, e2e, contract, property-based, mutation, performance, security, accessibility)
- Tests รันผ่านทั้งหมด ไม่มี false positive
- Coverage 100% ผ่าน `/review-codebase` และ `/run-test-coverage`
- Test code มีคุณภาพ (DRY, readable, typed helpers, no type casting)
- Test data ใช้ factories/fixtures/builders ตาม strategy
- `spec/SPEC.md` หรือเอกสาร test plan ถูกอัพเดทด้วย test cases ที่เขียนแล้ว
