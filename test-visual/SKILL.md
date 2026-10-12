---
name: test-visual
description: รัน visual regression tests — screenshot diffs, design-system regression ผ่าน browser
argument-hint: "[scope]"
related:
  - run-test
  - test-all
  - test-e2e
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - run-verify
  - follow-tool-playwright
  - create-report-in-dot-devin
  - report
---

## Goal

รัน visual regression tests — screenshot diffs, design-system regression ผ่าน browser — signals: `playwright` screenshots, Storybook, design system dirs, `*-snapshots/`

## Scope

ใช้เมื่อต้องรัน visual regression tests — run-only ไม่แก้ tests (analysis ลึก → `/deep-test visual`)

## Execute

> Pre-Run: ทำ `/deep-review` ก่อนเสมอ — `test-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test)

### 1. Detect

`*-snapshots/`, `toHaveScreenshot`, Storybook config, Percy/Argos; runner: Playwright screenshots → `bunx playwright test`, Storybook → visual addon/chromatic, Percy → `percy exec -- <cmd>`; ไม่มี baseline → รอบแรกสร้าง baseline ไม่ใช่ verify

### 2. Run

environment เดียวกับ baseline (browser, viewport, OS, fonts); บันทึก per-snapshot status, diff %, diff image paths; platform-tagged snapshots → รันเฉพาะ platform ของ baseline

### 3. Classify

UI เปลี่ยนตั้งใจ → test outdated → `/update-tests` regenerate (confirm change ถูกต้อง); layout แตก/style หาย → source regression → `/resolve-errors`; font/render/timing noise → environment stabilize (fixed fonts, wait conditions) ห้ามแก้ threshold ให้หละหลวม; ซ้ำ ≥3 → stop+report

### 4. Report

persist → `.devin/temp/report/<workspace>/visual-test-<time>.md` พร้อม diff images; ผ่านหมด → `/run-verify`

## Rules

- run-only (analysis ลึก → `/deep-test visual`)
- ห้าม regenerate snapshots โดยไม่ตรวจ diff — update = ยอมรับทุกภาพ
- ห้ามขยาย threshold โดยไม่มีเหตุผล
- snapshots reproducible — disable animations, fixed viewport, wait-for-idle
- baseline ต้อง environment เดียวกับรันจริง

## Expected Outcome

- Visual tests รันครบทุก snapshot พร้อม diff % และ diff images
- Failures ถูก classify เป็น source/test/environment
- Report persist ใน `.devin/temp/report/` พร้อม diff images
