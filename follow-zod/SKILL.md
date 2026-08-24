---
name: follow-zod
description: ตั้งค่าและใช้งาน Zod สำหรับ TypeScript-first schema validation ด้วย static type inference
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
---

## Goal

ตั้งค่าและใช้งาน Zod สำหรับ schema validation และ type safety ใน TypeScript projects

## Scope

Use `follow-zod` for the specific tasks and workflows it covers

## Execute

### 1. Install Zod
> Goal: Install Zod

1. ติดตั้ง Zod ด้วย Bun
2. ตรวจสอบ version ล่าสุด
3. เพิ่ม dependencies ใน package.json

### 2. Enable Strict TypeScript Mode
> Goal: Enable Strict TypeScript Mode

1. เปิด strict mode ใน tsconfig.json
2. ตั้งค่า strict: true
3. ตรวจสอบ compiler options อื่นๆ

### 3. Define Schemas
> Goal: Define Schemas

1. ใช้ factory functions จาก z namespace
2. กำหนด schemas สำหรับ primitive types (string, number, boolean)
3. กำหนด schemas สำหรับ complex structures (object, array, union)
4. ใช้ z.coerce สำหรับ type coercion
5. ใช้ z.custom สำหรับ custom validation
6. จัดโครงสร้าง schemas ให้ reusable

### 4. Validate Data
> Goal: Validate Data

1. ใช้ .parse() สำหรับ validation ที่ต้องการ throw error
2. ใช้ .safeParse() สำหรับ validation ที่ต้องการ result object
3. ใช้ .parseAsync() หรือ .safeParseAsync() สำหรับ async validation
4. เลือก method ที่เหมาะสมกับ use case

### 5. Handle Errors
> Goal: Handle Errors

1. ใช้ try-catch กับ .parse()
2. ตรวจสอบ z.ZodError instance
3. เข้าถึง error.issues สำหรับข้อมูล error
4. custom error messages ใน schema definitions
5. ใช้ z.config() สำหรับ global error messages

### 6. TypeScript Integration
> Goal: TypeScript Integration

1. ใช้ z.infer<typeof schema> สำหรับ type inference
2. ใช้ z.input<typeof schema> สำหรับ input type
3. ใช้ z.output<typeof schema> สำหรับ output type
4. extend z.ZodTypeAny สำหรับ generic functions
5. รักษา type safety ทั้ง runtime และ compile-time

### 7. Schema Composition
> Goal: Schema Composition

1. ใช้ spread syntax แทนการ chain `.extend()` เพื่อลด TypeScript compilation time
2. ใช้ .safeExtend() สำหรับ extending schemas ที่มี refinements
3. ใช้ .merge() สำหรับ merging schemas (ไม่ mutate)
4. ใช้ .extend() สำหรับ extending schemas (mutate)
5. ใช้ .pick() และ .omit() สำหรับ partial schemas
6. ใช้ .partial() สำหรับ optional fields
7. ใช้ .required() สำหรับ required fields
8. จัดระเบียบ schemas ให้ maintainable ตาม domain หรือ feature

### 8. Advanced Patterns
> Goal: Advanced Patterns

1. ใช้ .refine() สำหรับ custom validation logic
2. ใช้ .transform() สำหรับ data transformation (หลัง validation)
3. ใช้ .pipe() สำหรับ chaining transformations
4. ใช้ .preprocess() สำหรับ data normalization (ก่อน validation)
5. ใช้ .discriminatedUnion() สำหรับ tagged unions
6. ใช้ .branded() สำหรับ branded types
7. ใช้ .readonly() สำหรับ immutable data
8. ใช้ .default() สำหรับ default values (output side)
9. ใช้ .prefault() สำหรับ prefault values (input side)

### 9. Performance Optimization
> Goal: Performance Optimization

1. ใช้ spread syntax แทน chain `.extend()` เพื่อลด TypeScript compilation time
2. ใช้ .safeParse() แทน try-catch ใน performance-sensitive code
3. พิจารณาใช้ Zod Mini (zod/mini) สำหรับ bundle size constraints (64% reduction)
4. ใช้ babel-plugin-zod-hoist เพื่อ hoist schema definitions
5. เลือก API variant ที่เหมาะสม (Classic, Mini, หรือ Core)
6. ใช้ .format() สำหรับ error formatting ที่มีประสิทธิภาพ

### 10. Recursive Types
> Goal: Recursive Types

1. ใช้ type hints สำหรับ recursive schemas
2. กำหนด type ด้วยตนเองเนื่องจาก TypeScript ไม่สามารถ infer recursive types
3. ใช้ z.lazy() สำหรับ lazy evaluation ของ recursive schemas

### 11. Testing Schemas
> Goal: Testing Schemas

1. เขียน unit tests สำหรับ validation logic
2. test valid cases
3. test invalid cases
4. test edge cases
5. test error messages
6. ใช้ .safeParse() ใน tests

## Rules

- เปิด strict mode ใน tsconfig.json เสมอ
- ใช้ .safeParse() สำหรับ user input validation และ performance-sensitive code
- ใช้ .parse() สำหรับ critical validation ที่ต้องการ throw error
- ใช้ .parseAsync() หรือ .safeParseAsync() สำหรับ async schemas
- custom error messages ควรชัดเจนและเป็นภาษาที่ user เข้าใจ
- schemas ควร reusable และ maintainable
- ใช้ type inference แทน manual type definitions
- จัดระเบียบ schemas ตาม domain หรือ feature
- test schemas อย่างครอบคลุม
- ใช้ z.coerce เมื่อต้องการ type conversion
- ใช้ spread syntax แทน chain `.extend()` เพื่อลด TypeScript compilation time
- ใช้ .safeExtend() สำหรับ extending schemas ที่มี refinements
- พิจารณาใช้ Zod Mini (zod/mini) สำหรับ bundle size constraints
- ใช้ type hints สำหรับ recursive schemas เนื่องจาก TypeScript ไม่สามารถ infer
- ใช้ .preprocess() สำหรับ data normalization ก่อน validation
- ใช้ .transform() สำหรับ data transformation หลัง validation

## Expected Outcome

- Zod ติดตั้งและตั้งค่าอย่างถูกต้อง
- Schemas ที่ well-structured และ reusable
- Validation logic ที่ type-safe
- Error handling ที่ clear และ user-friendly
- TypeScript types ที่ synchronized กับ runtime validation
- Test coverage สำหรับ validation logic
- Codebase ที่ maintainable และ scalable
