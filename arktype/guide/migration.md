---
title: Migration
description: คู่มือการ migrate จาก validation libraries อื่นๆ มายัง ArkType
---

## Migration

คู่มือการ migrate จาก validation libraries อื่นๆ มายัง ArkType

## From Zod

### Basic Schema

#### Zod

```typescript
import { z } from 'zod'

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email()
})
```

#### ArkType

```typescript
import { type } from 'arktype'

const UserSchema = type({
  id: 'string',
  name: 'string',
  email: 'string.email'
})
```

### Optional Fields

#### Zod

```typescript
const UserSchema = z.object({
  name: z.string().optional()
})
```

#### ArkType

```typescript
const UserSchema = type({
  name: 'string?'
})
```

### Union Types

#### Zod

```typescript
const ValueSchema = z.union([
  z.string(),
  z.number()
])
```

#### ArkType

```typescript
const ValueSchema = type('string|number')
```

### Arrays

#### Zod

```typescript
const ItemsSchema = z.array(z.string())
```

#### ArkType

```typescript
const ItemsSchema = type('string[]')
```

## From Yup

### Basic Schema

#### Yup

```typescript
import * as yup from 'yup'

const UserSchema = yup.object({
  id: yup.string().required(),
  name: yup.string().required(),
  email: yup.string().email()
})
```

#### ArkType

```typescript
import { type } from 'arktype'

const UserSchema = type({
  id: 'string',
  name: 'string',
  email: 'string.email'
})
```

### Validation

#### Yup

```typescript
const result = await UserSchema.validate(data)
```

#### ArkType

```typescript
const result = UserSchema(data)
if (result instanceof type.errors) {
  // Handle error
}
```

## From Joi

### Basic Schema

#### Joi

```typescript
import Joi from 'joi'

const UserSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email()
})
```

#### ArkType

```typescript
import { type } from 'arktype'

const UserSchema = type({
  id: 'string',
  name: 'string',
  email: 'string.email'
})
```

### Validation

#### Joi

```typescript
const { error, value } = UserSchema.validate(data)
```

#### ArkType

```typescript
const result = UserSchema(data)
if (result instanceof type.errors) {
  // Handle error
}
```

## Migration Steps

### 1. Install ArkType

```bash
bun add arktype
```

### 2. Convert Schemas

แปลง schemas จาก library เดิม:

```typescript
// แปลง schema definitions
// ใช้ type syntax ของ ArkType
```

### 3. Update Validation Logic

อัปเดต validation logic:

```typescript
// เปลี่ยนจาก
const result = schema.validate(data)

// เป็น
const result = schema(data)
if (result instanceof type.errors) {
  // Handle error
}
```

### 4. Update Type Inference

อัปเดต type inference:

```typescript
// เปลี่ยนจาก
type User = z.infer<typeof UserSchema>

// เป็น
type User = typeof UserSchema.infer
```

### 5. Test Thoroughly

ทดสอบอย่างละเอียด:

```typescript
// Test ทุก validation cases
// ตรวจสอบ error messages
// ตรวจสอบ type inference
```

## ตารางเปรียบเทียบ

| Feature | Zod | Yup | Joi | ArkType |
|---------|-----|-----|-----|---------|
| Type syntax | Custom | Custom | Custom | TypeScript |
| Performance | 1x | 0.6x | 0.5x | 20x |
| Type inference | ✅ | ❌ | ❌ | ✅ |
| Bundle size | Medium | Medium | Large | Small |
| Learning curve | Medium | Low | Medium | Low |

## Common Issues

### 1. Error Handling

#### Problem

Error handling ต่างกันระหว่าง libraries

#### Solution

```typescript
// ArkType uses instanceof check
if (result instanceof type.errors) {
  console.log(result.summary)
}
```

### 2. Custom Validators

#### Problem

Custom validators ต้องแปลง

#### Solution

```typescript
// ใช้ pipe สำหรับ custom logic
const CustomSchema = type('string').pipe((value) => {
  if (!isValid(value)) {
    throw new Error('Invalid')
  }
  return value
})
```

### 3. Async Validation

#### Problem

ArkType ไม่รองรับ async validation โดยตรง

#### Solution

```typescript
// ใช้ async wrapper
const validateAsync = async (schema, data) => {
  const result = schema(data)
  if (result instanceof type.errors) {
    throw new Error('Invalid')
  }
  return result
}
```
