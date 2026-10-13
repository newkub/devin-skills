---
name: improve-typesafe
description: หา type-safety improvements — any leaks, unsafe casts, type drift — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-code-quality
  - improve-data
  - improve-sdk
  - deep-review
  - deep-review-then-fix
  - run-typecheck
  - check-types-definition
  - no-use-ignore
  - follow-lang-typescript
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "type safety improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains ที่เกี่ยวกับ types (scope type-safety) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "type safety ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-code-quality` (type-safety scope) — `any`/`unknown` leaks, type assertions (`as`), non-null assertions (`!`), unsafe casts, implicit any, generics ที่กว้าง/แคบผิด, union narrowing ไม่ครบ
- `review-data-validation` (type-safety scope) — schema vs static type drift, runtime validation ไม่ตรง types, boundary data ที่ cast เอาแทน validate
- `review-sdk` (types scope — เฉพาะ library/package) — exported types quality, public API surface, generic contracts ที่ leak ให้ consumer
- `review-frontend` (type-safety scope — เฉพาะ frontend) — props/state types, event handler types, API response types
- ignore comments ที่ปิด type errors (`@ts-ignore`, `@ts-expect-error` ค้าง, `biome-ignore`, `eslint-disable` ที่เกี่ยวกับ types) → `/no-use-ignore`
- type definitions inspection (name/type/options/default ของ lib/config) → `/check-types-definition`
- verification หลัง fix → `/run-typecheck`
- TypeScript language best practices → `/follow-lang-typescript`

## Execute

### 1. Review Type Safety

> Goal: ได้ prioritized type-safety findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. รัน `/run-typecheck` ก่อนเพื่อ baseline — ถ้า typecheck fail → findings หลักคือ type errors ที่มีอยู่
3. ทำ `/deep-review` กับ scope นั้น domains `review-code-quality` + `review-data-validation` (scope type-safety) — เพิ่ม `review-sdk` ถ้าเป็น library และ `review-frontend` ถ้าเป็น frontend
4. รวบรวม prioritized list พร้อม severity และ evidence — จับคู่ "type hole" กับ "จุดที่ unsafe value เข้าระบบ" ไว้ในทุก finding

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Type Hole (any/cast/ignore/drift), Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. ignore comments ที่ปิด type errors → ส่งต่อ `/no-use-ignore` (แก้ root cause ไม่ใช่ suppress)
3. เปลี่ยน type/schema ที่มีผลกระทบกว้าง → ใช้ `/all-this-patterns` ให้ครบทุก consumer
4. รัน `/run-typecheck` ทุกครั้งหลัง fix เพื่อยืนยันไม่มี type errors ใหม่
5. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้ามแก้ type errors ด้วย `as` cast หรือ ignore comment เพิ่ม — ต้องแก้ root cause (narrowing, schema, generics) ยกเว้น user ระบุชัดเจน
- ห้ามแก้ครึ่งทาง — เปลี่ยน type definition ต้องอัปเดตครบทุก consumer ใน scope
- หลัง fix ทุกรอบต้อง `/run-typecheck` ผ่าน
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Baseline typecheck status ทราบก่อน review
- Prioritized type-safety improvement list จาก `/deep-review` พร้อม type hole classification ต่อ finding
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` และ typecheck ผ่านโดยไม่เพิ่ม `as`/ignore ใหม่
