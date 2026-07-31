---
title: Project Structure
description: โครงสร้างโปรเจกต์และการจัดระเบียบ schemas สำหรับ ArkType
---

## Project Structure

โครงสร้างโปรเจกต์ที่แนะนำสำหรับการใช้ ArkType

### โครงสร้างพื้นฐาน

```text
src/
├── schemas/
│   ├── user.ts          # User-related schemas
│   ├── product.ts       # Product-related schemas
│   └── index.ts         # Export all schemas
├── types/
│   ├── inferred.ts      # TypeScript inferred types
│   └── index.ts         # Export all types
└── validators/
    ├── user.ts          # Custom validators
    └── index.ts         # Export all validators
```

### การจัดระเบียน Schemas

#### 1. Group by Domain

จัด schemas ตาม domain หรือ feature:

```typescript
// schemas/user.ts
import { type } from 'arktype'

export const UserSchema = type({
  id: 'string',
  name: 'string',
  email: 'string.email'
})

// schemas/product.ts
export const ProductSchema = type({
  id: 'string',
  name: 'string',
  price: 'number.positive'
})
```

#### 2. Export from Index

สร้าง index file สำหรับ export schemas:

```typescript
// schemas/index.ts
export * from './user'
export * from './product'
```

### การจัดระเบียน Types

#### 1. Infer Types

ใช้ inferred types จาก schemas:

```typescript
// types/inferred.ts
import type { UserSchema, ProductSchema } from '../schemas'

export type User = typeof UserSchema.infer
export type Product = typeof ProductSchema.infer
```

#### 2. Export Types

```typescript
// types/index.ts
export * from './inferred'
```

### การจัดระเบียน Validators

#### 1. Custom Validators

สร้าง custom validators แยกต่างหาก:

```typescript
// validators/user.ts
import { type } from 'arktype'

export const validateUsername = type('string.min(3).max(20)')
export const validatePassword = type('string.min(8).matches(/[A-Z]/)')
```

#### 2. Export Validators

```typescript
// validators/index.ts
export * from './user'
```

### Naming Conventions

#### Schemas

- ใช้ PascalCase สำหรับ schema names
- เติม `Schema` ต่อท้ายชื่อ
- ตัวอย่าง: `UserSchema`, `ProductSchema`, `OrderSchema`

#### Types

- ใช้ PascalCase สำหรับ type names
- ไม่ต้องเติม `Type` ต่อท้าย
- ตัวอย่าง: `User`, `Product`, `Order`

#### Validators

- ใช้ camelCase สำหรับ validator functions
- เริ่มต้นด้วย `validate`
- ตัวอย่าง: `validateUsername`, `validatePassword`

### Best Practices

#### 1. Separation of Concerns

แยก schemas, types, และ validators ออกจากกัน:

```typescript
// ❌ ไม่ดี - รวมทุกอย่างไว้ในไฟล์เดียว
const UserSchema = type({...})
type User = typeof UserSchema.infer
const validateUser = (data) => UserSchema(data)

// ✅ ดี - แยกออกตามหน้าที่
// schemas/user.ts
export const UserSchema = type({...})

// types/inferred.ts
export type User = typeof UserSchema.infer

// validators/user.ts
export const validateUser = (data) => UserSchema(data)
```

#### 2. Index Files

ใช้ index files สำหรับ exports:

```typescript
// ✅ ดี - ใช้ index files
// schemas/index.ts
export * from './user'
export * from './product'

// ใช้งาน
import { UserSchema, ProductSchema } from './schemas'
```

#### 3. Consistent Organization

รักษาโครงสร้างที่สม่ำเสมอทั่วโปรเจกต์:

```text
src/
├── schemas/          # All schemas
├── types/            # All inferred types
└── validators/       # All custom validators
```

### ตารางสรุป

| Component | Location | Naming | Purpose |
|-----------|----------|--------|---------|
| Schemas | `schemas/` | PascalCase + Schema | Type definitions |
| Types | `types/` | PascalCase | Inferred TypeScript types |
| Validators | `validators/` | camelCase + validate | Custom validation logic |
| Index Files | `*/index.ts` | - | Centralized exports |
