# TypeScript Code Quality

## Type Annotations

ใช้ `type annotations` สำหรับ function return types

```ts
function add(a: number, b: number): number {
  return a + b;
}
```

## const vs let

ใช้ `const` แทน `let` เมื่อเป็นไปได้

```ts
const config = { port: 8080 };
let counter = 0;
```

## Named Exports

ใช้ `named exports` สำหรับ tree-shaking

```ts
export function add(a: number, b: number): number {
  return a + b;
}
export const PI = 3.14;
```

## import type

ใช้ `import type` สำหรับ type-only imports

```ts
import type { Config } from "./config";
import { add } from "./math";
```

## interface vs type

ใช้ `interface` สำหรับ object shapes ที่ extend ได้ และ `type` สำหรับ unions, tuples, และ complex types

```ts
interface User {
  id: string;
  name: string;
}

type Result<T> = { success: true; data: T } | { success: false; error: string };
```

## === vs ==

ใช้ `===` แทน `==` เสมอ เพื่อ strict equality ไม่มี type coercion

## Template Literals

ใช้ `template literals` แทน string concatenation

```ts
const message = `User ${name} has ${count} items`;
```

## Destructuring

ใช้ `destructuring` สำหรับ objects และ arrays

```ts
const { name, age } = user;
const [first, second] = items;
```

## Generic Constraints

ใช้ generic constraints สำหรับ reusable type-safe code

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```
