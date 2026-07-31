# Middleware Guide

คู่มือการใช้งาน middleware ใน oRPC

## What Is Middleware

Middleware เป็น function ที่ทำงานก่อน procedure:

```typescript
const middleware = orpc.middleware(async ({ next }) => {
  // pre-processing
  return next()
})
```

## Create Middleware

สร้าง middleware:

```typescript
const authMiddleware = orpc.middleware(async ({ next, context }) => {
  const user = await getCurrentUser()
  if (!user) {
    throw new ORPCError('UNAUTHORIZED')
  }
  return next({ context: { user } })
})
```

## Use Middleware

ใช้ middleware กับ procedure:

```typescript
query: orpc
  .procedure()
  .use(authMiddleware)
  .query(({ context }) => {
    return { user: context.user }
  })
```

## Global Middleware

ใช้ middleware ทั้ง router:

```typescript
const appRouter = orpc
  .router({ ... })
  .use(authMiddleware)
```

## Middleware Chain

เชื่อม middleware หลายตัว:

```typescript
query: orpc
  .procedure()
  .use(authMiddleware)
  .use(loggerMiddleware)
  .use(rateLimitMiddleware)
  .query(() => { ... })
```

## Context In Middleware

เข้าถึง context ใน middleware:

```typescript
const middleware = orpc.middleware(async ({ context }) => {
  console.log(context.user)
  return next()
})
```

## Error Handling In Middleware

จัดการ errors ใน middleware:

```typescript
const middleware = orpc.middleware(async ({ next }) => {
  try {
    return await next()
  } catch (error) {
    throw new ORPCError('INTERNAL_SERVER_ERROR')
  }
})
```
