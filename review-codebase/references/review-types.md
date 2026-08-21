---
name: review-types
description: Review generics, type inference, discriminated unions, branded types, type narrowing, type safety, as const, exhaustive checks
---

## Goal

Review type design ครอบคลุม generics, inference, discriminated unions, branded types, type narrowing, type safety พร้อม review score

## Scope

type review สำหรับ: generic type usage, type parameter constraints, type inference quality, discriminated unions, type narrowing, type predicate patterns, branded types, opaque types, nominal typing, type safety gaps, any usage, unnecessary type assertions, union/literal types, readonly/immutable patterns, exhaustive checks with never, generic function constraints, optional/null safety, as const usage

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ type system และ TypeScript config

1. ทำ `/scan-codebase` เพื่อเข้าใจ type patterns
2. ระบุ TypeScript version, tsconfig strictness, type utility libraries (type-fest, ts-toolbelt) ที่ใช้
3. ถ้า project ไม่มี TypeScript → stop และ report

### 2. Deep Analyze

> Goal: ครอบคลุมทุก type dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ type patterns
2. ทำ `/update-review-cli` — `/update-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. Generic And Type Inference Review

> Goal: ครอบคลุม generics, inference, constraints

1. ตรวจสอบ generic type usage: generic functions, generic classes, generic interfaces, type parameter constraints (extends), conditional types, mapped types, template literal types
2. ตรวจสอบ type inference quality: inference that works without explicit annotations, over-annotated types ที่ควร infer, inference in generic function calls, inference in conditional types
3. ตรวจสอบ type parameter constraints: proper constraints (extends), constraint completeness, constraint specificity, avoid unnecessary constraints
4. ตรวจสอบ `as const` usage: literal type narrowing with as const, as const in object literals, as const in arrays, as const vs enum

### 4. Type Safety And Advanced Patterns Review

> Goal: ครอบคลุม type safety, discriminated unions, branded types, narrowing

1. ตรวจสอบ discriminated unions: union member discriminants, exhaustive union coverage, union member naming consistency, tagged union patterns
2. ตรวจสอบ type narrowing: type guard functions, type predicate patterns (x is T), in operator narrowing, typeof narrowing, instanceof narrowing, control flow narrowing
3. ตรวจสอบ branded types/opaque types: branded type usage for IDs, opaque type patterns, nominal typing simulation, brand consistency
4. ตรวจสอบ exhaustive checks: never type usage in switch, exhaustive pattern matching, default case with never, missing case detection
5. ตรวจสอบ type safety gaps: any usage, unknown vs any, unnecessary type assertions (as), non-null assertions (!), @ts-ignore, @ts-expect-error, type erasure risks
6. ตรวจสอบ readonly/immutable patterns: readonly arrays, readonly properties, Readonly<T>, as const for immutability, mutable vs immutable API
7. ตรวจสอบ optional/null safety: optional chaining (?.), nullish coalescing (??), null vs undefined consistency, optional parameter defaults
8. Critical: any ใน critical path, type safety bypass ใน critical path, unsafe assertion ที่ก่อให้เกิด runtime error, @ts-ignore ใน critical path
9. High: missing type constraint, poor generic design, missing discriminated union, unnecessary assertion, missing branded type for IDs, missing exhaustive check

### 5. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี TypeScript → ข้ามทั้งหมด
- ถ้า project ไม่มี generics → ข้าม Step 3
- ถ้า project ไม่มี discriminated unions → ข้าม Step 4 item 1

### 2. Severity Classification

- Critical: any ใน critical path, type safety bypass ใน critical path, unsafe assertion ที่ก่อให้เกิด runtime error, @ts-ignore ใน critical path
- High: missing type constraint, poor generic design, missing discriminated union, unnecessary assertion, missing branded type for IDs, missing exhaustive check
- Medium: suboptimal inference, missing as const, missing readonly, minor any usage ใน non-critical path, missing type predicate
- Low: cosmetic, minor type improvement, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ type, function, หรือ interface ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก type section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
