---
name: follow-lib-arktype
description: TypeScript runtime validation ด้วย native type syntax 1:1, 20x faster than Zod
related:
  - follow-lib-animejs
  - follow-lib-better-auth
  - follow-lib-css
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

ใช้ ArkType สำหรับ TypeScript runtime validation ด้วย type syntax โดยตรง

## Scope

ใช้สำหรับ schema validation, type checking, และ type-safe validation ทั้ง compile-time และ runtime

## Execute

### 1. Install ArkType

> Goal: ติดตั้ง ArkType และตรวจสอบ version ให้เป็นปัจจุบัน

1. รัน `bun add arktype` สำหรับ core library
2. ตรวจสอบ version ล่าสุดที่ `https://www.npmjs.com/package/arktype`
3. ยืนยันว่า `package.json` มี `arktype` ใน `dependencies`

### 2. Configure TypeScript

> Goal: ตั้งค่า `tsconfig.json` และ editor ให้รองรับ ArkType type syntax

1. เปิด `strict: true` ใน `tsconfig.json`
2. ตั้งค่า `noUncheckedIndexedAccess: true` และ `exactOptionalPropertyTypes: true`
3. ตั้งค่า VSCode `quickSuggestions` สำหรับ strings เพื่อ autocomplete type syntax
4. ดูรายละเอียดใน [references/arktype-config-build-dev.md](references/arktype-config-build-dev.md)

### 3. Define Schemas

> Goal: สร้าง schemas ด้วย `type()` และ native type syntax ให้ reusable

1. ใช้ `type()` จาก `arktype` สำหรับ schema definitions
2. กำหนด schemas จาก string syntax (เช่น `type("string")`, `type("number")`)
3. กำหนด object schemas ด้วย `type({ name: "string", age: "number" })`
4. ใช้ optional fields ด้วย `"field?"` syntax
5. ใช้ union และ intersection ด้วย `|` และ `&`
6. ดูรายละเอียดใน [references/arktype-api-core.md](references/arktype-api-core.md)

### 4. Validate Data

> Goal: เลือก validation method ที่เหมาะสมกับ use case

1. เรียก schema โดยตรง `Schema(data)` สำหรับ return result หรือ `ArkErrors`
2. ใช้ `Schema.assert(data)` สำหรับ throw บน error
3. ใช้ `Schema.is(data)` หรือ `Schema.can(data)` สำหรับ boolean check
4. ตรวจ `instanceof ArkErrors` สำหรับ error handling
5. ดูรายละเอียดใน [references/arktype-api-core.md](references/arktype-api-core.md)

### 5. Pattern Matching

> Goal: ใช้ `match()` สำหรับ type-safe branching ตาม input type

1. ใช้ `match()` จาก `arktype` สำหรับ pattern matching
2. กำหนด cases ด้วย Case Record API (`match({ "string | Array": v => v.length, ... })`)
3. ใช้ Fluent API ด้วย `.case()` และ `.default()` สำหรับ non-string definitions
4. ใช้ `.in<T>()` และ `.at("key")` สำหรับ narrowing และ property matching
5. ค่า `default`: `"assert"` (throw), `"reject"` (return ArkErrors), `"never"` (throw), หรือ handler function

### 6. Configure Validation

> Goal: ปรับแต่ง validation behavior และ error messages

1. ใช้ `configure()` จาก `arktype/config` สำหรับ global configuration
2. กำหนด custom error messages ด้วย `message` option ใน `@` config
3. ใช้ keyword configuration สำหรับ built-in types (เช่น `string.email`)
4. ดูรายละเอียดใน [references/arktype-config-type-validation.md](references/arktype-config-type-validation.md)

### 7. Type Inference And Scope

> Goal: ใช้ type inference และ scope สำหรับ reusable types

1. ใช้ `typeof Schema.t` สำหรับ type inference
2. ใช้ `type.scope()` สำหรับ grouped type definitions ที่ reference กัน
3. หลีกเลี่ยง type assertions ที่ไม่จำเป็น — ใช้ inference จาก ArkType
4. ดูรายละเอียดใน [references/arktype-api-advanced.md](references/arktype-api-advanced.md)

### 8. Performance And Integration

> Goal: ใช้ ArkType ใน performance-critical scenarios และ integrate กับ frameworks

1. ใช้ ArkType สำหรับ performance-critical validation (100x faster than Zod)
2. ใช้ caching สำหรับ repeated validations
3. ใช้ Standard Schema integration เมื่อจำเป็น
4. ดู official resources ใน [references/arktype-resources.md](references/arktype-resources.md)

## Rules

### 1. Installation

- ใช้ `bun add arktype` สำหรับ installation
- ใช้ `bun add -D arktype` สำหรับ dev dependencies

### 2. TypeScript Configuration

- ตั้งค่า `strict: true` ใน `tsconfig.json` เสมอ
- ตั้งค่า `noUncheckedIndexedAccess: true` และ `exactOptionalPropertyTypes: true`
- ตั้งค่า VSCode `quickSuggestions` สำหรับ strings

### 3. Schema Definitions

- ใช้ `type()` สำหรับ schema definitions
- ใช้ `match()` สำหรับ pattern matching
- ใช้ backticks สำหรับ `type()`, `match()`, `declare()`, commands
- ใช้ code blocks สำหรับ schema examples

### 4. Type Safety

- ใช้ type inference จาก ArkType เสมอ (`typeof Schema.t`)
- หลีกเลี่ยง type assertions ที่ไม่จำเป็น

### 5. Performance

- ใช้ ArkType สำหรับ performance-critical validation
- หลีกเลี่ยง redundant validations
- ใช้ caching สำหรับ repeated validations

### 6. Integration

- ใช้ Standard Schema integration เมื่อจำเป็น

- ใช้ /follow-lib-animejs ถ้าจำเป็น
- ใช้ /follow-lib-better-auth ถ้าจำเป็น
- ใช้ /follow-lib-css ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /use-my-packages-on-registry ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น

## Expected Outcome

- Schema validation ที่รวดเร็วและแม่นยำ
- Type-safe code ทั้ง compile-time และ runtime
- Code ที่ maintainable และ consistent
- Performance ที่ optimized
