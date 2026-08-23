---
name: review-type-safety
description: Review type-safety
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - review-codebase
  - validate
  - suggest-next-action
---


## Goal

Review type design, type safety, generics, type inference, narrowing, discriminated unions, branded types, `as const`, and exhaustive checks พร้อม review score

## Scope

type review สำหรับ: `any` usage, `as` assertions, non-null assertions, missing return types, generic type usage, type parameter constraints, type inference quality, `as const` usage, discriminated unions, type narrowing, branded types, opaque types, exhaustive checks with `never`, readonly/immutable patterns, optional/null safety, `unknown` vs `any`, `@ts-ignore`, `@ts-expect-error`, และ tsconfig strictness

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ type system และ TypeScript config

1. ทำ `/scan-codebase` เพื่อเข้าใจ type patterns
2. ระบุ TypeScript version, tsconfig strictness, type utility libraries (`type-fest`, `ts-toolbelt`) ที่ใช้
3. ถ้า project ไม่มี่ TypeScript → stop และ report

### 2. Deep Analyze

> Goal: รวบรวม findings จากทุก type dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ type patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด
6. ถ้า review CLI ไม่ผ่าน → ทำ `/update-create-review-cli` แล้ว re-run ถ้าไม่ผ่านหลังจาก 3 ครั้ง → stop และ report

### 3. Review Type Safety Issues

> Goal: ตรวจสอบ type safety issues และจัดลำดับตาม severity

1. ทำ `/scan-codebase`, รัน `tsc --noEmit`, ทำ `/review-codebase` — ระบุ `any`, `as`, non-null assertions, missing return types
2. ค้นหา patterns: `: any`, `as any`, `as unknown`, `!`, `@ts-ignore`, `@ts-expect-error`, missing type annotations
3. ตรวจสอบ `any` ใน production code — ควรใช้ `unknown` + type narrowing หรือ specific types
4. ตรวจสอบ `as` assertions ที่ไม่จำเป็น — ใช้ type guards, `instanceof`, หรือ proper type definitions แทน
5. ตรวจสอบ `@ts-ignore` และ `@ts-expect-error` — ระบุ root cause แทนการ suppress
6. ตรวจสอบ non-null assertions (`!`) — ควรใช้ proper null checks หรือ optional chaining
7. ตรวจสอบ `unknown` vs `any` — ใช้ `unknown` + type narrowing แทน `any`
8. จัดลำดับตาม severity: runtime bugs > type errors > missing types > style issues
9. ถ้าไม่มี่ issues → ข้ามไปยัง Step 6 หรือ report

### 4. Review Generics, Inference, And Type Design

> Goal: ครอบคลุม generics, inference, constraints, และ type design

1. ตรวจสอบ generic type usage: generic functions, generic classes, generic interfaces, type parameter constraints (`extends`), conditional types, mapped types, template literal types, `const` type parameters
2. ตรวจสอบ type inference quality: inference ที่ทำงานได้โดยไม่ต้อง explicit annotations, over-annotated types ที่ควร infer, inference in generic function calls, inference in conditional types
3. ตรวจสอบ type parameter constraints: proper constraints (`extends`), constraint completeness, constraint specificity, avoid unnecessary constraints
4. ตรวจสอบ `as const` usage: literal type narrowing with `as const`, `as const` in object literals, `as const` in arrays, `as const` vs enum
5. ตรวจสอบ type inference จาก schema และ API, branded types สำหรับ IDs และ domain types, discriminated unions สำหรับ state machines
6. ตรวจสอบ return types สำหรับ public functions — ใช้ `satisfies` แทน type annotations เมื่อเหมาะสม
7. ตรวจสอบ generic constraints และ conditional types แทน `any` — ใช้ `const` type parameters เมื่อเหมาะสม
8. ตรวจสอบ type flow: schema → validation → API → UI
9. Critical: unsafe generic design, missing type constraint, over-annotated types ที่ทำให้ lose inference
10. High: missing branded type for IDs, missing discriminated union, unnecessary assertion, poor generic design, missing `as const`

### 5. Review Type Safety And Advanced Patterns

> Goal: ครอบคลุม type safety, discriminated unions, branded types, narrowing, strictness

