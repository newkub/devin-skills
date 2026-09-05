---
name: follow-lib-arktype
description: ใช้ ArkType สำหรับ TypeScript runtime validation ด้วย native type syntax
related:
  - follow-lib-zod
  - follow-lib-better-auth
  - follow-lang-typescript
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

ใช้ ArkType เวอร์ชันล่าสุดสำหรับ TypeScript runtime validation โดยอาศัย native type syntax ให้ schema และ type ซิงค์กันระหว่าง compile-time กับ runtime พร้อมประสิทธิภาพสูง

## Scope

ใช้กับ TypeScript projects ทุกประเภทที่รองรับ ESM และ strict mode ไม่ว่าจะเป็น Bun, Node.js, frontend, backend หรือ framework ใดๆ

## Execute

### 1. Install ArkType

> Goal: ติดตั้ง ArkType และเตรียม environment

1. รัน `npm install arktype` (หรือ `pnpm add arktype`, `yarn add arktype`, `bun add arktype`)
2. ตรวจสอบเวอร์ชันล่าสุดที่ `https://www.npmjs.com/package/arktype` (ปัจจุบัน v2.2.3)
3. ยืนยันว่า `package.json` มี `arktype` ใน `dependencies`
4. ตรวจสอบว่า `package.json` มี `"type": "module"` หรือ runtime รองรับ ESM imports

### 2. Configure TypeScript

> Goal: ตั้งค่า `tsconfig.json` และ editor ให้รองรับ ArkType syntax

1. เปิด `strict: true` หรือ `strictNullChecks: true` (required)
2. เปิด `exactOptionalPropertyTypes: true` (recommended)
3. เปิด `skipLibCheck: true` (strongly recommended)
4. ใช้ TypeScript เวอร์ชัน `>= 5.1`
5. เพิ่ม VSCode settings ใน `.vscode/settings.json`:

```json
{
  "editor.quickSuggestions": { "strings": "on" },
  "typescript.preferences.autoImportSpecifierExcludeRegexes": [
    "^(node:)?os$"
  ]
}
```

6. ดูรายละเอียดเพิ่มเติมใน [references/arktype-config-build-dev.md](references/arktype-config-build-dev.md)

### 3. Define Schemas

> Goal: สร้าง schemas ด้วย native type syntax

1. ใช้ `type()` จาก `arktype`
2. กำหนด primitives เช่น `type("string")`, `type("number")`, `type("boolean")`
3. กำหนด object เช่น `type({ name: "string", "age?": "number" })`
4. ใช้ optional fields ด้วย `"field?"` syntax
5. ใช้ union และ intersection ด้วย `"|"` และ `"&"` หรือ `.or()` และ `.and()`
6. ดูรายละเอียดเพิ่มเติมใน [references/arktype-api-core.md](references/arktype-api-core.md)

### 4. Validate Data

> Goal: เลือก validation method ที่เหมาะสม

1. เรียก `Schema(data)` โดยตรง เพื่อรับ output หรือ `ArkErrors`
2. ใช้ `Schema.assert(data)` เมื่อต้องการ throw `TraversalError`
3. ใช้ `Schema.allows(data)` เมื่อต้องการ boolean type guard (ไม่ apply morphs)
4. ตรวจ `instanceof type.errors` หรือ `instanceof ArkErrors` สำหรับ error handling
5. ดูรายละเอียดเพิ่มเติมใน [references/arktype-api-core.md](references/arktype-api-core.md)

### 5. Pattern Matching

> Goal: ใช้ `match()` สำหรับ type-safe branching

1. ใช้ `match()` จาก `arktype` สำหรับ pattern matching
2. กำหนด cases ด้วย Case Record API (`match({ "string | Array": v => v.length, ... })`)
3. ใช้ Fluent API ด้วย `.case()` และ `.default()` สำหรับ non-string definitions
4. ใช้ `.in<T>()` และ `.at("key")` สำหรับ narrowing และ property matching
5. ค่า `default`: `"assert"` (throw), `"reject"` (return ArkErrors), `"never"` (throw), หรือ handler function

