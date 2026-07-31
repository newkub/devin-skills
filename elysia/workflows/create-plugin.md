# Create Plugin

สร้าง custom plugin สำหรับ Elysia

## Basic Plugin

```typescript
import { Elysia } from 'elysia'

const myPlugin = new Elysia({ name: 'my-plugin' })
  .onRequest(({ request }) => {
    console.log('Request received')
  })

app.use(myPlugin)
```

## Plugin with Derive

```typescript
const auth = new Elysia({ name: 'auth' })
  .derive(({ headers }) => {
    const token = headers.authorization
    const user = verifyToken(token)
    return { user }
  })

app.use(auth).get('/protected', ({ user }) => user)
```

## Plugin with Options

```typescript
interface PluginOptions {
  apiKey: string
  endpoint: string
}

const apiPlugin = (options: PluginOptions) => new Elysia({ name: 'api' })
  .derive(() => ({
    api: {
      fetch: (path) => fetch(`${options.endpoint}${path}`, {
        headers: { 'X-API-Key': options.apiKey }
      })
    }
  }))

app.use(apiPlugin({
  apiKey: process.env.API_KEY,
  endpoint: 'https://api.example.com'
}))
```

## Plugin Composition

```typescript
const logger = new Elysia({ name: 'logger' })
  .onRequest(({ request }) => {
    console.log(request.method, request.url)
  })

const timing = new Elysia({ name: 'timing' })
  .onRequest(({ set }) => {
    set.headers['X-Request-Start'] = Date.now().toString()
  })
  .onResponse(({ set }) => {
    const duration = Date.now() - Number(set.headers['X-Request-Start'])
    console.log(`Request took ${duration}ms`)
  })

const monitoring = new Elysia({ name: 'monitoring' })
  .use(logger)
  .use(timing)

app.use(monitoring)
```

## Plugin with State

```typescript
const counter = new Elysia({ name: 'counter' })
  .state('count', 0)
  .derive(({ state }) => ({
    increment: () => state.count++,
    getCount: () => state.count
  }))

app.use(counter).get('/count', ({ getCount }) => getCount())
```

## Plugin with Error Handling

```typescript
const errorHandler = new Elysia({ name: 'error-handler' })
  .onError(({ error, set }) => {
    set.status = 500
    return {
      error: error.message,
      timestamp: new Date().toISOString()
    }
  })

app.use(errorHandler)
```

## Export Plugin

```typescript
// src/plugins/logger.ts
import { Elysia } from 'elysia'

export const logger = new Elysia({ name: 'logger' })
  .onRequest(({ request }) => {
    console.log(request.method, request.url)
  })

// src/index.ts
import { logger } from './plugins/logger'

app.use(logger)
```

## Best Practices

- **Naming**: ตั้งชื่อ plugin ด้วย `name` option
- **Single Responsibility**: แต่ละ plugin ทำหน้าที่เดียว
- **Options**: ให้ configure ผ่าน options
- **Composition**: รวม plugins เล็กๆ เป็น plugin ใหญ่
- **Export**: export plugins สำหรับ reuse
