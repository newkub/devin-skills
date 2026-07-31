# Architecture

## Purpose

อธิบาย architecture ของ Elysia framework และ recommended project structure

## Scope

- Framework Architecture
- Plugin Composition Pattern
- Recommended Project Structure
- Separation of Concerns

## Framework Architecture

Elysia ออกแบบด้วยแนวคิด modular และ composable

```
+--------------------------------------------------+
|                  Elysia App                        |
+--------------------------------------------------+
|                                                    |
|  +----------+  +----------+  +----------+        |
|  | Routes   |  | Lifecycle|  | Plugins  |        |
|  | (GET,    |  | Hooks    |  | (use,    |        |
|  |  POST..) |  | (on,     |  |  guard)  |        |
|  +----------+  |  before) |  +----------+        |
|                +----------+                       |
|                                                    |
|  +----------+  +----------+  +----------+        |
|  | Context  |  | Schema   |  | State    |        |
|  | (body,   |  | (body,   |  | (store,  |        |
|  |  params) |  |  query)  |  |  decor)  |        |
|  +----------+  +----------+  +----------+        |
|                                                    |
+--------------------------------------------------+
         |                    |
    Bun.serve()          TypeBox (validation)
```

| Component | หน้าที่ |
|-----------|---------|
| **Router** | Match HTTP method + path ไปยัง handler |
| **Lifecycle** | จัดการ request flow เป็น stages |
| **Plugins** | Reusable Elysia instances |
| **Context** | ข้อมูล request/response สำหรับ handler |
| **Schema** | TypeBox-based validation |
| **State** | Shared data ระหว่าง requests |

## Plugin Composition Pattern

```
Main App
├── use(corsPlugin)          # Global middleware
├── use(authPlugin)          # Authentication
├── guard({ auth }, app =>   # Protected routes
│   ├── use(usersPlugin)    # /users routes
│   ├── use(postsPlugin)    # /posts routes
│   └── use(adminPlugin)    # /admin routes
│  )
└── .get('/', handler)       # Public routes
```

### Plugin Scope

| Scope | คำอธิบาย | Method |
|-------|----------|--------|
| **Global** | มีผลทุก routes ใน app | `.as('global')` |
| **Scoped** | มีผลเฉพาะ instance ที่ `.use()` | `.as('scoped')` (default) |
| **Local** | มีผลเฉพาะ route เดียว | inline hook |

## Recommended Project Structure

```text
my-project/
├── src/
│   ├── index.ts              # Main entry, server setup
│   ├── routes/               # Route modules (as plugins)
│   │   ├── users.ts
│   │   ├── posts.ts
│   │   └── auth.ts
│   ├── plugins/              # Reusable plugins
│   │   ├── cors.ts
│   │   ├── jwt.ts
│   │   └── rate-limit.ts
│   ├── services/             # Business logic
│   │   ├── user.service.ts
│   │   └── post.service.ts
│   ├── schemas/              # Shared schemas
│   │   ├── user.schema.ts
│   │   └── common.schema.ts
│   └── types/                # TypeScript types
│       └── index.ts
├── test/                     # Tests
│   └── users.test.ts
├── tsconfig.json
├── package.json
└── .env
```

## Separation of Concerns

| Layer | หน้าที่ | ตัวอย่าง |
|-------|---------|----------|
| **Route** | HTTP handling, input/output | `.get('/users', handler)` |
| **Service** | Business logic | `userService.findAll()` |
| **Repository** | Data access | `db.select().from(users)` |
| **Schema** | Validation rules | `t.Object({ name: t.String() })` |

```typescript
// Route layer
.get('/users', async ({ query }) => {
  return userService.findAll(query)
})

// Service layer
const userService = {
  findAll: (query: FindAllQuery) => {
    return userRepository.findMany(query)
  }
}

// Repository layer
const userRepository = {
  findMany: (query) => {
    return db.select().from(users).limit(query.limit)
  }
}
```

## Summary

| Aspect | Approach |
|--------|----------|
| **Architecture** | Modular, composable Elysia instances |
| **Routes** | แยกเป็น plugins ด้วย `prefix` |
| **Logic** | Service layer แยกจาก handlers |
| **Validation** | Shared schemas ด้วย TypeBox |
| **Types** | End-to-end type safety |
