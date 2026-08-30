---
name: follow-lang-typescript
description: พัฒนา TypeScript projects ด้วย type safety และ code quality best practices
related:
  - follow-lang-bun
  - follow-lang-javascript
  - follow-lang-kotlin
  - follow-best-practice
  - setup-cicd
  - use-scripts
---

## Goal

พัฒนาโปรเจกต์ TypeScript ด้วย type safety สูงสุดและ code quality best practices

## Scope

ใช้สำหรับพัฒนาโปรเจกต์ TypeScript ทั้ง type system, code quality, testing, และ documentation (TypeScript 7.0+)

## Execute

### 1. Setup Type System

> Goal: ตั้งค่า TypeScript type system ให้เข้มงวดสำหรับ type safety สูงสุด

1. เปิดใช้งาน `strict: true` และ enhanced options ใน `tsconfig.json` (`strict` เป็น default ใน TS 7.0)
2. ใช้ `type narrowing` แทน `type assertion` และ `discriminated unions` สำหรับ complex state
3. ไม่ใช้ `any` ใช้ `unknown` แทน และใช้ `readonly` สำหรับ immutable properties
4. ใช้ utility types, `satisfies`, type guards และ exhaustive switch ด้วย `never`
5. ดูรายละเอียดใน [references/typescript-type-system.md](references/typescript-type-system.md)

### 2. Use Modern Type Features

> Goal: ใช้ modern TypeScript features สำหรับ type safety และ expressiveness

1. ใช้ `as const` และ branded types สำหรับ domain-specific values
2. ใช้ template literal types และ conditional types สำหรับ type logic
3. ใช้ `infer` keyword และ mapped types สำหรับ type transformations
4. ใช้ `keyof` และ `typeof` operators สำหรับ type queries
5. ดูรายละเอียดใน [references/typescript-modern-features.md](references/typescript-modern-features.md)

### 3. Setup Code Quality

> Goal: ตั้งค่า code quality tools และ conventions สำหรับ maintainable code

1. ใช้ `type annotations` สำหรับ function return types และ `const` แทน `let`
2. ใช้ `named exports` และ `import type` สำหรับ type-only imports
3. ใช้ `interface` สำหรับ object shapes และ `type` สำหรับ unions และ complex types
4. ใช้ `===`, `template literals`, `destructuring` และ generic constraints
5. ดูรายละเอียดใน [references/typescript-code-quality.md](references/typescript-code-quality.md)

### 4. Setup Testing

> Goal: ตั้งค่า type-safe testing ด้วย vitest และ type coverage tools

1. ใช้ `vitest` สำหรับ unit testing
2. สร้าง type-safe mocks ด้วย `vi.fn()` และ `vi.spyOn()`
3. ใช้ `expect-type` สำหรับ runtime type assertions
4. ตรวจสอบ type coverage ด้วย `type-coverage`
5. ดูรายละเอียดใน [references/typescript-testing.md](references/typescript-testing.md)

### 5. Setup Documentation

> Goal: ตั้งค่า documentation standards ด้วย JSDoc/TSDoc

1. ใช้ `JSDoc`/`TSDoc` สำหรับ function documentation
2. เพิ่ม `@param`, `@returns`, `@example` สำหรับ public functions
3. ใช้ `@remarks` สำหรับ additional notes และ `@deprecated` สำหรับ deprecated APIs
4. ดูรายละเอียดใน [references/typescript-documentation.md](references/typescript-documentation.md)

## Rules

### 1. Type System

- เปิด `strict: true` และ enhanced options ใน `tsconfig.json` (default ใน TS 7.0)
- ใช้ `type narrowing`, `discriminated unions`, `readonly`, utility types, `satisfies`, type guards
- ไม่ใช้ `any` ใช้ `unknown` แทน และใช้ exhaustive switch ด้วย `never`
- ดู [references/typescript-type-system.md](references/typescript-type-system.md)

### 2. Modern Type Features

- ใช้ `as const`, branded types, template literal types, conditional types
- ใช้ `infer`, mapped types, `keyof` และ `typeof` operators
- ดู [references/typescript-modern-features.md](references/typescript-modern-features.md)

### 3. Code Quality

- ใช้ `type annotations`, `const`, `named exports`, `import type`
- ใช้ `interface` สำหรับ object shapes, `type` สำหรับ complex types
- ใช้ `===`, `template literals`, `destructuring`, generic constraints
- ดู [references/typescript-code-quality.md](references/typescript-code-quality.md)

### 4. Testing And Documentation

- ใช้ `vitest`, `vi.fn`/`vi.spyOn`, `expect-type`, `type-coverage`
- ใช้ `JSDoc`/`TSDoc` พร้อม `@param`, `@returns`, `@example`, `@remarks`, `@deprecated`
- ดู [references/typescript-testing.md](references/typescript-testing.md) และ [references/typescript-documentation.md](references/typescript-documentation.md)

- ใช้ /follow-lang-bun ถ้าจำเป็น
- ใช้ /follow-lang-javascript ถ้าจำเป็น
- ใช้ /follow-lang-kotlin ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น
- ใช้ /use-scripts ถ้าจำเป็น

## Expected Outcome

- Type safety สูงสุดด้วย strict mode และ enhanced options
- Modern TypeScript features ที่ใช้ประโยชน์จาก type system เต็มที่
- Code quality ตาม best practices
- Type-safe testing ด้วย vitest
- Documentation ที่ครบถ้วนด้วย JSDoc/TSDoc
