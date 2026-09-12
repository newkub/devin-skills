---
name: follow-tool-playwright-config-projects
description: ตั้งค่า Playwright projects, devices, baseURL, retries และ reporters
argument-hint: "[scope]"
related:
  - follow-tool-playwright
  - follow-config
  - run-test-e2e
  - setup-cicd
---

## Goal

ตั้งค่า `playwright.config.ts` ขั้นสูง — multi-browser projects, device emulation, `baseURL`, retries, reporters — โดย merge กับ config เดิมไม่ clobber

## Scope

- แก้ไข `playwright.config.ts` ที่มีอยู่แล้ว (setup ครั้งแรก → `subskills/setup-playwright`)
- ครอบคลุม: `projects`, `devices`, `use.baseURL`, `retries`, `reporter`, project dependencies
- ไม่ครอบคลุม: เขียน test specs, page objects

## Execute

### 1. Read Current Config

> Goal: เข้าใจ config เดิมก่อนแก้

1. อ่าน `playwright.config.ts` ปัจจุบัน — ทำ `/check-config-drift` ถ้าสงสัย config ค้าง
2. ระบุ keys ที่มีอยู่แล้ว — merge กับเดิม ห้าม overwrite ทั้งไฟล์
3. ถ้าไม่พบ config → ทำ `subskills/setup-playwright` แทน

### 2. Configure Projects And Devices

> Goal: ตั้ง multi-browser/device projects

1. ใช้ `projects` array — แต่ละ project มี `name` ไม่ซ้ำและ `use` options
2. ใช้ `devices` จาก `@playwright/test` เช่น `...devices['Desktop Chrome']`, `...devices['iPhone 14']` สำหรับ device emulation
3. สร้าง project แยกตาม concerns: browsers (chromium/firefox/webkit), viewports (mobile/desktop), หรือ auth state
4. ใช้ project `dependencies` สำหรับ setup project (เช่น login → save `storageState`)
5. รันเฉพาะ project ด้วย `bunx playwright test --project=chromium`

### 3. Configure baseURL And Context

> Goal: ตั้ง `use` options ที่ share ข้าม tests

1. ตั้ง `use.baseURL` — tests ใช้ relative paths `page.goto('/login')` ได้
2. รองรับ env override: `baseURL: process.env.BASE_URL ?? 'http://localhost:5173'` สำหรับ staging/prod targets
3. ตั้ง `use` เพิ่มตามต้องการ: `locale`, `timezoneId`, `viewport`, `storageState`, `extraHTTPHeaders`
4. Project-level `use` override global `use` — ตั้งเฉพาะที่ต่างจริง

### 4. Configure Retries And Reporters

> Goal: ตั้ง retries และ reporters ตาม environment

1. `retries: process.env.CI ? 2 : 0` — retry เฉพาะ CI; อย่าใช้ retries ปิดบัง flaky tests
2. `reporter`: local ใช้ `[['list'], ['html']]` — CI ใช้ `blob` สำหรับ sharding แล้วรวมด้วย `bunx playwright merge-reports`
3. เพิ่ม `['github']` reporter ใน CI สำหรับ annotations บน PR
4. ตั้ง `fullyParallel: true` สำหรับ parallel tests ใน file เดียวกัน (ถ้า tests independent)

### 5. Verify

> Goal: validate config และ smoke test

1. รัน `bunx playwright test --list` — ตรวจว่า tests ถูก discover ตาม projects
2. รัน `bunx playwright test --project=<name>` smoke 1 spec ต่อ project
3. ถ้าพัง → revert key ที่เพิ่งแก้แล้ว report diff — ทำ `/report-before-after`

## Rules

- Merge กับ config เดิม — ห้าม rewrite ทั้งไฟล์ถ้าไม่จำเป็น
- `retries` เฉพาะ CI — local ต้องเห็น failure ทันที
- `baseURL` ต้อง override ผ่าน env ได้ — ห้าม hardcode environment เดียว
- ทุก project ต้องมี `name` ไม่ซ้ำ — shards/CI filters อ้างด้วย name
- ถ้า config option ไม่แน่ใจ → ดู official docs หรือ `references/playwright-config-options.md`

## Expected Outcome

- Config รองรับ multi-browser/device projects พร้อม names ที่ชัดเจน
- `baseURL`, retries, reporters ตั้งถูกตาม environment
- `playwright test --list` แสดง tests ถูกต้องทุก project
