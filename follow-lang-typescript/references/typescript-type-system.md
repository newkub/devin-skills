# TypeScript Type System

## Strict Mode Options

เปิดใช้งานใน `tsconfig.json` เพื่อ type safety สูงสุด

- `strict: true` — เปิดทั้งหมด (strictNullChecks, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, noImplicitThis, alwaysStrict)
- `noUncheckedIndexedAccess` — index access คืน `T | undefined` ป้องกัน runtime errors
- `exactOptionalPropertyTypes` — แยก `undefined` value กับ missing property
- `noUnusedLocals` — error เมื่อมี local variable ที่ไม่ได้ใช้
- `noUnusedParameters` — error เมื่อมี parameter ที่ไม่ได้ใช้
- `noImplicitReturns` — error เมื่อ code path ไม่ return ค่า
- `noImplicitOverride` — ต้องใช้ `override` keyword เมื่อ override method
- `noFallthroughCasesInSwitch` — ห้าม fallthrough ใน switch cases
- `verbatimModuleSyntax` — บังคับ `import type` สำหรับ type-only imports
- `isolatedModules` — รองรับ transpilation ทีละไฟล์
- `noUncheckedSideEffectImports` — ตรวจ side-effect imports

## Type Narrowing vs Assertion

ใช้ `type narrowing` แทน `type assertion` เพื่อ type safety ที่ตรวจได้

```ts
// ดี: narrowing ด้วย typeof
function process(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}

// หลีกเลี่ยง: assertion ข้ามการตรวจสอบ
const value = unknownThing as string;
```

## Discriminated Unions

ใช้ `discriminated unions` สำหรับ complex state

```ts
type RequestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: string }
  | { status: "error"; error: Error };
```

## No any / unknown

ไม่ใช้ `any` โดยเด็ดขาด ใช้ `unknown` แทนเพื่อบังคับ type check ก่อนใช้งาน

```ts
function parse(input: unknown): string {
  if (typeof input === "string") {
    return input;
  }
  throw new Error("Invalid input");
}
```

## Readonly

ใช้ `readonly` สำหรับ properties ที่ไม่ควรเปลี่ยนแปลง

```ts
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}
```

## Utility Types

ใช้ utility types สำหรับ type transformations ทั่วไป

- `Partial<T>` — ทุก property เป็น optional
- `Readonly<T>` — ทุก property เป็น readonly
- `Pick<T, K>` — เลือก properties เฉพาะ
- `Omit<T, K>` — ตัด properties ออก
- `Awaited<T>` — unwrap Promise type
- `Parameters<T>` — parameter types ของ function
- `ReturnType<T>` — return type ของ function

## satisfies Operator

ใช้ `satisfies` เพื่อ validate types โดยไม่เปลี่ยน inferred type

```ts
const config = {
  port: 8080,
  host: "localhost",
} satisfies Config;
```

## Type Guards

ใช้ `type guards` สำหรับ runtime type checking

```ts
function isString(value: unknown): value is string {
  return typeof value === "string";
}
```

## Exhaustive Switch with never

ใช้ exhaustive switch checking ด้วย `never` type เพื่อจับ missing cases

```ts
function handle(state: RequestState): string {
  switch (state.status) {
    case "idle":
      return "idle";
    case "loading":
      return "loading";
    case "success":
      return state.data;
    case "error":
      return state.error.message;
    default: {
      const _exhaustive: never = state;
      throw new Error(`Unhandled state: ${_exhaustive}`);
    }
  }
}
```
