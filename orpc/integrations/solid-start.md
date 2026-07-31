# SolidStart Integration

ใช้ oRPC กับ SolidStart

## Setup

ติดตั้ง dependencies:

```bash
bun add @orpc/server @orpc/client @orpc/solid-start
bun add zod
```

## Create Router

สร้าง `src/server/router/index.ts`:

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

## Create API Route

สร้าง `src/routes/api/orpc/[...orpc].ts`:

```typescript
import { createORPCHandler } from '@orpc/solid-start'
import { appRouter } from '~/server/router'

export const GET = createORPCHandler(appRouter)
export const POST = createORPCHandler(appRouter)
```

## Create Client

สร้าง `src/client/index.ts`:

```typescript
import { orpc } from '@orpc/client'
import type { AppRouter } from '~/server/router'

export const orpcClient = orpc.client<AppRouter>({
  baseURL: '/api/orpc'
})
```

## Use In Components

ใช้ใน Solid components:

```tsx
import { createQuery } from '@tanstack/solid-query'
import { orpcClient } from '~/client'

function Hello() {
  const query = createQuery(() => ({
    queryKey: ['hello'],
    queryFn: () => orpcClient.hello.query({ name: 'World' })
  }))

  return <div>{query.data?.message}</div>
}
```
