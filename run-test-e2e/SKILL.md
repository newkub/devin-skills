---
name: run-test-e2e
description: รัน E2E tests ผ่าน browser — user flows จริงจาก entry ถึง outcome
argument-hint: "[scope]"
related:
  - run-test-all
  - run-test
  - deep-test
  - review-test
  - update-tests
  - resolve-errors
  - follow-tool-playwright
  - use-agent-browser
  - create-report-in-dot-devin
  - report
---

## Goal

รัน end-to-end tests ผ่าน browser — user flows จริงจาก entry ถึง outcome — แล้ว classify failures ว่า source, test, หรือ environment

## Scope

Runner ของ E2E domain เท่านั้น — flow/coverage analysis ลึกไป `/deep-test e2e` (`deep-test/references/e2e.md`); เขียน/แก้ tests → `/update-tests`; เลือกโดย `/run-test-all` เมื่อพบ signals: `playwright.config`, `cypress.config`, `e2e/` dirs, web frontend

- ถ้าไม่มี suite แต่ต้อง E2E smoke → ใช้ `agent-browser` headless ตาม `/use-agent-browser`
- ถ้าต้องการเขียน E2E tests ใหม่ → `/update-tests` (run-only skill นี้ไม่เขียน tests)

## Execute

> Pre-Run: ทำ `/review-test` ก่อนเสมอ — `run-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test e2e)

### 1. Detect E2E Tooling

> Goal: เลือก runner ตาม artifacts ที่พบจริง

1. ตรวจ config — `playwright.config.*`, `cypress.config.*`, `e2e/`/`tests/e2e/` dirs
2. Playwright → `bunx playwright test` (installed `mise npm:playwright`); Cypress → `bunx cypress run`
3. ไม่มี suite → `/use-agent-browser` สร้าง headless smoke flow
4. ตรวจ prerequisites — dev server/start command ที่ suite ต้องการ, baseURL, seed data

### 2. Run E2E Tests

> Goal: รันด้วย environment ที่ถูกต้อง

1. Start app ตามที่ suite ต้องการ (webServer config หรือ manual) แล้วรัน suite
2. ใช้ `--reporter=line` + `--retries=0` สำหรับผลที่ซื่อสัตย์ — ปิด retry masking flakiness
3. บันทึกผล: per-spec status, failure screenshots/traces, duration

### 3. Classify Failures

> Goal: แยก source issue กับ test issue กับ flaky

1. element missing/flow broken → source bug → `/resolve-errors`
2. selector outdated/timing assertion → test issue → `/update-tests`
3. flaky (ผ่านบ้าง fail บ้าง) → report flakiness + `/check-test-isolation` — ห้ามเพิ่ม retry เพื่อให้ผ่าน
4. environment (server ไม่ขึ้น, port ชน) → แก้ env ไม่แก้ test
5. Failure เดิมซ้ำ ≥3 รอบโดยไม่คืบหน้า → stop และ report

### 4. Report

> Goal: รายงาน audit ได้

1. สรุป specs covered, pass/fail, flaky list, classification ต่อ failure พร้อม trace paths
2. persist → `.devin/reports/<workspace>/e2e-test-<time>.md` ตาม format `/create-report-in-dot-devin`
3. ผ่านหมดและต้องการ verify ครบวงจร → `/run-verify`

## Rules

### 1. Run Only

- ไม่เขียน/แก้ E2E tests ใน skill นี้ → `/update-tests`
- วิเคราะห์ flow coverage ลึก → `/deep-test e2e`

### 2. Failure Discipline

- ห้าม `.skip`/`xit`/เพิ่ม retries เพื่อให้ผ่าน — flakiness ต้อง report ไม่ mask
- แยก source/test/environment/flaky ก่อนแก้เสมอ

### 3. Deterministic

- E2E ต้องไม่พึ่ง external services จริง — staging/local only; ห้ามยิง production
- ใช้ /run-test-all ถ้าจำเป็น · ใช้ /run-check ถ้าจำเป็น · ใช้ /suggest-next-action ถ้าจำเป็น

## Expected Outcome

- E2E specs รันครบด้วย runner ที่ตรง, prerequisites ครบ
- Failures classify พร้อม evidence (screenshot/trace); flaky ถูกระบุแยก
- Report persisted พร้อม per-spec results
