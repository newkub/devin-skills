---
name: follow-lib-fast-check
description: ใช้ fast-check สำหรับ property-based testing — arbitraries, shrinking, invariants
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test
  - follow-tool-vitest
---

## Goal

ใช้ fast-check สำหรับ property-based testing — arbitraries, shrinking, invariants

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ `fast-check` — setup, เขียน property tests, model-based testing, debugging counterexamples

- ใช้ skill นี้สำหรับ property-based testing เท่านั้น — unit tests ทั่วไปทำ `/run-test` หรือ `/follow-tool-vitest`
- `fast-check` เป็น test library — ติดตั้งเป็น devDependency และไม่มี standalone CLI (run ผ่าน test runner)
- Latest: `fast-check@4.10.1` (verified 2026-09-16) — v4 ต้อง Node ≥12.17 / ES2020 และ drop deprecated arbitraries (`unicode*`, `ascii*`, `char`, `uuidV`, `.noBias`, `.noShrink`) พร้อม include invalid dates และ null-prototype objects โดย default
- References: [apis](references/apis.md) | [routes](references/routes.md) | [website](references/website.md)

## Execute

### 1. Install And Configure

> Goal: ติดตั้ง `fast-check` และตั้งค่า run parameters

1. รัน `bun add -D fast-check` — devDependency เท่านั้น ห้ามใส่ `dependencies`
2. ติดตั้ง runner integration ตาม test framework: `bun add -D @fast-check/vitest` สำหรับ vitest (setup ดู `/follow-tool-vitest`), `@fast-check/jest` สำหรับ jest, `@fast-check/ava` สำหรับ ava
3. ติดตั้ง `bun add -D @fast-check/poisoning` ถ้าต้องการตรวจ prototype pollution ระหว่าง tests
4. ตั้ง global defaults ด้วย `fc.configureGlobal({ numRuns, seed })` หรือ env `FAST_CHECK_NUM_RUNS` / `FAST_CHECK_SEED`
5. ตรวจ version ใน `package.json` — v4 API ต่างจาก v3 (deprecated arbitraries ถูกลบ)

### 2. Write Property Tests

> Goal: เขียน property tests ที่ assert invariants

1. เขียน property ด้วย `fc.assert(fc.property(arb, (x) => invariant))` — invariant คือเงื่อนไขที่ต้องจริงเสมอ
2. ใช้ `fc.asyncProperty(arb, async (x) => ...)` สำหรับ async code
3. ใช้ `fc.pre(condition)` ภายใน property สำหรับ preconditions — skip inputs ที่ไม่เกี่ยวแทนการ generate เอง
4. เลือก arbitraries ตาม domain: `fc.string()`, `fc.integer({ min, max })`, `fc.record()`, `fc.oneof()`, `fc.array()`
5. ใช้ `fc.sample(arb, n)` เพื่อดูตัวอย่าง generated values ขณะ debug
6. ใช้ `fc.statistics(property, classifier)` เพื่อวัด distribution ของ generated inputs

### 3. Handle Failures And Shrinking

> Goal: reproduce และแปลง counterexample เป็น regression test

1. เมื่อ fail fast-check จะ shrink หา minimal counterexample อัตโนมัติ
2. จด `seed` และ `path` จาก failure output — replay ด้วย `fc.assert(prop, { seed, path })` หรือ env `FAST_CHECK_SEED`
3. แปลง counterexample เป็น unit test ธรรมดาเพื่อกัน regression ก่อนแก้ bug

### 4. Model-Based And Race Testing

> Goal: test stateful systems และ concurrency

1. ใช้ `fc.commands()` สำหรับ model-based testing — เปรียบเทียบ model vs real implementation ผ่าน command sequences
2. ใช้ `fc.scheduler()` / scheduled helpers สำหรับ detect race conditions ใน async code
3. ใช้ `it.prop` จาก `@fast-check/vitest` หรือ equivalent ของ runner ที่ใช้ สำหรับ integration โดยตรง

### 5. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` เพื่อ execute test suite ที่มี property tests
3. ตรวจ official docs ล่าสุดที่ `https://fast-check.dev` ก่อนใช้ API ที่ไม่แน่ใจ

## Rules

- property tests เสริม unit tests ไม่แทนที่ — ใช้กับ pure functions, serializers และ invariants
- ตั้ง `numRuns` ให้สมดุลระหว่าง coverage กับเวลา (default 100; เพิ่มใน CI ได้ผ่าน `fc.configureGlobal` หรือ env `FAST_CHECK_NUM_RUNS`)
- fixed seed ใน CI เพื่อ reproducibility — ระบุ `{ seed }` หรือ env `FAST_CHECK_SEED` เมื่อต้อง replay failure
- compose arbitraries ด้วย `.map()`, `.filter()`, `.chain()` แทนการเขียน generator เอง
- ห้ามใช้ deprecated arbitraries จาก v3 (`unicode*`, `ascii*`, `char`, `uuidV`, `.noBias`, `.noShrink`) — ถูกลบใน v4

- ใช้ `/run-verify` ถ้าจำเป็น
- ใช้ `/run-test` ถ้าจำเป็น
- ใช้ `/follow-tool-vitest` ถ้าจำเป็น

## Expected Outcome

- `fast-check` ติดตั้งเป็น devDependency และ integrate กับ test runner ของ project
- Property tests assert invariants ถูกต้อง พร้อม arbitraries ที่ compose ได้
- Failures reproduce ได้ด้วย `seed`/`path` และ counterexample ถูกแปลงเป็น regression tests
- Lint, typecheck, tests ผ่าน
