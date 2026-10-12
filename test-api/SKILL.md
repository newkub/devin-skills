---
name: test-api
description: รัน API/HTTP tests — endpoints, request/response contracts, OpenAPI conformance
argument-hint: "[scope]"
related:
  - run-test
  - test-all
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - run-verify
  - follow-tool-hurl
  - follow-tool-bruno
  - create-report-in-dot-devin
  - report
---

## Goal

รัน API/HTTP tests — endpoints, request/response contracts, OpenAPI conformance — signals: `routes/`, `controllers/`, `openapi.yaml`, `*.hurl`, `*.bru`, collection files

## Scope

ใช้เมื่อต้องรัน API/HTTP tests — run-only ไม่แก้ tests (เขียน/แก้ → `/update-tests`; analysis ลึก → `/deep-test api`)

## Execute

> Pre-Run: ทำ `/deep-review` ก่อนเสมอ — `test-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test)

### 1. Detect

`*.hurl`, `*.bru`/Bruno collections, `*.api.test.*`, `*.http.test.*`, Postman/Newman; spec → `schemathesis run` fuzzing; framework tests (Playwright APIRequestContext, supertest, fastify inject, httpx); monorepo → scope เฉพาะ workspace ที่มี API surface

### 2. Run

Hurl → `hurl --test <files>`; Bruno → `bru run`; Schemathesis → `schemathesis run <spec>`; framework → runner scope (`bunx vitest run '*.api.test.*'`, `pytest tests/api/`); บันทึก per-endpoint status, status codes, mismatches

### 3. Classify

`5xx`/unhandled → source → `/resolve-errors`; schema/assertion mismatch → contract เปลี่ยนจริง (source) หรือ test outdated → `/update-tests`; connection refused/missing env → environment; ซ้ำ ≥3 → stop+report

### 4. Report

persist → `.devin/temp/report/<workspace>/api-test-<time>.md`; ผ่านหมด → `/run-verify`

## Rules

- run-only (เขียน/แก้ → `/update-tests`; analysis ลึก → `/deep-test api`)
- ห้าม `.skip`/`xit`; ห้ามแก้ assertion ให้อ่อนลง
- ห้ามยิง external services จริง — local server/fixtures เท่านั้น

## Expected Outcome

- API tests รันครบทุก endpoint พร้อม per-endpoint status และ mismatches
- Failures ถูก classify เป็น source/test/environment
- Report persist ใน `.devin/temp/report/`
