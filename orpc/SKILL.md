---
name: orpc
description: "Build typesafe APIs with end-to-end type safety and OpenAPI support"
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

สร้าง APIs ที่มี end-to-end type safety ด้วย oRPC ตาม best practices


## Scope

ใช้สำหรับการพัฒนา APIs ด้วย oRPC บน TypeScript projects


## Execute

### 1. Setup ORPC

ติดตั้งและตั้งค่า oRPC

1. ติดตั้ง dependencies ด้วย `bun add @orpc/server @orpc/client`
2. ติดตั้ง schema validator ที่ต้องการ (Zod, Valibot, หรือ ArkType)
3. สร้าง app router ด้วย `orpc.app()`
4. กำหนด procedures ด้วย `router.procedure()`

### 2. Define Procedures

กำหนด API procedures ด้วย type safety

1. ใช้ `z.object()` หรือ schema validator สำหรับ input validation
2. กำหนด output types สำหรับ response
3. ใช้ `context()` สำหรับ shared context
4. ใช้ `middleware()` สำหรับ auth และ validation

### 3. Create Server

สร้าง server สำหรับ framework ที่ใช้

1. สร้าง server handler ด้วย `orpc.handler()`
2. integrate กับ framework (Next.js, Hono, Nitro, ฯลฯ)
3. ตั้งค่า CORS และ security headers
4. ทำตาม `follow-deploy` สำหรับ deployment

### 4. Create Client

สร้าง client สำหรับ frontend

1. สร้าง client ด้วย `orpc.client()`
2. integrate กับ TanStack Query หรือ SWR
3. ใช้ `useQuery()` สำหรับ data fetching
4. ใช้ `useMutation()` สำหรับ mutations

### 5. Type Safety

รักษา type safety ทั้ง client และ server

1. ใช้ inferred types จาก procedures
2. ตรวจสอบ types ด้วย `bun run typecheck`
3. ใช้ `@orpc/ts-plugin` สำหรับ autocomplete
4. ทำตาม `follow-typescript` สำหรับ type safety

### 6. OpenAPI Integration

ใช้งาน OpenAPI สำหรับ documentation

1. สร้าง OpenAPI spec ด้วย `orpc.openapi()`
2. export เป็น JSON หรือ YAML
3. integrate กับ Swagger UI หรือ Redoc
4. ทำตาม `/check-api` สำหรับ API documentation


### 9. Report

รายงานผลลัพธ์:

1. ทำ `report` เพื่อจัดรูปแบบ output
2. แสดง procedures ที่สร้าง
3. แสดง integration points
4. แสดง type safety coverage


## Rules

### 1. Contract-First Development

กำหนด contract ก่อน implementation:

- ใช้ schema validators (Zod, Valibot, ArkType) สำหรับ input/output
- กำหนด error types อย่างชัดเจน
- ใช้ inferred types แทน manual typing
- เขียน contract ในไฟล์แยก ถ้า project ใหญ่

### 2. Procedure Organization

จัดระเบียบ procedures:

- ใช้ nested routers สำหรับ grouping
- ตั้งชื่อ procedures ด้วย verb + noun (เช่น `getUser`, `createPost`)
- แยก procedures ตาม domain หรือ feature
- ใช้ `prefix()` สำหรับ versioning

### 3. Error Handling

จัดการ errors อย่างเป็นระบบ:

- ใช้ `ORPCError` สำหรับ custom errors
- กำหนด error codes ที่ชัดเจน
- ใช้ middleware สำหรับ global error handling
- log errors สำหรับ debugging

### 4. Middleware Usage

ใช้ middleware อย่างเหมาะสม:

- ใช้สำหรับ auth และ authorization
- ใช้สำหรับ rate limiting
- ใช้สำหรับ logging และ telemetry
- ใช้สำหรับ context enrichment

### 5. Client Integration

Integrate client อย่างถูกต้อง:

- ใช้ TanStack Query สำหรับ React apps
- ใช้ SWR สำหรับ simple use cases
- ใช้ Pinia Colada สำหรับ Vue apps
- ใช้ React Server Actions สำหรับ Next.js

### 6. Performance Optimization

ปรับปรุง performance:

- ใช้ lazy router สำหรับ cold start
- ใช้ streaming สำหรับ large responses
- ใช้ caching สำหรับ frequently accessed data
- ใช้ bundler optimization สำหรับ client

### 7. Testing

ทดสอบ procedures:

- เขียน unit tests สำหรับ procedures
- เขียน integration tests สำหรับ client-server
- ใช้ mock data สำหรับ testing
- ทำตาม `follow-test` สำหรับ testing

### 8. Security

รักษา security:

- ใช้ HTTPS สำหรับ production
- validate inputs ทุกครั้ง
- ใช้ auth middleware สำหรับ protected routes
- ใช้ rate limiting สำหรับ public APIs


## Expected Outcome

- APIs มี end-to-end type safety
- OpenAPI documentation สมบูรณ์
- Client-server integration ทำงานได้อย่างราบรื่น
- Code มีคุณภาพและ maintainability สูง
