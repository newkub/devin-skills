---
name: follow-lib-zod
description: ใช้ Zod v4 สำหรับ TypeScript schema validation ด้วย static type inference
related:
  - follow-lib-arktype
  - follow-lib-better-auth
  - follow-lang-typescript
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

ใช้ Zod v4 เพื่อสร้าง schema validation ที่ type-safe ทั้ง compile-time และ runtime ด้วย API ปัจจุบัน

## Scope

ใช้กับ TypeScript projects ทุกประเภท รวมถึง frontend, backend, full-stack และ libraries ที่ต้องการ runtime validation พร้อม static type inference

## Execute

### 1. Install Zod

> Goal: ติดตั้ง Zod เวอร์ชันล่าสุด

1. รัน `npm install zod@latest` (หรือ `pnpm add zod@latest`, `yarn add zod@latest`, `bun add zod@latest`)
2. ตรวจสอบเวอร์ชันล่าสุดที่ `https://www.npmjs.com/package/zod` (ปัจจุบัน v4.5.4)
3. ยืนยันว่า `package.json` มี `zod` ใน `dependencies`
4. ใช้ `import * as z from "zod"` สำหรับ classic API
5. หากต้องการ bundle ที่เล็กลง ให้ใช้ `import * as z from "zod/mini"`

### 2. Enable Strict TypeScript Mode

> Goal: ตั้งค่า `tsconfig.json` ให้รองรับ strict mode สำหรับ Zod type inference

1. เปิด `strict: true` ใน `tsconfig.json`
2. เปิด `noUncheckedIndexedAccess: true` สำหรับ type safety เพิ่มเติม (ถ้า project อนุญาต)
3. ตรวจสอบ compiler options อื่นๆ ให้สอดคล้องกับ project

### 3. Define Schemas

> Goal: สร้าง schemas สำหรับ primitive และ complex types ให้ reusable

1. ใช้ factory functions จาก `z` namespace (`z.string()`, `z.number()`, `z.boolean()`)
2. กำหนด schemas สำหรับ complex structures (`z.object({})`, `z.array()`, `z.union()`, `z.intersection()`)
3. ใช้ `z.coerce` สำหรับ type coercion โดยรู้ว่า input type คือ `unknown` ถ้าไม่ระบุ generic
4. ใช้ `z.custom()` หรือ `.refine()` สำหรับ custom validation
5. จัดโครงสร้าง schemas ให้ reusable ตาม domain หรือ feature

### 4. Validate Data

> Goal: เลือก validation method ที่เหมาะสมกับ use case

1. ใช้ `.parse()` สำหรับ validation ที่ต้องการ throw `ZodError`
2. ใช้ `.safeParse()` สำหรับ validation ที่ต้องการ result object
3. ใช้ `.parseAsync()` หรือ `.safeParseAsync()` สำหรับ async validation
4. ระวังว่า `safeParse()` error ใน Zod 4 ไม่ extend `Error` แล้ว ให้ตรวจผ่าน `result.success`

### 5. Handle Errors

> Goal: จัดการ validation errors ให้ชัดเจนและ user-friendly

1. ใช้ `try-catch` กับ `.parse()`
2. ตรวจสอบ `error instanceof z.ZodError`
3. เข้าถึง `error.issues` สำหรับข้อมูล error (`.errors` ถูกลบไปแล้วใน v4)
4. ใช้ `error` parameter ใน schemas แทน `message` ที่ deprecated
5. ใช้ `z.config({ customError: ... })` หรือ `z.config(z.locales.en())` สำหรับ global error messages
6. ใช้ `z.treeifyError()` แทน `.format()` หรือ `.flatten()` ที่ deprecated

### 6. TypeScript Integration

> Goal: รักษา type safety ทั้ง runtime และ compile-time

1. ใช้ `z.infer<typeof schema>` สำหรับ type inference
2. ใช้ `z.input<typeof schema>` สำหรับ input type
3. ใช้ `z.output<typeof schema>` สำหรับ output type
4. ระวัง internal API (`._zod`, `ZodEffects` ถูกลบ) ให้ใช้ public API เป็นหลัก
5. รักษา type safety ทั้ง runtime และ compile-time

### 7. Schema Composition

> Goal: ประกอบ schemas ให้ maintainable และลด TypeScript compilation time

