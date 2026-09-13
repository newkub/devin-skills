---
name: follow-tool-playwright-migrate-from-cypress
description: ย้าย E2E suite จาก Cypress ไป Playwright — API mapping, page objects, verify
argument-hint: "[scope]"
related:
  - follow-tool-playwright
  - use-astgrep
  - migration-by-astgrep
  - run-test
  - update-tests
---

## Goal

Migrate E2E test suite จาก Cypress ไป Playwright อย่างปลอดภัย — suite เขียวบน Playwright ก่อนลบ Cypress

## Scope

- ย้าย `cypress` → `@playwright/test` ครอบคลุม specs, commands, fixtures, intercepts, config
- ไม่ครอบคลุม: setup ครั้งแรก (`subskills/setup-playwright`), component testing ที่ยังไม่มี equivalent ชัดเจน

## Execute

### 1. Plan And Inventory

> Goal: map จุดที่กระทบก่อนแก้

1. ทำ `/plan` — เขียน rollback path (Cypress suite ต้องเขียวก่อนเริ่ม)
2. ทำ `scan-codebase` หา Cypress usage: `cypress.config.*`, `cypress/e2e/**`, `cy.*` calls, custom commands ใน `cypress/support/`, `cy.intercept`, fixtures
3. จัดกลุ่ม specs: simple assertions, auth flows, API intercepts, file upload/download — แต่ละกลุ่ม map ต่างกัน
4. อ่าน official migration docs — ดู Playwright docs ถ้าไม่แน่ใจ API equivalent

### 2. Setup Playwright Alongside

> Goal: ติดตั้ง Playwright โดย Cypress ยังอยู่

1. ทำตาม `subskills/setup-playwright` — install, browsers, config
2. ตั้ง `testDir` แยกจาก `cypress/` (เช่น `e2e/`) — สอง frameworks run คู่กันได้ระหว่าง migrate
3. Map config: `baseUrl` → `use.baseURL`, `viewportWidth/Height` → `use.viewport`, `defaultCommandTimeout` → `timeout`/`expect.timeout`, `video`/`screenshotOnRunFailure` → `video`/`screenshot` options

### 3. Map APIs

> Goal: แปลง `cy.*` เป็น Playwright APIs ทีละกลุ่ม

1. Navigation/actions: `cy.visit(url)` → `await page.goto(url)`, `cy.get(sel).click()` → `await page.locator(sel).click()` หรือ `getByRole`, `cy.get().type()` → `locator.fill()`
2. Assertions: `cy.get().should('be.visible')` → `await expect(locator).toBeVisible()`, `.should('have.text')` → `toHaveText()`, `.should('have.attr')` → `toHaveAttribute()` — ใช้ web-first assertions ที่ auto-wait
3. Network: `cy.intercept()` → `page.route()` หรือ `context.route()`
4. State: `cy.clearCookies()`/`localStorage` → context methods หรือ `storageState` config
5. Custom commands → Playwright fixtures (`test.extend()`) หรือ page object methods — ห้ามทำ global commands
6. ใช้ `/use-astgrep`/`/migration-by-astgrep` สำหรับ rename patterns จำนวนมาก — แยก commit ต่อ pattern

### 4. Extract Page Objects

> Goal: จัดโครงสร้าง locators/actions ให้ maintainable

1. แปลง Cypress custom commands และ repeated selectors เป็น Page Object classes
2. แปลง selectors เป็น locators: `getByRole` > `getByText`/`getByLabel` > `getByTestId` > CSS
3. อย่า copy `.should('exist')` chains ตรงๆ — Playwright locators lazy และ auto-wait

### 5. Verify And Cleanup

> Goal: suite เขียวบน Playwright แล้วลบ Cypress

1. รัน `bunx playwright test` — specs ที่ migrate ต้องเขียวทั้งหมด; เปรียบเทียบ coverage กับ Cypress suite เดิม
2. ใช้ `--last-failed` re-run เฉพาะที่ fail; ทำ `/run-test` (e2e) ยืนยันรอบสุดท้าย
3. เมื่อเขียว: ลบ `cypress`, `cypress.config.*`, `cypress/` dir, eslint plugins — แยก commit
4. ทำ `/check-deprecated-apis` เช็ค `cy.` เหลือ → เสร็จแล้ว `/report-before-after` แล้ว `/ship`

## Rules

- ห้ามผสม migration กับ feature work — แยก commit ต่อ step
- Cypress suite ต้องเขียวก่อน migrate — ใช้เป็น reference behavior
- ห้ามใช้ `page.waitForTimeout()` แทน Cypress auto-retry — ใช้ web-first assertions
- ทุก spec ที่ migrate ต้อง assert เทียบเท่าเดิม — ห้ามลด assertions เพื่อให้ผ่าน
- specs ที่พึ่ง Cypress-only features (เช่น component testing) → TODO list ชัดเจน อย่าบังคับ

## Expected Outcome

- E2E suite รันบน Playwright เขียวทั้งหมด เทียบเท่า coverage เดิม
- Cypress dependencies/config ถูกลบใน commit แยก
- Locators/page objects ตาม Playwright best practices
