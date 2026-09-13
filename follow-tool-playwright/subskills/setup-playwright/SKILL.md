---
name: follow-tool-playwright-setup-playwright
description: ติดตั้ง Playwright พร้อม browsers และ playwright.config.ts พื้นฐาน
argument-hint: "[scope]"
related:
  - follow-tool-playwright
  - run-test
  - update-tests
  - setup-cicd
---

## Goal

ติดตั้งและตั้งค่า Playwright ครั้งแรกให้พร้อมรัน E2E tests — packages, browser binaries, config พื้นฐาน, smoke test

## Scope

- First-time setup ของ Playwright ใน web project
- ครอบคลุม: install, `playwright install`, `playwright.config.ts` พื้นฐาน, test ตัวอย่าง, verify
- ไม่ครอบคลุม: projects/devices/reporters ขั้นสูง (`subskills/config-projects`), migration (`subskills/migrate-from-cypress`)

## Execute

### 1. Check Prerequisites

> Goal: ตรวจ prerequisites และ current state

1. ตรวจ Node.js version ให้ตรง requirement — Playwright ต้องการ Node >= 20 (ดู official docs สำหรับ version ล่าสุด)
2. ระบุ package manager จาก lockfile แล้วใช้ตัวนั้นตลอด
3. ตรวจ `package.json` — ถ้ามี `@playwright/test` อยู่แล้ว (idempotent check) → skip install ไป verify
4. ระบุ dev server command และ port ของ app (`bun dev`, `vite`, `next dev`)

### 2. Install Packages And Browsers

> Goal: ติดตั้ง `@playwright/test` และ browser binaries

1. ติดตั้ง `bun add -D @playwright/test` (หรือ equivalent ของ package manager)
2. รัน `bunx playwright install` — ติดตั้ง chromium, firefox, webkit
3. ถ้า CI/minimal → ติดตั้งเฉพาะ browser ที่ใช้ เช่น `bunx playwright install chromium`
4. ติดตั้ง VS Code extension สำหรับ IDE integration (optional)

### 3. Create Config

> Goal: สร้าง `playwright.config.ts` ขั้นต่ำ

1. สร้าง `playwright.config.ts` ที่ root ด้วย `defineConfig` จาก `@playwright/test`
2. ตั้ง `testDir` (เช่น `./e2e` หรือ `./tests`) — แยกจาก unit tests
3. ตั้ง `use.baseURL` ชี้ dev server (เช่น `http://localhost:5173`)
4. ตั้ง `retries: process.env.CI ? 2 : 0`, `workers: process.env.CI ? 4 : undefined`, `forbidOnly: !!process.env.CI`
5. ตั้ง `trace: 'on-first-retry'` และ `screenshot: 'only-on-failure'` สำหรับ debugging artifacts
6. ตั้ง `webServer: { command, url, reuseExistingServer: !process.env.CI }` ให้ Playwright start dev server เอง

### 4. Add Scripts And Smoke Test

> Goal: เพิ่ม scripts และเขียน smoke test

1. เพิ่ม `"test:e2e": "playwright test"` ใน `package.json`
2. เขียน spec ตัวอย่าง: `page.goto('/')` แล้ว `expect(page).toHaveTitle(...)` หรือ assert locator ที่มั่นคง
3. เพิ่ม `test-results/` และ `playwright-report/` ใน `.gitignore`

### 5. Verify

> Goal: smoke check ว่า setup ทำงาน

1. รัน `bun run test:e2e` — spec ตัวอย่างต้องผ่าน โดย webServer auto-start ถูกต้อง
2. รัน `bunx playwright test --ui` ถ้าต้องการดูใน UI mode
3. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- ใช้ official docs เป็นแหล่งหลัก — ถ้า option ไม่แน่ใจให้ดู docs ก่อน
- ติดตั้งเฉพาะ browsers ที่ใช้จริงใน CI — ประหยัดเวลาและ disk
- `testDir` ต้องแยกจาก unit tests — ห้ามให้ Vitest pickup e2e specs
- secrets/env สำหรับ E2E → `/follow-secret-manager` ห้าม commit
- อย่าใส่ `page.waitForTimeout()` ใน smoke test — ใช้ web-first assertions

## Expected Outcome

- `@playwright/test` ติดตั้งพร้อม browsers และ `playwright.config.ts` ที่ verify แล้ว
- Smoke test รันผ่านโดย webServer auto-start
- Artifacts dirs ถูก gitignore
