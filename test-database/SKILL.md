---
name: test-database
description: รัน database tests — migrations up/down, constraints, transactions, query correctness บน ephemeral test DB
argument-hint: "[scope]"
related:
  - run-test
  - test-all
  - test-integration
  - test-contract
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - improve-database
  - follow-lib-drizzle
  - follow-tool-drizzle-kit
  - follow-lib-postgres
  - run-verify
  - create-report-in-dot-devin
  - report
---

## Goal

รัน database tests — migrations up/down roundtrip, constraints/triggers, transaction integrity, query correctness บน ephemeral test database — signals: `migrations/` dir, ORM config (Drizzle, Prisma), `testcontainers`, `*.test` ที่แตะ DB, `DATABASE_URL` test env

## Scope

ใช้เมื่อต้องรัน DB-bound tests — run-only ไม่แก้ tests (analysis ลึก → `/deep-test`; schema design fixes → `/improve-database`)

- Module wiring โดยไม่เจาะ DB semantics → `/test-integration`; API contract → `/test-api`/`/test-contract`

## Execute

> Pre-Run: ทำ `/deep-review` ก่อนเสมอ — `test-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test)

### 1. Detect

`drizzle.config.*`/`prisma/schema.prisma`/`migrations/`/`sql` dirs, testcontainers config, test DB scripts (`db:test`, `test:db`), CI DB services; runner: suite runner ปกติ (`bunx vitest run`, `cargo test`, `pytest`) + migration checks ผ่าน ORM CLI (`drizzle-kit`, `prisma migrate`)

### 2. Run

provision ephemeral DB ก่อน — testcontainers/docker compose/test schema เท่านั้น ห้าม dev/prod DB; รัน migrations up→down→up roundtrip check ถ้า suite ไม่ครอบ; isolate per-test ด้วย transaction rollback หรือ fresh schema; บันทึก per-spec status + migration log

### 3. Classify

migration/constraint fail → schema issue → `/resolve-errors` (route `/improve-database` ถ้า design); assertion/query logic ผิด → source; stale fixtures/migration order → test → `/update-tests`; connection/container/env → environment; ซ้ำ ≥3 → stop+report

### 4. Report

persist → `.devin/temp/report/<workspace>/db-test-<time>.md` — migrations verified, per-spec status; teardown container/DB หลังจบเสมอ; ผ่านหมด → `/run-verify`

## Rules

- run-only (analysis ลึก → `/deep-test`)
- ห้ามรัน tests ชน dev/staging/production DB เด็ดขาด — ephemeral instance เท่านั้น
- Migration tests ต้องเช็ค down migration ด้วย ไม่ใช่แค่ up
- Cleanup test containers/schemas เสมอ — ไม่ทิ้ง state ค้าง

## Expected Outcome

- DB tests + migration roundtrip รันครบบน ephemeral instance
- Failures ถูก classify เป็น source/test/environment
- Report persist ใน `.devin/temp/report/` พร้อม migration log
