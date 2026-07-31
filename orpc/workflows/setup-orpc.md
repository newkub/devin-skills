# Setup ORPC Workflow

ตั้งค่า oRPC ใน project

## Prerequisites

ติดตั้ง dependencies:

```bash
bun add @orpc/server @orpc/client
bun add zod  # หรือ valibot, arktype
```

## Step 1: Create Router Structure

สร้าง folder structure:

```
src/
  server/
    router/
      index.ts
  client/
    index.ts
```

## Step 2: Define App Router

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

## Step 3: Create Client

สร้าง `src/client/index.ts`:

```typescript
import { orpc } from '@orpc/client'
import type { AppRouter } from '../server/router'

export const orpcClient = orpc.client<AppRouter>({
  baseURL: 'http://localhost:3000/api'
})
```

## Step 4: Setup Server Handler

สร้าง server handler ตาม framework ที่ใช้:

ดูจาก `/orpc/integrations/` สำหรับ framework-specific setup

## Step 5: Configure TypeScript

ตั้งค่า `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "plugins": [{ "name": "@orpc/ts-plugin" }]
  }
}
```

## Step 6: Test Setup

ทดสอบ setup:

```bash
bun run typecheck
```
