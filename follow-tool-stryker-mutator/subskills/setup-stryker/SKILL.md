---
name: follow-tool-stryker-mutator-setup-stryker
description: ติดตั้ง Stryker Mutator พร้อม config และ test runner integration
argument-hint: "[scope]"
related:
  - follow-tool-stryker-mutator
  - follow-tool-vitest
  - run-test-mutation
  - update-tests
  - run-test
---

## Goal

ติดตั้งและตั้งค่า Stryker Mutator ให้รัน mutation testing ได้ — core, runner plugin, config file, smoke run

## Scope

- First-time setup ของ Stryker ใน JavaScript/TypeScript project
- ครอบคลุม: install, `stryker init`, config keys, test runner integration, verify run
- ไม่ครอบคลุม: performance tuning/incremental (`subskills/optimize-mutation`)

## Execute

### 1. Check Prerequisites

> Goal: ตรวจ environment และ test runner ก่อน install

1. ตรวจ Node.js >= 22 (Stryker v10 ต้องการ) — ดู official docs สำหรับ version ล่าสุด
2. ระบุ test runner ปัจจุบัน: `vitest`, `jest`, `mocha` จาก `package.json` — ทำ `/follow-tool-vitest` ถ้าใช้ vitest
3. รัน test suite ปกติก่อน — tests ต้องเขียวและไม่ flaky ก่อนรัน mutation testing
4. ตรวจ `package.json` — ถ้ามี `@stryker-mutator/core` แล้ว (idempotent check) → skip install

### 2. Install Packages

> Goal: ติดตั้ง Stryker core และ runner plugin

1. ติดตั้ง `bun add -D @stryker-mutator/core`
2. ติดตั้ง runner plugin ตาม test runner เช่น `bun add -D @stryker-mutator/vitest-runner`
3. ถ้าใช้ TypeScript → ติดตั้ง `bun add -D @stryker-mutator/typescript-checker`
4. ดู plugin options ใน `references/stryker-mutator.md` หรือ official docs

### 3. Initialize Config

> Goal: สร้าง Stryker config ขั้นต่ำ

1. รัน `bunx stryker init` เพื่อ generate config (เลือก runner/reporters ตามที่ติดตั้ง)
2. ตรวจ `stryker.config.json`/`stryker.config.mjs` — กำหนด `testRunner`, `mutate`, `reporters`, `coverageAnalysis`
3. ตั้ง `mutate` glob ให้ชัดเจน — เช่น `['src/**/*.ts', '!src/**/*.test.ts']` อย่า mutate ทั้ง repo
4. ตั้ง `coverageAnalysis: 'perTest'` — เร็วกว่าและแม่นกว่า `all`
5. ตั้ง `ignorePatterns` สำหรับ generated/vendored dirs

### 4. Run Smoke Mutation

> Goal: verify ว่า Stryker ทำงานกับ suite จริง

1. รัน `bunx stryker run` บน scope เล็กก่อน (แคบ `mutate` ชั่วคราว หรือยอมรับเวลานาน)
2. ถ้ามีปัญหา → `bunx stryker run --logLevel trace` debug
3. เปิด `reports/mutation/html/index.html` ตรวจ report
4. ยืนยันว่า mutants ถูก generate, tests ถูกรัน และผลมี `killed`/`survived`/`timeout`

### 5. Wire Scripts

> Goal: เพิ่ม scripts และ artifacts hygiene

1. เพิ่ม `"test:mutation": "stryker run"` ใน `package.json`
2. เพิ่ม `reports/mutation/` (หรือ output dir ที่ตั้ง) ใน `.gitignore`
3. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- Tests ต้องเขียวและ stable ก่อน — ห้าม setup Stryker บน suite ที่ flaky
- `mutate` ต้อง explicit — อย่า mutate tests, configs, generated files
- ใช้ `coverageAnalysis: 'perTest'` เป็นค่าเริ่มต้น
- ใช้ official docs เป็นแหล่งหลัก — ถ้า option ไม่แน่ใจให้ดู docs ก่อน
- Mutation run ช้า — smoke run บน scope เล็กก่อน scale ขึ้น

## Expected Outcome

- Stryker ติดตั้งพร้อม runner plugin และ config ที่ถูกต้อง
- Smoke mutation run สำเร็จพร้อม HTML report
- `test:mutation` script พร้อมใช้
