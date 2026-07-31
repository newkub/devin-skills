# Hono Integration

ใช้ oRPC กับ Hono

## Setup

ติดตั้ง dependencies:

```bash
bun add @orpc/server @orpc/client @orpc/hono
bun add zod
bun add hono
```

## Create Router

สร้าง `src/router/index.ts`:

```typescript
import { orpc } from '@orpc/server'
import { z } from 'zod'

export const appRouter = orpc.router({
  hello: orpc
    .procedure()
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return { message: `Hello ${input.name}!` }
    })
})

export type AppRouter = typeof appRouter
```

## Create Hono App

สร้าง `src/index.ts`:

```typescript
import { Hono } from 'hono'
import { orpcHandler } from '@orpc/hono'
import { appRouter } from './router'

const app = new Hono()

app.use('/api/*', orpcHandler(appRouter))

app.fire()
```

## Create Client

สร้าง `src/client/index.ts`:

```typescript
import { orpc } from '@orpc/client'
import type { AppRouter } from '../router'

export const orpcClient = orpc.client<AppRouter>({
  baseURL: 'http://localhost:3000/api'
})
```

## Use In Client

ใช้ใน client:

```typescript
import { orpcClient } from './client'

const result = await orpcClient.hello.query({ name: 'World' })
console.log(result.message)
```
