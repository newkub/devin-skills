# Plugins

Plugin system ของ Elysia สำหรับ reusable logic

## Basic Plugin

```typescript
import { Elysia } from 'elysia'

const logger = new Elysia({ name: 'logger' })
  .onRequest(({ request }) => {
    console.log(`${request.method} ${request.url}`)
  })

app.use(logger)
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

## Plugin Options

```typescript
const cors = (options: CorsOptions) => new Elysia({ name: 'cors' })
  .onBeforeHandle(({ set, headers }) => {
    set.headers['Access-Control-Allow-Origin'] = options.origin
  })

app.use(cors({ origin: 'https://example.com' }))
```

## Plugin Scope

```typescript
// Global plugin
app.use(globalPlugin)

// Scoped to group
app.group('/api', (app) => app
  .use(apiPlugin)
  .get('/users', () => 'Users')
)
```

## Best Practices

- **Single Responsibility**: แต่ละ plugin ทำหน้าที่เดียว
- **Naming**: ตั้งชื่อ plugin ด้วย `name` option
- **Composition**: รวม plugins เล็กๆ เป็น plugin ใหญ่
- **Options**: ให้ configure ผ่าน options
