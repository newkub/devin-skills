---
title: Ecosystem
description: เครื่องมือและทรัพยากรที่เกี่ยวข้องกับ ArkType
---

## Ecosystem

เครื่องมือและทรัพยากรที่เกี่ยวข้องกับ ArkType

## Official Resources

### Documentation

- [Official Docs](https://arktype.io/) - เอกสารอย่างเป็นทางการ
- [GitHub Repository](https://github.com/arktypeio/arktype) - Source code และ issues
- [API Reference](https://arktype.io/api) - API documentation

### Community

- [Discord](https://discord.gg/arktype) - Community chat
- [Twitter](https://twitter.com/arktypeio) - Updates และ announcements
- [GitHub Discussions](https://github.com/arktypeio/arktype/discussions) - Q&A และ discussions

## Related Libraries

### TypeScript Tools

#### ts-pattern

Pattern matching library ที่ทำงานร่วมกับ ArkType:

```typescript
import { match } from 'ts-pattern'
import { type } from 'arktype'

const ResultSchema = type('string|number')

const process = (data: unknown) => {
  const result = ResultSchema(data)
  return match(result)
    .with('string', (s) => s.toUpperCase())
    .with('number', (n) => n * 2)
    .exhaustive()
}
```

#### effect-ts

Functional programming library:

```typescript
import { pipe } from 'effect'
import { type } from 'arktype'

const Schema = type({...})

const validate = (data) => pipe(
  Schema(data),
  (result) => result instanceof type.errors ?
    Effect.fail(result.summary) :
    Effect.succeed(result)
)
```

### Framework Integrations

#### Hono

Web framework ที่รองรับ ArkType:

```typescript
import { Hono } from 'hono'
import { type } from 'arktype'

const app = new Hono()

app.post('/users', async (c) => {
  const data = await c.req.json()
  const user = UserSchema(data)
  if (user instanceof type.errors) {
    return c.json({ error: user.summary }, 400)
  }
  return c.json(user)
})
```

#### Elysia

Fast web framework ที่รองรับ ArkType:

```typescript
import { Elysia, t } from 'elysia'
import { type } from 'arktype'

const app = new Elysia()

app.post('/users', ({ body }) => {
  const user = UserSchema(body)
  if (user instanceof type.errors) {
    return { error: user.summary }
  }
  return user
})
```

## Development Tools

### VS Code Extensions

- [ArkType Syntax](https://marketplace.visualstudio.com/) - Syntax highlighting
- [TypeScript Vue Plugin](https://marketplace.visualstudio.com/) - TypeScript support

### Testing Tools

#### Vitest

Testing framework ที่รองรับ ArkType:

```typescript
import { describe, it, expect } from 'vitest'
import { type } from 'arktype'

describe('UserSchema', () => {
  it('should validate valid user', () => {
    const result = UserSchema(validData)
    expect(result).not.toBeInstanceOf(type.errors)
  })

  it('should reject invalid user', () => {
    const result = UserSchema(invalidData)
    expect(result).toBeInstanceOf(type.errors)
  })
})
```

## Code Quality Tools

### Biome

Linter และ formatter:

```json
{
  "linter": {
    "rules": {
      "suspicious": {
        "noExplicitAny": "error"
      }
    }
  }
}
```

### TypeScript

Strict type checking:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

## ตารางสรุป Ecosystem

| Category | Tool | Use Case |
|----------|------|----------|
| Documentation | Official Docs | Learning และ reference |
| Community | Discord | Help และ discussions |
| Pattern Matching | ts-pattern | Advanced patterns |
| Functional Programming | effect-ts | FP patterns |
| Web Framework | Hono | API development |
| Web Framework | Elysia | Fast APIs |
| Testing | Vitest | Unit testing |
| Linting | Biome | Code quality |
| Type Checking | TypeScript | Type safety |

## Learning Resources

### Tutorials

- [Quick Start](https://arktype.io/docs/quick-start) - เริ่มต้นใช้งาน
- [Type Syntax](https://arktype.io/docs/type-syntax) - ไวยากรณ์ type
- [Advanced Patterns](https://arktype.io/docs/advanced) - Patterns ขั้นสูง

### Examples

- [GitHub Examples](https://github.com/arktypeio/arktype/tree/main/examples) - Code examples
- [Playground](https://arktype.io/playground) - Try online

### Blog Posts

- [Why ArkType](https://arktype.io/blog/why-arktype) - ทำไมเลือก ArkType
- [Performance](https://arktype.io/blog/performance) - Performance benchmarks
- [Migration Guide](https://arktype.io/blog/migration) - Migration จาก libraries อื่น
