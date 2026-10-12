---
name: run-test
description: Test dispatcher — เลือก test-* skill จาก domain arg หรือ signals (unit default, all = orchestrator) — auto-detect framework
argument-hint: "[scope|domain] [target%]"
related:
  - test-unit
  - test-all
  - test-api
  - test-cli
  - test-contract
  - test-coverage
  - test-e2e
  - test-integration
  - test-mutation
  - test-visual
  - test-load
  - test-smoke
  - test-component
  - test-a11y
  - test-property
  - test-database
  - test-mobile
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - run-check
  - run-verify
  - run-lint
  - run-typecheck
  - report
---

## Goal

Test dispatcher — เลือก `test-*` skill ที่ตรง domain จาก argument หรือ signals แล้ว delegate — unit/fast tests เป็น default; `all` → `/test-all` orchestrator

## Scope

ใช้สำหรับรัน tests ทุกประเภท — skill นี้เป็น dispatcher เท่านั้น ไม่รัน test เอง; workflow จริงอยู่ใน `test-*` skills

ครอบคลุม framework detection (delegated): Vitest, Jest, Bun test, Node test runner, Mocha, pytest, go test, cargo test, dotnet test, cargo nextest

- ถ้าต้องการ update/เขียน tests → `/update-tests`
- ถ้าต้องการ analysis ลึกของ domain (route coverage, exploratory, subagent fan-out) → `/deep-test <domain>`

| No. | Signal ที่พบ | Domain → Skill |
|----:|-------------|----------------|
| 1 | `*.test.*`, `*.spec.*`, vitest/jest/pytest/go test | unit (default) → `/test-unit` |
| 2 | shared modules, DB, services integration | `integration` → `/test-integration` |
| 3 | HTTP endpoints, OpenAPI spec, API routes | `api` → `/test-api` |
| 4 | CLI binary, `bin` field, command definitions | `cli` → `/test-cli` |
| 5 | consumer/provider services, Pact, contract files | `contract` → `/test-contract` |
| 6 | web frontend, browser flows | `e2e` → `/test-e2e` |
| 7 | UI components, design system, screenshots | `visual` → `/test-visual` |
| 8 | coverage config หรือ target กำหนดไว้ | `coverage` → `/test-coverage` (default 100%) |
| 9 | critical logic, mutation config | `mutation` → `/test-mutation` |
| 10 | perf concern, k6/autocannon config, load scripts | `load` → `/test-load` |
| 11 | post-build/deploy sanity, `smoke` scripts/tags, health checks | `smoke` → `/test-smoke` |
| 12 | `@testing-library/*`, Vitest browser, Playwright CT, Storybook | `component` → `/test-component` |
| 13 | axe/pa11y config, WCAG/a11y specs | `a11y` → `/test-a11y` |
| 14 | fast-check/proptest/hypothesis, fuzz targets | `property` → `/test-property` |
| 15 | migrations dir, ORM config, testcontainers, test DB scripts | `database` → `/test-database` |
| 16 | `.maestro/`, detox, androidTest, XCUITest, mobile apps | `mobile` → `/test-mobile` |
| 17 | หลาย domains พร้อมกัน | `all` → `/test-all` (orchestrator) |

## Execute

> Pre-Run: ทำ `/deep-review` ก่อนเสมอ — `test-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test)

### Domain Dispatch

> Goal: เลือก `test-*` จาก argument หรือ signals

- argument เป็น domain (`a11y`, `api`, `cli`, `component`, `contract`, `coverage`, `database`, `e2e`, `integration`, `load`, `mobile`, `mutation`, `property`, `smoke`, `visual`) → ทำ `/test-<domain>`
- argument เป็น `all` → `/test-all`; argument เป็น `unit` → `/test-unit`
- ไม่ระบุหรือเป็น unit scope → `/test-unit` (default)
- หลาย signals พร้อมกันแต่ไม่ได้ระบุ `all` → `/test-all` ให้ orchestrator เลือก

## Rules

- skill นี้เป็น dispatcher เท่านั้น — ห้าม duplicate workflow ของ `test-*` ในไฟล์นี้
- ห้ามใช้ `.skip`, `.only`, `xit`, `xtest` เพื่อหลีกเลี่ยง failure (กำกับโดย `test-*` ปลายทาง)
- ใช้ /run-check ถ้าจำเป็น
- ใช้ /run-watch ถ้าจำเป็น
- ใช้ /suggest-next-action ถ้าจำเป็น

## Expected Outcome

- Domain ถูก dispatch ไป `test-*` ที่ถูกต้อง — unit default, `all` → orchestrator
- Test report persist ใน `.devin/temp/report/` (โดย `test-*` ปลายทาง)
