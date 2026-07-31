# Patterns

Design patterns ที่ใช้กับ Elysia

## Common Patterns

### 1. Repository Pattern

แยก data access logic:

```typescript
// src/repositories/user.repository.ts
export class UserRepository {
  constructor(private db: Database) {}

  async findById(id: string) {
    return this.db.query('SELECT * FROM users WHERE id = $1', [id])
  }

  async create(data: CreateUser) {
    return this.db.query('INSERT INTO users (...) VALUES (...) RETURNING *', [data])
  }
}

// src/routes/user.ts
app.get('/users/:id', async ({ params, repositories }) => {
  return repositories.user.findById(params.id)
})
```

### 2. Service Layer Pattern

แยก business logic:

```typescript
// src/services/user.service.ts
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private emailService: EmailService
  ) {}

  async register(data: RegisterUser) {
    const user = await this.userRepo.create(data)
    await this.emailService.sendWelcome(user.email)
    return user
  }
}

// src/routes/user.ts
app.post('/register', async ({ body, services }) => {
  return services.user.register(body)
})
```

### 3. Factory Pattern

สร้าง Elysia instances:

```typescript
// src/factories/app.factory.ts
export function createApp(config: AppConfig) {
  return new Elysia({
    aot: config.production
  })
    .use(cors())
    .use(jwt())
    .use(logger())
}
```

### 4. Strategy Pattern

เลือก algorithms แบบ dynamic:

```typescript
// src/strategies/cache.strategy.ts
interface CacheStrategy {
  get(key: string): Promise<any>
  set(key: string, value: any): Promise<void>
}

class RedisCache implements CacheStrategy {
  async get(key: string) {
    return redis.get(key)
  }
  async set(key: string, value: any) {
    return redis.set(key, value)
  }
}

class MemoryCache implements CacheStrategy {
  private cache = new Map()
  async get(key: string) {
    return this.cache.get(key)
  }
  async set(key: string, value: any) {
    this.cache.set(key, value)
  }
}

// src/app.ts
const cacheStrategy = process.env.REDIS_URL
  ? new RedisCache()
  : new MemoryCache()
```

### 5. Middleware Chain Pattern

จัดเรียง middleware ตามลำดับ:

```typescript
const authMiddleware = new Elysia({ name: 'auth' })
  .derive(({ headers }) => {
    const user = verifyToken(headers.authorization)
    return { user }
  })

const loggingMiddleware = new Elysia({ name: 'logging' })
  .onRequest(({ request }) => {
    console.log(`${request.method} ${request.url}`)
  })

const errorMiddleware = new Elysia({ name: 'error' })
  .onError(({ error, set }) => {
    set.status = 500
    return { error: error.message }
  })

app
  .use(loggingMiddleware)
  .use(authMiddleware)
  .use(errorMiddleware)
```

### 6. Plugin Composition Pattern

รวม plugins เป็น module:

```typescript
// src/plugins/user.plugin.ts
export const userPlugin = new Elysia({ name: 'user' })
  .derive(({ db }) => ({
    userRepo: new UserRepository(db)
  }))
  .group('/users', (app) => app
    .get('/', ({ userRepo }) => userRepo.findAll())
    .get('/:id', ({ params, userRepo }) => userRepo.findById(params.id))
  )

// src/app.ts
app.use(userPlugin)
```

### 7. Dependency Injection Pattern

ฉีด dependencies ผ่าน derive:

```typescript
// src/app.ts
const app = new Elysia()
  .derive(() => ({
    db: new Database(),
    cache: new Cache(),
    logger: new Logger()
  }))
  .derive(({ db, cache, logger }) => ({
    userService: new UserService(db, cache, logger)
  }))
```

### 8. Observer Pattern

ติดตาม events:

```typescript
// src/events/user.events.ts
const userEvents = new Elysia({ name: 'user-events' })
  .onAfterHandle(({ body }) => {
    if (body.user) {
      emit('user:created', body.user)
    }
  })

// src/listeners/user.listener.ts
on('user:created', (user) => {
  sendWelcomeEmail(user.email)
})
```

### 9. Decorator Pattern

เพิ่ม functionality แบบ dynamic:

```typescript
// src/decorators/cache.decorator.ts
export function withCache(ttl: number) {
  return new Elysia({ name: 'cache' })
    .onBeforeHandle(async ({ request, set }) => {
      const cached = await cache.get(request.url)
      if (cached) {
        set.headers['X-Cache'] = 'HIT'
        return cached
      }
    })
    .onAfterHandle(async ({ request, body, set }) => {
      await cache.set(request.url, body, ttl)
      set.headers['X-Cache'] = 'MISS'
    })
}

// src/routes/user.ts
app
  .use(withCache(60))
  .get('/users/:id', () => getUser())
```

### 10. Builder Pattern

สร้าง configurations แบบ fluent:

```typescript
// src/builders/response.builder.ts
class ResponseBuilder {
  private data: any = null
  private status: number = 200
  private headers: Record<string, string> = {}

  setData(data: any) {
    this.data = data
    return this
  }

  setStatus(status: number) {
    this.status = status
    return this
  }

  setHeader(key: string, value: string) {
    this.headers[key] = value
    return this
  }

  build() {
    return new Response(JSON.stringify(this.data), {
      status: this.status,
      headers: this.headers
    })
  }
}

// src/routes/user.ts
app.get('/users/:id', () => {
  return new ResponseBuilder()
    .setData(getUser())
    .setStatus(200)
    .setHeader('X-Custom', 'value')
    .build()
})
```

## Anti-Patterns

### 1. God Object

❌ ไม่ดี: รวมทุกอย่างใน instance เดียว

```typescript
const app = new Elysia()
  .get('/users', () => {})
  .post('/users', () => {})
  .get('/products', () => {})
  .post('/products', () => {})
  // ... 100+ routes
```

✅ ดี: แยกเป็น modules

```typescript
app
  .use(userRoutes)
  .use(productRoutes)
  .use(orderRoutes)
```

### 2. Tight Coupling

❌ ไม่ดี: เชื่อมต่อกับ external services โดยตรง

```typescript
app.get('/users', async () => {
  return await fetch('https://external-api.com/users')
})
```

✅ ดี: ใช้ abstraction layer

```typescript
app.get('/users', async ({ userService }) => {
  return userService.getUsers()
})
```

### 3. Global State

❌ ไม่ดี: ใช้ global variables

```typescript
let currentUser: User

app.get('/user', () => currentUser)
```

✅ ดี: ใช้ context หรือ session

```typescript
app.get('/user', ({ session }) => session.user)
```

## Best Practices

- **Separation of Concerns**: แยก logic ตาม responsibility
- **Dependency Injection**: ฉีด dependencies แทน hardcode
- **Composition over Inheritance**: ใช้ composition มากกว่า inheritance
- **Interface Segregation**: สร้าง interfaces ที่เฉพาะเจาะจง
- **Single Responsibility**: แต่ละ class/function ทำหน้าที่เดียว
- **Open/Closed Principle**: เปิดสำหรับ extension, ปิดสำหรับ modification
