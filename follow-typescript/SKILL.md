---
name: follow-typescript
description: Develop TypeScript projects with type safety and code quality best practices
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
related: []
---
## Goal

พัฒนาโปรเจกต์ TypeScript ด้วย type safety สูงสุดและ code quality best practices

## Scope

ใช้สำหรับพัฒนาโปรเจกต์ TypeScript ทั้ง type system, code quality, testing, และ documentation

## Execute

### 1. Setup Type System
> Goal: Setup Type System

ตั้งค่า TypeScript type system ให้เข้มงวด

1. เปิดใช้งาน `strict: true` ทั้งหมดใน `tsconfig.json`
2. เปิดใช้งาน enhanced options: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noImplicitOverride`, `noFallthroughCasesInSwitch`
3. เปิดใช้งาน module options: `verbatimModuleSyntax`, `isolatedModules`, `noUncheckedSideEffectImports`
4. ใช้ `type narrowing` แทน `type assertion`
5. ใช้ `discriminated unions` สำหรับ complex state
6. ไม่ใช้ `any` โดยเด็ดขาด ใช้ `unknown` แทน
7. ใช้ `readonly` สำหรับ properties ที่ไม่ควรเปลี่ยนแปลง

### 2. Use Modern Type Features
> Goal: Use Modern Type Features

ใช้ modern TypeScript features สำหรับ type safety สูงสุด

1. ใช้ `satisfies` operator เพื่อ validate types โดยไม่เปลี่ยน inferred type
2. ใช้ `as const` สำหรับ literal type inference
3. ใช้ branded types สำหรับ domain-specific values
4. ใช้ template literal types สำหรับ string patterns
5. ใช้ conditional types สำหรับ type logic
6. ใช้ `infer` keyword สำหรับ type inference ใน conditional types
7. ใช้ mapped types สำหรับ type transformations

### 3. Setup Code Quality
> Goal: Setup Code Quality

ตั้งค่า code quality tools และ conventions

1. ใช้ `type annotations` สำหรับ function return types
2. ใช้ `const` แทน `let` เมื่อเป็นไปได้
3. ใช้ `named exports` สำหรับ tree-shaking
4. ใช้ `import type` สำหรับ type-only imports
5. ใช้ `interface` สำหรับ object shapes ที่ extend ได้
6. ใช้ `type` สำหรับ unions, tuples, และ complex types
7. ใช้ generic constraints สำหรับ reusable type-safe code

### 4. Setup Testing
> Goal: Setup Testing

ตั้งค่า testing ด้วย type safety

1. ใช้ `vitest` สำหรับ unit testing
2. สร้าง type-safe mocks ด้วย `vi.fn()` และ `vi.spyOn()`
3. ใช้ `expect-type` สำหรับ runtime type assertions
4. ตรวจสอบ type coverage ด้วย `type-coverage`

### 5. Setup Documentation
> Goal: Setup Documentation

ตั้งค่า documentation standards

1. ใช้ `JSDoc`/`TSDoc` สำหรับ function documentation
2. เพิ่ม `@param`, `@returns`, `@example` สำหรับ public functions
3. ใช้ `@remarks` สำหรับ additional notes
4. ใช้ `@deprecated` สำหรับ deprecated APIs

## Rules

### 1. Type System Best Practices

ใช้ TypeScript type system อย่างเต็มประสิทธิภาพ

- เปิดใช้งาน `strict: true` ทั้งหมดใน `tsconfig.json`
- เปิดใช้งาน `noUncheckedIndexedAccess` เพื่อป้องกัน `undefined` errors
- เปิดใช้งาน `exactOptionalPropertyTypes` สำหรับ strict optional handling
- เปิดใช้งาน `noImplicitReturns`, `noImplicitOverride`, `noFallthroughCasesInSwitch`
- เปิดใช้งาน `noUnusedLocals`, `noUnusedParameters`
- ใช้ `verbatimModuleSyntax` และ `isolatedModules`
- ใช้ `type narrowing` แทน `type assertion`
- ใช้ `discriminated unions` สำหรับ complex state
- ไม่ใช้ `any` โดยเด็ดขาด ใช้ `unknown` แทน
- ใช้ `readonly` สำหรับ properties ที่ไม่ควรเปลี่ยนแปลง
- ใช้ utility types (`Partial`, `Readonly`, `Pick`, `Omit`, `Awaited`, `Parameters`, `ReturnType`)
- ใช้ `satisfies` operator เพื่อ validate types โดยไม่เปลี่ยน inferred type
- ใช้ `type guards` สำหรับ runtime type checking
- ใช้ exhaustive switch checking ด้วย `never` type

### 2. Modern Type Features

ใช้ modern TypeScript features สำหรับ type safety สูงสุด

- ใช้ `as const` สำหรับ literal type inference
- ใช้ branded types สำหรับ domain-specific values (e.g. `UserId`, `Email`)
- ใช้ template literal types สำหรับ string patterns
- ใช้ conditional types สำหรับ type logic
- ใช้ `infer` keyword สำหรับ type inference ใน conditional types
- ใช้ mapped types สำหรับ type transformations
- ใช้ `keyof` และ `typeof` operators สำหรับ type queries

### 3. Code Quality Best Practices

เขียนโค้ดที่มีคุณภาพและ maintainable

- ใช้ `type annotations` สำหรับ function return types
- ใช้ `const` แทน `let` เมื่อเป็นไปได้
- ใช้ `named exports` สำหรับ tree-shaking
- ใช้ `import type` สำหรับ type-only imports
- ใช้ `interface` สำหรับ object shapes ที่ extend ได้
- ใช้ `type` สำหรับ unions, tuples, และ complex types
- ใช้ `===` แทน `==` เสมอ
- ใช้ `template literals` แทน string concatenation
- ใช้ `destructuring` สำหรับ objects และ arrays
- ใช้ generic constraints สำหรับ reusable type-safe code

### 4. Documentation Best Practices

ใช้ `JSDoc`/`TSDoc` สำหรับ documentation

- ใช้ `/** */` สำหรับ documentation comments
- เพิ่ม `@param`, `@returns` สำหรับ public functions
- เพิ่ม `@example` สำหรับ usage examples
- ใช้ `@remarks` สำหรับ additional notes
- ใช้ `@deprecated` สำหรับ deprecated APIs

```ts [JSDoc Example]
/**
 * Calculates the sum of two numbers
 * @param a - First number
 * @param b - Second number
 * @returns The sum of a and b
 * @example
 * ```ts
 * add(1, 2) // returns 3
 * ```
 */
function add(a: number, b: number): number {
  return a + b;
}
```

## Expected Outcome

- Type safety สูงสุดด้วย strict mode และ enhanced options
- Modern TypeScript features ที่ใช้ประโยชน์จาก type system เต็มที่
- Code quality ตาม best practices
- Type-safe testing ด้วย vitest
- Documentation ที่ครบถ้วนด้วย JSDoc/TSDoc
