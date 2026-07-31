# Configuration

## Server Options

Elysia accepts the following configuration options when creating a new instance:

```typescript
import { Elysia } from 'elysia'

const app = new Elysia({
  name: 'my-app',
  port: 3000,
  hostname: '0.0.0.0',
  precompile: true,
  aot: true,
  normalize: true,
})
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | `string` | - | Application name for debugging |
| `port` | `number` | `3000` | Server port |
| `hostname` | `string` | `localhost` | Server hostname |
| `prefix` | `string` | - | Route prefix for all routes |
| `precompile` | `boolean` | `false` | Precompile routes |
| `aot` | `boolean` | `true` | Ahead-of-time compilation |
| `normalize` | `boolean` | `false` | Normalize URL (remove trailing slash) |
| `serializer` | `function` | - | Custom response serializer |

## Context Extension

### state

Add shared state (immutable after server starts):

```typescript
app.state('version', '1.0.0')
app.state('config', { maxRetries: 3 })
```

### decorate

Add functions or objects to context:

```typescript
app.decorate('greet', (name: string) => `Hello ${name}`)
app.decorate('logger', console)
```

### derive

Add per-request computed properties (before validation):

```typescript
app.derive(({ headers }) => ({
  bearer: headers['authorization']?.split(' ')[1]
}))
```

### resolve

Add per-request computed properties (after validation):

```typescript
app.resolve(({ headers }) => ({
  userId: parseToken(headers['authorization'])
}))
```

## Lifecycle Hooks

### onRequest

Global hook executed on every request:

```typescript
app.onRequest(({ set }) => {
  set.headers['x-powered-by'] = 'Elysia'
})
```

### onParse

Custom body parser:

```typescript
app.onParse(({ request, contentType }) => {
  if (contentType === 'application/custom') return request.text()
})
```

### onTransform

Transform context before validation:

```typescript
app.onTransform(({ params }) => {
  params.id = +params.id
})
```

### onBeforeHandle

Execute before route handler:

```typescript
app.onBeforeHandle(({ headers, status }) => {
  if (!headers['authorization']) return status(401)
})
```

### onAfterHandle

Execute after route handler:

```typescript
app.onAfterHandle(({ response, set }) => {
  if (typeof response === 'object') {
    set.headers['content-type'] = 'application/json'
  }
})
```

### onError

Global error handler:

```typescript
app.onError(({ error, code }) => {
  console.error(code, error)
  return 'Something went wrong'
})
```

### onAfterResponse

Execute after response sent:

```typescript
app.onAfterResponse(() => {
  console.log('Request completed')
})
```

## Plugin Configuration

```typescript
import { cors } from '@elysia/cors'
import { jwt } from '@elysia/jwt'

app
  .use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  }))
  .use(jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET!,
    exp: '7d',
  }))
```

## Environment Variables

```typescript
const app = new Elysia({
  port: parseInt(process.env.PORT || '3000'),
  hostname: process.env.HOSTNAME || 'localhost',
})
```

## Error Codes

| Code | Description |
|------|-------------|
| `NOT_FOUND` | Route not found |
| `PARSE` | Body parsing failed |
| `VALIDATION` | Schema validation failed |
| `INTERNAL_SERVER_ERROR` | Unhandled error |
| `INVALID_COOKIE_SIGNATURE` | Cookie signature mismatch |
| `INVALID_FILE_TYPE` | File type validation failed |