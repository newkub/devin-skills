# Next.js Integration

ใช้ oRPC กับ Next.js

## Setup

ติดตั้ง dependencies:

```bash
bun add @orpc/server @orpc/client @orpc/next
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

สร้าง `src/app/api/orpc/[...orpc]/route.ts`:

```typescript
import { ORPCHandler } from '@orpc/next'
import { appRouter } from '@/server/router'

const handler = new ORPCHandler(appRouter)

export { handler as GET, handler as POST }
```

## Create Client

สร้าง `src/client/index.ts`:

```typescript
import { orpc } from '@orpc/client'
import type { AppRouter } from '@/server/router'

export const orpcClient = orpc.client<AppRouter>({
  baseURL: '/api/orpc'
})
```

## Server Actions

ใช้กับ Server Actions:

```typescript
'use server'

import { appRouter } from '@/server/router'

export async function hello(name: string) {
  return await appRouter.hello({ name })
}
```
