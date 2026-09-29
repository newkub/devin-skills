---
name: run-test-contract
description: รัน contract tests — consumer/provider pacts, schema conformance ระหว่าง services
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

รัน contract tests — ยืนยัน consumer/provider compatibility และ schema conformance ระหว่าง services — ทั้งสองฝั่งต้องผ่าน

## Scope

Runner ของ contract domain เท่านั้น — analysis ลึกไป `/deep-test contract` (`deep-test/references/contract.md`); เขียน/แก้ tests → `/update-tests`; เลือกโดย `/run-test-all` เมื่อพบ signals: Pact files, `pacts/` dir, pact-broker config, shared schemas (protobuf/JSON Schema), consumer/provider dirs

- ถ้าต้องการเขียน contract tests ใหม่ → `/update-tests` (run-only skill นี้ไม่เขียน tests)

## Execute

> Pre-Run: ทำ `/review-test` ก่อนเสมอ — `run-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test contract)

### 1. Detect Contract Tooling

> Goal: เลือก runner ตาม artifacts ที่พบจริง

1. ตรวจ artifacts — `pacts/*.json`, pact-broker config, `*.contract.test.*`, schema files (`.proto`, JSON Schema)
2. Runner: Pact verifier สำหรับ pact-based; project test runner สำหรับ schema-conformance tests; `schemathesis` สำหรับ OpenAPI-driven contracts
3. ระบุ consumer side กับ provider side ชัดเจน — contract test ต้องรันสองทิศ

### 2. Run Contract Tests

> Goal: verify ทั้ง consumer และ provider

1. Consumer → รัน consumer tests → generate/publish pact
2. Provider → รัน provider verification กับ pact ที่ generate
3. Schema-only → validate responses กับ schema (`schemathesis run`, schema validators)
4. บันทึกผล: per-interaction status, schema violations, breaking changes

### 3. Classify Failures

> Goal: แยก source issue กับ test issue กับ contract drift

1. provider ผิด pact → breaking change ใน source → `/resolve-errors` หรือ report versioning decision
2. consumer expectation เก่า → pact outdated → `/update-tests`
3. broker/env unavailable → environment issue
4. Failure เดิมซ้ำ ≥3 รอบโดยไม่คืบหน้า → stop และ report

### 4. Report

> Goal: รายงาน audit ได้

1. สรุป interactions verified, violations, breaking changes ที่พบ
2. persist → `.devin/temp/report/<workspace>/contract-test-<time>.md` ตาม format `/create-report-in-dot-devin`
3. ผ่านหมดและต้องการ verify ครบวงจร → `/run-verify`

## Rules

### 1. Run Only

- ไม่เขียน/แก้ contract tests ใน skill นี้ → `/update-tests`
- วิเคราะห์ contract coverage ลึก → `/deep-test contract`

### 2. Failure Discipline

- ห้ามแก้ pact/assertion ให้เข้ากับ breaking change โดยไม่ report — contract violation = decision point ไม่ใช่ auto-fix
- แยก source/test/environment ก่อนแก้เสมอ

### 3. Deterministic

- provider verification ต้อง reproducible — fixed fixtures, เวอร์ชัน pact ชัดเจน
- ใช้ /run-test-all ถ้าจำเป็น · ใช้ /run-check ถ้าจำเป็น · ใช้ /suggest-next-action ถ้าจำเป็น

## Expected Outcome

- Consumer + provider verification ผ่านทั้งสองฝั่ง
- Contract violations/breaking changes ถูก report พร้อม evidence
- Report persisted พร้อม per-interaction results
