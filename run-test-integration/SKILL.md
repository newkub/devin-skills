---
name: run-test-integration
description: รัน integration tests — module boundaries, DB, services — classify source vs test
argument-hint: "[scope]"
related:
  - run-test-all
  - run-test
  - deep-test
  - review-test
  - update-tests
  - resolve-errors
  - create-report-in-dot-devin
  - report
---

## Goal

รัน integration tests — module boundaries, database, external service adapters, wiring ระหว่าง components — แล้ว classify failures ว่า source หรือ test ผิด

## Scope

Runner ของ integration domain เท่านั้น — boundary analysis ลึกไป `/deep-test integration` (`deep-test/references/integration.md`); เขียน/แก้ tests → `/update-tests`; เลือกโดย `/run-test-all` เมื่อพบ signals: shared modules, DB clients, service adapters, `*.integration.test.*`, docker-compose test env

- ถ้าต้องการเขียน integration tests ใหม่ → `/update-tests` (run-only skill นี้ไม่เขียน tests)

## Execute

> Pre-Run: ทำ `/review-test` ก่อนเสมอ — `run-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test integration)

### 1. Detect Integration Tooling

> Goal: เลือก runner + environment ตาม artifacts ที่พบจริง

1. ตรวจ suite — `*.integration.test.*`, `tests/integration/`, testcontainers usage, compose files
2. ตรวจ dependencies ที่ต้องขึ้น — database, cache, message queue (testcontainers หรือ local services)
3. Runner: project test runner scope integration files — เช่น `bunx vitest run '*.integration.test.*'`, `pytest -m integration`, `go test -tags=integration ./...`
4. ถ้า monorepo → scope เฉพาะ workspace ที่มี shared/service modules

### 2. Run Integration Tests

> Goal: รันกับ dependencies จริงที่ suite ต้องการ

1. Start dependencies (testcontainers auto-start หรือ compose up) → verify health ก่อนรัน
2. รัน suite → บันทึก per-test status, duration, dependency logs ถ้า fail
3. Teardown dependencies สะอาดหลังจบ — ห้ามทิ้ง containers/ports ค้าง

### 3. Classify Failures

> Goal: แยก source issue กับ test issue กับ environment

1. boundary/logic fail → source bug → `/resolve-errors`
2. fixture/seed ผิด, assertion outdated → test issue → `/update-tests`
3. dependency ไม่ขึ้น, port ชน, timeout เชื่อมต่อ → environment — แก้ env ไม่แก้ test
4. shared-state interference ระหว่าง tests → report + `/check-test-isolation`
5. Failure เดิมซ้ำ ≥3 รอบโดยไม่คืบหน้า → stop และ report

### 4. Report

> Goal: รายงาน audit ได้

1. สรุป boundaries covered, pass/fail, dependencies ที่ใช้, classification ต่อ failure
2. persist → `.devin/reports/<workspace>/integration-test-<time>.md` ตาม format `/create-report-in-dot-devin`
3. ผ่านหมดและต้องการ verify ครบวงจร → `/run-verify`

## Rules

### 1. Run Only

- ไม่เขียน/แก้ integration tests ใน skill นี้ → `/update-tests`
- วิเคราะห์ boundary coverage ลึก → `/deep-test integration`

### 2. Failure Discipline

- ห้าม `.skip`/`xit` เพื่อให้ผ่าน — แยก source/test/environment ก่อนแก้
- ห้าม mock ตัวที่เป็นจุดทดสอบของ integration (เช่น DB ที่ test ตั้งใจใช้จริง)

### 3. Deterministic

- tests ต้อง isolate — seed state ใหม่ต่อ test หรือ transaction rollback
- ห้ามยิง external services จริง — local/testcontainers เท่านั้น
- ใช้ /run-test-all ถ้าจำเป็น · ใช้ /run-check ถ้าจำเป็น · ใช้ /suggest-next-action ถ้าจำเป็น

## Expected Outcome

- Integration tests รันครบพร้อม dependencies จริงใน controlled environment
- Failures classify เป็น source/test/environment พร้อม evidence
- Environment teardown สะอาด; report persisted พร้อม per-boundary results
