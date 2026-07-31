# Quick Start

## Purpose

เริ่มต้นใช้งาน Elysia ตั้งแต่ติดตั้งจนถึงสร้าง REST API

## Scope

- Installation
- Basic Server
- Routing
- Validation
- Plugin Usage

## Step Overview

| ขั้นตอน | คำอธิบาย | เวลา |
|---------|----------|------|
| **1. Install** | ติดตั้ง Bun และ Elysia | 1 นาที |
| **2. Create Server** | สร้าง server แรก | 3 นาที |
| **3. Add Routes** | เพิ่ม routes และ handlers | 5 นาที |
| **4. Validate** | กำหนด schema สำหรับ validation | 5 นาที |
| **5. Use Plugins** | เพิ่ม plugin (CORS, Auth) | 3 นาที |

## Step 1: Install

```bash
# Create new project
bun create elysia my-api
cd my-api

# Or add to existing project
bun add elysia
```

## Step 2: Create Server

สร้างไฟล์ `src/index.ts`:

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
  .get('/', () => 'Hello Elysia!')
  .listen(3000)

console.log(`Server running at ${app.server?.url}`)
```

Run:

```bash
bun run src/index.ts
```

## Step 3: Add Routes

```typescript
import { Elysia } from 'elysia'

type User = { id: string; name: string; email: string }
const users: User[] = []

const app = new Elysia()
  // GET all users
  .get('/users', () => users)

  // GET user by ID
  .get('/users/:id', ({ params: { id } }) => {
    return users.find(u => u.id === id)
  })

  // POST create user
  .post('/users', ({ body }) => {
    const user = body as User
    users.push(user)
    return user
  })

  // PUT update user
  .put('/users/:id', ({ params: { id }, body }) => {
    const index = users.findIndex(u => u.id === id)
    if (index === -1) return 'Not found'
    users[index] = { ...users[index], ...(body as User) }
    return users[index]
  })

  // DELETE user
  .delete('/users/:id', ({ params: { id } }) => {
    const index = users.findIndex(u => u.id === id)
    if (index === -1) return 'Not found'
    users.splice(index, 1)
    return 'Deleted'
  })

  .listen(3000)
```

## Step 4: Add Validation

```typescript
import { Elysia, t } from 'elysia'

const app = new Elysia()
  .post('/users', ({ body }) => body, {
    body: t.Object({
      id: t.String(),
      name: t.String({ minLength: 1 }),
      email: t.String({ format: 'email' }),
    }),
    response: t.Object({
      id: t.String(),
      name: t.String(),
      email: t.String(),
    }),
  })
  .listen(3000)
```

## Step 5: Use Plugins

```typescript
import { Elysia, t } from 'elysia'
import { cors } from '@elysia/cors'

// Auth plugin
const auth = new Elysia({ name: 'auth' })
  .macro('isAuth', {
    resolve({ headers, status }) {
      const token = headers['authorization']?.split(' ')[1]
      if (!token) return status(401)
      return { userId: token }
    },
  })

const app = new Elysia()
  .use(cors())
  .use(auth)
  .get('/public', () => 'No auth needed')
  .guard({}, (app) =>
    app
      .get('/profile', ({ userId }) => `User: ${userId}`, {
        isAuth: true,
      })
  )
  .listen(3000)
```

## Project Structure

```text
my-api/
├── src/
│   ├── index.ts          # Main entry, server setup
│   ├── routes/
│   │   └── users.ts      # User routes (as plugin)
│   └── plugins/
│       └── auth.ts       # Auth plugin
├── tsconfig.json
└── package.json
```

## Summary

| ขั้นตอน | Action |
|---------|--------|
| **Install** | `bun create elysia my-api` |
| **Server** | `new Elysia().get('/', handler).listen(3000)` |
| **Routes** | `.get()`, `.post()`, `.put()`, `.delete()` |
| **Validate** | `{ body: t.Object({...}) }` |
| **Plugins** | `.use(cors())`, `.guard({}, callback)` |
