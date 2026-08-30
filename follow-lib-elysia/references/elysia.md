# Elysia Reference

## Version Info

- Package: `elysia` v1.4.29 (published ~23 days ago)
- Companion: `@elysia/eden` (end-to-end type safety client)
- License: MIT
- Runtime: Optimized for Bun; also supports Node.js
- Peer Dependencies: None
- Source: https://elysiajs.com

## Install

```bash
# Core framework
bun add elysia

# Eden client for end-to-end type safety
bun add @elysia/eden

# Scaffold a new project
bun create elysia app
```

## Basic Server

```ts
import { Elysia } from 'elysia'

new Elysia()
    .get('/', 'Hello Elysia')
    .get('/user/:id', ({ params: { id } }) => id)
    .post('/form', ({ body }) => body)
    .listen(3000)
```

## Routing

### HTTP verbs

```ts
import { Elysia } from 'elysia'

new Elysia()
    .get('/', 'hello')
    .post('/hi', 'hi')
    .put('/item/:id', ({ params: { id } }) => id)
    .patch('/item/:id', ({ params: { id } }) => id)
    .delete('/item/:id', ({ params: { id } }) => id)
    .listen(3000)
```

### Dynamic path parameters

```ts
new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/:id/:name', ({ params: { id, name } }) => id + ' ' + name)
    .listen(3000)
```

### Optional path parameters

```ts
new Elysia()
    .get('/id/:id?', ({ params: { id } }) => `id ${id}`)
    .listen(3000)
```

### Wildcards

```ts
new Elysia()
    .get('/id/*', ({ params }) => params['*'])
    .listen(3000)
```

### Custom HTTP method

```ts
new Elysia()
    .route('M-SEARCH', '/m-search', 'connect')
    .listen(3000)
```

### Path priority

1. Static paths
2. Dynamic paths
3. Wildcards

## Validation with Elysia.t (TypeBox)

```ts
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/user/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Number()
        })
    })
    .listen(3000)
```

## Validation with Standard Schema (Zod, Valibot, etc.)

```ts
import { Elysia } from 'elysia'
import { z } from 'zod'
import * as v from 'valibot'

new Elysia()
    .get('/id/:id', ({ params: { id }, query: { name } }) => id, {
        params: z.object({
            id: z.coerce.number()
        }),
        query: v.object({
            name: v.literal('Lilith')
        })
    })
    .listen(3000)
```

## Handler Context

```ts
new Elysia()
    .get('/', ({ body, query, params, headers, cookie, store, set, redirect }) => {
        set.headers['x-custom'] = 'value'
        return { body, query, params }
    })
    .post('/redirect', ({ redirect }) => redirect('/'))
    .listen(3000)
```

## Lifecycle Hooks

```ts
new Elysia()
    .onRequest(({ path }) => {
        console.log(`Request to ${path}`)
    })
    .beforeHandle(({ path }) => {
        // Custom validation before handler
    })
    .afterHandle(({ path, response }) => {
        // Tweak returned value
    })
    .onError(({ code, error }) => {
        return `Error: ${error.message}`
    })
    .get('/', () => 'hello')
    .listen(3000)
```

## Plugins

```ts
import { Elysia } from 'elysia'

const auth = new Elysia()
    .decorate('auth', { verify: () => true })
    .guard({
        beforeHandle: ({ auth, set }) => {
            if (!auth.verify()) {
                set.status = 401
                return 'Unauthorized'
            }
        }
    })

new Elysia()
    .use(auth)
    .get('/protected', () => 'protected data')
    .listen(3000)
```

## Eden Treaty Client

### Server side — export type

```ts
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/hi', () => 'Hi Elysia')
    .get('/id/:id', ({ params: { id } }) => id)
    .post('/mirror', ({ body }) => body, {
        body: t.Object({
            id: t.Number(),
            name: t.String()
        })
    })
    .listen(3000)

export type App = typeof app
```

### Client side — type-safe calls

```ts
// client.ts
import { treaty } from '@elysia/eden'
import type { App } from './server'

const app = treaty<App>('localhost:3000')

// GET /hi
const { data, error } = await app.hi.get()

// GET /id/:id — dynamic path via function call
const { data } = await app.id({ id: 1 }).get()

// POST /mirror
const { data } = await app.mirror.post({
    id: 1,
    name: 'Skadi'
})
```

## CLI / Dev Commands

```bash
# Start dev server with hot reload
bun dev

# Run with hot reloading manually
bun --hot src/index.ts

# Create new project
bun create elysia app
```

## Sources

- At a Glance: https://elysiajs.com/at-glance.html
- Quick Start: https://elysiajs.com/quick-start.html
- Routing: https://elysiajs.com/essential/route.html
- Eden Treaty: https://elysiajs.com/eden/treaty/overview.html
