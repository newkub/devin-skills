# Project Structure

โครงสร้างโปรเจกต์ Elysia ที่เหมาะสมสำหรับการพัฒนาแบบ scalable และ maintainable

## โครงสร้างพื้นฐาน

```
my-elysia-app/
├── src/
│   ├── index.ts          # Entry point
│   ├── app.ts            # Elysia instance
│   ├── routes/           # Route handlers
│   ├── plugins/          # Custom plugins
│   ├── schemas/          # Validation schemas
│   ├── services/         # Business logic
│   ├── middleware/       # Custom middleware
│   └── utils/            # Utility functions
├── public/               # Static files
├── test/                 # Test files
├── package.json
└── tsconfig.json
```

## แนวทางการจัดระเบียบ

### 1. Route Organization

แยก routes ตาม feature หรือ resource:

```typescript
// src/routes/user.ts
import { Elysia, t } from 'elysia'

export const userRoutes = new Elysia({ prefix: '/users' })
  .get('/', () => 'List users')
  .post('/', ({ body }) => createUser(body), {
    body: t.Object({
      name: t.String(),
      email: t.String()
    })
  })
  .get('/:id', ({ params }) => getUser(params.id))
```

### 2. Plugin Structure

สร้าง plugins สำหรับ reusable logic:

```typescript
// src/plugins/auth.ts
import { Elysia, t } from 'elysia'

export const auth = new Elysia({ name: 'auth' })
  .derive(({ headers }) => {
    const token = headers.authorization
    const user = verifyToken(token)
    return { user }
  })
```

### 3. Schema Management

จัดเก็บ schemas แยกจาก routes:

```typescript
// src/schemas/user.ts
import { t } from 'elysia'

export const userSchema = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.String()
})

export const createUserSchema = t.Object({
  name: t.String(),
  email: t.String()
})
```

### 4. Service Layer

แยก business logic จาก routes:

```typescript
// src/services/user.ts
export const userService = {
  async create(data: CreateUser) {
    // Business logic here
  },
  async findById(id: string) {
    // Business logic here
  }
}
```

## โครงสร้างขนาดใหญ่

สำหรับโปรเจกต์ขนาดใหญ่ ใช้ modular architecture:

```
my-elysia-app/
├── src/
│   ├── modules/
│   │   ├── user/
│   │   │   ├── routes.ts
│   │   │   ├── schemas.ts
│   │   │   ├── services.ts
│   │   │   └── index.ts
│   │   ├── product/
│   │   └── order/
│   ├── plugins/
│   ├── middleware/
│   └── app.ts
```

## Best Practices

- **Separation of Concerns**: แยก routes, services, schemas
- **Modular Design**: จัดกลุ่มตาม feature
- **Type Safety**: ใช้ schemas สำหรับ validation
- **Reusable Plugins**: สร้าง plugins สำหรับ logic ที่ใช้ซ้ำ
- **Clear Naming**: ตั้งชื่อไฟล์และ folder ให้ชัดเจน
