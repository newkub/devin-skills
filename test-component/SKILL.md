---
name: test-component
description: รัน component tests — render component เดี่ยวแยก DOM, user events, props/states (Testing Library, Vitest browser, Playwright CT, Storybook)
argument-hint: "[scope]"
related:
  - run-test
  - test-all
  - test-unit
  - test-e2e
  - test-visual
  - test-a11y
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - run-verify
  - create-report-in-dot-devin
  - report
---

## Goal

รัน component tests — render component เดี่ยวแยกจาก app (DOM isolation), ทดสอบ props, states, user events — signals: `@testing-library/*`, `*.test.tsx` ที่ render, Playwright CT (`ct`/experimental), Storybook test-runner, Vitest browser mode

## Scope

ใช้เมื่อต้องรัน component-level tests — run-only ไม่แก้ tests (analysis ลึก → `/deep-test`)

- Logic pure ไม่แตะ DOM → `/test-unit`; full user flows ทั้ง app → `/test-e2e`; screenshot diffs → `/test-visual`; axe checks บน rendered component → `/test-a11y`

## Execute

> Pre-Run: ทำ `/deep-review` ก่อนเสมอ — `test-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test)

### 1. Detect

`@testing-library/{react,vue,solid,dom}`, `vitest --browser`, `playwright/experimental-ct-*`, `@storybook/test-runner`, `happy-dom`/`jsdom` ใน test config; runner: Vitest → `bunx vitest run`, Playwright CT → `bunx playwright test -c playwright-ct.config.*`, Storybook → `bunx test-storybook`

### 2. Run

รันเฉพาะ component specs (pattern filter ตาม scope); env ต้องตรง — jsdom/happy-dom tests ห้ามพึ่ง browser APIs จริง, browser-mode tests ต้อง headless config; บันทึก per-spec status, duration, errors

### 3. Classify

render crash/prop contract fail → source → `/resolve-errors`; selector outdated/wait timing → test → `/update-tests`; DOM env ไม่ตรง (browser API missing ใน jsdom) → environment; flaky ซ้ำ ≥3 → stop+report

### 4. Report

persist → `.devin/temp/report/<workspace>/component-test-<time>.md` — per-spec status + classification; ผ่านหมด → `/run-verify`

## Rules

- run-only (analysis ลึก → `/deep-test`)
- Component tests isolate component เดียว — mock providers/stores/network, ห้าม render ทั้ง app
- เลือก queries ตาม accessibility (role/label) ไม่ใช่ css selectors — ตรวจใน classify
- ห้าม `.skip`/`.only` เพื่อหลีกเลี่ยง failure

## Expected Outcome

- Component tests รันครบตาม scope พร้อม per-spec status
- Failures ถูก classify เป็น source/test/environment
- Report persist ใน `.devin/temp/report/`
