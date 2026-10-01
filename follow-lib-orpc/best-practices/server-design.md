# Best Practices: oRPC Server Design

แนวทางออกแบบ procedures, middleware, context และ router ฝั่ง server ให้ type-safe และ maintainable

## Recommended Patterns

- สร้าง base builder `os` ครั้งเดียวต่อ app แล้ว derive procedure builders ตาม concern เช่น `pub` (public), `authed` (ผ่าน auth middleware)
- ใช้ `.$context<T>()` ระบุ initial context ตั้งแต่ base — ทำให้ type dependency ชัดตั้งแต่ต้นสาย
- Validate ทุก input ด้วย `.input(zodSchema)` — ไม่ trust client data แม้ type ตรงกัน
- ใช้ `.output(zodSchema)` เมื่อต้องการ contract ที่ชัด + OpenAPI spec ที่ถูกต้อง
- Group procedures เป็น nested router ตาม domain (`router.user.list`, `router.order.create`) แทน flat list ยาว
- Middleware แบบ named function (`.use(authMiddleware)`) สำหรับ logic ที่ reuse; inline middleware เฉพาะเคสเดียวจบ
- ใช้ `next({ context: {...} })` inject เฉพาะค่าที่ handler ต้องใช้จริง — context เป็น typed contract
- Guard ด้วย `throw new ORPCError('UNAUTHORIZED')` ใน middleware ก่อนถึง handler

## Do / Don't

| Do | Don't |
|---|---|
| Export `type Router` สำหรับ client inference | export router instance ให้ client import โดยตรง |
| ใช้ `.errors()` สำหรับ domain errors เฉพาะทาง | define error schema สำหรับ common codes ทุก procedure |
| เลือก handler ตาม runtime (`/fetch`, `/node`) | import handler ผิด runtime แล้ว debug type error |
| ตรวจ `matched` ก่อนส่ง response | assume handler match ทุก request |
| Dedup resource init ใน middleware (เช็ค context ก่อน) | สร้าง db connection ใหม่ทุก procedure call |
| แยก initial context (env, headers) จาก execution context (auth, db) | ใส่ทุกอย่างใน initial context |

## Common Pitfalls

- ลืม `.$context` ก่อน `.use()` — middleware ที่ต้องการ context ใหม่จะ type error หรือได้ `unknown`
- ใส่ sensitive data (secrets, internal errors) ใน `ORPCError` message/data — ถูก serialize ส่งไป client
- Middleware order ผิด — auth ต้องมาก่อน procedure ที่ใช้ `context.user`; เรียง `.use()` ให้ถูก
- Rebuild router object ใน request handler — router ควรสร้างครั้งเดียวตอน boot
- ใช้ `.errors()` กับทุก common case — `UNAUTHORIZED`, `NOT_FOUND` ใช้ common codes ได้เลยไม่ต้อง define schema

## Performance Notes

- Middleware ทำงานทุก request — งานหนัก (db connect, token verify) ควร cache/dedup หรือ lazy-init
- Zod validation มี cost — schema ใหญ่มากใน hot path ควร measure; `z.lazy`/precompiled schema ช่วยได้
- Context object ใหญ่ถูก clone ผ่าน `next({context})` — เก็บเฉพาะ reference (db client) ไม่ใช่ data payload
- ใช้ `interceptors` สำหรับ logging/error reporting รวมศูนย์ แทน try/catch ทุก handler

## Ecosystem / Integration

- Zod schemas → `/follow-lib-zod`
- Contract-first: `@orpc/contract` define contract → implement router → `ContractRouterClient`
- OpenAPI spec จาก `OpenAPIGenerator` ใช้กับ `/run-api-docs` และ `/deep-test api`
- TanStack Start integration ผ่าน `server.handlers` ใน route definition
