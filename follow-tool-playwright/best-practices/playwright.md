# Playwright — Best Practices

E2E testing — locators, isolation และ flake elimination

## Recommended Patterns

- Locators หลัก: `getByRole` > `getByLabel`/`getByText` > `getByTestId` — resilient ต่อ DOM changes; CSS/XPath selectors เป็นทางเลือกสุดท้าย
- Web-first assertions: `await expect(locator).toBeVisible()` — auto-retry built-in; ห้าม `waitForTimeout` แบบตายตัว
- Test isolation: แต่ละ test สร้าง state เอง (storage state, API seeding) — ไม่พึ่ง test ก่อนหน้า
- `test.beforeEach` สำหรับ shared setup; `page.goto` ใน test เพื่อ explicitness เมื่อ flows ต่างกัน
- Playwright Test fixtures (`test.extend`) สำหรับ authenticated contexts — login once per worker

## Common Pitfalls

- Flakiness ต้นตอ: hard sleeps, race conditions, animations — `toBeVisible`/`waitFor` auto-retry แทน
- Parallel tests ชนกันบน shared backend state — isolate data per test (unique users/records)
- `page.waitForSelector` แล้ว interact ทันที — element visible ≠ actionable; auto-waiting locators จัดการแล้ว
- Trace/video/screenshot on-failure config — debug artifacts จำเป็นใน CI
- `test.describe.serial` = smell — แก้ isolation แทน serialize

## CI Discipline

- `workers` + `fullyParallel` — sharding (`--shard`) ข้าม runners สำหรับ suites ใหญ่
- `retries` ใน CI เท่านั้น (1-2), local = 0 — flakes ต้อง visible
- Browser projects: chromium ก่อน เพิ่ม webkit/firefox ตาม risk matrix ไม่ใช่ทุก PR
- `playwright install --with-deps` cache ใน CI — browsers เสถียรต่อ version

## Do / Don't

| Do | Don't |
|----|-------|
| role/label locators | brittle CSS/XPath selectors |
| web-first auto-retry assertions | `waitForTimeout` |
| isolated test state | inter-test dependencies |
| trace on-first-retry ใน CI | debug flakes ด้วย re-runs |
