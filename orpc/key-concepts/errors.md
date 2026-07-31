# Error Concepts

แนวคิดเกี่ยวกับ errors ใน oRPC

## ORPCError

ใช้ `ORPCError` สำหรับ custom errors:

```typescript
import { ORPCError } from '@orpc/server'

throw new ORPCError('NOT_FOUND', { message: 'User not found' })
```

## Error Codes

Error codes ที่รองรับ:

- `BAD_REQUEST`: Invalid input
- `UNAUTHORIZED`: Not authenticated
- `FORBIDDEN`: Not authorized
- `NOT_FOUND`: Resource not found
- `INTERNAL_SERVER_ERROR`: Server error
- `TOO_MANY_REQUESTS`: Rate limit exceeded

## Error Structure

Error structure:

```typescript
{
  code: 'NOT_FOUND',
  message: 'User not found',
  data: { ... }
}
```

## Throw Errors

Throw errors ใน procedures:

```typescript
query: orpc.procedure().query(({ input }) => {
  if (!input.id) {
    throw new ORPCError('BAD_REQUEST', { message: 'ID required' })
  }
  return { ... }
})
```

## Error In Middleware

Throw errors ใน middleware:

```typescript
const authMiddleware = orpc.middleware(async ({ next }) => {
  const user = await getCurrentUser()
  if (!user) {
    throw new ORPCError('UNAUTHORIZED')
  }
  return next()
})
```

## Catch Errors At Client

Catch errors ที่ client:

```typescript
try {
  await orpcClient.users.get.query({ id: '123' })
} catch (error) {
  if (error.code === 'NOT_FOUND') {
    // handle not found
  }
}
```

## Error Handler

ตั้งค่า error handler:

```typescript
const handler = appRouter.handler({
  error({ error }) {
    console.error(error)
  }
})
```

## Custom Error Data

เพิ่ม custom data ใน errors:

```typescript
throw new ORPCError('BAD_REQUEST', {
  message: 'Validation failed',
  data: { errors: ['name is required'] }
})
```
