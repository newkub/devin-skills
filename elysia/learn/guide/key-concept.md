# Key Concept

## Purpose

อธิบาย core concepts สำคัญของ Elysia framework เพื่อเป็นพื้นฐานในการใช้งาน

## Scope

- Routing & Handler
- Plugin System
- Lifecycle Hooks
- Validation & Schema
- Type Safety (End-to-End)

## Core Concepts

### 1. Routing & Handler

Elysia ใช้ method chaining สำหรับกำหนด routes และ handlers

```typescript
import { Elysia } from 'elysia'

new Elysia()
  .get('/', () => 'Hello World')
  .get('/id/:id', ({ params: { id } }) => id)
  .post('/user', ({ body }) => body)
  .listen(3000)
```

| องค์ประกอบ | คำอธิบาย | ตัวอย่าง |
|------------|----------|----------|
| **Method** | HTTP method | `.get()`, `.post()`, `.put()` |
| **Path** | URL path พร้อม params | `'/user/:id'`, `'/rest/*'` |
| **Handler** | ฟังก์ชันที่ return response | `({ body }) => body` |
| **Context** | ข้อมูล request ที่ส่งให้ handler | `body`, `params`, `query`, `headers` |

### 2. Plugin System

Plugin คือ Elysia instance แยกที่นำกลับมาใช้ใหม่ได้

```typescript
import { Elysia } from 'elysia'

const auth = new Elysia()
  .derive(({ headers }) => ({
    user: headers['authorization']?.split(' ')[1]
  }))
  .get('/me', ({ user }) => user)

new Elysia()
  .use(auth)
  .listen(3000)
```

| Concept | คำอธิบาย |
|---------|----------|
| **Instance Isolation** | แต่ละ instance มี lifecycle เป็นของตัวเอง |
| **`.use()`** | รวม plugin เข้ากับ main instance |
| **Scope** | ควบคุมว่า plugin มีผลกับ routes ไหน |

### 3. Lifecycle Hooks

Elysia แบ่ง request handling เป็นหลาย stages เรียกว่า lifecycle

```text
Request --> Parse --> Transform --> Validate --> Before Handle --> Handler --> After Handle --> Map Response --> Response
```

| Hook | ตำแหน่ง | วัตถุประสงค์ |
|------|---------|-------------|
| **onRequest** | แรกสุด | Caching, Rate limiter, CORS |
| **onParse** | Parse body | Custom body parser |
| **onTransform** | ก่อน validate | Mutate context |
| **onBeforeHandle** | ก่อน handler | Auth check, Validation |
| **onAfterHandle** | หลัง handler | Transform response |
| **onError** | เมื่อมี error | Error handling |
| **onAfterResponse** | หลังส่ง response | Logging, Cleanup |

### 4. Validation & Schema

ใช้ TypeBox สำหรับกำหนด schema และ validate ข้อมูล

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
  .post('/user', ({ body }) => body, {
    body: t.Object({
      name: t.String(),
      age: t.Number(),
    })
  })
  .listen(3000)
```

| Schema Type | คำอธิบาย | ตัวอย่าง |
|-------------|----------|----------|
| **body** | Validate request body | `t.Object({...})` |
| **query** | Validate query params | `t.Object({...})` |
| **params** | Validate path params | `t.Object({...})` |
| **headers** | Validate headers | `t.Object({...})` |
| **response** | Validate response | `t.String()`, `t.Object({...})` |

### 5. Type Safety (End-to-End)

Elysia ให้ type safety ตั้งแต่ request ถึง response และ Eden Treaty สำหรับ client

```typescript
// Server
const app = new Elysia()
  .get('/user/:id', ({ params }) => ({
    id: params.id,
    name: 'John'
  }))

// Client (Eden Treaty) - type-safe จาก server
import { treaty } from '@elysia/eden'
const api = treaty<typeof app>('localhost:3000')
const { data } = await api.user[':id'].get({ params: { id: '1' } })
// data มี type { id: string, name: string } อัตโนมัติ
```

## Summary

| Concept | ความสำคัญ | ระดับ |
|---------|-----------|-------|
| **Routing & Handler** | พื้นฐานการกำหนด routes | พื้นฐาน |
| **Plugin System** | จัดการ code ให้ modular | ปานกลาง |
| **Lifecycle Hooks** | ควบคุม request flow | ปานกลาง |
| **Validation** | ตรวจสอบข้อมูล input/output | พื้นฐาน |
| **Type Safety** | ปลอดภัยด้วย end-to-end types | สูง |
