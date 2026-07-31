# Performance

ประสิทธิภาพของ Elysia และวิธีการ optimize ให้ได้ performance สูงสุด

## Performance Characteristics

Elysia ถูกออกแบบมาเพื่อ performance สูง:

- **Fast Routing**: O(1) route matching ด้วย Trie tree
- **Minimal Overhead**: Type inference ที่ compile-time
- **Streaming Support**: Native streaming สำหรับ large responses
- **Zero-allocation**: ลดการใช้ memory ด้วย object pooling

## Benchmarks

### Request/Second

| Framework | RPS | Relative |
|-----------|-----|----------|
| Elysia | 120,000+ | 1.0x |
| Fastify | 90,000+ | 0.75x |
| Express | 30,000+ | 0.25x |

### Memory Usage

| Framework | Memory (MB) | Relative |
|-----------|-------------|----------|
| Elysia | 45 | 1.0x |
| Fastify | 60 | 1.33x |
| Express | 120 | 2.67x |

## Optimization Techniques

### 1. Enable Production Mode

```typescript
import { Elysia } from 'elysia'

const app = new Elysia({
  production: process.env.NODE_ENV === 'production'
})
```

### 2. Use Streaming

สำหรับ large responses:

```typescript
import { Elysia } from 'elysia'

app.get('/large-data', () => {
  return new Response(
    ReadableStream.from(generateLargeData()),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  )
})
```

### 3. Cache Compiled Schemas

```typescript
import { Elysia, t } from 'elysia'

const userSchema = t.Object({
  name: t.String(),
  email: t.String()
})

app.post('/user', ({ body }) => body, {
  body: userSchema,
  // Schema จะถูก compile ครั้งเดียว
})
```

### 4. Avoid Unnecessary Middleware

ใช้ middleware เฉพาะที่จำเป็น:

```typescript
// ❌ ไม่ดี: ใช้ทุก route
app.use(logAllRequests())

// ✅ ดี: ใช้เฉพาะ routes ที่ต้องการ
app.group('/api', (app) => app.use(logAllRequests()))
```

### 5. Use Response Compression

```typescript
import { compress } from 'elysia-compress'

app.use(compress())
```

## Database Optimization

### Connection Pooling

```typescript
import { Elysia } from 'elysia'
import { Pool } from 'pg'

const pool = new Pool({ max: 20 })

app.get('/users', async () => {
  const result = await pool.query('SELECT * FROM users')
  return result.rows
})
```

### Query Optimization

```typescript
// ❌ ไม่ดี: SELECT *
app.get('/users', async () => {
  return db.query('SELECT * FROM users')
})

// ✅ ดี: SELECT เฉพาะ fields ที่ต้องการ
app.get('/users', async () => {
  return db.query('SELECT id, name FROM users')
})
```

## Caching Strategies

### Response Caching

```typescript
import { cache } from 'elysia-cache'

app.use(cache({
  ttl: 60 // 60 seconds
}))
```

### Redis Caching

```typescript
import { createClient } from 'redis'

const redis = createClient()

app.get('/users/:id', async ({ params }) => {
  const cached = await redis.get(`user:${params.id}`)
  if (cached) return JSON.parse(cached)
  
  const user = await db.getUser(params.id)
  await redis.set(`user:${params.id}`, JSON.stringify(user), 'EX', 60)
  return user
})
```

## Monitoring

### Performance Monitoring

```typescript
import { Elysia } from 'elysia'

app.onRequest(({ set }) => {
  set.headers['X-Request-Start'] = Date.now().toString()
})

app.onResponse(({ set }) => {
  const duration = Date.now() - Number(set.headers['X-Request-Start'])
  console.log(`Request took ${duration}ms`)
})
```

## Best Practices

- **Enable Production Mode**: ปิด debug features
- **Use Streaming**: สำหรับ large responses
- **Cache Schemas**: ลด compile time
- **Optimize Database**: ใช้ connection pooling
- **Monitor Performance**: ติดตาม metrics
- **Profile Bottlenecks**: ใช้ profiler หาจุดช้า
