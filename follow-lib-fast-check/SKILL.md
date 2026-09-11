---
name: follow-lib-fast-check
description: ใช้ fast-check สำหรับ property-based testing — arbitraries, shrinking, invariants
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test-unit
---

## Goal

ใช้ fast-check สำหรับ property-based testing — arbitraries, shrinking, invariants

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices (lib fast check)

- Latest: `fast-check@4.9.0` (verified 2026-09-11)

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. เขียน property tests ด้วย `fc.assert(fc.property(arb, (x) => invariant))`
1. ใช้ arbitraries ตาม domain: `fc.string()`, `fc.integer()`, `fc.record()`, `fc.oneof()`
1. ใช้ `fc.pre()` สำหรับ preconditions — skip กรณีที่ไม่เกี่ยว
1. เมื่อ fail fast-check จะ shrink หา minimal counterexample — เอา seed/replay ไปเขียนเป็น unit test

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test-unit` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (lib fast check)

## Rules

- property tests เสริม unit tests ไม่แทนที่ — ใช้กับ pure functions และ serializers
- ตั้ง `numRuns` ให้สมดุลระหว่าง coverage กับเวลา
- fixed seed ใน CI เพื่อ reproducibility

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (lib fast check)
- ไม่มี security/performance pitfalls ที่รู้จัก (lib fast check)
- Lint, typecheck, tests ผ่าน
