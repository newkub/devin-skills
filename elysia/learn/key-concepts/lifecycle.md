# Lifecycle

Request lifecycle hooks ของ Elysia

## Lifecycle Order

```
1. onRequest
2. parse
3. transform
4. beforeHandle
5. handle (route handler)
6. afterHandle
7. mapResponse
8. onResponse
9. onError (if error)
```

## onRequest

```typescript
app.onRequest(({ request, set }) => {
  console.log('Request received:', request.url)
  set.headers['X-Request-ID'] = generateId()
})
```

## parse

```typescript
app.parse(({ request, headers }) => {
  const contentType = headers['content-type']
  if (contentType === 'application/json') {
    return request.json()
  }
})
```

## transform

```typescript
app.transform(({ body }) => {
  if (body) {
    body.timestamp = Date.now()
  }
})
```

## beforeHandle

```typescript
app.beforeHandle(({ set, headers }) => {
  if (!headers.authorization) {
    set.status = 401
    return { error: 'Unauthorized' }
  }
})
```

## afterHandle

```typescript
app.afterHandle(({ response }) => {
  console.log('Response sent:', response.status)
})
```

## mapResponse

```typescript
app.mapResponse(({ response }) => {
  return new Response(response.body, {
    ...response,
    headers: {
      ...response.headers,
      'X-Powered-By': 'Elysia'
    }
  })
})
```

## onResponse

```typescript
app.onResponse(({ set }) => {
  console.log('Request completed')
})
```

## onError

```typescript
app.onError(({ error, set }) => {
  set.status = 500
  return { error: error.message }
})
```

## Best Practices

- **Use Appropriate Hooks**: เลือก hook ที่เหมาะสมกับ task
- **Keep Hooks Light**: ไม่ทำงานหนักใน hooks
- **Error Handling**: ใช้ onError hook สำหรับ global error handling
