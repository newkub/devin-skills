# Deep Test — E2E Domain

รัน E2E tests สำหรับ browser testing ด้วย Playwright ครบทุก route และ user flow — รวมถึง exploratory all-routes testing ผ่าน `agent-browser` แบบ headless เมื่อยังไม่มี test suite

- Playwright เป็น framework หลัก — ไม่ใช้ Cypress
- `agent-browser` (headless) ใช้สำหรับ exploratory route/action testing เมื่อยังไม่มี Playwright suite หรือต้องการ ad-hoc verification
- ถ้าต้องการ update/เขียน Playwright tests → `/update-tests` (run-only ไม่แก้ tests)

> Pre-Run: ทำ `/review-test` ก่อนเสมอ — `run-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน

## 1. Detect Setup

> Goal: รู้ว่า project มี Playwright suite หรือยัง

1. ตรวจ `playwright.config.ts`/`playwright.config.js`, test files ใน `tests/`, `e2e/`, `*.spec.ts`
2. ตรวจ `package.json` — `@playwright/test`, scripts `test:e2e`, `e2e`
3. ถ้ามี suite → ไป Step 3; ถ้าไม่มี → Step 2 (exploratory) หรือ `/follow-tool-playwright` เพื่อ setup ใหม่

## 2. Exploratory All-Routes (agent-browser, headless)

> Goal: ทดสอบทุก route แบบ programmatic เมื่อยังไม่มี test suite

1. รัน dev server ถ้าจำเป็น (`/run-dev`) แล้วได้ base URL
2. List routes จาก `/report-uxui-all-routes` หรือ `agent-browser snapshot -i` + `agent-browser links`
3. เปิดแต่ละ route ด้วย `agent-browser open <url>` (headless เป็น default — ไม่ต้องใส่ `--headed`)
4. ต่อ route: `agent-browser snapshot -i` list interactive elements → ทดสอบ click/toggle/select/fill/submit ตามที่พบ
5. `agent-browser console` + `agent-browser errors` เก็บ page errors; `agent-browser screenshot` เมื่อ action ล้มเหลว
6. จบด้วย `agent-browser close`
7. รายงานตาราง: route → actions tested → pass/fail → console errors
8. persist raw results → `.devin/reports/<workspace>/e2e-exploratory-<time>.md` ตาม format `/create-report-in-dot-devin` — ระบุชัดว่าเป็น exploratory (ไม่ใช่ Playwright suite result)

## 3. Install Browser Dependencies

> Goal: ติดตั้ง browser binaries ถ้าจำเป็น

1. รัน `bunx playwright install` สำหรับ browsers
2. รัน `bunx playwright install-deps` สำหรับ system dependencies (Linux)
3. ตรวจสอบ browser binaries ถูกติดตั้งแล้ว

## 4. Run E2E Tests

> Goal: รัน Playwright tests

1. Prefer script จาก `package.json` (`bun run test:e2e` ฯลฯ)
2. Fallback: `bunx playwright test`
3. Headless เป็น default สำหรับ CI; `--headed` เฉพาะตอน debug
4. ใช้ `--project`, file pattern, `--grep` เมื่อ scope ระบุ
5. ใช้ `--last-failed` สำหรับ re-run เฉพาะที่ fail
6. ใช้ `--ui` หรือ `--debug` เมื่อต้องการ authoring/troubleshooting

## 5. Cover All Routes And Flows

> Goal: coverage ครบ routes + critical flows

1. เทียบ test files กับ route list จาก Step 2 — route ไหนไม่มี test ให้บันทึกเป็น gap
2. Critical flows ต้องมี test เสมอ: auth, main user journey, forms submit, error states
3. ถ้า routes เยอะ → สร้าง smoke spec ที่ visit ทุก route แล้ว assert ไม่มี console errors / 5xx

## 6. Review Test Results

> Goal: ตรวจสอบผลลัพธ์จากการทดสอบ

1. ดู test report จาก framework (`bunx playwright show-report` สำหรับ html report)
2. ตรวจสอบ failed tests พร้อม screenshots, videos, traces
3. จำแนก failure: source bug / outdated test / flaky / environment
4. แก้ที่ root cause — ถ้า test ผิด → `/update-tests`; ถ้า source ผิด → `/resolve-errors`
5. persist authoritative results → รัน Playwright ด้วย JSON reporter (`bunx playwright test --reporter=json > .devin/reports/<workspace>/playwright-<time>.json` หรือ `PLAYWRIGHT_JSON_OUTPUT_NAME`) แล้วเขียน summary `.devin/reports/<workspace>/e2e-<time>.md` ตาม format `/create-report-in-dot-devin` — stats (expected/unexpected/flaky/skipped/duration) + ลิงก์ `playwright-report/` — artifact นี้คือ e2e result ของจริงสำหรับ `/update-docs`

## Rules

### 1. Test Framework

- ใช้ Playwright เท่านั้น — ถ้า project มี Cypress อยู่ให้แนะนำ migrate ไป Playwright
- ตั้งค่า browsers (`projects`), viewport, device emulation ตาม target
- `forbidOnly: !!process.env.CI` กัน `.only` หลุดเข้า CI

### 2. Test Execution

- Headless สำหรับ CI/การรันปกติ — `--headed` เฉพาะ debug
- ใช้ parallel execution และ `retries: 2` บน CI
- ใช้ `webServer` ใน config ให้ Playwright start dev server เอง (`reuseExistingServer` ตอน local)

### 3. Test Isolation

- แต่ละ test independent — ใช้ `beforeEach`/`afterEach` setup/teardown
- ใช้ `storageState` สำหรับ auth reuse แทน login ผ่าน UI ทุก test
- ใช้ test data ที่ isolated, seed ผ่าน `request` fixture ไม่ใช่ UI

### 4. Locators And Assertions

- ใช้ `getByRole`/`getByLabel`/`getByText`/`getByTestId` — หลีกเลี่ยง CSS selectors ที่ fragile
- ใช้ web-first assertions (`toBeVisible`, `toHaveText`) ที่ auto-wait — ห้าม `waitForTimeout`
- ไม่ใช้ conditional logic (`if`/`try-catch`) ใน test bodies

### 5. Failure Handling

- ดู error, screenshot, video, trace ก่อนแก้
- แก้ root cause ไม่ suppress; ห้าม `.skip`/`.only` หลีกเลี่ยง failure
- Flaky test ที่ fail ซ้ำ ≥3 ครั้ง → tag และ report แทนการ re-run ไปเรื่อย
- ใช้ /review-uxui ถ้าจำเป็น
- ใช้ /run-test ถ้าจำเป็น
- ใช้ /run-check ถ้าจำเป็น
- ใช้ /run-verify ถ้าจำเป็น
- ใช้ /use-agent-browser ถ้าจำเป็น
- ใช้ /suggest-next-action ถ้าจำเป็น

## Expected Outcome

- E2E tests รันผ่านทั้งหมดบน browsers ที่ตั้งค่าไว้
- ทุก route มี coverage: Playwright spec หรือ exploratory pass ผ่าน agent-browser
- Route gaps ถูกบันทึกชัดเจน
- Test report พร้อม screenshots/videos/traces สำหรับ failed tests
- Console errors และ page errors ถูกจับและรายงาน
