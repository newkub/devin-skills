---
name: run-test
description: รัน unit/fast tests ทั้งหมด — auto-detect framework, isolate, report failures พร้อม root cause
argument-hint: "[scope]"
related:
  - review-test
  - run-test-all
  - deep-test
  - run-check
  - run-verify
  - update-tests
  - resolve-errors
  - create-report-in-dot-devin
  - update-docs
  - suggest-next-action
---

## Goal

รัน unit tests / fast tests ของ project ครบทุก framework — detect runner อัตโนมัติ, จัดการ failures แยก source vs test issue, รายงานผลพร้อม root cause

## Scope

ใช้สำหรับรัน unit tests ที่ทดสอบ pure functions, edge cases, parameterized tests ไม่รวม integration, E2E, หรือ component tests (merged from: `run-test-unit`; domain tests ย้ายไป `/deep-test` — api, cli, contract, coverage, e2e, integration, mutation, visual)

ครอบคลุม framework detection: Vitest, Jest, Bun test, Node test runner, Mocha, pytest, go test, cargo test, dotnet test, cargo nextest

- ถ้าต้องการ update/เขียน unit tests → `/update-tests` (run-only skill นี้ไม่แก้ tests)

## Execute

> Pre-Run: ทำ `/review-test` ก่อนเสมอ — `run-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test)

### Domain Dispatch

> Goal: domain tests ไปที่ `/deep-test` — skill นี้ unit tests เท่านั้น

- ถ้า argument คือ domain (`api`, `cli`, `contract`, `coverage`, `e2e`, `integration`, `mutation`, `visual`) → ส่งต่อ `/deep-test <domain>`
- ถ้าไม่ระบุหรือเป็น unit scope → ทำตาม steps ด้านล่างตามปกติ

### 1. Detect Test Framework

> Goal: ตรวจสอบ test framework ที่ project ใช้จริง

1. ตรวจ `package.json` — `scripts.test`, `scripts.test:unit`, devDependencies (`vitest`, `jest`, `@vitest/*`, `mocha`, `tap`, `ava`)
2. ตรวจ config files — `vitest.config.ts`, `vite.config.ts` (test block), `jest.config.*`, `pytest.ini`, `pyproject.toml` ([tool.pytest]), `go.mod`, `Cargo.toml`, `*.csproj`
3. ตรวจ test file patterns — `*.test.*`, `*.spec.*`, `test_*.py`, `*_test.go`, `#[cfg(test)]`, `*_test.rs`, `__tests__/`
4. ถ้า monorepo → ใช้ workspace runner (`moon run :test`, `turbo run test`, `bun run --filter '*' test`, `pnpm -r test`)
5. ถ้าหลาย framework → รันทุกตัวที่พบ รายงานแยกกัน

### 2. Run Tests

> Goal: รัน tests ด้วย command ที่ถูกต้อง

1. Prefer script จาก `package.json` / task runner config เสมอ (เช่น `bun run test`, `bun test`)
2. Fallback ตาม framework:
   - Vitest → `bunx vitest run`
   - Jest → `bunx jest --runInBand` (serial ถ้า flaky) หรือ `bunx jest`
   - Bun → `bun test`
   - Node → `node --test`
   - Python → `pytest` / `python -m pytest`
   - Go → `go test ./...`
   - Rust → `cargo test` หรือ `cargo nextest run`
   - .NET → `dotnet test`
3. ใช้ `--reporter=verbose` หรือ equivalent เมื่อต้องการ per-test results
4. ใช้ filter/pattern เมื่อ scope ระบุ (`bunx vitest run src/foo`, `pytest tests/unit/test_x.py::test_y`, `go test ./pkg/... -run TestX`)
5. บันทึกผลลัพธ์, duration, และรายการ tests ที่ fail

### 3. Classify Failures

> Goal: แยก source issue กับ test issue

1. จำแนกแต่ละ failure:
   - assertion fail → ตรวจว่า expected หรือ actual ผิด
   - error/exception → อ่าน stack trace หา file:line
   - timeout → performance หรือ hanging async
   - environment → missing deps, wrong cwd, missing fixtures
2. ห้ามแก้ assertion ให้ผ่าน — ถ้า source ผิด → แก้ source (`/resolve-errors`); ถ้า test outdated → `/update-tests`
3. ถ้า failure เดิมเกิดซ้ำ → หยุดแล้ว report แทนการวนแก้

### 4. Report

> Goal: รายงานผลชัดเจน

1. สรุป: passed/failed/skipped/total, duration, framework ที่ใช้
2. List failures พร้อม file:line และ classification (source/test/environment)
3. persist raw results → ถ้า runner เป็น Vitest ให้เก็บ JSON ด้วย `vitest run --reporter=json --outputFile=.devin/reports/<workspace>/vitest-<time>.json` แล้วเขียน summary `.devin/reports/<workspace>/unit-test-<time>.md` ตาม format `/create-report-in-dot-devin` — เพื่อให้ `/update-docs` reuse (runner อื่นเขียนแค่ summary md)
4. ถ้ามี coverage flag → ทำ `/deep-test-coverage` ต่อ
5. ถ้า tests ผ่านหมดและต้องการ verify ครบวงจร → `/run-verify`

## Rules

### 1. Test Scope

- Unit tests ทดสอบ pure functions เท่านั้น — ไม่ใช้ real database, network, หรือ file I/O
- ใช้ mocks/stubs สำหรับ dependencies
- แต่ละ test ต้อง independent และรันแยกได้

### 2. Performance

- Unit tests ต้องเร็ว (< 10ms per test โดยเฉลี่ย)
- ไม่มี `setTimeout`/`sleep` ที่ไม่จำเป็น
- ใช้ parallel execution ถ้า framework รองรับ

### 3. Edge Cases

- ทดสอบ happy path, edge cases, และ error cases
- ทดสอบ boundary values, null/undefined/empty inputs
- ทดสอบ parameterized cases

### 4. Failure Discipline

- ห้ามใช้ `.skip`, `.only`, `xit`, `xtest` เพื่อหลีกเลี่ยง failure
- ห้ามแก้ test หรือ source โดยไม่มี evidence จากการตรวจสอบ
- ถ้า failure มาจาก missing dependency → `/run-install`
- ใช้ /run-test-all ถ้าจำเป็น
- ใช้ domain skills ตาม `### Test Domain Skills` dispatch table ถ้าจำเป็น
- ใช้ /run-check ถ้าจำเป็น
- ใช้ /run-watch ถ้าจำเป็น
- ใช้ /suggest-next-action ถ้าจำเป็น

## Expected Outcome

- Unit tests รันครบด้วย runner ที่ถูกต้อง
- Test report แสดงผลชัดเจน พร้อม per-test status
- Failures ถูก classify เป็น source/test/environment พร้อม file:line
- ไม่มีการ suppress failures
