---
name: follow-tool-vitest-migrate-from-jest
description: ย้าย test suite จาก Jest ไป Vitest — globals, mock API, snapshots, verify green
argument-hint: "[scope]"
related:
  - follow-tool-vitest
  - use-astgrep
  - migration-by-astgrep
  - update-tests
  - run-test
---

## Goal

Migrate test suite จาก Jest ไป Vitest อย่างปลอดภัย — suite เขียวทั้งหมดก่อนลบ Jest และ rollback ได้

## Scope

- ย้าย `jest` → `vitest` ครอบคลุม config, globals, mock APIs, timers, snapshots
- ใช้ codemods/ast-grep แทน manual edit เมื่อจำนวนไฟล์เยอะ
- ไม่ครอบคลุม: first-time setup ที่ยังไม่มี test framework (`subskills/setup-vitest`)

## Execute

### 1. Plan And Inventory

> Goal: map จุดที่กระทบทั้งหมดก่อนแก้

1. ทำ `/plan` — ระบุ from→to และเขียน rollback path (git branch หรือ revert plan)
2. ทำ `scan-codebase` หา jest usage: `jest.config.*`, `jest.*` API calls, `@jest/globals` imports, `setupFiles*`, `moduleNameMapper`, snapshot files
3. อ่าน official Vitest migration guide สำหรับ breaking differences — ดู official docs
4. Backup: commit/snapshot สถานะปัจจุบัน — Jest suite ต้องเขียวก่อนเริ่ม

### 2. Install And Config

> Goal: ติดตั้ง Vitest โดย Jest ยังอยู่ (run คู่กันได้)

1. ติดตั้งตาม `subskills/setup-vitest` — vitest, coverage, environment
2. ตั้ง `test.globals: true` ใน `vitest.config.ts` — tests เดิมที่ใช้ `describe`/`it`/`expect` โดยไม่ import จะทำงานต่อได้
3. เพิ่ม `"types": ["vitest/globals"]` ใน `tsconfig.json`
4. Map `jest.config` keys → vitest equivalents: `testEnvironment` → `environment`, `setupFilesAfterEach`/`setupFiles` → `setupFiles`, `moduleNameMapper` → `resolve.alias`, `coverageProvider`/`collectCoverageFrom` → `coverage.*`
5. แยก vitest script: `"test:vitest": "vitest run"` — อย่าแทน `test` จน suite เขียว

### 3. Migrate APIs

> Goal: แปลง Jest APIs เป็น Vitest equivalents

1. ใช้ `/use-astgrep` หรือ `/migration-by-astgrep` สำหรับ rename จำนวนมาก — แยก commit ต่อ pattern
2. Map mock APIs: `jest.mock` → `vi.mock`, `jest.fn` → `vi.fn`, `jest.spyOn` → `vi.spyOn`, `jest.requireActual` → `vi.importActual` (async), `jest.doMock` → `vi.doMock`
3. Map timers: `jest.useFakeTimers` → `vi.useFakeTimers`, `jest.advanceTimersByTime` → `vi.advanceTimersByTime`
4. `@jest/globals` import → `vitest` import หรือ globals config
5. ระวัง hoisting: `vi.mock` ต้อง top-level (Vitest 5 throw ถ้าอยู่ใน function/block)

### 4. Migrate Snapshots

> Goal: snapshot files ใช้ต่อหรือ regenerate อย่างปลอดภัย

1. Vitest ใช้ format เดียวกับ Jest — snapshot เดิมส่วนใหญ่ใช้ต่อได้
2. รัน suite ก่อน — ถ้า snapshots fail เพราะ format diff → regenerate ด้วย `vitest run -u` แล้ว review diff
3. อย่า bulk-update snapshots โดยไม่ review — snapshot diff อาจซ่อน behavior change

### 5. Verify Green And Cleanup

> Goal: suite เขียวทั้งหมดบน Vitest แล้วลบ Jest

1. รัน `vitest run` — ต้องเขียวทั้งหมด; ถ้า fail ให้แก้ทีละกลุ่ม ห้าม skip มั่ว
2. ทำ `/check-deprecated-apis` เช็ค `jest.` ที่เหลือ
3. เมื่อเขียวแล้ว: ลบ `jest`, `@types/jest`, `ts-jest`, `babel-jest`, `jest.config.*` แยก commit
4. สลับ `"test": "vitest run"` แล้วรัน `/run-test` ยืนยันอีกครั้ง
5. เสร็จ → `/report-before-after` แล้ว `/ship`

## Rules

- ห้ามผสม migration กับ feature work ใน commit เดียว — แยก commit ต่อ step ให้ bisect ได้
- Jest suite ต้องเขียวก่อน migrate และ Vitest suite ต้องเขียวก่อนลบ Jest
- `vi.mock`/`vi.hoisted` top-level เท่านั้น (Vitest 5)
- ถ้า test บางไฟล์พึ่ง Jest-specific behavior จริงๆ → สร้าง TODO list ชัดเจนแทนการบังคับ

- ใช้ /follow-tool-vitest ถ้าจำเป็น
- ใช้ /update-tests ถ้าจำเป็น

## Expected Outcome

- Test suite รันบน Vitest เขียวทั้งหมด
- Jest dependencies และ config ถูกลบใน commit แยก
- ไม่มี `jest.*` API เหลือใน codebase
