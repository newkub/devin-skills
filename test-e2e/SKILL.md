---
name: test-e2e
description: รัน end-to-end tests ผ่าน browser — user flows จริงจาก entry ถึง outcome (Playwright/Cypress/agent-browser)
argument-hint: "[scope]"
related:
  - run-test
  - test-all
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - run-verify
  - follow-tool-playwright
  - use-agent-browser
  - use-chrome-devtools
  - create-report-in-dot-devin
  - report
---

## Goal

รัน end-to-end tests ผ่าน browser — user flows จริงจาก entry ถึง outcome — signals: `playwright.config`, `cypress.config`, `e2e/` dirs, web frontend; ไม่มี suite แต่ต้อง smoke/interact → `agent-browser` headless ตาม `/use-agent-browser`; smoke/debug ผ่าน MCP ที่ register อยู่ → `chrome-devtools-mcp` ตาม `/use-chrome-devtools`

## Scope

ใช้เมื่อต้องรัน e2e tests — run-only ไม่แก้ tests (analysis ลึก → `/deep-test e2e`)

## Execute

> Pre-Run: ทำ `/deep-review` ก่อนเสมอ — `test-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test)

### 1. Detect

`playwright.config.*`, `cypress.config.*`, `e2e/`/`tests/e2e/`; Playwright → `bunx playwright test`; Cypress → `bunx cypress run`; ตรวจ prerequisites — dev server/start command, baseURL, seed data

### 2. Run

start app ตาม suite ต้องการ (webServer config หรือ manual) แล้วรัน; `--reporter=line` + `--retries=0` ผลซื่อสัตย์ ห้าม retry mask flakiness; บันทึก per-spec status, screenshots/traces, duration

### 3. Classify

element missing/flow broken → source → `/resolve-errors`; selector outdated/timing → test → `/update-tests`; flaky → report + `/deep-review` ห้ามเพิ่ม retry; server ไม่ขึ้น/port ชน → environment; ซ้ำ ≥3 → stop+report

### 4. Report

persist → `.devin/temp/report/<workspace>/e2e-test-<time>.md` พร้อม trace paths; ผ่านหมด → `/run-verify`

## Rules

- run-only (analysis ลึก → `/deep-test e2e`)
- ห้าม `.skip`/`xit`/เพิ่ม retries
- ห้ามพึ่ง external services จริง — staging/local only ห้ามยิง production

## Expected Outcome

- E2E tests รันครบทุก spec พร้อม screenshots/traces
- Failures ถูก classify เป็น source/test/environment (flaky แยก)
- Report persist ใน `.devin/temp/report/` พร้อม trace paths
