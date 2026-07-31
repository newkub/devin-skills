# Integration

## Purpose

แนะนำการ integrate Drizzle ORM กับ frameworks, tools และ services ต่างๆ

## Scope

- Framework Integration (Next.js, Hono, Express)
- Validation Integration (Zod)
- API Integration (tRPC)
- Serverless Platforms

## Framework Integration

### Next.js (App Router)

```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql } from '@vercel/postgres'
import * as schema from './schema'

export const db = drizzle(sql, { schema })
```

```typescript
// src/app/api/users/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'

export async function GET() {
  const allUsers = await db.select().from(users)
  return NextResponse.json(allUsers)
}
```

| หมายเหตุ | คำอธิบาย |
|---------|----------|
| ใช้ singleton | สร้าง `db` instance ครั้งเดียว |
| Edge Runtime | ใช้ `@vercel/postgres` หรือ `@neondatabase/serverless` |
| Server Components | เรียก `db` ใน Server Components ได้โดยตรง |

### Hono

```typescript
// src/db.ts
import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'

export const createDb = (env: { DB: D1Database }) =>
  drizzle(env.DB, { schema })
```

```typescript
// src/index.ts
import { Hono } from 'hono'
import { createDb } from './db'
import { users } from './schema'

const app = new Hono<{ Bindings: { DB: D1Database } }>()

app.get('/users', async (c) => {
  const db = createDb(c.env)
  const allUsers = await db.select().from(users)
  return c.json(allUsers)
})
```

### Express

```typescript
import express from 'express'
import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { users } from './schema'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! })
const db = drizzle(pool, { schema: { users } })

const app = express()
app.use(express.json())

app.get('/users', async (req, res) => {
  const allUsers = await db.select().from(users)
  res.json(allUsers)
})
```

## Validation Integration

### Zod + Drizzle

```typescript
import { z } from 'zod'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

const insertUserSchema = createInsertSchema(users, {
  name: (schema) => schema.name.min(2).max(100),
  email: (schema) => schema.email.email(),
})

const selectUserSchema = createSelectSchema(users)

type NewUser = z.infer<typeof insertUserSchema>

app.post('/users', async (req, res) => {
  const validated = insertUserSchema.parse(req.body)
  const user = await db.insert(users).values(validated).returning()
  res.json(user[0])
})
```

| Package | คำอธิบาย |
|---------|----------|
| `drizzle-zod` | สร้าง Zod schema จาก Drizzle schema |
| `drizzle-typebox` | สร้าง TypeBox schema |
| `drizzle-valibot` | สร้าง Valibot schema |

## API Integration

### tRPC

```typescript
import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { createInsertSchema } from 'drizzle-zod'

const t = initTRPC.context<{ db: typeof db }>().create()

export const appRouter = t.router({
  getUsers: t.procedure.query(async ({ ctx }) => {
    return ctx.db.select().from(users)
  }),
  createUser: t.procedure
    .input(createInsertSchema(users))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(users).values(input).returning()
    }),
})
```

## Serverless Platforms

| Platform | Driver | Import |
|----------|--------|--------|
| **Vercel Postgres** | `@vercel/postgres` | `drizzle-orm/vercel-postgres` |
| **Neon** | `@neondatabase/serverless` | `drizzle-orm/neon-http` |
| **PlanetScale** | `@planetscale/database` | `drizzle-orm/planetscale-serverless` |
| **Cloudflare D1** | Built-in | `drizzle-orm/d1` |
| **Turso** | `@libsql/client` | `drizzle-orm/libsql` |
| **Supabase** | `@supabase/supabase-js` | `drizzle-orm/postgres-js` |

## Summary

| Integration | Package ที่ต้องใช้ |
|-------------|-------------------|
| **Next.js** | `drizzle-orm/vercel-postgres` หรือ `drizzle-orm/node-postgres` |
| **Hono + D1** | `drizzle-orm/d1` |
| **Express** | `drizzle-orm/node-postgres` |
| **Zod** | `drizzle-zod` |
| **tRPC** | `@trpc/server` + `drizzle-zod` |
| **Serverless** | เลือก driver ตาม platform |
