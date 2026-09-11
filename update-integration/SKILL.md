---
name: update-integration
description: Update หรือเขียน integration tests — API, DB, service boundaries แล้วรันจนผ่าน
argument-hint: "[scope]"
related:
  - run-test-integration
  - run-test-api
  - update-test-and-fix
  - update-unit-test
  - improve-tests
  - resolve-errors
  - run-check
  - report
  - suggest-next-action
---

## Goal

อัปเดตหรือเขียน integration tests ให้ครอบคลุม boundaries ปัจจุบัน — API endpoints, database queries, service interactions — แล้วรันจนผ่าน

## Scope

ใช้เมื่อ contracts/boundaries เปลี่ยน (API schema, DB schema, service deps) หรือ integration coverage ขาด — focus เฉพาะ integration layer (หลาย units ทำงานร่วมกัน, real deps หรือ test containers)

- ถ้าต้องการรัน integration tests เฉยๆ → `/run-test-integration`
- ถ้า unit → `/update-unit-test`; ถ้า e2e → `/update-e2e-test`
- ถ้า API contract เฉพาะ → `/run-test-api`; general updates → `/update-test-and-fix`; test suite quality → `/improve-tests`

## Execute

### 1. Detect Setup And Boundaries

> Goal: รู้ integration surface และ test infra

1. ตรวจ test infra เดิม — test DB, containers (testcontainers), fixtures, seed data, API test client
2. map boundaries: HTTP endpoints, DB repositories, external service calls, queues
3. เทียบกับ tests ที่มี → gaps (endpoints ใหม่, schema เปลี่ยน, boundaries ที่ไม่เคย test)

### 2. Update Or Write Tests

> Goal: boundaries ทุกจุดมี integration coverage

1. tests ที่พังจาก contract/schema changes → อัปเดตตาม intended contract
2. เขียน tests สำหรับ gaps: request→response cycle, DB read/write จริง, service integration, error propagation ข้าม boundary
3. ใช้ real instances เมื่อทำได้ (test DB, container) — mock เฉพาะ external services ที่ควบคุมไม่ได้
4. seed/cleanup ต่อ test — ไม่พึ่ง shared state

### 3. Run And Fix

> Goal: tests ผ่านบน environment จริง

1. `/run-test-integration` หรือรัน suite ของ project — เตรียม test env (DB up, migrations applied) ก่อน
2. FAIL → แยก infra issue vs test bug vs app bug — infra → fix setup; app bug → `/resolve-errors`
3. loop จนผ่าน (สูงสุด 3 รอบ)

### 4. Verify

> Goal: suite เสถียรและ isolated

1. รันซ้ำ — ไม่มี cross-test pollution (data leak ระหว่าง tests)
2. `/run-check` lint/typecheck ผ่าน
3. suite duration สมเหตุสมผล — setup/teardown ไม่ช้าเกิน

### 5. Report

> Goal: ส่งมอบ

1. ทำ `/report` — boundaries covered, tests added/updated, env requirements
2. ทำ `/suggest-next-action`

## Rules

### 1. Real Boundaries

- integration tests ต้องใช้ real implementations ที่ boundary (test DB, real HTTP stack) — ไม่ใช่ unit test ปลอม
- mock เฉพาะ third-party ที่ควบคุมไม่ได้จริงๆ

### 2. Isolation

- ทุก test cleanup หลังจบ — ไม่ leak data ให้ test ถัดไป
- ไม่พึ่ง run order หรือ shared fixtures ที่ mutate

### 3. Contract Truth

- tests assert contract จริง (status, schema, side effects) — ไม่ใช่แค่ happy path
- schema/contract เปลี่ยน → อัปเดต tests + flag consumers ที่อาจพัง

### 4. Environment Honest

- ถ้า test ต้อง env พิเศษ (DB, services) → document requirements ชัด
- ห้ามทำให้ tests ผ่านโดย weaken assertions

## Expected Outcome

- integration coverage ครบ boundaries สำคัญ
- suite ผ่านบน test env จริง, isolated, deterministic
- report สรุป coverage และ env requirements
