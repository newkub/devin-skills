# Match

## Purpose

Pattern matching ด้วย type-safe syntax สำหรับ handle different input types

## Overview

`match()` function ใน ArkType 2.1+ ให้ pattern matching ที่ optimized ด้วย expressive type syntax

## Basic Usage

```typescript
import { match } from "arktype"

const sizeOf = match({
  "string | Array": v => v.length,
  number: v => v,
  bigint: v => v,
  default: "assert"
})
```

## Case Record API

ใช้ object สำหรับ define cases:

```typescript
const handler = match({
  string: s => s.toUpperCase(),
  number: n => n * 2,
  boolean: b => !b,
  default: "never" // หรือ "assert", "reject", หรือ custom function
})
```

## Fluent API

ใช้ method chaining:

```typescript
const handler = match()
  .case("string", s => s.toUpperCase())
  .case("number", n => n * 2)
  .default("never")
```

## Default Options

| Option | Description |
|--------|-------------|
| `"assert"` | Throw error ถ้าไม่ match |
| `"never"` | TypeScript never type (ถือว่าไม่ควรถึง) |
| `"reject"` | Return error ถ้าไม่ match |
| function | Custom handler function |

## Type Inference

```typescript
const result = match({
  string: s => s.length, // number
  number: n => n.toString(), // string
  default: "assert"
})

// result type: string | number
```

## Pattern Matching with Discriminated Unions

```typescript
const User = type({
  kind: "'admin'",
  permissions: "string[]"
}).or({
  kind: "'user'",
  preferences: "object"
})

const handler = match({
  "kind: 'admin'": admin => admin.permissions,
  "kind: 'user'": user => user.preferences,
  default: "never"
})
```

## Examples

### API Response Handler

```typescript
const ApiResponse = type({
  status: "'success' | 'error'",
  data: "object",
  "error?": "string"
})

const handleResponse = match({
  "status: 'success'": res => res.data,
  "status: 'error'": res => res.error,
  default: "assert"
})
```

### Type Guard

```typescript
const isString = match({
  string: true,
  default: false
})
```

## Performance

- Optimized สำหรับ fast pattern matching
- Discriminated unions ถูก optimized อัตโนมัติ
- No runtime overhead สำหรับ type checking
