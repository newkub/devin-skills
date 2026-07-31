# Use Elysia

การใช้งาน Elysia พื้นฐาน

## Basic Server

```typescript
import { Elysia } from 'elysia'

new Elysia()
  .get('/', () => 'Hello World')
  .listen(3000)
```

## Routing

### HTTP Methods

```typescript
app
  .get('/', () => 'GET')
  .post('/', () => 'POST')
  .put('/', () => 'PUT')
  .delete('/', () => 'DELETE')
```

### Path Parameters

```typescript
app.get('/users/:id', ({ params }) => {
  return `User ID: ${params.id}`
})
```

### Query Parameters

```typescript
app.get('/search', ({ query }) => {
  return `Search: ${query.q}`
})
```

## Validation

### Body Validation

```typescript
import { t } from 'elysia'

app.post('/user', ({ body }) => body, {
  body: t.Object({
    name: t.String(),
    email: t.String()
  })
})
```

### Response Validation

```typescript
app.get('/user', () => {
  return { name: 'John' }
}, {
  response: t.Object({
    name: t.String()
  })
})
```

## Middleware

### onRequest Hook

```typescript
app.onRequest(({ request }) => {
  console.log('Request:', request.url)
})
```

### beforeHandle Hook

```typescript
app.beforeHandle(({ set, headers }) => {
  if (!headers.authorization) {
    set.status = 401
    return { error: 'Unauthorized' }
  }
})
```

## Plugins

### Use Plugin

```typescript
import { cors } from '@elysia/cors'

app.use(cors())
```

### Custom Plugin

```typescript
const logger = new Elysia({ name: 'logger' })
  .onRequest(({ request }) => {
    console.log(request.method, request.url)
  })

app.use(logger)
```

## Error Handling

### Global Error Handler

```typescript
app.onError(({ error, set }) => {
  set.status = 500
  return { error: error.message }
})
```

### Custom Error

```typescript
app.error('NotFoundError', class extends Error {
  constructor(message) {
    super(message)
  }
})

app.onError(({ error }) => {
  if (error instanceof NotFoundError) {
    return { error: 'Not Found' }
  }
})
```

## Response

### JSON Response

```typescript
app.get('/', () => {
  return { message: 'Hello' }
})
```

### Custom Headers

```typescript
app.get('/', ({ set }) => {
  set.headers['X-Custom'] = 'value'
  return { message: 'Hello' }
})
```

### Redirect

```typescript
app.get('/old', ({ set }) => {
  set.redirect = '/new'
})
```

## Best Practices

- **Type Safety**: ใช้ schemas สำหรับ validation
- **Error Handling**: ใช้ onError hook สำหรับ global errors
- **Plugins**: ใช้ plugins สำหรับ reusable logic
- **Groups**: ใช้ groups สำหรับ organize routes
