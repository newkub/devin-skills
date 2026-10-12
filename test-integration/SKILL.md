---
name: test-integration
description: รัน integration tests — module boundaries, DB, external service adapters, wiring ระหว่าง components
argument-hint: "[scope]"
related:
  - run-test
  - test-all
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - run-verify
  - create-report-in-dot-devin
  - report
---

## Goal

รัน integration tests — module boundaries, DB, external service adapters, wiring ระหว่าง components — signals: shared modules, DB clients, service adapters, `*.integration.test.*`, docker-compose test env

## Scope

ใช้เมื่อต้องรัน integration tests — run-only ไม่แก้ tests (analysis ลึก → `/deep-test integration`)

## Execute

> Pre-Run: ทำ `/deep-review` ก่อนเสมอ — `test-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test)

### 1. Detect

`*.integration.test.*`, `tests/integration/`, testcontainers, compose files; dependencies ที่ต้องขึ้น (DB, cache, queue); runner scope (`bunx vitest run '*.integration.test.*'`, `pytest -m integration`, `go test -tags=integration ./...`); monorepo → scope workspace ที่มี shared/service modules

### 2. Run

start dependencies (testcontainers auto-start หรือ compose up) → verify health ก่อนรัน; บันทึก per-test status, dependency logs ถ้า fail; teardown สะอาด ห้ามทิ้ง containers/ports ค้าง

### 3. Classify

boundary/logic fail → source → `/resolve-errors`; fixture/seed ผิด, assertion outdated → test → `/update-tests`; dependency ไม่ขึ้น/port ชน/timeout → environment; shared-state interference → report + `/deep-review`; ซ้ำ ≥3 → stop+report

### 4. Report

persist → `.devin/temp/report/<workspace>/integration-test-<time>.md`; ผ่านหมด → `/run-verify`

## Rules

- run-only (analysis ลึก → `/deep-test integration`)
- ห้าม mock ตัวที่เป็นจุดทดสอบ (เช่น DB ที่ตั้งใจใช้จริง)
- tests isolate — seed ใหม่ต่อ test หรือ transaction rollback
- ห้ามยิง external จริง — local/testcontainers เท่านั้น

## Expected Outcome

- Integration tests รันครบพร้อม dependency lifecycle สะอาด
- Failures ถูก classify เป็น source/test/environment
- Report persist ใน `.devin/temp/report/`
