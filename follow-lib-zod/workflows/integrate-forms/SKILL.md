---
name: follow-lib-zod-integrate-forms
description: Zod integration — Standard Schema, react-hook-form/tanstack-form, JSON Schema/OpenAPI, env/config patterns
argument-hint: "[integration]"
related:
  - follow-lib-zod
  - follow-lib-tanstack-ecosystem
  - run-test
  - resolve-errors
---

## Goal

Integrate Zod เข้า ecosystem — Standard Schema interop, form libs (RHF/TanStack Form), JSON Schema export, OpenAPI, validation libs interop

## Scope

interop — `StandardSchemaV1` interface (zod เป็น implementer), resolver patterns, `z.toJSONSchema` (v4), ecosystem tool compat

## Execute

### 1. Standard Schema

```ts
// Zod v3.24+ / v4 implement Standard Schema — ทุก lib ที่รับ StandardSchemaV1 ใช้ได้เลย
import type { StandardSchemaV1 } from '@standard-schema/spec'

// ใช้กับ TanStack Form, tRPC, oRPC, Hono validator, Nitro, Arkaic... (auto-detect)
```

- Zod schemas ผ่าน Standard Schema contract — ใช้กับ lib ไหนก็ได้ที่รองรับ โดยไม่ต้อง adapter

### 2. Form Libraries

```tsx
// react-hook-form
import { zodResolver } from '@hookform/resolvers/zod'
useForm({ resolver: zodResolver(FormSchema) })

// TanStack Form (v1) — Standard Schema ตรง
<form.Field validators={{ onChange: FieldSchema }} />
```

- `@hookform/resolvers` — `zodResolver`; TanStack Form → ผ่าน Standard Schema ตรง
- Server + client shared schema — validate ทั้งสองฝั่งด้วย schema เดียว

### 3. JSON Schema Export (v4)

```ts
import { z } from 'zod'
const jsonSchema = z.toJSONSchema(UserSchema)   // v4 native
// v3: zod-to-json-schema package
```

- `z.toJSONSchema` — export schemas → OpenAPI/JSON Schema docs, code-gen, form builders
- ข้อจำกัด: transforms/some refinements ไม่ representable — ตรวจ output

### 4. OpenAPI And Docs

- `zod-to-openapi`/`@asteasolutions/zod-to-openapi` — OpenAPI spec จาก schemas (v3); v4 → `z.toJSONSchema` + OpenAPI tooling
- oRPC/tRPC — schemas เป็น procedure input/output contract โดยตรง
- `zod-openapi` ecosystem — เช็ค v4 support ก่อน adopt

### 5. Env/Config (application)

- Env schema → `z.toJSONSchema` → generated `.env.example` docs
- Config schemas shared FE/BE — same contract ทั้ง runtime + docs

## Rules

- Standard Schema คือ canonical interop — prefer libs ที่รองรับโดยตรงก่อน adapter
- `z.toJSONSchema` v4-native — v3 ใช้ `zod-to-json-schema` package
- Shared schemas FE/BE — single contract, validate 2 ฝั่ง
- Transforms ไม่ serialize ลง JSON Schema — แยก input/output schemas เมื่อต้อง docs

## Expected Outcome

- Zod เชื่อม forms/OpenAPI/Standard Schema ครบ
- Schema = single contract ทั้ง runtime validation + docs + types
