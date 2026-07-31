# Routing

ระบบ routing ของ Elysia ที่ใช้ Trie tree สำหรับ performance สูง

## Basic Routing

```typescript
import { Elysia } from 'elysia'

new Elysia()
  .get('/', () => 'Hello World')
  .get('/users', () => 'Users')
  .post('/users', () => 'Create User')
  .put('/users/:id', ({ params }) => `Update User ${params.id}`)
  .delete('/users/:id', ({ params }) => `Delete User ${params.id}`)
  .listen(3000)
```

## Route Parameters

### Path Parameters

```typescript
app.get('/users/:id', ({ params }) => {
  return { userId: params.id }
})

app.get('/posts/:postId/comments/:commentId', ({ params }) => {
  return { postId: params.postId, commentId: params.commentId }
})
```

### Query Parameters

```typescript
app.get('/search', ({ query }) => {
  return { q: query.q, page: query.page }
})

// GET /search?q=hello&page=1
```

### Headers

```typescript
app.get('/', ({ headers }) => {
  return { authorization: headers.authorization }
})
```

## Route Groups

จัดกลุ่ม routes ด้วย prefix:

```typescript
app.group('/api', (app) => app
  .get('/users', () => 'Users')
  .get('/posts', () => 'Posts')
)

// หรือใช้ prefix option
new Elysia({ prefix: '/api' })
  .get('/users', () => 'Users')
```

## Nested Groups

```typescript
app
  .group('/api', (app) => app
    .group('/v1', (app) => app
      .get('/users', () => 'Users v1')
    )
    .group('/v2', (app) => app
      .get('/users', () => 'Users v2')
    )
  )
```

## Route Guards

```typescript
app.guard({
  beforeHandle: ({ set, headers }) => {
    if (!headers.authorization) {
      set.status = 401
      return { error: 'Unauthorized' }
    }
  }
}, (app) => app
  .get('/protected', () => 'Protected Route')
)
```

## Route Options

### Response Type

```typescript
app.get('/user', () => {
  return { name: 'John' }
}, {
  response: t.Object({
    name: t.String()
  })
})
```

### Headers

```typescript
app.get('/', () => 'Hello', {
  headers: {
    'X-Custom-Header': 'value'
  }
})
```

## Best Practices

- **Group Related Routes**: ใช้ groups สำหรับ routes ที่เกี่ยวข้อง
- **RESTful Naming**: ใช้ naming conventions มาตรฐาน
- **Parameter Validation**: validate parameters ด้วย schemas
- **Route Guards**: ใช้ guards สำหรับ authentication/authorization
