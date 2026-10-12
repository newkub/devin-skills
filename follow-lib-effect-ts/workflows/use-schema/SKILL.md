---
name: follow-lib-effect-ts-use-schema
description: Effect Schema — decode/encode, transforms, branded types, TaggedError schemas, JSON Schema
argument-hint: "[scope]"
related:
  - follow-lib-effect-ts
  - run-typecheck
  - run-test
  - resolve-errors
---

## Goal

ใช้ `Schema` (built-in `effect` since v3) ครบ — decode/encode, transforms, branded, filters, struct composition, TaggedError schemas

## Scope

runtime validation + type derivation — external data boundaries (API, env, DB rows); standalone `@effect/schema` deprecated — ใช้ `Schema` จาก `effect` เท่านั้น

## Execute

### 1. Define Schemas

```ts
import { Schema } from "effect"

class Todo extends Schema.Class<Todo>("Todo")({
  id: Schema.UUID,
  title: Schema.NonEmptyString,
  done: Schema.Boolean,
  dueAt: Schema.optional(Schema.DateFromString),
}) {}
```

- `Schema.Class` = runtime schema + class instance + nominal typing ในตัวเดียว
- Composition: `Schema.Struct`, `Schema.Union`, `Schema.Literal`, `Schema.Array`, `Schema.optional`, `Schema.NullOr`

### 2. Decode/Encode

```ts
Schema.decodeUnknownSync(Todo)(raw)         // throws — boundaries ที่ trust ได้
Schema.decodeUnknown(Todo)(raw)             // Effect — ParseError ใน E channel
Schema.encode(Todo)(todo)                   // domain → wire format
```

- `decode` = input→domain, `encode` = domain→output — transforms flow สองทาง
- `Schema.is(Todo)` type guard; `Schema.validate` variants ตามความต้องการ

### 3. Transforms And Refinements

- `Schema.transform`/`transformOrFail` — string→Date, csv→array ฯลฯ
- `Schema.filter` / built-ins: `NonEmptyString`, `MinLength`, `Int`, `UUID`, `greaterThan`
- `Schema.brand` nominal typing (`UserId`, `Email`) — ป้องกัน primitive mixup
- `Schema.partial`/`pick`/`omit`/`required` — derive variants

### 4. Patterns

1. **Tagged errors เป็น schema**: `Schema.TaggedError` — serialize errors ข้าม RPC/HTTP
2. **Config/env validation**: decode env เป็น typed config ตอน boot
3. **Message/payload schemas**: RPC, queue payloads — validate ทั้ง 2 ทิศ
4. **Arbitrary** (testing): `Arbitrary.make(Todo)` สำหรับ fast-check random data

## Rules

- Validate ที่ boundary เท่านั้น — ภายใน domain ใช้ types แล้ว ห้าม re-validate ซ้ำ
- `Schema.Class` สำหรับ domain entities — `Schema.Struct` สำหรับ plain payloads
- ParseError inspect ด้วย `ParseResult`/`TreeFormatter` — อย่า swallow message
- ห้าม `as T` casts บน external data — decode เสมอ

## Expected Outcome

- Schemas typed + runtime-validated ทุก boundary
- Transforms/branded/TaggedError ใช้ถูกจุด
