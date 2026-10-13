---
name: test-mobile
description: Run mobile app tests — device/emulator flows, gestures, lifecycle, permissions (Maestro/Detox)
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

Run mobile app tests on an emulator/simulator/physical device — user flows, gestures, app lifecycle, permissions, platform conventions — signals: `.maestro/` flows, `detox.config.*`, `appium`, `androidTest/`, `*UITests/`, React Native/Capacitor/KMP test configs

## Scope

Use when running mobile tests — run-only, does not modify tests (deep analysis → `/deep-test`; platform fixes → `/improve-mobile-app`)

- Web E2E in a browser → `/test-e2e`; component-level needing no device → `/test-component`

## Execute

> Pre-Run: always run `/deep-review` first — `test-*` must be reviewed/assessed before the main work; never skip; if a finding is a blocker, fix or report it before running (test)

### 1. Detect

Maestro → `.maestro/` flows (`maestro test`); Detox → `detox.config.*` (`detox test`); native → `androidTest/` (Espresso), `*UITests/` (XCUITest); Capacitor/RN → web-e2e fallback when there is no native suite; check prerequisites — emulator/simulator booted, app build, test backend

### 2. Run

Boot the emulator/simulator per the platform flag; run flows per the suite config; collect screenshots/video/logs for every failure; the backend must be a test/staging env — never prod APIs

### 3. Classify

App crash/native error → source → `/resolve-errors`; outdated locator/flow → test → `/update-tests`; flaky emulator/boot failure → environment (restart the emulator once and rerun); permission dialogs → test setup issue; repeats ≥3 times → stop+report

### 4. Report

persist → `.devin/temp/report/<workspace>/mobile-test-<time>.md` — per-flow status, platform, screenshots; all pass → `/run-verify`

## Rules

- run-only (deep analysis → `/deep-test`)
- Never run against a production backend — test/staging env only
- For a flaky emulator, restart and rerun once before classifying it as a test issue
- Clean up test accounts/data the suite created on the backend

## Expected Outcome

- Mobile flows fully run on every platform with signals, with screenshots
- Failures classified as source/test/environment
- Report persisted in `.devin/temp/report/`
