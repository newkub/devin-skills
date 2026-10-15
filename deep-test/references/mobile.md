# Deep Test — Mobile Domain

Run mobile app tests on an emulator/simulator/physical device — user flows, gestures, app lifecycle, permissions, platform conventions (merged from `/test-mobile`)

Signals: `.maestro/` flows, `detox.config.*`, `appium`, `androidTest/`, `*UITests/`, React Native/Capacitor/KMP test configs

- Web E2E in a browser → `/deep-test e2e`; component-level needing no device → `/deep-test component`; platform/design fixes → `/improve mobile-app`; app creation/setup → `/follow-create-mobile`

## 1. Detect

> Goal: find the mobile runner and check prerequisites

1. Maestro → `.maestro/` flows (`maestro test`); Detox → `detox.config.*` (`detox test`); native → `androidTest/` (Espresso), `*UITests/` (XCUITest); Capacitor/RN → web-e2e fallback when there is no native suite
2. Prerequisites — emulator/simulator booted, app build exists, test backend reachable

## 2. Run

> Goal: run every flow on every requested platform

1. Boot the emulator/simulator per the platform flag (`--platform ios|android`)
2. Run flows per the suite config; collect screenshots/video/logs for every failure
3. The backend must be a test/staging env — never prod APIs

## 3. Classify

> Goal: separate app, test, and environment failures

1. App crash / native error → source → `/resolve-errors`
2. Outdated locator / flow → test → `/update-tests`
3. Flaky emulator / boot failure → environment (restart the emulator once and rerun before classifying)
4. Permission dialogs → test setup issue; repeats ≥3 → stop + report

## 4. Report

> Goal: persist per-flow evidence per platform

1. Persist → `.devin/temp/report/<workspace>/mobile-test-<time>.md` — per-flow status, platform, screenshots
2. All passed → `/run-verify`

## Rules

### 1. Backend Safety

- Never run against a production backend — test/staging env only
- Clean up test accounts/data the suite created on the backend

### 2. Emulator Flakiness

- For a flaky emulator, restart and rerun once before calling it a test issue

### 3. No Suppression

- Never `.skip`/force-pass a failing flow; a failure is a failure

## Expected Outcome

- Mobile flows fully run on every platform with screenshots and logs
- Failures classified as source/test/environment
- Report persisted in `.devin/temp/report/`
