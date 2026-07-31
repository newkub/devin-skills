# Quick Start Guide

เริ่มต้นใช้งาน oRPC อย่างรวดเร็ว

## Installation

ติดตั้ง dependencies:

```bash
bun add @orpc/server @orpc/client
bun add zod  # หรือ valibot, arktype
```

## Define Router

สร้าง router ใน `src/server/router.ts`:

```typescript
import { orpc } from '@orpc/server'
import { z } from 'zod'

export const appRouter = orpc
  .router({
    hello: orpc
      .procedure()
      .input(z.object({ name: z.string() }))
      .query(({ input }) => {
        return { message: `Hello ${input.name}!` }
      })
  })

export type AppRouter = typeof appRouter
```

## Create Server

สร้าง server handler:

```typescript
import { appRouter } from './router'
import { ORPCError } from '@orpc/server'

const handler = appRouter.handler({
  error({ error }) {
    console.error(error)
  }
})
```

## Create Client

สร้าง client ใน `src/client/index.ts`:

```typescript
import { orpc } from '@orpc/client'
import type { AppRouter } from '../server/router'

export const orpcClient = orpc.client<AppRouter>({
  baseURL: 'http://localhost:3000/api'
})
```

## Use In React

ใช้กับ TanStack Query:

```typescript
import { orpcClient } from './client'
import { useQuery } from '@tanstack/react-query'

function Hello() {
  const { data } = useQuery({
    queryKey: ['hello', { name: 'World' }],
    queryFn: () => orpcClient.hello.query({ name: 'World' })
  })

  return <div>{data?.message}</div>
}
```

## Next Steps

- อ่าน `/orpc/key-concepts/router.md` สำหรับ router concepts
- อ่าน `/orpc/best-practices/organization.md` สำหรับ organization
- อ่าน `/orpc/integrations/tanstack-query.md` สำหรับ integration
