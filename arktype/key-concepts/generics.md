# Generics

## Purpose

Define reusable type patterns ด้วย generic parameters

## Overview

ArkType supports generics สำหรับ define reusable type patterns

## Basic Syntax

```typescript
import { type } from "arktype"

const boxOf = type("<t>", { box: "t" })
```

## Generic Parameters

### Definition

```typescript
const pair = type("<t, u>", {
  first: "t",
  second: "u"
})
```

### Constrained Parameters

```typescript
const bounded = type("<t extends string>", {
  value: "t"
})
```

### Scoped Generics

```typescript
const container = type("<t>", {
  items: "t[]",
  "default?": "t"
})
```

## Instantiation

```typescript
const StringBox = boxOf.instantiate({ t: "string" })
const NumberBox = boxOf.instantiate({ t: "number" })
```

## Use Cases

### Collection Types

```typescript
const list = type("<t>", {
  items: "t[]",
  count: "number"
})

const StringList = list.instantiate({ t: "string" })
const NumberList = list.instantiate({ t: "number" })
```

### Response Types

```typescript
const response = type("<t>", {
  success: "boolean",
  data: "t",
  "error?": "string"
})

const UserResponse = response.instantiate({ t: user })
const PostResponse = response.instantiate({ t: post })
```

### Optional Types

```typescript
const optional = type("<t>", "t | undefined")

const OptionalString = optional.instantiate({ t: "string" })
const OptionalNumber = optional.instantiate({ t: "number" })
```

## Type Inference

```typescript
const boxOf = type("<t>", { box: "t" })
const StringBox = boxOf.instantiate({ t: "string" })

type StringBoxType = typeof StringBox.t
// { box: string }
```

## Constraints

```typescript
const numeric = type("<t extends number>", {
  value: "t",
  doubled: "t"
})

const IntBox = numeric.instantiate({ t: "number.integer" })
```

## Best Practices

- ใช้ generics สำหรับ patterns ที่ซ้ำกัน
- ตั้งชื่อ generic parameters ให้ชัดเจน (t, u, v)
- ใช้ constraints เมื่อจำเป็น
- Document generic usage ใน comments

## Limitations

- Generic parameters ต้อง declare ใน type string
- Complex generic constraints อาจต้อง simplify
- Type inference อาจจำกัดในบาง cases
