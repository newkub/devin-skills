---
name: review-code-quality-improve-types
description: Apply type-safety findings — strict flags ทีละตัว, any→unknown, casts→guards
argument-hint: "[scope-or-findings]"
related:
  - review-code-quality
  - run-typecheck
  - review-test
  - run-test
  - report-before-after
  - resolve-errors
---

## Goal

แก้ type findings จาก `/review-code-quality` จริง — เพิ่ม type safety ทีละขั้นโดยไม่เปลี่ยน runtime behavior

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้
- ครอบคลุม: `any` elimination, strict flags, unsafe casts, untyped public APIs
- ไม่รวม: complexity/imports fixes → parent `## Fix`; runtime behavior changes → `/refactor`

## Execute

### 1. Baseline

> Goal: coverage numbers ก่อนแก้

1. ทำ `/review-test` — `any` count, untyped exports, strict flags status
2. list findings: `any` hotspots, casts (`as`, `!`), missing return types บน public APIs
3. order: public API surfaces ก่อน → internals → test files

### 2. Enable Strictness Gradually

> Goal: strict โดยไม่ break build

1. เปิด strict flags ทีละตัว (`strictNullChecks` → `noUncheckedIndexedAccess` → ฯลฯ) — fix errors ต่อ flag เป็น commit แยก
2. ถ้า errors เยอะ → ใช้ `// @ts-expect-error` scoped กับ TODO เฉพาะจุดที่ blocked (นับเป็น debt ไม่ใช่ fix)

### 3. Fix Type Issues

> Goal: type safety ที่แท้ไม่ใช่แค่ผ่าน compiler

1. `any` → `unknown` + narrowing, หรือ proper types/generics
2. casts (`as`) → type guards/`satisfies`/schema validation ที่ boundary
3. public APIs — explicit return types + input types ครบ

### 4. Verify

> Goal: typecheck ผ่าน + runtime เหมือนเดิม

1. `/run-typecheck` + `/run-test` ผ่าน — type-only changes ห้ามเปลี่ยน behavior
2. `/report-before-after` — `any` count, coverage %, strict flags enabled

## Rules

- type-only commits — ห้ามปน runtime changes; ถ้า fix ต้องเปลี่ยน logic → `/refactor` แยก
- ห้าม `as any`/`@ts-ignore` เพิ่ม — narrowing หรือกำกับ debt เท่านั้น
- ทีละ flag/โฟลเดอร์ — big-bang strict enable = unreviewable
- fix-verify loop สูงสุด 3 รอบ → ไม่ผ่าน `/resolve-errors` แล้ว report

## Expected Outcome

- Coverage metrics ดีขึ้น (`any` ลด, strict flags เปิด)
- Zero runtime behavior change — tests เหมือนเดิม
