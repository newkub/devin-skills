# Router Concepts

แนวคิดเกี่ยวกับ oRPC Router

## App Router

App router เป็น root router ของ application:

```typescript
const appRouter = orpc.router({
  // procedures
})
```

## Procedure

Procedure เป็น unit พื้นฐานของ API:

- **Query**: สำหรับดึงข้อมูล (GET)
- **Mutation**: สำหรับเปลี่ยนแปลงข้อมูล (POST/PUT/DELETE)
- **Subscription**: สำหรับ real-time updates

```typescript
query: orpc.procedure().query(() => { ... })
mutation: orpc.procedure().mutation(() => { ... })
```

## Input Validation

ใช้ schema validators สำหรับ input:

```typescript
.input(z.object({
  id: z.string(),
  name: z.string()
}))
```

## Context

Context ใช้สำหรับ shared data:

```typescript
.context(() => ({ user: getCurrentUser() }))
```

## Middleware

Middleware ใช้สำหรับ preprocessing:

```typescript
.use(async ({ next }) => {
  // pre-processing
  return next()
})
```

## Nested Routers

ใช้ nested routers สำหรับ grouping:

```typescript
const appRouter = orpc.router({
  users: userRouter,
  posts: postRouter
})
```

## Error Handling

ใช้ `ORPCError` สำหรับ custom errors:

```typescript
throw new ORPCError('NOT_FOUND', { message: 'User not found' })
```

## Type Inference

Types ถูก inferred อัตโนมัติ:

```typescript
type Input = inferProcedureInput<AppRouter['hello']>
type Output = inferProcedureOutput<AppRouter['hello']>
```
