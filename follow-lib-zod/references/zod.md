# Zod Reference

## Version Info

- Package: `zod` v4.5.4 (published Aug 29, 2026)
- License: MIT, zero external dependencies
- TypeScript: >= 5.5.0 (older versions may work but not officially supported)
- Runtime: Node.js and all modern browsers
- Source: https://zod.dev

## Install

```bash
npm install zod@latest
# or
pnpm add zod@latest
yarn add zod@latest
bun add zod@latest
```

## TypeScript Configuration

Zod v4 แนะนำให้เปิด `strict` mode ใน `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

## Defining Schemas

```ts
import * as z from "zod"

const User = z.object({
  name: z.string(),
  age: z.number(),
})
```

## Parsing Data

```ts
// throws ZodError on failure
const data = User.parse({ name: "A", age: 10 })

// returns result object, no throw
const result = User.safeParse({ name: 1, age: "x" })
if (!result.success) {
  result.error.issues
}

// async variants
await User.parseAsync({ name: "A", age: 10 })
await User.safeParseAsync({ name: "A", age: 10 })
```

ใน Zod 4 `safeParse()` error ไม่ extend `Error` แล้ว ให้ตรวจผ่าน `success` flag

## Error Handling

```ts
try {
  User.parse({})
} catch (error) {
  if (error instanceof z.ZodError) {
    error.issues
  }
}
```

ใช้ `z.treeifyError()` สำหรับ formatted error tree แทน `.format()` และ `.flatten()` ที่ deprecated

## Type Inference

```ts
type User = z.infer<typeof User>
type UserIn = z.input<typeof User>
type UserOut = z.output<typeof User>
```

## Schema Composition

```ts
const Base = z.object({ id: z.string() })

// แนะนำให้ใช้ spread หรือ extend shape
const Extended = z.object({
  ...Base.shape,
  name: z.string(),
})

const Picked = Base.pick({ id: true })
const Omitted = Base.omit({ id: true })
const Partial = Base.partial()
const Required = Base.partial().required()
```

`.merge()` deprecated ใน v4 ให้ใช้ `A.extend(B.shape)` หรือ spread แทน

## Unknown-Key Handling

`.strict()` และ `.passthrough()` deprecated ใน v4 ให้ใช้:

```ts
z.strictObject({ name: z.string() })       // reject unknown keys
z.looseObject({ name: z.string() })        // allow unknown keys
// หรือ
z.object({ name: z.string() }).catchall(z.never())
z.object({ name: z.string() }).catchall(z.unknown())
```

## Coercion

```ts
const schema = z.coerce.number()
schema.parse("42") // 42
type In = z.input<typeof schema> // unknown
```

ระบุ generic ถ้าต้องการ input type เฉพาะ:

```ts
const schema = z.coerce.number<number>()
```

## Error Customization

ใช้ `error` parameter แทน `message` หรือ `errorMap` ที่ deprecated:

```ts
const Password = z.string().min(8, {
  error: "Too short",
})
```

Global config:

```ts
z.config({
  customError: (issue) => `Invalid: ${issue.code}`,
})

z.config(z.locales.en())
```

## Advanced Patterns

```ts
// custom validation
const Odd = z.number().refine((n) => n % 2 === 1, {
  error: "Must be odd",
})

// transform
const Trimmed = z.string().transform((s) => s.trim())

// pipe
const Piped = z
  .string()
  .transform((s) => s.length)
  .pipe(z.number().min(5))

// preprocess
const Preprocessed = z.preprocess((val) => String(val), z.string())

// default/prefault/catch
const WithDefault = z.string().default("hello")
const WithPrefault = z.string().prefault("hello")
const WithCatch = z.string().catch("fallback")

// discriminated union
const Result = z.discriminatedUnion("status", [
  z.object({ status: z.literal("success"), data: z.string() }),
  z.object({ status: z.literal("error"), message: z.string() }),
])

// string formats (top-level preferred)
const Email = z.email()
const Uuid = z.uuid()
const Date = z.iso.date()
```

## Zod Mini

สำหรับ bundle ที่เล็กลง:

```ts
import * as z from "zod/mini"

const User = z.object({
  name: z.string(),
  age: z.number(),
})
```

## AOT Compilation

```ts
import * as z from "zod"

const compiled = z.compile(User)
```

## Sources

- https://zod.dev/v4
- https://zod.dev/api
- https://zod.dev/v4/changelog
- https://zod.dev/error-customization
- https://zod.dev/packages/mini
