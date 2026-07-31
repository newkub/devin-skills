# Validation

ระบบ validation ด้วย TypeBox schemas

## Basic Validation

```typescript
import { Elysia, t } from 'elysia'

app.post('/user', ({ body }) => body, {
  body: t.Object({
    name: t.String(),
    email: t.String()
  })
})
```

## Validation Types

### String

```typescript
t.String({
  minLength: 1,
  maxLength: 100,
  format: 'email'
})
```

### Number

```typescript
t.Number({
  minimum: 0,
  maximum: 120
})
```

### Boolean

```typescript
t.Boolean()
```

### Optional

```typescript
t.Optional(t.String())
```

### Arrays

```typescript
t.Array(t.String())
```

### Objects

```typescript
t.Object({
  name: t.String(),
  age: t.Optional(t.Number())
})
```

## Query Validation

```typescript
app.get('/search', ({ query }) => query, {
  query: t.Object({
    q: t.String(),
    page: t.Optional(t.Number())
  })
})
```

## Params Validation

```typescript
app.get('/users/:id', ({ params }) => params, {
  params: t.Object({
    id: t.String()
  })
})
```

## Headers Validation

```typescript
app.get('/', ({ headers }) => headers, {
  headers: t.Object({
    authorization: t.String()
  })
})
```

## Response Validation

```typescript
app.get('/user', () => {
  return { name: 'John' }
}, {
  response: t.Object({
    name: t.String()
  })
})
```

## Custom Validation

```typescript
const customSchema = t.Transform(t.String())
  .Decode((value) => value.toUpperCase())
  .Encode((value) => value.toLowerCase())

app.post('/data', ({ body }) => body, {
  body: customSchema
})
```

## Best Practices

- **Validate Everything**: validate inputs, outputs, headers
- **Use Schemas**: ใช้ schemas แทน manual validation
- **Reuse Schemas**: export schemas สำหรับ reuse
- **Clear Errors**: Elysia จะ return error messages อัตโนมัติ
