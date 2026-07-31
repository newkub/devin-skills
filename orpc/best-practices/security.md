# Security Best Practices

รักษา security สำหรับ oRPC

## HTTPS

ใช้ HTTPS สำหรับ production:

```typescript
export const orpcClient = orpc.client<AppRouter>({
  baseURL: 'https://api.example.com'
})
```

## Input Validation

Validate inputs ทุกครั้ง:

```typescript
.input(z.object({
  id: z.string().uuid()
}))
```

## Auth Middleware

ใช้ auth middleware สำหรับ protected routes:

```typescript
const authMiddleware = orpc.middleware(async ({ next, context }) => {
  const user = await getCurrentUser()
  if (!user) {
    throw new ORPCError('UNAUTHORIZED')
  }
  return next({ context: { user } })
})
```

## Rate Limiting

ใช้ rate limiting สำหรับ public APIs:

```typescript
const rateLimitMiddleware = orpc.middleware(async ({ next }) => {
  const rateLimit = await checkRateLimit()
  if (!rateLimit) {
    throw new ORPCError('TOO_MANY_REQUESTS')
  }
  return next()
})
```

## CORS

ตั้งค่า CORS อย่างเหมาะสม:

```typescript
app.use(cors({
  origin: 'https://example.com',
  credentials: true
}))
```

## Environment Variables

ใช้ environment variables สำหรับ secrets:

```typescript
const API_KEY = process.env.API_KEY
```

## Sanitization

Sanitize user inputs:

```typescript
import { sanitize } from 'sanitizer'

const cleanInput = sanitize(input)
```
