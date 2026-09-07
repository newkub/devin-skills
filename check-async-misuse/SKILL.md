---
name: check-async-misuse
description: ตรวจ floating promises, missing await และ async patterns ผิดผ่าน ast-grep และ linter
argument-hint: "[path]"
related:
  - follow-asynchronous
  - use-astgrep
  - run-lint
  - review-stability
  - report-table
---

## Goal

ตรวจหา async/await misuse ที่ทำให้เกิด unhandled rejections, race conditions หรือ fire-and-forget bugs — floating promises, missing `await`, `async` ใน forEach, promise executor anti-patterns

## Scope

- ตรวจ source files ที่มี `async`, `await`, `Promise`, `.then(`, `.catch(`
- Patterns: floating promises, `async` ใน `forEach`/`map` ที่ไม่ `Promise.all`, missing `await` บน promise-returning calls, `new Promise(async ...)`, unhandled `.then()` ไม่มี `.catch`
- Read-only: รายงานอย่างเดียว

## Execute

### 1. Detect Tooling

> Goal: เลือกเครื่องมือตาม ecosystem

1. TypeScript + ESLint → เช็คว่ามี `@typescript-eslint/no-floating-promises` เปิดอยู่ไหม (`/run-lint`)
2. Biome → `lint/nursery/noFloatingPromises`
3. ถ้าไม่มี typed lint → ใช้ `/use-astgrep` สแกน patterns โดยตรง

### 2. Scan Patterns

> Goal: หา misuse patterns

1. Expression statements ที่ return promise แต่ไม่ `await`/ไม่ `.catch` → floating promise
2. `forEach(async ...)`, `array.map(async ...)` ที่ไม่ `Promise.all` → ไม่รอผล
3. `new Promise(async (resolve) => ...)` → async executor anti-pattern
4. `await` ใน loop ที่ไม่ขึ้นต่อกัน → sequential โดยไม่จำเป็น (perf note)
5. `.then()` chains ที่ไม่มี `.catch`/`try-catch` → unhandled rejection

### 3. Report

> Goal: สรุปตาม bug risk

1. ใช้ `/report-table` คอลัมน์: `No.`, `File:Line`, `Pattern`, `Risk`, `Severity`, `Fix`
2. Severity: `critical` (floating promise ใน request handler), `warning` (missing await), `info` (sequential await)
3. แนะนำ `/follow-asynchronous` สำหรับวิธีแก้แต่ละ pattern

## Rules

### 1. Evidence-Based

- ทุก finding ต้องมี `file:line` และ code snippet
- Floating promise ต้อง confirm ว่า return type เป็น promise จริง — ถ้า infer ไม่ได้ให้ mark `needs-typecheck`

### 2. Read-Only

- ไม่แก้ code — แนะนำ `/follow-asynchronous` หรือ lint autofix

### 3. Context Aware

- `void promise` / `promise.catch(noop)` = intentional fire-and-forget → ไม่ flag หรือ flag `info`
- Top-level promise ใน entrypoint ที่มี `.catch(process.exit)` → acceptable

- ใช้ /follow-asynchronous สำหรับ best practices
- ใช้ /run-lint รัน linter ที่มีอยู่
- ใช้ /review-stability สำหรับ error handling gaps

## Expected Outcome

- รายการ async misuse พร้อม risk level ต่อ finding
- สรุป lint rules ที่ควรเปิดถ้ายังไม่มี
