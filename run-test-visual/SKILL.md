---
name: run-test-visual
description: รัน visual tests — screenshot diffs, design-system regression ผ่าน browser
argument-hint: "[scope]"
related:
  - run-test-all
  - run-test
  - deep-test
  - review-test
  - update-tests
  - resolve-errors
  - follow-tool-playwright
  - create-report-in-dot-devin
  - report
---

## Goal

รัน visual regression tests — screenshot diffs และ design-system regression ผ่าน browser — แล้ว classify failures ว่า intentional change, regression, หรือ environment

## Scope

Runner ของ visual domain เท่านั้น — visual coverage analysis ลึกไป `/deep-test visual` (`deep-test/references/visual.md`); เขียน/แก้ tests → `/update-tests`; เลือกโดย `/run-test-all` เมื่อพบ signals: `playwright` screenshots, Storybook, design system dirs, `*-snapshots/`

- ถ้าต้องการเขียน visual tests ใหม่ → `/update-tests` (run-only skill นี้ไม่เขียน tests)

## Execute

> Pre-Run: ทำ `/review-test` ก่อนเสมอ — `run-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test visual)

### 1. Detect Visual Tooling

> Goal: เลือก runner ตาม artifacts ที่พบจริง

1. ตรวจ artifacts — `*-snapshots/` dirs, `toHaveScreenshot` usage, Storybook config, Percy/Argos config
2. Runner: Playwright screenshots → `bunx playwright test`; Storybook → visual addon/chromatic; Percy → `percy exec -- <test cmd>`
3. ตรวจ baseline snapshots มีครบ — ถ้าไม่มี baseline → รอบแรกสร้าง baseline ไม่ใช่ verify

### 2. Run Visual Tests

> Goal: เปรียบเทียบกับ baseline ภายใต้ environment คงที่

1. รัน suite ใน environment เดียวกับ baseline — browser, viewport, OS, fonts ต้องตรงกัน
2. บันทึกผล: per-snapshot status, diff %, diff image paths
3. ถ้า cross-platform snapshots มีนามแทง platform → รันเฉพาะ platform ของ baseline

### 3. Classify Diffs

> Goal: แยก intentional change กับ regression กับ environment

1. UI เปลี่ยนตั้งใจ → test outdated → `/update-tests` regenerate snapshots (ต้อง confirm ว่า change ถูกต้อง)
2. UI เปลี่ยนผิด (layout แตก, style หาย) → source regression → `/resolve-errors`
3. font/render/timing noise → environment — stabilize (fixed fonts, wait conditions) ไม่แก้ threshold ให้หละหลวม
4. Failure เดิมซ้ำ ≥3 รอบโดยไม่คืบหน้า → stop และ report

### 4. Report

> Goal: รายงาน audit ได้

1. สรุป snapshots compared, pass/fail, diffs พร้อม image paths, classification ต่อ failure
2. persist → `.devin/reports/<workspace>/visual-test-<time>.md` ตาม format `/create-report-in-dot-devin`
3. ผ่านหมดและต้องการ verify ครบวงจร → `/run-verify`

## Rules

### 1. Run Only

- ไม่เขียน/แก้ visual tests ใน skill นี้ → `/update-tests`
- วิเคราะห์ visual coverage ลึก → `/deep-test visual`

### 2. Failure Discipline

- ห้าม regenerate snapshots โดยไม่ตรวจ diff — snapshot update = ยอมรับ change ทุกภาพ
- ห้ามขยาย diff threshold เพื่อให้ผ่านโดยไม่มีเหตุผล

### 3. Deterministic

- snapshots ต้อง reproducible — disable animations, fixed viewport, wait-for-idle ก่อน capture
- baseline ต้องถูกสร้างใน environment เดียวกับรันจริง (OS/browser/fonts)
- ใช้ /run-test-all ถ้าจำเป็น · ใช้ /run-check ถ้าจำเป็น · ใช้ /suggest-next-action ถ้าจำเป็น

## Expected Outcome

- Visual tests รันครบภายใต้ environment ที่ตรง baseline
- Diffs classify เป็น intentional/regression/environment พร้อม diff images
- Report persisted พร้อม per-snapshot results
