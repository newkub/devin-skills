# API Reference

API reference ของ Elysia framework

## Core API

### Elysia Class

```typescript
import { Elysia } from 'elysia'

const app = new Elysia(options?)
```

**Options:**
- `name?: string` - Instance name
- `prefix?: string` - Route prefix
- `aot?: boolean` - Ahead-of-time compilation
- `forceErrorLogging?: boolean` - Force error logging
- `seed?: object` - Initial context

### Route Methods

```typescript
app.get(path, handler, options?)
app.post(path, handler, options?)
app.put(path, handler, options?)
app.patch(path, handler, options?)
app.delete(path, handler, options?)
app.options(path, handler, options?)
app.head(path, handler, options?)
```

### Route Groups

```typescript
app.group(prefix, (app) => app)
app.guard(options, (app) => app)
```

## Lifecycle Hooks

### onRequest

```typescript
app.onRequest(handler)
```

### parse

```typescript
app.parse(handler)
```

### transform

```typescript
app.transform(handler)
```

### beforeHandle

```typescript
app.beforeHandle(handler)
```

### afterHandle

```typescript
app.afterHandle(handler)
```

### mapResponse

```typescript
app.mapResponse(handler)
```

### onResponse

```typescript
app.onResponse(handler)
```

### onError

```typescript
app.onError(handler)
```

## Context

### Request Context

```typescript
({
  request,
  set,
  headers,
  query,
  params,
  body,
  store
}) => response
```

**Properties:**
- `request: Request` - HTTP request
- `set: { status, headers, redirect }` - Response config
- `headers: Record<string, string>` - Request headers
- `query: Record<string, string>` - Query parameters
- `params: Record<string, string>` - Path parameters
- `body: T` - Request body
- `store: Record<string, any>` - Instance store

## Validation

### TypeBox Types

```typescript
import { t } from 'elysia'

t.String(options?)
t.Number(options?)
t.Boolean()
t.Array(type)
t.Object(schema)
t.Optional(type)
t.Null(type)
t.Union(types)
t.Intersect(types)
```

### Validation Options

```typescript
{
  body: schema,
  query: schema,
  params: schema,
  headers: schema,
  response: schema
}
```

## Plugins

### use

```typescript
app.use(plugin)
```

### derive

```typescript
app.derive(handler)
```

## Server

### listen

```typescript
app.listen(port, callback?)
```

### stop

```typescript
app.stop()
```

## Utility Methods

### state

```typescript
app.state(key, value)
```

### decorate

```typescript
app.decorate(key, value)
```

### error

```typescript
app.error(name, class)
```

## TypeBox Options

### String Options

```typescript
t.String({
  minLength?: number,
  maxLength?: number,
  format?: 'email' | 'uuid' | 'uri' | 'date',
  pattern?: RegExp
})
```

### Number Options

```typescript
t.Number({
  minimum?: number,
  maximum?: number,
  exclusiveMinimum?: number,
  exclusiveMaximum?: number,
  multipleOf?: number
})
```

## Response Types

### JSON Response

```typescript
return { data: 'value' }
```

### String Response

```typescript
return 'Hello World'
```

### Custom Response

```typescript
return new Response(body, options)
```

## Error Handling

### Custom Errors

```typescript
app.error('CustomError', class extends Error {
  constructor(message) {
    super(message)
  }
})
```

### Error Response

```typescript
app.onError(({ error, set }) => {
  set.status = 500
  return { error: error.message }
})
```

## Full Example

```typescript
import { Elysia, t } from 'elysia'

const app = new Elysia({ prefix: '/api' })
  .state('counter', 0)
  .derive(({ state }) => ({
    increment: () => state.counter++
  }))
  .get('/counter', ({ state }) => state.counter)
  .post('/counter', ({ increment }) => increment())
  .listen(3000)
```
