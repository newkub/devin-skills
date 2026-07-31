# Middleware Concepts

แนวคิดเกี่ยวกับ middleware ใน oRPC

## What Is Middleware

Middleware เป็น function ที่ทำงานก่อน/หลัง procedure:

```typescript
const middleware = orpc.middleware(async ({ next }) => {
  // pre-processing
  const result = await next()
  // post-processing
  return result
})
```

## Middleware Parameters

Middleware ได้รับ parameters:

- `context`: Context ปัจจุบัน
- `input`: Input ของ procedure
- `next`: Function สำหรับเรียก procedure ถัดไป

## Create Middleware

สร้าง middleware:

```typescript
const loggerMiddleware = orpc.middleware(async ({ next }) => {
  console.log('Request started')
  const result = await next()
  console.log('Request finished')
  return result
})
```

## Use Middleware

ใช้ middleware กับ procedure:

```typescript
query: orpc
  .procedure()
  .use(loggerMiddleware)
  .query(() => { ... })
```

## Middleware Order

Middleware ทำงานตามลำดับ:

```typescript
.use(middleware1) // runs first
.use(middleware2) // runs second
.query(() => { ... })
```

## Global Middleware

ใช้ middleware ทั้ง router:

```typescript
const appRouter = orpc
  .router({ ... })
  .use(authMiddleware)
```

## Conditional Middleware

ใช้ middleware แบบมีเงื่อนไข:

```typescript
.use(({ next }) => {
  if (shouldAuth) {
    return authMiddleware({ next })
  }
  return next()
})
```

## Error Handling In Middleware

จัดการ errors ใน middleware:

```typescript
.use(async ({ next }) => {
  try {
    return await next()
  } catch (error) {
    throw new ORPCError('INTERNAL_SERVER_ERROR')
  }
})
```