1. ใช้ spread syntax หรือ `A.extend(B.shape)` แทน `.merge()` ที่ deprecated
2. ใช้ `.safeExtend()` สำหรับ extending schemas ที่มี refinements
3. ใช้ `.pick()` และ `.omit()` สำหรับ partial schemas
4. ใช้ `.partial()` สำหรับ optional fields
5. ใช้ `.required()` สำหรับ required fields
6. ใช้ `z.strictObject()` หรือ `z.looseObject()` แทน `.strict()` และ `.passthrough()` ที่ deprecated
7. จัดระเบียบ schemas ตาม domain หรือ feature

### 8. Advanced Patterns

> Goal: ใช้ advanced validation และ transformation patterns สำหรับกรณีพิเศษ

1. ใช้ `.refine()` สำหรับ custom validation logic โดยใช้ `error` option
2. ใช้ `.transform()` สำหรับ data transformation หลัง validation
3. ใช้ `.pipe()` สำหรับ chaining transformations
4. ใช้ `.preprocess()` สำหรับ data normalization ก่อน validation
5. ใช้ `z.discriminatedUnion()` หรือ `z.union()` สำหรับ tagged unions
6. ใช้ `.brand()` สำหรับ branded types
7. ใช้ `.readonly()` สำหรับ immutable data
8. ใช้ `.default()` สำหรับ default values (output side)
9. ใช้ `.prefault()` สำหรับ prefault values (input side)
10. ใช้ string format top-level เช่น `z.email()`, `z.uuid()`, `z.iso.date()` แทน `z.string().email()` ที่ deprecated
11. พิจารณาใช้ `z.core` หรือ `z.compile()` สำหรับ AOT compilation เมื่อจำเป็น

## Rules

### 1. TypeScript Configuration

- เปิด `strict: true` ใน `tsconfig.json` เสมอ
- เปิด `noUncheckedIndexedAccess: true` สำหรับ type safety เพิ่มเติม

### 2. Validation Methods

- ใช้ `.safeParse()` สำหรับ user input validation และ performance-sensitive code
- ใช้ `.parse()` สำหรับ critical validation ที่ต้องการ throw
- ใช้ `.parseAsync()` หรือ `.safeParseAsync()` สำหรับ async schemas

### 3. Error Handling

- custom error messages ควรชัดเจนและเป็นภาษาที่ user เข้าใจ
- ใช้ `error` parameter แทน `message` หรือ `errorMap` ที่ deprecated
- ใช้ `z.config()` สำหรับ global error messages

### 4. Schema Design

- schemas ควร reusable และ maintainable
- จัดระเบียบ schemas ตาม domain หรือ feature
- ใช้ type inference แทน manual type definitions
- ใช้ `z.coerce` เมื่อต้องการ type conversion

### 5. Schema Composition

- ใช้ spread syntax หรือ `A.extend(B.shape)` แทน `.merge()` ที่ deprecated
- ใช้ `.safeExtend()` สำหรับ schemas ที่มี refinements

### 6. Advanced Patterns

- ใช้ `.preprocess()` สำหรับ data normalization ก่อน validation
- ใช้ `.transform()` สำหรับ data transformation หลัง validation
- ใช้ `z.lazy()` สำหรับ recursive schemas พร้อมระบุ type hint

### 7. Performance

- พิจารณาใช้ `zod/mini` สำหรับ bundle size constraints
- ใช้ `z.compile()` เมื่อต้องการ AOT compilation

### 8. Testing

- test schemas อย่างครอบคลุม valid, invalid, และ edge cases
- ใช้ `.safeParse()` ใน tests

### 9. Cross-Skill References

- ใช้ `/follow-lib-arktype` ถ้าจำเป็น
- ใช้ `/follow-lib-better-auth` ถ้าจำเป็น
- ใช้ `/follow-lang-typescript` ถ้าจำเป็น
- ใช้ `/follow-best-practice` ถ้าจำเป็น
- ใช้ `/use-my-packages-on-registry` ถ้าจำเป็น
- ใช้ `/setup-cicd` ถ้าจำเป็น

## Expected Outcome

- Zod ติดตั้งและตั้งค่าอย่างถูกต้อง
- Schemas ที่ well-structured และ reusable
- Validation logic ที่ type-safe
- Error handling ที่ clear และ user-friendly
- TypeScript types ที่ synchronized กับ runtime validation
- Test coverage สำหรับ validation logic
- Codebase ที่ maintainable และ scalable
