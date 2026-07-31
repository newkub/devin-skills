---
title: Schema Validation
description: ใช้ drizzle-zod, drizzle-valibot, drizzle-typebox, และ drizzle-arktype สำหรับ runtime validation
---

## Goal

ใช้ schema validation packages สำหรับ generate validation schemas จาก Drizzle ORM definitions

## Scope

ใช้สำหรับ runtime validation ด้วย Zod, Valibot, TypeBox, หรือ ArkType

## Execute

### 1. Drizzle Zod

ติดตั้ง:

```bash
bun add drizzle-zod zod
```

ใช้ `createSelectSchema`, `createInsertSchema`, และ `createUpdateSchema`:

```typescript
import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { users } from './schema';

// Select schema - สำหรับ validate data จาก database
const selectUserSchema = createSelectSchema(users);

// Insert schema - สำหรับ validate data ก่อน insert
const insertUserSchema = createInsertSchema(users);

// Update schema - สำหรับ validate data สำหรับ update (all fields optional)
const updateUserSchema = createUpdateSchema(users);
```

#### Refining Schemas

Override หรือ refine fields:

```typescript
import { z } from 'zod';

const insertUserSchema = createInsertSchema(users, {
  // Override ด้วย Zod schema
  role: z.string(),
  
  // Refine ด้วย callback
  id: (schema) => schema.positive(),
  email: (schema) => schema.email(),
});
```

#### Type Coercion

ใช้ `createSchemaFactory` สำหรับ type coercion:

```typescript
import { createSchemaFactory } from 'drizzle-zod';

const { createSelectSchema } = createSchemaFactory({
  coerce: true,
});

const result = createSelectSchema(table);
// จะได้ z.coerce.bigint(), z.coerce.boolean(), z.coerce.date() ฯลฯ
```

### 2. Drizzle Valibot

ติดตั้ง:

```bash
bun add drizzle-valibot valibot
```

ใช้งานคล้ายกับ drizzle-zod:

```typescript
import { createSelectSchema, createInsertSchema } from 'drizzle-valibot';
import { users } from './schema';

const selectUserSchema = createSelectSchema(users);
const insertUserSchema = createInsertSchema(users);
```

### 3. Drizzle TypeBox

ติดตั้ง:

```bash
bun add drizzle-typebox @sinclair/typebox
```

ใช้งาน:

```typescript
import { createSelectSchema, createInsertSchema } from 'drizzle-typebox';
import { users } from './schema';

const selectUserSchema = createSelectSchema(users);
const insertUserSchema = createInsertSchema(users);
```

### 4. Drizzle ArkType

ติดตั้ง:

```bash
bun add drizzle-arktype arktype
```

ใช้งาน:

```typescript
import { createSelectSchema, createInsertSchema } from 'drizzle-arktype';
import { users } from './schema';

const selectUserSchema = createSelectSchema(users);
const insertUserSchema = createInsertSchema(users);
```

## Rules

- ใช้ `createSelectSchema` สำหรับ validate data จาก database
- ใช้ `createInsertSchema` สำหรับ validate data ก่อน insert
- ใช้ `createUpdateSchema` สำหรับ validate data สำหรับ update
- Columns ที่มี default values จะเป็น optional ใน insert schema
- ใช้ refine parameter สำหรับ custom validation logic
- เปิดใช้ coerce ถ้าต้องการ type coercion

## Expected Outcome

- Runtime validation schemas ที่ sync กับ database schema
- Type-safe validation สำหรับ API inputs
- Consistent validation ทั่ว application
- Easy schema maintenance
