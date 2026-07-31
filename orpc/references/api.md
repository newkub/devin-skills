# API Reference

API references สำหรับ oRPC

## Core API

### orpc.app()

สร้าง app router:

```typescript
const appRouter = orpc.app()
```

### orpc.router()

สร้าง router:

```typescript
const router = orpc.router({
  procedure1: orpc.procedure()
})
```

### orpc.procedure()

สร้าง procedure:

```typescript
const procedure = orpc.procedure()
```

## Procedure Methods

### .input()

กำหนด input schema:

```typescript
.input(z.object({ name: z.string() }))
```

### .output()

กำหนด output schema:

```typescript
.output(z.object({ message: z.string() }))
```

### .query()

กำหนด query handler:

```typescript
.query(({ input }) => { ... })
```

### .mutation()

กำหนด mutation handler:

```typescript
.mutation(({ input }) => { ... })
```

### .context()

กำหนด context:

```typescript
.context(() => ({ user: getCurrentUser() }))
```

### .use()

ใช้ middleware:

```typescript
.use(middleware)
```

## Client API

### orpc.client()

สร้าง client:

```typescript
const client = orpc.client<AppRouter>({
  baseURL: 'http://localhost:3000/api'
})
```

### .query()

เรียก query:

```typescript
client.procedure.query({ input })
```

### .mutate()

เรียก mutation:

```typescript
client.procedure.mutate({ input })
```

## Error API

### ORPCError

สร้าง custom error:

```typescript
throw new ORPCError('NOT_FOUND', { message: 'Not found' })
```

## Documentation

ดูเพิ่มเติมที่ https://orpc.dev/docs
