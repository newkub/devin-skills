---
name: deep-test
description: Test ละเอียดหลายมิติ — coverage, mutation, security, performance, accessibility
argument-hint: "[scope]"
related:
  - update-test
  - run-test
  - run-test-coverage
  - run-test-unit
  - run-test-integration
  - run-test-e2e
  - test-all
  - watch-test
  - review-test
  - deep-analyze
  - deep-validate
  - follow-tdd
  - follow-tool-playwright
  - follow-tool-stryker-mutator
  - follow-tool-mutants-rs
  - run-bench
---

## Goal

Test ละเอียดหลายมิติเพื่อ verify implementation ครบทั้ง correctness, type safety, coverage, mutation, security, performance, accessibility, contract, property-based

## Scope

ใช้เมื่องาน test ต้องการความละเอียดสูง ครอบคลุมทุก test type และ cross-dimensional validation — ไม่ใช่สำหรับรัน unit test ง่ายๆ เท่านั้น

## Execute

Step dependencies: แต่ละ step ขึ้นกับ step ก่อนหน้าตามลำดับ

### 1. Define Test Scope And Strategy

> Goal: กำหนดขอบเขตและกลยุทธ์การ test อย่างชัดเจน

1. ทำ `/deep-thinking` เพื่อวิเคราะห์เป้าหมายและ risk ของ testing
2. ทำ `/deep-analyze` เพื่อเข้าใจ architecture, tech stack, dependencies
3. ระบุ dimensions ที่ต้อง test: unit, integration, e2e, contract, property-based, mutation, performance, security, accessibility
4. ระบุ target scope: feature, module, workspace, หรือทั้งโปรเจกต์
5. กำหนด coverage target, mutation score, performance baseline, security scenarios
6. บันทึก test strategy ใน `spec/TEST_PLAN.md` ถ้างานซับซ้อน

### 2. Audit Existing Test State

> Goal: วิเคราะห์สถานะ test ปัจจุบัน

1. ตรวจ manifest files: `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`
2. ตรวจ test configs: `vitest.config.*`, `jest.config.*`, `pytest.ini`, `nextest.toml`
3. ทำ `/scan-codebase` เพื่อหา test files, source files, conventions
4. ทำ `/run-test-coverage` เพื่อดู coverage ปัจจุบัน
5. บันทึก gaps: missing test types, low coverage, fragile tests, no security tests

### 3. Design Deep Test Cases

> Goal: ออกแบบ test cases ครอบคลุมทุกมิติ

1. ทำ `/deep-analyze` เพื่อระบุทุก branch, edge case, error path
2. ทำ `/roleplay-qa-tester` เพื่อหา boundary conditions และ edge cases
3. ทำ `/roleplay-attacker` เพื่อหา security scenarios
4. สร้าง test matrix: input × role × state × error condition
5. ใช้ table-driven/parameterized tests สำหรับ boundary values และ permission matrix

### 4. Implement Unit And Integration Tests

> Goal: เขียน unit และ integration tests ตามมาตรฐาน

1. ทำ `/update-test` เพื่อสร้างหรืออัปเดต unit และ integration tests
2. ทำ `/run-test-unit` เพื่อ verify unit tests
3. ทำ `/run-test-integration` เพื่อ verify integration tests
4. ใช้ factories, fixtures, builders สำหรับ test data
5. ตรวจ auth bypass, IDOR, userId injection, sanitization ใน integration tests

### 5. Implement E2E And Contract Tests

> Goal: ครอบคลุม user flow และ API contract

1. ทำ `/run-test-e2e` เพื่อ verify user flows ด้วย Playwright หรือ Cypress
2. ทำ `/follow-tool-playwright` ถ้ายังไม่มี E2E setup
3. ตรวจสอบ API contract ระหว่าง services
4. เพิ่ม contract tests สำหรับ serialization และ schema compatibility
5. ทำ `/test-usage` เพื่อ verify examples ทำงานจริง

### 6. Implement Property And Mutation Tests

> Goal: ตรวจ invariants และ test quality

1. ทำ `/follow-math-probability` สำหรับ property-based invariants
2. ใช้ `fast-check`, `hypothesis`, หรือ `proptest` สำหรับ property-based tests
3. ทำ `/follow-tool-stryker-mutator` สำหรับ JS/TS mutation testing
4. ทำ `/follow-tool-mutants-rs` สำหรับ Rust mutation testing
5. บันทึก mutation score และ fix tests ที่ไม่ฆ่า mutant ได้

### 7. Run Performance And Security Tests

> Goal: ตรวจประสิทธิภาพและความปลอดภัย

1. ทำ `/run-bench` เพื่อวัด performance critical paths
2. ทำ `/roleplay-attacker` เพื่อหา security test scenarios
3. ทำ `/review-security` สำหรับ security review
4. ทำ `/follow-tool-react-scan` ถ้าเป็น React project
5. บันทึก performance baseline และ security findings

### 8. Verify Coverage And Accessibility

> Goal: บรรลุ coverage target และ accessibility

1. ทำ `/run-test-coverage` อีกครั้งเพื่อ verify 100% coverage
2. ทำ accessibility tests สำหรับ UI components ด้วย Playwright Axe ถ้ามี
3. ตรวจ WCAG, ARIA, keyboard navigation สำหรับ UI components
4. ใช้ `/deep-validate` เพื่อตรวจสอบ correctness, cross-references

### 9. Watch And Fix

> Goal: แก้ไข failures จนผ่านทั้งหมด

1. ทำ `/watch-test` เพื่อตรวจ failures อย่างต่อเนื่อง
2. ทำ `/resolve-errors` สำหรับ failing tests
3. retry สูงสุด 3 รอบ ถ้ายังไม่ผ่าน → stop และ report

### 10. Report

> Goal: สรุปผลและแนะนำ next action

1. ทำ `/report-table` สรุป test type, count, pass/fail, coverage, mutation score
2. ทำ `/deep-validate` เพื่อ verify ผลลัพธ์สุดท้าย
3. ทำ `/suggest-next-action` เพื่อแนะนำ next action

## Rules

### 1. Test Quality

- แต่ละ test case มี single responsibility
- ใช้ `Arrange-Act-Assert` pattern
- ไม่แชร์ state ระหว่าง tests
- ใช้ factories/fixtures สำหรับ test data
- ไม่ hardcode secrets หรือ credentials

### 2. Coverage And Mutation

- เป้าหมาย coverage 100% สำหรับ critical paths
- mutation score ไม่ต่ำกว่า 80%
- ทุก branch ต้องมี test
- ทุก error path ต้องมี test

### 3. Security And Accessibility

- ทุก protected endpoint ต้องมี auth test
- ทุก permission check ต้องมี permission matrix test
- ทุก user input ต้องมี validation/sanitization test
- UI components ต้องมี keyboard nav และ ARIA tests ถ้าเกี่ยวข้อง

### 4. Performance

- ระบุ performance threshold ก่อน run benchmark
- เปรียบเทียบ baseline และ regression
- ไม่ยอมรับ flaky tests

### 5. Independence

- แต่ละ test type เป็นอิสระจากกัน
- ใช้ real implementation สำหรับ pure functions
- mock external dependencies เฉพาะที่จำเป็น

## Expected Outcome

- Tests ครอบคลุมทุก type: unit, integration, e2e, contract, property, mutation, performance, security, accessibility
- Coverage 100% สำหรับ critical paths
- Mutation score ผ่านเกณฑ์
- ไม่มี flaky tests หรือ false positives
- รายงานผล test เป็น table พร้อม next action
