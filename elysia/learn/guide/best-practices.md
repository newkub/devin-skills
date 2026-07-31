# Best Practices

## Purpose

แนะนำ best practices สำหรับการพัฒนา Elysia applications ให้มีประสิทธิภาพและ maintain ได้ง่าย

## Scope

- Code Organization
- Performance
- Security
- Error Handling
- Type Safety

## Code Organization

| Practice | คำอธิบาย | ตัวอย่าง |
|----------|----------|----------|
| **Routes as Plugins** | แยก routes เป็น Elysia instances | `const users = new Elysia()` |
| **Separate Concerns** | แยก business logic จาก handlers | ใช้ service layer |
| **Named Plugins** | ตั้งชื่อ plugin สำหรับ debug | `new Elysia({ name: 'auth' })` |
| **Group Routes** | ใช้ `.group()` สำหรับ route prefix | `.group('/api', app => ...)` |

```typescript
// routes/users.ts
import { Elysia, t } from 'elysia'

export const users = new Elysia({ prefix: '/users' })
  .get('/', () => 'List users')
  .get('/:id', ({ params }) => `User ${params.id}`)
  .post('/', ({ body }) => body, {
    body: t.Object({ name: t.String() }),
  })

// index.ts
import { Elysia } from 'elysia'
import { users } from './routes/users'

new Elysia()
  .use(users)
  .listen(3000)
```

## Performance

| Practice | คำอธิบาย |
|----------|----------|
| **Enable AOT** | เปิด ahead-of-time compilation (default) |
| **Use Precompile** | `precompile: true` สำหรับ static routes |
| **Avoid Derive** | ใช้ `resolve` แทน `derive` เมื่อต้องการ validate ก่อน |
| **Minimize Hooks** | ใช้เฉพาะ hooks ที่จำเป็น |
| **Response Schema** | กำหนด response schema เพื่อ optimize serialization |

```typescript
// Good: response schema ช่วย optimize
.get('/user', () => ({ name: 'John', age: 25 }), {
  response: t.Object({
    name: t.String(),
    age: t.Number(),
  }),
})

// Bad: ไม่มี response schema
.get('/user', () => ({ name: 'John', age: 25 }))
```

## Security

| Practice | คำอธิบาย |
|----------|----------|
| **Validate All Input** | ใช้ schema validation ทุก endpoint |
| **Use CORS** | กำหนด origin ที่อนุญาต |
| **Sanitize Errors** | ไม่เปิดเผย internal errors |
| **Auth Guards** | ใช้ guard สำหรับ protected routes |
| **Environment Secrets** | เก็บ secrets ใน `.env` |

```typescript
// Good: error handling ที่ไม่เปิดเผยข้อมูลภายใน
.onError(({ error, code }) => {
  if (code === 'VALIDATION') return error
  console.error(error)
  return 'Internal server error'
})
```

## Error Handling

| Practice | คำอธิบาย |
|----------|----------|
| **Global Error Handler** | ตั้ง `onError` ระดับ app |
| **Error Codes** | ใช้ Elysia error codes (`NOT_FOUND`, `VALIDATION`) |
| **Custom Errors** | สร้าง custom error classes |
| **Local Error** | ใช้ `error` ใน guard สำหรับ scoped errors |

```typescript
import { Elysia, NotFoundError } from 'elysia'

new Elysia()
  .onError(({ error, code }) => {
    switch (code) {
      case 'NOT_FOUND':
        return 'Page not found'
      case 'VALIDATION':
        return error.message
      default:
        return 'Something went wrong'
    }
  })
  .get('/user/:id', ({ params }) => {
    const user = findUser(params.id)
    if (!user) throw new NotFoundError()
    return user
  })
```

## Type Safety

| Practice | คำอธิบาย |
|----------|----------|
| **Always Validate** | กำหนด schema ทุก input/output |
| **Use Eden Treaty** | ใช้ type-safe client |
| **Strict Mode** | เปิด `strict: true` ใน tsconfig |
| **Response Schema** | กำหนด response type ชัดเจน |

## Summary

| Category | Key Practice |
|----------|-------------|
| **Organization** | แยก routes เป็น plugins, ใช้ `.group()` |
| **Performance** | เปิด AOT, ใช้ response schema |
| **Security** | Validate input, CORS, sanitize errors |
| **Errors** | Global handler, error codes, custom errors |
| **Types** | Schema validation, Eden Treaty, strict mode |
