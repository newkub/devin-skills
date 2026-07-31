# Configuration

## Purpose

อธิบายการตั้งค่า Elysia server options และ plugin configuration

## Scope

- Server Options
- Context Extension (state, decorate, derive)
- Plugin Configuration
- Environment Variables

## Server Options

```typescript
import { Elysia } from 'elysia'

const app = new Elysia({
  name: 'my-app',
  port: 3000,
  hostname: 'localhost',
})
```

| Option | Type | Default | คำอธิบาย |
|--------|------|---------|----------|
| `name` | `string` | - | ชื่อ app สำหรับ debug |
| `port` | `number` | `3000` | Port ที่ server listen |
| `hostname` | `string` | `localhost` | Hostname ที่ server listen |
| `prefix` | `string` | - | Route prefix สำหรับทุก routes |
| `precompile` | `boolean` | `false` | Precompile routes เพื่อ performance |
| `normalize` | `boolean` | `false` | Normalize URL (remove trailing slash) |
| `aot` | `boolean` | `true` | Ahead-of-time compilation |

## Context Extension

### State

เพิ่ม state ที่แชร์ระหว่างทุก requests (immutable หลัง server start)

```typescript
new Elysia()
  .state('version', '1.0.0')
  .state('maxRetries', 3)
  .get('/version', ({ store }) => store.version)
```

### Decorate

เพิ่ม functions หรือ objects ลง context

```typescript
new Elysia()
  .decorate('greet', (name: string) => `Hello ${name}`)
  .decorate('logger', console)
  .get('/', ({ greet }) => greet('World'))
```

### Derive

เพิ่ม computed properties สำหรับแต่ละ request

```typescript
new Elysia()
  .derive(({ headers }) => ({
    bearer: headers['authorization']?.split(' ')[1] ?? null,
  }))
  .get('/', ({ bearer }) => bearer)
```

### Resolve

เหมือน derive แต่ทำงานหลัง validation (แนะนำใช้แทน derive)

```typescript
new Elysia()
  .resolve(({ headers }) => ({
    user: parseToken(headers['authorization']),
  }))
  .get('/', ({ user }) => user)
```

| Method | When Assigned | Shared | Use Case |
|--------|-------------|--------|----------|
| **state** | ก่อน server start | ใช่ (ทุก requests) | Config values |
| **decorate** | ก่อน server start | ใช่ (ทุก requests) | Utility functions |
| **derive** | ทุก request (ก่อน validate) | ไม่ (unique ต่อ request) | Extract from request |
| **resolve** | ทุก request (หลัง validate) | ไม่ (unique ต่อ request) | Auth, DB queries |

## Plugin Configuration

```typescript
import { cors } from '@elysia/cors'
import { jwt } from '@elysia/jwt'

new Elysia()
  .use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  }))
  .use(jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET!,
  }))
  .listen(3000)
```

## Environment Variables

ใช้ `.env` file หรือ `process.env`:

```env
PORT=3000
HOSTNAME=0.0.0.0
JWT_SECRET=my-secret-key
DATABASE_URL=postgresql://localhost:5432/mydb
```

```typescript
const app = new Elysia({
  port: parseInt(process.env.PORT || '3000'),
  hostname: process.env.HOSTNAME || 'localhost',
})
```

## Summary

| การตั้งค่า | ค่าแนะนำ |
|------------|----------|
| **Port** | ใช้ `process.env.PORT` |
| **Hostname** | `0.0.0.0` สำหรับ production |
| **State** | เก็บ config ที่ไม่เปลี่ยน |
| **Derive/Resolve** | ใช้ `resolve` สำหรับ auth |
| **Env** | ใช้ `.env` file |