### 6. Configure Validation

> Goal: ปรับแต่ง validation behavior และ error messages

1. ใช้ `configure()` จาก `arktype/config` สำหรับ global configuration
2. กำหนด custom error messages ด้วย `.configure({ actual: () => "..." })` หรือ `.describe(...)`
3. ใช้ keyword configuration สำหรับ built-in types (เช่น `numberAllowsNaN`, `jitless`)
4. ดูรายละเอียดเพิ่มเติมใน [references/arktype-config-type-validation.md](references/arktype-config-type-validation.md)

### 7. Type Inference And Scope

> Goal: ใช้ type inference และ scope สำหรับ reusable types

1. ใช้ `typeof Schema.t` หรือ `typeof Schema.infer` สำหรับ type inference
2. ใช้ `scope()` จาก `arktype` สำหรับ grouped type definitions ที่ reference กัน
3. หลีกเลี่ยง type assertions ที่ไม่จำเป็น ให้ใช้ inference จาก ArkType
4. ดูรายละเอียดเพิ่มเติมใน [references/arktype-api-advanced.md](references/arktype-api-advanced.md)

### 8. Performance And Integration

> Goal: ใช้ ArkType ใน performance-critical scenarios และ integrate กับ frameworks

1. ใช้ ArkType สำหรับ performance-critical validation (benchmark เร็วกว่า Zod หลายเท่า)
2. ใช้ caching ที่ runtime สำหรับ repeated validations
3. ใช้ Standard Schema integration (`~standard`) เมื่อจำเป็น
4. ดู official resources ใน [references/arktype-resources.md](references/arktype-resources.md)

## Rules

### 1. Installation

- ใช้ `npm install arktype` หรือ package manager ที่ project ใช้
- ยืนยันว่า `package.json` มี `type: "module"` หรือ environment รองรับ ESM

### 2. TypeScript Configuration

- เปิด `strict: true` หรือ `strictNullChecks: true` เสมอ
- เปิด `exactOptionalPropertyTypes: true` และ `skipLibCheck: true`
- ตั้งค่า VSCode `quickSuggestions.strings: on`

### 3. Schema Definitions

- ใช้ `type()` สำหรับ schema definitions
- ใช้ `match()` สำหรับ pattern matching
- ใช้ double quotes หรือ backticks สำหรับ type expressions ใน examples
- ใช้ code blocks สำหรับ schema examples

### 4. Validation

- ใช้ direct invocation `Schema(data)` สำหรับ result หรือ errors
- ใช้ `.assert()` สำหรับ throw
- ใช้ `.allows()` สำหรับ boolean type guard

### 5. Type Safety

- ใช้ type inference จาก ArkType เสมอ (`typeof Schema.t` หรือ `typeof Schema.infer`)
- หลีกเลี่ยง type assertions ที่ไม่จำเป็น

### 6. Performance

- ใช้ ArkType สำหรับ performance-critical validation
- หลีกเลี่ยง redundant validations

### 7. Integration

- ใช้ Standard Schema (`~standard`) เมื่อจำเป็น
- ใช้ `/follow-lib-zod` ถ้าจำเป็น
- ใช้ `/follow-lib-better-auth` ถ้าจำเป็น
- ใช้ `/follow-lang-typescript` ถ้าจำเป็น
- ใช้ `/follow-best-practice` ถ้าจำเป็น
- ใช้ `/use-my-packages-on-registry` ถ้าจำเป็น
- ใช้ `/setup-cicd` ถ้าจำเป็น

## Expected Outcome

- Schema validation ที่รวดเร็วและแม่นยำ
- Type-safe code ทั้ง compile-time และ runtime
- Code ที่ maintainable และ consistent
- Performance ที่ optimized
