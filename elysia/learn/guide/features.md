# Features

## Purpose

สรุป features ทั้งหมดของ Elysia framework พร้อมตัวอย่างการใช้งาน

## Scope

- Routing & HTTP Methods
- Validation (TypeBox/Zod/Valibot)
- Plugin & Guard
- WebSocket
- Eden Treaty (Type-safe Client)
- OpenAPI Generation

## Feature Overview

| Feature | คำอธิบาย | สถานะ |
|---------|----------|--------|
| **Routing** | Method chaining, path params, wildcard, group | Stable |
| **Handler** | Return string, JSON, File, Stream, Response | Stable |
| **Validation** | TypeBox, Zod, Valibot, ArkType, Effect Schema | Stable |
| **Plugin** | Reusable Elysia instances | Stable |
| **Lifecycle** | 9 lifecycle hooks | Stable |
| **Guard** | Apply validation/auth to subroutes | Stable |
| **WebSocket** | Realtime communication | Stable |
| **Eden Treaty** | Type-safe HTTP client | Stable |
| **OpenAPI** | Auto-generate API docs | Stable |
| **Macro** | Custom route-level middleware | Stable |

## Routing

```typescript
import { Elysia } from 'elysia'

new Elysia()
  .get('/', () => 'Hello')
  .get('/id/:id', ({ params: { id } }) => id)
  .get('/rest/*', () => 'Wildcard')
  .route('M-SEARCH', '/search', () => 'Custom method')
  .group('/api', (app) =>
    app
      .get('/users', () => 'List users')
      .post('/users', ({ body }) => body)
  )
  .listen(3000)
```

## Handler Response Types

| Type | ตัวอย่าง | Content-Type |
|------|----------|-------------|
| **String** | `'Hello'` | `text/plain` |
| **Object** | `{ name: 'John' }` | `application/json` |
| **File** | `file('image.png')` | auto-detected |
| **Stream** | `function*() { yield '...' }` | streaming |
| **Response** | `new Response(...)` | custom |
| **Redirect** | `redirect('/path')` | redirect |

## Validation

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
  .post('/user', ({ body }) => body, {
    body: t.Object({
      name: t.String(),
      age: t.Number({ minimum: 0 }),
      email: t.String({ format: 'email' }),
    }),
    query: t.Object({
      include: t.Optional(t.String()),
    }),
    response: t.Object({
      name: t.String(),
      age: t.Number(),
      email: t.String(),
    }),
  })
```

### File Upload

```typescript
new Elysia()
  .post('/upload', ({ body }) => body, {
    body: t.Object({
      file: t.File({ type: 'image' }),
      multipleFiles: t.Files(),
    })
  })
```

## Plugin & Guard

```typescript
// Plugin
const auth = new Elysia({ name: 'auth' })
  .derive(({ headers }) => ({
    bearer: headers['authorization']?.split(' ')[1]
  }))

// Guard - apply to subroutes
new Elysia()
  .guard({
    headers: t.Object({
      authorization: t.String(),
    }),
  }, (app) =>
    app
      .use(auth)
      .get('/profile', ({ bearer }) => bearer)
  )
  .listen(3000)
```

## WebSocket

```typescript
new Elysia()
  .ws('/chat', {
    open(ws) {
      console.log('Connected:', ws.data.id)
    },
    message(ws, message) {
      ws.send('Echo: ' + message)
    },
    close(ws) {
      console.log('Disconnected')
    },
  })
```

## Eden Treaty (Type-safe Client)

```typescript
import { treaty } from '@elysia/eden'
import type { App } from './server'

const api = treaty<App>('localhost:3000')

// Type-safe request
const { data, error } = await api.user.post({
  name: 'John',
  age: 25,
})
```

## OpenAPI Generation

```typescript
import { Elysia } from 'elysia'
import { openapi } from '@elysia/openapi'

const app = new Elysia()
  .use(openapi())
  .get('/user', () => ({ name: 'John' }))
  .listen(3000)

// Docs at http://localhost:3000/openapi
```

## Summary

| Category | Features |
|----------|----------|
| **Routing** | Methods, Params, Wildcard, Group, Custom method |
| **Handler** | String, JSON, File, Stream, Response, Redirect |
| **Validation** | TypeBox, Zod, Valibot, ArkType, Effect, File upload |
| **Architecture** | Plugin, Guard, Macro, Lifecycle hooks, Derive, Resolve |
| **Realtime** | WebSocket with typed events |
| **Client** | Eden Treaty (type-safe from server types) |
| **Docs** | Auto OpenAPI from TypeScript types |
