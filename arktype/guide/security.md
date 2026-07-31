---
title: Security
description: ข้อควรระวังด้านความปลอดภัยสำหรับ ArkType
---

## Security

ข้อควรระวังด้านความปลอดภัยเมื่อใช้ ArkType

## Input Validation

### 1. Validate All Inputs

#### Validate ทุก external inputs

```typescript
// ✅ ดี - Validate ทุก inputs
const UserInputSchema = type({
  username: 'string.min(3).max(20)',
  email: 'string.email',
  age: 'number.min(0).max(120)'
})

const createUser = (input: unknown) => {
  const user = UserInputSchema(input)
  if (user instanceof type.errors) {
    throw new Error('Invalid input')
  }
  // Process user
}
```

### 2. Sanitize Data

#### Sanitize ข้อมูลก่อนใช้งาน

```typescript
// ✅ ดี - Sanitize data
const SanitizedString = type('string.trim().toLowercase()')

const EmailSchema = type({
  email: SanitizedString.pipe('string.email')
})
```

## Type Safety

### 1. Type Guards

#### ใช้ type guards

```typescript
// ✅ ดี - ใช้ type guards
const isUser = (data: unknown): data is User => {
  return UserSchema(data) instanceof type === false
}

if (isUser(data)) {
  // TypeScript knows data is User
}
```

### 2. Narrow Types

#### Narrow types อย่างถูกต้อง

```typescript
// ✅ ดี - Narrow types
const processData = (data: unknown) => {
  const result = DataSchema(data)
  if (result instanceof type.errors) {
    throw new Error('Invalid data')
  }
  // result is now typed
}
```

## Data Exposure

### 1. Avoid Exposing Schemas

#### ไม่เปิดเผย schemas ใน production

```typescript
// ❌ ไม่ดี - เปิดเผย errors
app.post('/api/users', (req, res) => {
  const result = UserSchema(req.body)
  if (result instanceof type.errors) {
    res.json({ error: result.summary }) // Exposes schema
  }
})

// ✅ ดี - ซ่อน details
app.post('/api/users', (req, res) => {
  const result = UserSchema(req.body)
  if (result instanceof type.errors) {
    res.status(400).json({ error: 'Invalid input' })
  }
})
```

### 2. Sanitize Error Messages

#### Sanitize error messages

```typescript
// ✅ ดี - Sanitize errors
const safeError = (error: type.errors) => {
  return {
    message: 'Validation failed',
    fields: Object.keys(error.summary)
  }
}
```

## SQL Injection Prevention

### 1. Validate Query Parameters

#### Validate query parameters

```typescript
// ✅ ดี - Validate query params
const QuerySchema = type({
  id: 'string.uuid',
  limit: 'number.min(1).max(100)'
})

const getUser = (query: unknown) => {
  const params = QuerySchema(query)
  if (params instanceof type.errors) {
    throw new Error('Invalid query')
  }
  // Use params in query
}
```

### 2. Use Parameterized Queries

#### ใช้ parameterized queries

```typescript
// ✅ ดี - ใช้ parameterized queries
const query = 'SELECT * FROM users WHERE id = ?'
db.query(query, [params.id])
```

## XSS Prevention

### 1. Validate HTML Content

#### Validate HTML content

```typescript
// ✅ ดี - Validate HTML
const HTMLSchema = type({
  content: 'string.sanitize()'
})
```

### 2. Escape Output

#### Escape output

```typescript
// ✅ ดี - Escape output
import { escape } from 'escape-html'

const render = (content: string) => {
  return `<div>${escape(content)}</div>`
}
```

## ตารางสรุป Security Best Practices

| Practice | Risk | Mitigation |
|----------|------|------------|
| Validate all inputs | Injection attacks | Use schemas for all inputs |
| Sanitize data | XSS | Trim, lowercase, escape |
| Type guards | Type confusion | Use type guards properly |
| Hide schema details | Information leakage | Generic error messages |
| Parameterized queries | SQL injection | Use prepared statements |
| Escape output | XSS | Escape HTML output |

## Common Vulnerabilities

### 1. Prototype Pollution

#### หลีกเลี่ยง prototype pollution

```typescript
// ❌ ไม่ดี - Prototype pollution risk
const UnsafeSchema = type({
  data: 'any'
})

// ✅ ดี - ใช้ specific types
const SafeSchema = type({
  data: type.object({
    key: 'string',
    value: 'string'
  })
})
```

### 2. ReDoS

#### หลีกเลี่ยง ReDoS

```typescript
// ❌ ไม่ดี - Complex regex
const UnsafeSchema = type({
  email: 'string.matches(/^(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/)'
})

// ✅ ดี - ใช้ built-in validators
const SafeSchema = type({
  email: 'string.email'
})
```
