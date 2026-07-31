# Security

แนวทางความปลอดภัยสำหรับ Elysia applications

## Common Vulnerabilities

### 1. SQL Injection

ใช้ parameterized queries:

```typescript
// ❌ ไม่ปลอดภัย
app.get('/users/:id', async ({ params }) => {
  return db.query(`SELECT * FROM users WHERE id = '${params.id}'`)
})

// ✅ ปลอดภัย
app.get('/users/:id', async ({ params }) => {
  return db.query('SELECT * FROM users WHERE id = $1', [params.id])
})
```

### 2. XSS Protection

Sanitize user input:

```typescript
import { sanitize } from 'sanitize-html'

app.post('/comment', ({ body }) => {
  const clean = sanitize(body.comment)
  return db.saveComment(clean)
})
```

### 3. CSRF Protection

ใช้ CSRF tokens:

```typescript
import { csrf } from 'elysia-csrf'

app.use(csrf({
  cookie: {
    httpOnly: true,
    secure: true
  }
}))
```

## Authentication

### JWT Authentication

```typescript
import { Elysia, t } from 'elysia'
import { sign, verify } from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET

app.post('/login', async ({ body }) => {
  const user = await authenticate(body.email, body.password)
  const token = sign({ id: user.id }, SECRET)
  return { token }
})

app.get('/protected', async ({ headers }) => {
  const token = headers.authorization?.replace('Bearer ', '')
  const decoded = verify(token, SECRET)
  return { user: decoded }
})
```

### Session Authentication

```typescript
import { session } from 'elysia-session'

app.use(session({
  password: process.env.SESSION_SECRET
}))

app.post('/login', async ({ body, session }) => {
  const user = await authenticate(body.email, body.password)
  session.user = user
  return { success: true }
})
```

## Authorization

### Role-based Access Control

```typescript
import { Elysia } from 'elysia'

const auth = new Elysia({ name: 'auth' })
  .derive(({ headers }) => {
    const token = headers.authorization
    const user = verifyToken(token)
    return { user }
  })

const adminOnly = new Elysia({ name: 'admin' })
  .use(auth)
  .onBeforeHandle(({ user, set }) => {
    if (user.role !== 'admin') {
      set.status = 403
      return { error: 'Forbidden' }
    }
  })

app.use(adminOnly).delete('/users/:id', () => {
  return deleteUser()
})
```

## Rate Limiting

```typescript
import { rateLimit } from 'elysia-rate-limit'

app.use(rateLimit({
  duration: 60_000, // 1 minute
  max: 100 // 100 requests per minute
}))
```

## Input Validation

ใช้ TypeBox schemas:

```typescript
import { Elysia, t } from 'elysia'

app.post('/user', ({ body }) => body, {
  body: t.Object({
    name: t.String({ minLength: 1, maxLength: 100 }),
    email: t.String({ format: 'email' }),
    age: t.Number({ minimum: 0, maximum: 120 })
  })
})
```

## Headers Security

### Security Headers

```typescript
import { Elysia } from 'elysia'

app.onAfterHandle(({ set }) => {
  set.headers['X-Content-Type-Options'] = 'nosniff'
  set.headers['X-Frame-Options'] = 'DENY'
  set.headers['X-XSS-Protection'] = '1; mode=block'
  set.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
})
```

### CORS Configuration

```typescript
import { cors } from '@elysia/cors'

app.use(cors({
  origin: 'https://example.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}))
```

## Environment Variables

ใช้ environment variables สำหรับ secrets:

```typescript
import { Elysia } from 'elysia'

const app = new Elysia({
  aot: process.env.NODE_ENV === 'production'
})

// ไม่ hardcode secrets
const DB_URL = process.env.DATABASE_URL
const JWT_SECRET = process.env.JWT_SECRET
```

## Best Practices

- **Validate Input**: ใช้ schemas สำหรับ validation
- **Sanitize Output**: ป้องกัน XSS
- **Use HTTPS**: เปิด SSL/TLS
- **Rate Limiting**: ป้องกัน abuse
- **Secure Headers**: เพิ่ม security headers
- **Environment Variables**: ไม่ hardcode secrets
- **Regular Updates**: อัปเดต dependencies
- **Security Audits**: ทำ security audit สม่ำเสมอ
