---
title: Testing
description: กลยุทธ์การทดสอบสำหรับ ArkType schemas
---

## Testing

กลยุทธ์การทดสอบสำหรับ ArkType schemas

## Unit Testing

### Test Schema Validation

#### ใช้ Vitest

```typescript
import { describe, it, expect } from 'vitest'
import { type } from 'arktype'

const UserSchema = type({
  id: 'string',
  name: 'string',
  email: 'string.email'
})

describe('UserSchema', () => {
  it('should validate valid user', () => {
    const validUser = {
      id: '123',
      name: 'John',
      email: 'john@example.com'
    }
    const result = UserSchema(validUser)
    expect(result).not.toBeInstanceOf(type.errors)
  })

  it('should reject invalid email', () => {
    const invalidUser = {
      id: '123',
      name: 'John',
      email: 'invalid'
    }
    const result = UserSchema(invalidUser)
    expect(result).toBeInstanceOf(type.errors)
  })
})
```

### Test Type Inference

#### Test inferred types

```typescript
import { describe, it, expect } from 'vitest'
import { type } from 'arktype'

const UserSchema = type({
  id: 'string',
  name: 'string'
})

type User = typeof UserSchema.infer

describe('User type', () => {
  it('should have correct properties', () => {
    const user: User = {
      id: '123',
      name: 'John'
    }
    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('name')
  })
})
```

## Integration Testing

### Test API Validation

#### Test API endpoints

```typescript
import { describe, it, expect } from 'vitest'
import { request } from 'vitest'
import { app } from './app'

describe('POST /users', () => {
  it('should accept valid user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        id: '123',
        name: 'John',
        email: 'john@example.com'
      })
    expect(response.status).toBe(200)
  })

  it('should reject invalid user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        id: '123',
        name: 'John',
        email: 'invalid'
      })
    expect(response.status).toBe(400)
  })
})
```

## Property-Based Testing

### Test with Fast-Check

#### ใช้ fast-check

```typescript
import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { type } from 'arktype'

const EmailSchema = type('string.email')

describe('EmailSchema', () => {
  it('should validate all valid emails', () => {
    fc.assert(
      fc.emailAddress().map((email) => {
        const result = EmailSchema(email)
        return !(result instanceof type.errors)
      })
    )
  })
})
```

## Test Coverage

### Coverage Goals

| Component | Target Coverage |
|-----------|-----------------|
| Schemas | 100% |
| Validators | 100% |
| Type inference | 100% |
| Error handling | 100% |

### Measure Coverage

```bash
bun test --coverage
```

## Test Organization

### File Structure

```text
tests/
├── unit/
│   ├── schemas/
│   │   ├── user.test.ts
│   │   └── product.test.ts
│   └── validators/
│       └── email.test.ts
├── integration/
│   └── api.test.ts
└── e2e/
    └── workflow.test.ts
```

### Test Naming

```typescript
// ✅ ดี - Descriptive names
describe('UserSchema validation', () => {
  it('should accept valid user data', () => {})
  it('should reject invalid email format', () => {})
})

// ❌ ไม่ดี - Vague names
describe('UserSchema', () => {
  it('works', () => {})
  it('fails', () => {})
})
```

## Test Data

### Fixtures

#### ใช้ fixtures

```typescript
// fixtures/users.ts
export const validUser = {
  id: '123',
  name: 'John',
  email: 'john@example.com'
}

export const invalidUser = {
  id: '123',
  name: 'John',
  email: 'invalid'
}

// tests/schemas/user.test.ts
import { validUser, invalidUser } from '../fixtures/users'

describe('UserSchema', () => {
  it('should validate valid user', () => {
    const result = UserSchema(validUser)
    expect(result).not.toBeInstanceOf(type.errors)
  })
})
```

## ตารางสรุป Testing Strategies

| Strategy | Use Case | Tool |
|----------|----------|------|
| Unit testing | Schema validation | Vitest |
| Integration testing | API validation | Vitest + Supertest |
| Property-based testing | Edge cases | fast-check |
| E2E testing | Full workflows | Playwright |

## Best Practices

### 1. Test Both Success and Failure

```typescript
// ✅ ดี - Test ทั้ง success และ failure
it('should validate valid data', () => {
  expect(UserSchema(validData)).not.toBeInstanceOf(type.errors)
})

it('should reject invalid data', () => {
  expect(UserSchema(invalidData)).toBeInstanceOf(type.errors)
})
```

### 2. Test Edge Cases

```typescript
// ✅ ดี - Test edge cases
it('should handle empty strings', () => {
  const result = StringSchema('')
  expect(result).toBeInstanceOf(type.errors)
})

it('should handle null values', () => {
  const result = StringSchema(null)
  expect(result).toBeInstanceOf(type.errors)
})
```

### 3. Use Descriptive Error Messages

```typescript
// ✅ ดี - Descriptive errors
it('should reject email without @ symbol', () => {
  const result = EmailSchema('invalidemail')
  expect(result).toBeInstanceOf(type.errors)
  expect(result.summary).toContain('email')
})
```

### 4. Keep Tests Independent

```typescript
// ✅ ดี - Independent tests
describe('UserSchema', () => {
  it('should validate independently', () => {
    const result = UserSchema(validData)
    expect(result).not.toBeInstanceOf(type.errors)
  })
})
```
