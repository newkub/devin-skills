# Type Safety

Type safety ของ Elysia ด้วย TypeScript และ Eden Treaty

## End-to-End Type Safety

### Server Types

```typescript
import { Elysia, t } from 'elysia'

const app = new Elysia()
  .post('/user', ({ body }) => body, {
    body: t.Object({
      name: t.String(),
      email: t.String()
    })
  })

// body type จะถูก inferred อัตโนมัติ
```

### Eden Treaty Client

```typescript
import { edenTreaty } from '@elysiajs/eden'
import type { App } from './server'

const client = edenTreaty<App>('http://localhost:3000')

// Full type safety
const user = await client.user.post({
  name: 'John',
  email: 'john@example.com'
})
```

## Type Inference

### Derive Types

```typescript
const auth = new Elysia({ name: 'auth' })
  .derive(() => ({
    user: { id: '1', name: 'John' } as User
  }))

app.use(auth).get('/profile', ({ user }) => {
  // user type ถูก inferred
  return user
})
```

### Context Types

```typescript
app.get('/', ({ request, headers, query, params, body }) => {
  // ทุกอย่างมี type safety
})
```

## Type Exports

```typescript
// server.ts
export type App = typeof app

// client.ts
import type { App } from './server'
import { edenTreaty } from '@elysiajs/eden'

const client = edenTreaty<App>('http://localhost:3000')
```

## Best Practices

- **Use Eden Treaty**: สำหรับ type-safe client
- **Export Types**: export app types สำหรับ client
- **Type Schemas**: ใช้ TypeBox schemas สำหรับ validation
- **Avoid Any**: ไม่ใช้ `any` type
