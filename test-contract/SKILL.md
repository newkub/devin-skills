---
name: test-contract
description: รัน contract tests — consumer/provider compatibility + schema conformance ระหว่าง services ทั้งสองฝั่ง
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

รัน contract tests — consumer/provider compatibility + schema conformance ระหว่าง services ทั้งสองฝั่ง — signals: Pact files, `pacts/` dir, pact-broker config, shared schemas (protobuf/JSON Schema), consumer/provider dirs

## Scope

ใช้เมื่อต้องรัน contract tests — run-only ไม่แก้ tests (analysis ลึก → `/deep-test contract`)

## Execute

> Pre-Run: ทำ `/deep-review` ก่อนเสมอ — `test-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test)

### 1. Detect

`pacts/*.json`, pact-broker config, `*.contract.test.*`, `.proto`/JSON Schema; runner = Pact verifier / project runner สำหรับ schema-conformance / `schemathesis` สำหรับ OpenAPI-driven; ระบุ consumer vs provider — ต้องรันสองทิศ

### 2. Run

consumer tests → generate/publish pact → provider verification กับ pact; schema-only → validate responses กับ schema; บันทึก per-interaction status, violations, breaking changes

### 3. Classify

provider ผิด pact → breaking change ใน source → `/resolve-errors` หรือ report versioning decision; consumer expectation เก่า → pact outdated → `/update-tests`; broker/env ไม่พร้อม → environment; ซ้ำ ≥3 → stop+report

### 4. Report

persist → `.devin/temp/report/<workspace>/contract-test-<time>.md`; ผ่านหมด → `/run-verify`

## Rules

- run-only (analysis ลึก → `/deep-test contract`)
- ห้ามแก้ pact/assertion ให้เข้ากับ breaking change โดยไม่มี report — violation = decision point ไม่ใช่ auto-fix
- provider verification ต้อง reproducible — fixed fixtures, pact version ชัดเจน

## Expected Outcome

- Contract tests รันสองทิศ (consumer + provider) พร้อม violations และ breaking changes
- Failures ถูก classify เป็น source/test/environment
- Report persist ใน `.devin/temp/report/`
