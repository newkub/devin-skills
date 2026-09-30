---
name: run-test-api
description: รัน API tests — endpoints, OpenAPI conformance, HTTP behavior — classify source vs test
argument-hint: "[scope]"
related:
  - run-test-all
  - run-test
  - deep-test
  - deep-review
  - update-tests
  - resolve-errors
  - follow-tool-hurl
  - follow-tool-bruno
  - create-report-in-dot-devin
  - report
---

## Goal

รัน API/HTTP tests ของ project — endpoints, request/response contracts, OpenAPI conformance — detect tooling แล้ว classify failures ว่า source หรือ test ผิด โดยไม่แก้ให้ผ่านอัตโนมัติ

## Scope

Runner ของ API domain เท่านั้น — spec/coverage analysis ลึกไป `/deep-test api` (`deep-test/references/api.md`); เขียน/แก้ tests → `/update-tests`; เลือกโดย `/run-test-all` เมื่อพบ signals: `routes/`, `controllers/`, `openapi.yaml`, `*.hurl`, `*.bru`, collection files

- ถ้าต้องการเขียน API tests ใหม่ → `/update-tests` (run-only skill นี้ไม่เขียน tests)

## Execute

> Pre-Run: ทำ `/deep-review` ก่อนเสมอ — `run-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test api)

### 1. Detect API Tooling

> Goal: เลือก runner ตาม artifacts ที่พบจริง

1. ตรวจ suite files — `*.hurl`, `*.bru`/Bruno collections, `*.api.test.*`, `*.http.test.*`, Postman/Newman collections
2. ตรวจ spec — `openapi.yaml`/`openapi.json` → property-based fuzzing ด้วย `schemathesis`
3. ตรวจ framework tests — `playwright` APIRequestContext, supertest, fastify inject, httpx-based suites
4. ถ้า monorepo → scope เฉพาะ workspace ที่มี API surface

### 2. Run API Tests

> Goal: รันด้วย tool ที่ตรง artifacts

1. Hurl → `hurl --test <files>`; Bruno → `bru run`; Schemathesis → `schemathesis run <spec-url-or-file>`
2. Framework tests → project runner scope API files (`bunx vitest run '*.api.test.*'`, `pytest tests/api/`)
3. บันทึกผล: per-endpoint status, status codes, response mismatches, duration

### 3. Classify Failures

> Goal: แยก source issue กับ test issue

1. `5xx`/unhandled error → source bug → `/resolve-errors`
2. schema/assertion mismatch → ตรวจว่า contract เปลี่ยนจริง (source) หรือ test outdated → `/update-tests`
3. connection refused/missing env → environment issue — แก้ env ไม่แก้ test
4. Failure เดิมซ้ำ ≥3 รอบโดยไม่คืบหน้า → stop และ report

### 4. Report

> Goal: รายงาน audit ได้

1. สรุป endpoints covered, pass/fail, spec violations, classification ต่อ failure
2. persist → `.devin/temp/report/<workspace>/api-test-<time>.md` ตาม format `/create-report-in-dot-devin`
3. ผ่านหมดและต้องการ verify ครบวงจร → `/run-verify`

## Rules

### 1. Run Only

- ไม่เขียน/แก้ API tests ใน skill นี้ → `/update-tests`
- วิเคราะห์ route/spec coverage ลึก → `/deep-test api`

### 2. Failure Discipline

- ห้าม `.skip`/`xit` เพื่อให้ผ่าน — แยก source/test/environment ก่อนแก้
- ห้ามแก้ assertion ให้อ่อนลง; source ผิด → `/resolve-errors`, test ผิด → `/update-tests`

### 3. Deterministic

- tests ต้องไม่ยิง external services จริง — ใช้ local server/test fixtures เท่านั้น
- ใช้ /run-test-all ถ้าจำเป็น · ใช้ /run-check ถ้าจำเป็น · ใช้ /suggest-next-action ถ้าจำเป็น

## Expected Outcome

- API tests รันครบด้วย runner ที่ตรง artifacts
- Failures classify เป็น source/test/environment พร้อม evidence
- Report persisted พร้อม per-endpoint results
