---
name: follow-tool-vitest-setup-vitest
description: ติดตั้งและตั้งค่า Vitest พร้อม config, environment และ coverage provider
argument-hint: "[scope]"
related:
  - follow-tool-vitest
  - follow-tool-vite
  - update-tests
  - run-test
---

## Goal

ติดตั้งและตั้งค่า Vitest ให้พร้อมใช้งาน — packages, `vitest.config.ts`, environment และ coverage — ครั้งแรกหรือ verify setup เดิม

## Scope

- First-time setup ของ Vitest ในโปรเจกต์เดี่ยว (monorepo projects ดู parent skill)
- ครอบคลุม: install, config file, test environment (`node`/`happy-dom`/`jsdom`), coverage provider, scripts
- ไม่ครอบคลุม: migration จาก Jest (`subskills/migrate-from-jest`), performance tuning (`subskills/optimize-tests`)

## Execute

### 1. Check Prerequisites

> Goal: ตรวจ prerequisites และ current state ก่อน install

1. ทำ `/follow-tool-vite` เพื่อตรวจสอบว่า project มี Vite setup แล้ว
2. ตรวจ Node version ให้ตรง requirement ของ Vitest version ที่จะติดตั้ง — ดู official docs ถ้าไม่แน่ใจ
3. ตรวจ `package.json` — ถ้ามี `vitest` อยู่แล้ว (idempotent check) → skip install ไป verify อย่างเดียว
4. ระบุ package manager จาก lockfile (`bun.lock`, `pnpm-lock.yaml`, `package-lock.json`) แล้วใช้ตัวนั้นตลอด

### 2. Install Packages

> Goal: ติดตั้ง Vitest และ dependencies ที่จำเป็น

1. ติดตั้ง `bun add -D vitest` (หรือ `pnpm add -D` / `npm install -D` ตาม package manager)
2. ติดตั้ง coverage provider `bun add -D @vitest/coverage-v8` (v8 เป็น default provider)
3. ถ้า test ต้องการ DOM → ติดตั้ง `happy-dom` (แนะนำ เบากว่า) หรือ `jsdom`
4. ถ้า project ใช้ `@effect/vitest` → pin `vitest` ตาม peer dep (ดู `/follow-lib-effect-ts`)

### 3. Create Config

> Goal: สร้าง `vitest.config.ts` ขั้นต่ำที่จำเป็น

1. สร้าง `vitest.config.ts` ที่ root (หรือเพิ่ม `test` key ใน `vite.config.ts` ที่มีอยู่)
2. ตั้ง `test.globals: true` ถ้าต้องการลด import และเพิ่ม `"types": ["vitest/globals"]` ใน `tsconfig.json`
3. ตั้ง `test.environment` เป็น `node` (default) หรือ `happy-dom`/`jsdom` ตาม tests
4. ตั้ง `test.include`/`test.exclude` สำหรับ test file patterns (`*.test.ts`, `*.spec.ts`)
5. ตั้ง `coverage` block: `provider: 'v8'`, `reporter`, `include` แบบ explicit — Vitest 4+ รายงานเฉพาะ files ที่ loaded

### 4. Wire Scripts

> Goal: เพิ่ม scripts ใน `package.json`

1. เพิ่ม `"test": "vitest run"` และ `"test:watch": "vitest"` — ใช้ `vitest` binary ไม่ใช่ `bun test`
2. เพิ่ม `"test:coverage": "vitest run --coverage"` สำหรับ coverage run

### 5. Verify

> Goal: smoke check ว่า setup ทำงาน

1. เขียน test ตัวอย่าง 1 ไฟล์แล้วรัน `bun run test` — ต้องผ่าน
2. รัน `bun run test:coverage` — ต้องออก coverage report
3. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- ใช้ official docs เป็นแหล่งหลัก — ถ้า option ไม่แน่ใจ ให้ดู docs ก่อนเขียนลง config
- ห้ามใส่ version numbers ใน docs/comments ที่ยังไม่ verified
- environment เลือกให้ตรง tests จริง — อย่าใส่ `happy-dom` ถ้า tests ไม่แตะ DOM
- `coverage.include` ต้อง explicit — ห้ามพึ่ง default เพราะ Vitest 4+ report เฉพาะ loaded files

- ใช้ /follow-tool-vitest ถ้าจำเป็น
- ใช้ /update-tests ถ้าจำเป็น
- ใช้ /run-test ถ้าจำเป็น

## Expected Outcome

- Vitest ติดตั้งพร้อม `vitest.config.ts`, scripts และ coverage ที่ verify แล้ว
- Test ตัวอย่างรันผ่านทั้ง normal และ coverage mode
