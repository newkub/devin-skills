# Integration

## Purpose

แนะนำการ integrate Elysia กับ tools, libraries, และ platforms ต่างๆ

## Scope

- Database (Drizzle ORM, Prisma)
- Authentication (JWT, Bearer, Better Auth)
- Frontend (Eden Treaty, React, Next.js)
- Deployment (Vercel, Cloudflare, Docker)

## Database Integration

### Drizzle ORM

```typescript
import { Elysia } from 'elysia'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { Database } from 'bun:sqlite'

const db = drizzle(new Database('sqlite.db'))

const app = new Elysia()
  .decorate('db', db)
  .get('/users', ({ db }) => {
    return db.select().from(users)
  })
```

### Prisma

```typescript
import { Elysia } from 'elysia'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = new Elysia()
  .decorate('prisma', prisma)
  .get('/users', ({ prisma }) => {
    return prisma.user.findMany()
  })
```

## Authentication

### JWT

```typescript
import { jwt } from '@elysia/jwt'

new Elysia()
  .use(jwt({ name: 'jwt', secret: 'secret' }))
  .post('/sign', async ({ jwt, body }) => {
    return jwt.sign({ userId: body.id })
  })
  .get('/verify', async ({ jwt, headers }) => {
    return jwt.verify(headers['authorization'])
  })
```

### Bearer Token

```typescript
import { bearer } from '@elysia/bearer'

new Elysia()
  .use(bearer())
  .get('/', ({ bearer }) => bearer)
```

## Frontend Integration

### Eden Treaty (Type-safe Client)

```typescript
// server.ts
export const app = new Elysia()
  .get('/user/:id', ({ params }) => ({ id: params.id, name: 'John' }))

// client.ts
import { treaty } from '@elysia/eden'
import type { app } from './server'

const api = treaty<typeof app>('localhost:3000')
const { data } = await api.user[':id'].get({ params: { id: '1' } })
// data: { id: string, name: string }
```

### Next.js / React

```typescript
// pages/api/[...elysia].ts
import { app } from '../../server'

export default function handler(req, res) {
  app.handle(req).then((response) => {
    res.status(response.status)
    response.text().then((text) => res.send(text))
  })
}
```

## Deployment

### Docker

```dockerfile
FROM oven/bun:latest
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --production
COPY . .
EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]
```

### Vercel

```typescript
// vercel.ts
import { app } from './src/index'
export default app.handle
```

### Cloudflare Workers

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
  .get('/', () => 'Hello from Cloudflare!')

export default app
```

## Summary

| Integration | Package / Tool |
|-------------|---------------|
| **Database** | Drizzle ORM, Prisma, Bun SQLite |
| **Auth** | `@elysia/jwt`, `@elysia/bearer`, Better Auth |
| **Frontend** | Eden Treaty, Next.js handler |
| **Deploy** | Docker, Vercel, Cloudflare Workers |