1. ตรวจสอบ discriminated unions: union member discriminants, exhaustive union coverage, union member naming consistency, tagged union patterns
2. ตรวจสอบ type narrowing: type guard functions, type predicate patterns (`x is T`), `in` operator narrowing, `typeof` narrowing, `instanceof` narrowing, control flow narrowing
3. ตรวจสอบ branded types/opaque types: branded type usage for IDs, opaque type patterns, nominal typing simulation, brand consistency
4. ตรวจสอบ exhaustive checks: `never` type usage in switch, exhaustive pattern matching, default case with `never`, missing case detection
5. ตรวจสอบ type safety gaps: `any` usage, `unknown` vs `any`, unnecessary type assertions (`as`), non-null assertions (`!`), `@ts-ignore`, `@ts-expect-error`, type erasure risks
6. ตรวจสอบ readonly/immutable patterns: readonly arrays, readonly properties, `Readonly<T>`, `as const` for immutability, mutable vs immutable API
7. ตรวจสอบ optional/null safety: optional chaining (`?.`), nullish coalescing (`??`), `null` vs `undefined` consistency, optional parameter defaults
8. ตรวจสอบ tsconfig strictness: `strict: true`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes`, consistency ทุก workspace ใน monorepo
9. Critical: `any` ใน critical path, type safety bypass ใน critical path, unsafe assertion ที่ก่อให้เกิด runtime error, `@ts-ignore` ใน critical path
10. High: missing type constraint, poor generic design, missing discriminated union, unnecessary assertion, missing branded type for IDs, missing exhaustive check

### 6. Validate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. รัน `tsc --noEmit`, ทำ `/run-typecheck`, รัน lint (`bunx biome lint`)
2. ทำ `/deep-validate` เพื่อ validate findings
3. ทำ `/validate` สำหรับ validate issues จากทุก section
4. นับ metrics: `any` count, `as` count, non-null assertion count, `@ts-ignore` count, `@ts-expect-error` count
5. จัดลำดับตาม severity: Critical → High → Medium → Low
6. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
7. ทำ `/report` พร้อม `/report-table`
8. ทำ `/suggest-next-action`


### 7. Fix

> Goal: ปรับปรุงตามประเด็นที review พบ

1. เรียงลำดับตาม severity Critical → High → Medium → Low
2. ใช้ `/follow-best-practice` หรือ `/learn-from-web` หา pattern ทีเหมาะสม
3. แก้ไขทีละประเด็น ใช้ minimal changes
4. ทำ `/validate` และ `/run-check` หลังแก้
5. ถ้าไม่ผ่าน → `/resolve-errors` แล้ว retry สูงสุด 3 รอบ
6. ทำ `/suggest-next-action` หลังผ่าน
## Rules

### 1. Type Safety Principles

- ไม่ควรมี่ `any` ใน production code — ใช้ `unknown` + type narrowing แทน
- ใช้ type inference จาก schema ไม่ประกาศ type ซ้ำ — ใช้ `satisfies` เมื่อต้องการ type check โดยไม่ lose inference
- ไม่ใช้ `as` assertions โดยไม่จำเป็น — ใช้ type guards, `instanceof`, หรือ proper type definitions แทน
- ไม่ใช้ `@ts-ignore` หรือ `@ts-expect-error` — ระบุ root cause แทนการ suppress
- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 2. Severity Classification

- Critical: `any` ใน critical path, type safety bypass ใน critical path, unsafe assertion ที่ก่อให้เกิด runtime error, `@ts-ignore` ใน critical path
- High: missing type constraint, poor generic design, missing discriminated union, unnecessary assertion, missing branded type for IDs, missing exhaustive check
- Medium: suboptimal inference, missing `as const`, missing `readonly`, minor `any` usage ใน non-critical path, missing type predicate
- Low: cosmetic, minor type improvement, documentation gap

### 3. Skip Conditions

- ถ้า project ไม่มี่ TypeScript → ข้ามทั้งหมด
- ถ้า project ไม่มี่ generics → ข้าม Step 4
- ถ้า project ไม่มี่ discriminated unions → ข้าม Step 5 item 1
- ถ้า project ไม่มี่ branded types/opaque types → ข้าม Step 5 item 3

### 4. Evidence-Based Findings

- ทุก finding ต้องมี่ file path และ line number
- ระบุ type, function, หรือ interface ที่เกี่ยวข้อง

### 5. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

### 7. High Impact Content

- เก็บเฉพาะข้อกำหนดที่ทำให้ผลลัพธ์เปลี่ยนอย่างมี่นัยสำคัญ
- ทุก instruction ต้องระบุ action, condition หรือ expected result ที่ตีความได้ทางเดียว
- ห้ามใช้ placeholder, generic filler, mock หรือ TODO ที่ไม่จำเป็น


### Fix Rules
- ใช้ minimal changes
- ไม่แก้นอก scope
- ถ้าไม่แน่ใจ → stop และ `/ask-me`
## Expected Outcome

- รายงานตาราง aggregate findings จากทุก type section
- Review score ต่อ dimension และ overall
- ตาราง metrics: `any` count, `as` count, non-null assertion count, `@ts-ignore` count, `@ts-expect-error` count
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
