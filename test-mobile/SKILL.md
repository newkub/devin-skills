---
name: test-mobile
description: รัน mobile app tests — device/emulator flows, gestures, lifecycle, permissions (Maestro, Detox, XCUITest, Espresso)
argument-hint: "[scope] [--platform ios|android]"
related:
  - run-test
  - test-all
  - test-e2e
  - test-visual
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - improve-mobile-app
  - follow-create-mobile
  - follow-create-mobile-cross-with-capacitor
  - run-verify
  - create-report-in-dot-devin
  - report
---

## Goal

รัน mobile app tests บน emulator/simulator/physical device — user flows, gestures, app lifecycle, permissions, platform conventions — signals: `.maestro/` flows, `detox.config.*`, `appium`, `androidTest/`, `*UITests/`, React Native/Capacitor/KMP test configs

## Scope

ใช้เมื่อต้องรัน mobile tests — run-only ไม่แก้ tests (analysis ลึก → `/deep-test`; platform fixes → `/improve-mobile-app`)

- Web E2E บน browser → `/test-e2e`; component-level ไม่ต้อง device → `/test-component`

## Execute

> Pre-Run: ทำ `/deep-review` ก่อนเสมอ — `test-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test)

### 1. Detect

Maestro → `.maestro/` flows (`maestro test`); Detox → `detox.config.*` (`detox test`); native → `androidTest/` (Espresso), `*UITests/` (XCUITest); Capacitor/RN → web-e2e fallback เมื่อไม่มี native suite; ตรวจ prerequisites — emulator/simulator booted, app build, test backend

### 2. Run

boot emulator/simulator ตาม platform flag; รัน flows ตาม suite config; เก็บ screenshots/video/logs ทุก failure; backend ต้องเป็น test/staging env — ห้าม prod APIs

### 3. Classify

app crash/native error → source → `/resolve-errors`; locator/flow outdated → test → `/update-tests`; emulator flaky/boot fail → environment (restart เครื่อง emulator 1 ครั้งแล้ว rerun); permission dialogs → test setup issue; ซ้ำ ≥3 → stop+report

### 4. Report

persist → `.devin/temp/report/<workspace>/mobile-test-<time>.md` — per-flow status, platform, screenshots; ผ่านหมด → `/run-verify`

## Rules

- run-only (analysis ลึก → `/deep-test`)
- ห้ามรันชน production backend — test/staging env เท่านั้น
- Emulator flaky ให้ restart แล้ว rerun 1 ครั้งก่อน classify เป็น test issue
- Cleanup test accounts/data ที่ suite สร้างบน backend

## Expected Outcome

- Mobile flows รันครบตาม platform ที่มี signal พร้อม screenshots
- Failures ถูก classify เป็น source/test/environment
- Report persist ใน `.devin/temp/report/`
