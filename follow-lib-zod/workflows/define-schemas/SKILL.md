---
name: follow-lib-zod-define-schemas
description: Zod schema design — objects, unions, discriminated unions, refinements, transforms, inference, composability
argument-hint: "[scope]"
related:
  - follow-lib-zod
  - run-typecheck
  - run-test
  - resolve-errors
---

## Goal

เขียน Zod schemas ครบ — primitives→complex types, refinements/transforms, type inference, schema composition patterns

## Scope

schema authoring — object/array/union/record/tuple schemas, `.refine`/`.superRefine`/`.transform`, `z.infer`, generics, recursive schemas, branded types

## Execute

### 1. Core Types

```ts
import { z } from 'zod'

const User = z.object({
  id: z.uuid(),                          // v4: top-level string formats
  email: z.email(),
  name: z.string().min(1).max(100),
  age: z.int().min(0).optional(),
  role: z.enum(['admin', 'user']),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.string(), z.unknown()),
  createdAt: z.iso.datetime(),           // iso string → validated
})

type User = z.infer<typeof User>         // derive TS type — single source
```

- v4: `z.uuid()`, `z.email()`, `z.url()`, `z.iso.datetime()` เป็น top-level (เร็วกว่า `z.string().email()` chain)
- `z.literal`, `z.union`, `z.tuple`, `z.null`, `z.unknown`, `z.any`, `z.never`, `z.templateLiteral`

### 2. Unions And Discriminated

```ts
const Event = z.discriminatedUnion('type', [
  z.object({ type: z.literal('click'), x: z.number(), y: z.number() }),
  z.object({ type: z.literal('scroll'), y: z.number() }),
])
```

- `z.discriminatedUnion` — fast + better errors กว่า `z.union` (ต้อง literal discriminator)
- `z.union` — fallback เมื่อไม่มี discriminator field

### 3. Refinements And Transforms

```ts
const Password = z.string().min(8).regex(/[A-Z]/, 'needs uppercase')
  .refine(s => !s.includes('password'), 'too weak')

const DateCoerced = z.coerce.date()                          // string → Date
const Slug = z.string().transform(s => s.toLowerCase())
const Positive = z.number().check(z.positive())              // v4 check() API
```

- `.refine` sync checks; `.refine` async ด้วย async fn; `.superRefine` multi-issue custom (v3) → v4 `.check()`
- `.transform` — output type ต่างจาก input (`z.input` vs `z.output` types)
- `.pipe()` — chain schemas post-parse (validate → transform pipeline)

### 4. Composition Patterns

- `.extend`, `.merge`, `.pick`, `.omit`, `.partial`, `.required`, `.deepPartial`
- Recursive: `const Node: z.ZodType<Node> = z.lazy(() => z.object({ children: z.array(Node) }))`
- Generic: `const Paginated = <T>(item: z.ZodType<T>) => z.object({ items: z.array(item), total: z.int() })`
- Branded: `z.string().brand<'UserId'>()` — nominal typing
- `.catch(default)` — fallback on invalid; `.readonly()` — freeze output type

## Rules

- Type derive จาก schema เท่านั้น: `z.infer`/`z.output` — ห้ามเขียน interface ซ้ำ
- `discriminatedUnion` ก่อน `union` เมื่อมี discriminator
- `.transform` แยกกับ `.refine` — refine=validate, transform=change value
- Schema ที่ boundary เท่านั้น — ภายใน trust inferred types
- v4 API preference — `z.uuid()` etc. top-level; `.check()` แทน chained methods บางตัว (เช็ค v4 docs)

## Expected Outcome

- Schemas composable, types derive ผ่าน `z.infer`
- Unions/refinements/transforms ใช้ถูก pattern
