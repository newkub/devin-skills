---
name: follow-lang-typescript
description: Develop TypeScript projects with type safety and code quality best practices
---

## Goal

พัฒนาโปรเจกต์ TypeScript ด้วย type safety สูงสุดและ code quality best practices

## Scope

ใช้สำหรับพัฒนาโปรเจกต์ TypeScript ทั้ง type system, code quality, testing, และ documentation

## Execute

### 1. Setup Type System

> Goal: Setup Type System

ตั้งค่า TypeScript type system ให้เข้มงวด ดูรายละเอียดที่ `references/typescript-type-system.md`

1. เปิดใช้งาน `strict: true` และ enhanced options ใน `tsconfig.json`
2. ใช้ `type narrowing` แทน `type assertion` และ `discriminated unions` สำหรับ complex state
3. ไม่ใช้ `any` ใช้ `unknown` แทน และใช้ `readonly` สำหรับ immutable properties
4. ใช้ utility types, `satisfies`, type guards และ exhaustive switch ด้วย `never`

### 2. Use Modern Type Features

> Goal: Use Modern Type Features

ใช้ modern TypeScript features สำหรับ type safety สูงสุด ดูรายละเอียดที่ `references/typescript-modern-features.md`

1. ใช้ `as const` และ branded types สำหรับ domain-specific values
2. ใช้ template literal types และ conditional types สำหรับ type logic
3. ใช้ `infer` keyword และ mapped types สำหรับ type transformations
4. ใช้ `keyof` และ `typeof` operators สำหรับ type queries

### 3. Setup Code Quality

> Goal: Setup Code Quality

ตั้งค่า code quality tools และ conventions ดูรายละเอียดที่ `references/typescript-code-quality.md`

1. ใช้ `type annotations` สำหรับ function return types และ `const` แทน `let`
2. ใช้ `named exports` และ `import type` สำหรับ type-only imports
3. ใช้ `interface` สำหรับ object shapes และ `type` สำหรับ unions และ complex types
4. ใช้ `===`, `template literals`, `destructuring` และ generic constraints

### 4. Setup Testing

> Goal: Setup Testing

ตั้งค่า testing ด้วย type safety ดูรายละเอียดที่ `references/typescript-testing.md`

1. ใช้ `vitest` สำหรับ unit testing
2. สร้าง type-safe mocks ด้วย `vi.fn()` และ `vi.spyOn()`
3. ใช้ `expect-type` สำหรับ runtime type assertions
4. ตรวจสอบ type coverage ด้วย `type-coverage`

### 5. Setup Documentation

> Goal: Setup Documentation

ตั้งค่า documentation standards ดูรายละเอียดที่ `references/typescript-documentation.md`

1. ใช้ `JSDoc`/`TSDoc` สำหรับ function documentation
2. เพิ่ม `@param`, `@returns`, `@example` สำหรับ public functions
3. ใช้ `@remarks` สำหรับ additional notes และ `@deprecated` สำหรับ deprecated APIs

## Rules

### 1. Type System

ใช้ TypeScript type system อย่างเต็มประสิทธิภาพ — ดู `references/typescript-type-system.md`

- เปิด `strict: true` และ enhanced options ใน `tsconfig.json`
- ใช้ `type narrowing`, `discriminated unions`, `readonly`, utility types, `satisfies`, type guards
- ไม่ใช้ `any` ใช้ `unknown` แทน และใช้ exhaustive switch ด้วย `never`

### 2. Modern Type Features

ใช้ modern TypeScript features สำหรับ type safety สูงสุด — ดู `references/typescript-modern-features.md`

- ใช้ `as const`, branded types, template literal types, conditional types
- ใช้ `infer`, mapped types, `keyof` และ `typeof` operators

### 3. Code Quality

เขียนโค้ดที่มีคุณภาพและ maintainable — ดู `references/typescript-code-quality.md`

- ใช้ `type annotations`, `const`, `named exports`, `import type`
- ใช้ `interface` สำหรับ object shapes, `type` สำหรับ complex types
- ใช้ `===`, `template literals`, `destructuring`, generic constraints

### 4. Testing And Documentation

ทดสอบและ document อย่างครบถ้วน — ดู `references/typescript-testing.md` และ `references/typescript-documentation.md`

- ใช้ `vitest`, `vi.fn`/`vi.spyOn`, `expect-type`, `type-coverage`
- ใช้ `JSDoc`/`TSDoc` พร้อม `@param`, `@returns`, `@example`, `@remarks`, `@deprecated`

## Expected Outcome

- Type safety สูงสุดด้วย strict mode และ enhanced options
- Modern TypeScript features ที่ใช้ประโยชน์จาก type system เต็มที่
- Code quality ตาม best practices
- Type-safe testing ด้วย vitest
- Documentation ที่ครบถ้วนด้วย JSDoc/TSDoc
