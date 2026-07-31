# Error Handling Best Practices

จัดการ errors อย่างเป็นระบบ

## Use ORPCError

ใช้ `ORPCError` สำหรับ custom errors:

```typescript
import { ORPCError } from '@orpc/server'

throw new ORPCError('NOT_FOUND', { message: 'User not found' })
```

## Error Codes

ใช้ error codes ที่ standard:

- `BAD_REQUEST`: Invalid input
- `UNAUTHORIZED`: Not authenticated
- `FORBIDDEN`: Not authorized
- `NOT_FOUND`: Resource not found
- `INTERNAL_SERVER_ERROR`: Server error

## Global Error Handler

ตั้งค่า global error handler:

```typescript
const handler = appRouter.handler({
  error({ error }) {
    console.error(error)
    if (error.code === 'NOT_FOUND') {
      return { message: 'Resource not found' }
    }
  }
})
```

## Error Middleware

ใช้ middleware สำหรับ error handling:

```typescript
const errorMiddleware = orpc.middleware(async ({ next }) => {
  try {
    return await next()
  } catch (error) {
    throw new ORPCError('INTERNAL_SERVER_ERROR')
  }
})
```

## Error Logging

Log errors สำหรับ debugging:

```typescript
const handler = appRouter.handler({
  error({ error }) {
    logger.error(error)
  }
})
```

## Client Error Handling

จัดการ errors ที่ client:

```typescript
try {
  await orpcClient.users.get.query({ id: '123' })
} catch (error) {
  if (error.code === 'NOT_FOUND') {
    // handle not found
  }
}
```
