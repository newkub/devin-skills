# How It Works

## Purpose

อธิบายการทำงานภายในของ Elysia framework เพื่อให้เข้าใจกลไกและ flow การทำงาน

## Scope

- Request Lifecycle Flow
- Plugin Composition
- Type Inference Mechanism
- Body Parsing Pipeline

## Request Lifecycle Flow

Elysia แบ่ง request handling เป็นหลาย stages แยกตามหน้าที่

```
+------------------+     +------------------+     +------------------+
|  Request         | --> |  Parse           | --> |  Transform       |
|  (onRequest)     |     |  (onParse)       |     |  (onTransform)   |
+------------------+     +------------------+     +------------------+
                                                          |
+------------------+     +------------------+     +------------------+
|  After Response  | <-- |  After Handle    | <-- |  Validate        |
|  (cleanup/log)   |     |  (map response)  |     |  (schema check)  |
+------------------+     +------------------+     +------------------+
          ^                                               |
          |              +------------------+     +------------------+
          +--------------|  Handler         | <-- |  Before Handle   |
                         |  (main logic)    |     |  (auth/guard)    |
                         +------------------+     +------------------+
```

### ขั้นตอนการทำงาน

| ขั้นตอน | คำอธิบาย | Output |
|---------|----------|--------|
| **1. onRequest** | รับ request แรกสุด (global) | อาจ return response ทันที |
| **2. Parse** | แปลง body เป็น object | `context.body` |
| **3. Transform** | แปลงค่า context ก่อน validate | context ที่แปลงแล้ว |
| **4. Validate** | ตรวจสอบ schema (body, query, params) | ผ่าน / Validation Error |
| **5. Before Handle** | ตรวจสอบเพิ่มเติม (auth, guard) | อาจ return response แทน |
| **6. Handler** | ดำเนินการหลักของ route | Response value |
| **7. After Handle** | แปลง response | Response ที่แปลงแล้ว |
| **8. Map Response** | สร้าง Web Standard Response | `Response` object |
| **9. After Response** | หลังส่ง response ไปแล้ว | Logging / Cleanup |

## Plugin Composition

Plugin คือ Elysia instance ที่แยกออกมา และรวมเข้าด้วย `.use()`

```
+--------------------------------------------------+
|              Main Elysia Instance                  |
+--------------------------------------------------+
|                                                    |
|  .use(authPlugin)                                 |
|  +--------------------------------------------+  |
|  | Auth Plugin (Elysia instance)               |  |
|  |  - derive({ user })                        |  |
|  |  - guard(beforeHandle)                     |  |
|  |  - .get('/me', handler)                    |  |
|  +--------------------------------------------+  |
|                                                    |
|  .use(corsPlugin)                                 |
|  +--------------------------------------------+  |
|  | CORS Plugin                                 |  |
|  |  - onRequest(set headers)                  |  |
|  +--------------------------------------------+  |
|                                                    |
|  Routes: /me + inherited from plugins             |
+--------------------------------------------------+
```

| Mechanism | คำอธิบาย |
|-----------|----------|
| **Instance Merge** | routes, hooks, decorators ถูกรวมเข้า main |
| **Scope Control** | `as('global')` หรือ `as('scoped')` |
| **Order Matters** | Plugin ที่ใช้ก่อนมีผลก่อน |

## Type Inference Mechanism

Elysia ใช้ TypeScript generics เพื่อ infer types ตลอด lifecycle

```
Elysia instance
    |
    +-- .get('/user/:id', handler)   -->  params = { id: string }
    +-- .post('/', h, {body: t.Object})  -->  body = validated type
    +-- .derive(() => ({user: 'x'}))  -->  context.user = string
    +-- .state('key', 1)             -->  store.key = number
```

### Context Composition

| Source | Context Property | When Available |
|--------|-----------------|----------------|
| **Request** | `request`, `headers` | ทุก lifecycle |
| **Route** | `params` | หลัง route match |
| **Parse** | `body`, `query` | หลัง parse |
| **Derive** | custom properties | หลัง transform |
| **Resolve** | custom properties | หลัง validate |
| **State** | `store` | ก่อน server start |
| **Decorate** | custom methods | ก่อน server start |

## Body Parsing Pipeline

Elysia เลือก parser อัตโนมัติจาก schema หรือ content-type

```
Request Body
    |
    v
+------------------+     +------------------+
| Auto-detect      | --> | Pick Parser      |
| (from schema)    |     | (json/form/text) |
+------------------+     +------------------+
                                  |
                                  v
+------------------+     +------------------+
| context.body     | <-- | Parsed Result    |
| (typed)          |     | (assign to ctx)  |
+------------------+     +------------------+
```

| Criteria | Parser Selected |
|----------|----------------|
| `t.Object({...})` | `application/json` |
| `t.Object` + `t.File` (1 level) | `multipart/form-data` |
| `t.URLEncoded` | `application/x-www-form-urlencoded` |
| Primitive type | `text/plain` |
| `parse: 'none'` | Skip parsing |

## Summary

| กลไก | ประโยชน์ |
|-------|---------|
| **Lifecycle Flow** | แยก request เป็น stages ชัดเจน |
| **Plugin Composition** | จัดการ code ให้ modular |
| **Type Inference** | ปลอดภัยด้วย type-checking อัตโนมัติ |
| **Body Parsing** | เลือก parser อัตโนมัติจาก schema |
