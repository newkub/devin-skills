# Context Concepts

แนวคิดเกี่ยวกับ context ใน oRPC

## What Is Context

Context เป็น shared data ที่ส่งผ่าน middleware และ procedures:

```typescript
.context(() => ({
  user: getCurrentUser(),
  db: getDatabase()
}))
```

## Create Context

สร้าง context:

```typescript
const createContext = async () => ({
  user: await getCurrentUser(),
  db: await getDatabase()
})
```

## Use Context In Procedures

ใช้ context ใน procedures:

```typescript
query: orpc
  .procedure()
  .context(() => ({ user: getCurrentUser() }))
  .query(({ context }) => {
    return { user: context.user }
  })
```

## Context Types

กำหนด context types:

```typescript
type Context = {
  user: User
  db: Database
}
```

## Context In Middleware

ใช้ context ใน middleware:

```typescript
const middleware = orpc.middleware(async ({ context }) => {
  console.log(context.user)
  return next()
})
```

## Context Inheritance

Context ถูกส่งต่อผ่าน middleware chain:

```typescript
.use(middleware1) // adds user
.use(middleware2) // adds db
.query(({ context }) => {
  // context has user and db
})
```

## Async Context

ใช้ async context:

```typescript
.context(async () => {
  const user = await getCurrentUser()
  return { user }
})
```

## Context Validation

Validate context:

```typescript
.context(() => {
  const user = getCurrentUser()
  if (!user) {
    throw new ORPCError('UNAUTHORIZED')
  }
  return { user }
})
```
