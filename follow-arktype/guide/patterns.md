---
title: Patterns
description: Design patterns และ use cases สำหรับ ArkType
---

## Patterns

Design patterns และ use cases สำหรับ ArkType

## Common Patterns

### 1. Schema Composition

#### Combine Schemas

```typescript
import { type } from 'arktype'

// Base schema
const BaseSchema = type({
  id: 'string',
  createdAt: 'string'
})

// Extend base schema
const UserSchema = type({
  ...BaseSchema,
  name: 'string',
  email: 'string.email'
})

const ProductSchema = type({
  ...BaseSchema,
  name: 'string',
  price: 'number.positive'
})
```

### 2. Conditional Validation

#### Conditional Fields

```typescript
import { type } from 'arktype'

const OrderSchema = type({
  type: '"pickup" | "delivery"',
  // Conditional fields
  pickupTime: type.when('type', 'pickup', 'string'),
  deliveryAddress: type.when('type', 'delivery', 'string')
})
```

### 3. Recursive Schemas

#### Recursive Types

```typescript
import { type } from 'arktype'

const TreeNodeSchema = type({
  value: 'string',
  left: 'TreeNodeSchema?',
  right: 'TreeNodeSchema?'
})
```

### 4. Schema Transformation

#### Transform Data

```typescript
import { type } from 'arktype'

const DateSchema = type('string').pipe((value) => {
  return new Date(value)
})

const result = DateSchema('2024-01-01')
// result is Date object
```

### 5. Custom Validators

#### Custom Validation Logic

```typescript
import { type } from 'arktype'

const UsernameSchema = type('string').pipe((value) => {
  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    throw new Error('Invalid username')
  }
  return value
})
```

## Use Cases

### 1. API Request Validation

#### Validate API Requests

```typescript
import { type } from 'arktype'

const CreateUserSchema = type({
  name: 'string.min(3).max(50)',
  email: 'string.email',
  age: 'number.min(0).max(120)'
})

app.post('/users', async (req, res) => {
  const result = CreateUserSchema(req.body)
  if (result instanceof type.errors) {
    return res.status(400).json({ error: result.summary })
  }
  // Create user
})
```

### 2. Environment Configuration

#### Validate Environment Variables

```typescript
import { type } from 'arktype'

const EnvSchema = type({
  NODE_ENV: '"development" | "production" | "test"',
  PORT: 'number',
  DATABASE_URL: 'string'
})

const env = EnvSchema(process.env)
if (env instanceof type.errors) {
  throw new Error('Invalid environment')
}
```

### 3. Form Validation

#### Validate Form Data

```typescript
import { type } from 'arktype'

const ContactFormSchema = type({
  name: 'string.min(2)',
  email: 'string.email',
  message: 'string.min(10).max(500)'
})

const handleSubmit = (data: unknown) => {
  const result = ContactFormSchema(data)
  if (result instanceof type.errors) {
    return { errors: result.summary }
  }
  // Submit form
}
```

### 4. Database Schema Validation

#### Validate Database Records

```typescript
import { type } from 'arktype'

const UserRecordSchema = type({
  id: 'string.uuid',
  name: 'string',
  email: 'string.email',
  createdAt: 'string',
  updatedAt: 'string'
})

const validateRecord = (record: unknown) => {
  const result = UserRecordSchema(record)
  if (result instanceof type.errors) {
    throw new Error('Invalid record')
  }
  return result
}
```

### 5. WebSocket Message Validation

#### Validate WebSocket Messages

```typescript
import { type } from 'arktype'

const MessageSchema = type({
  type: '"chat" | "system" | "error"',
  payload: type.object({
    text: 'string',
    timestamp: 'number'
  })
})

ws.on('message', (data) => {
  const result = MessageSchema(JSON.parse(data))
  if (result instanceof type.errors) {
    return ws.send(JSON.stringify({ error: 'Invalid message' }))
  }
  // Process message
})
```

## ตารางสรุป Patterns

| Pattern | Use Case | Complexity |
|---------|----------|------------|
| Schema Composition | Reusable schemas | Low |
| Conditional Validation | Dynamic schemas | Medium |
| Recursive Schemas | Tree structures | Medium |
| Schema Transformation | Data conversion | Medium |
| Custom Validators | Business logic | High |

## Anti-Patterns

### 1. Over-Validation

#### ❌ ไม่ดี - Validate เกินไป

```typescript
const OverValidatedSchema = type({
  name: 'string.min(3).max(20).trim().lowercase().matches(/^[a-z]+$/)'
})
```

#### ✅ ดี - Validate เท่าที่จำเป็น

```typescript
const ValidatedSchema = type({
  name: 'string.min(3).max(20)'
})
```

### 2. Deep Nesting

#### ❌ ไม่ดี - Nesting ลึกเกินไป

```typescript
const DeepSchema = type({
  level1: {
    level2: {
      level3: {
        level4: 'string'
      }
    }
  }
})
```

#### ✅ ดี - Flatten structures

```typescript
const FlatSchema = type({
  level1_level2_level3_level4: 'string'
})
```

### 3. Mixed Concerns

#### ❌ ไม่ดี - รวม validation กับ business logic

```typescript
const Schema = type({
  data: 'string'
}).pipe((value) => {
  // Business logic ไม่ควรอยู่ที่นี่
  saveToDatabase(value)
  return value
})
```

#### ✅ ดี - แยก validation กับ business logic

```typescript
const Schema = type({
  data: 'string'
})

const processData = (data: string) => {
  saveToDatabase(data)
}
```

## When to Use ArkType

### ✅ ใช้เมื่อ

- ต้องการ runtime validation ที่เร็ว
- ต้องการ type inference ที่แม่นยำ
- ต้องการ syntax ที่เข้าใจง่าย
- ต้องการ performance สูง

### ❌ ไม่ใช้เมื่อ

- ต้องการ async validation
- ต้องการ complex transformations
- ต้องการ schema ที่ dynamic มาก
- ต้องการ internationalization
