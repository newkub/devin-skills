---
name: test-a11y
description: รัน accessibility tests — axe rules, keyboard nav, screen reader semantics, contrast ผ่าน axe-core/pa11y/Lighthouse
argument-hint: "[scope|url]"
related:
  - run-test
  - test-all
  - test-component
  - test-e2e
  - test-visual
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - improve-a11y
  - improve-uxui
  - follow-tool-lighthouse
  - follow-tool-unlighthouse
  - create-report-in-dot-devin
  - report
---

## Goal

รัน accessibility tests — WCAG violations, keyboard navigation, screen reader semantics, color contrast — signals: `axe`/`jest-axe`/`@axe-core/*`, `pa11y` config, Lighthouse a11y audits, `.a11y.` specs

## Scope

ใช้เมื่อต้องรัน accessibility tests — run-only ไม่แก้ tests (analysis ลึก → `/deep-test`; fix findings → `/improve-a11y` หรือ `/deep-review` domain `review-accessibility`)

## Execute

> Pre-Run: ทำ `/deep-review` ก่อนเสมอ — `test-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test)

### 1. Detect

`axe-core`, `jest-axe`, `@axe-core/playwright`, `pa11y`, `@storybook/addon-a11y`, Lighthouse a11y category; runner: axe in Playwright/Vitest → รัน spec suite, pa11y → `bunx pa11y <url>`, site-wide → `/follow-tool-unlighthouse`, single page → `/follow-tool-lighthouse`

### 2. Run

axe suite → รัน spec ปกติ; ad-hoc บน running app → `@axe-core/playwright` scan ต่อ route หรือ `pa11y <url>`; manual checks ที่ tools ไม่ครอบ → keyboard-only walkthrough, focus order, zoom 200%; บันทึก violations พร้อม WCAG rule id + severity

### 3. Classify

violation จริง (missing label, contrast, focus trap, missing landmark) → source → `/resolve-errors` หรือ `/improve-a11y`; rule config ผิด/false positive → test → `/update-tests`; scan env ไม่พร้อม (page ไม่โหลด) → environment; ซ้ำ ≥3 → stop+report

### 4. Report

persist → `.devin/temp/report/<workspace>/a11y-test-<time>.md` — violations ต่อ route/component พร้อม WCAG level (A/AA), severity (critical/serious/moderate/minor), element selector; ผ่านหมด → `/run-verify`

## Rules

- run-only (analysis ลึก → `/deep-test`; fix findings → `/improve-a11y`)
- ห้าม disable axe rules โดยไม่มี justification ใน config comment
- Severity ordering: critical/serious ก่อน — block merge ถ้า public-facing
- ห้ามพึ่ง automated scan อย่างเดียว — axe ครอบ ~40% ของ WCAG; flag จุดที่ต้อง manual check (focus order, screen reader flow)

## Expected Outcome

- A11y violations ต่อ route/component พร้อม WCAG ref + severity
- Failures ถูก classify เป็น source/test/environment
- Report persist ใน `.devin/temp/report/`
