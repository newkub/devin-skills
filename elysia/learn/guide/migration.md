# Migration

วิธีการ migrate จาก frameworks อื่นมายัง Elysia

## From Express

### Basic Migration

**Express:**
```typescript
import express from 'express'

const app = express()
app.get('/', (req, res) => {
  res.send('Hello')
})
app.listen(3000)
```

**Elysia:**
```typescript
import { Elysia } from 'elysia'

new Elysia()
  .get('/', () => 'Hello')
  .listen(3000)
```

### Middleware Migration

**Express:**
```typescript
app.use((req, res, next) => {
  console.log(req.url)
  next()
})
```

**Elysia:**
```typescript
app.onRequest(({ request }) => {
  console.log(request.url)
})
```

### Body Parser

**Express:**
```typescript
app.use(express.json())
app.post('/user', (req, res) => {
  res.json(req.body)
})
```

**Elysia:**
```typescript
app.post('/user', ({ body }) => body, {
  body: t.Object({
    name: t.String()
  })
})
```

## From Fastify

### Basic Migration

**Fastify:**
```typescript
import Fastify from 'fastify'

const app = Fastify()
app.get('/', async (request, reply) => {
  return 'Hello'
})
app.listen({ port: 3000 })
```

**Elysia:**
```typescript
import { Elysia } from 'elysia'

new Elysia()
  .get('/', () => 'Hello')
  .listen(3000)
```

### Plugin Migration

**Fastify:**
```typescript
app.register(async (fastify) => {
  fastify.get('/plugin', () => 'Plugin route')
})
```

**Elysia:**
```typescript
app.group('/plugin', (app) => app.get('/', () => 'Plugin route'))
```

## From Hono

### Basic Migration

**Hono:**
```typescript
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello'))
```

**Elysia:**
```typescript
import { Elysia } from 'elysia'

new Elysia()
  .get('/', () => 'Hello')
```

## Breaking Changes

### Request Object

**Express/Fastify:**
```typescript
app.get('/', (req) => {
  console.log(req.url)
  console.log(req.headers)
})
```

**Elysia:**
```typescript
app.get('/', ({ request, headers }) => {
  console.log(request.url)
  console.log(headers)
})
```

### Response

**Express:**
```typescript
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello' })
})
```

**Elysia:**
```typescript
app.get('/', ({ set }) => {
  set.status = 200
  return { message: 'Hello' }
})
```

## Migration Checklist

- [ ] แปลง routes จาก framework เดิม
- [ ] แปลง middleware เป็น Elysia hooks
- [ ] แปลง validation เป็น TypeBox schemas
- [ ] แปลง error handling
- [ ] แปลง plugins
- [ ] ทดสอบ functionality ทั้งหมด
- [ ] Benchmark performance
- [ ] อัปเดต documentation

## Tools

### Automated Migration

ใช้ tools เพื่อช่วย migration:

```bash
# ติดตั้ง tools
bun add -d @elysia/migration-tools

# รัน migration
bunx elysia-migrate express ./src
```

## Best Practices

- **Incremental Migration**: migrate ทีละส่วน
- **Parallel Development**: รันทั้งสอง frameworks ชั่วคราว
- **Test Coverage**: เพิ่ม tests ก่อน migration
- **Performance Testing**: benchmark หลัง migration
- **Documentation**: อัปเดต docs หลัง migration
