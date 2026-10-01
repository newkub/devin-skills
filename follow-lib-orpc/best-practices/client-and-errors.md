# Best Practices: oRPC Client, Errors และ Query Integration

แนวทางสร้าง type-safe client, จัดการ errors ด้วย `safe()`/`isDefinedError` และ integrate TanStack Query

## Recommended Patterns

- สร้าง client ด้วย `createORPCClient(link)` + `RouterClient<typeof router>` — ได้ auto-completion เต็ม router
- ใช้ `headers: () => ({...})` function สำหรับ auth token ที่เปลี่ยนได้ — อย่า snapshot token ตอนสร้าง client
- Error handling ด้วย `safe()` คืน tuple `[error, data]` — อ่านง่ายกว่า try/catch และ type-safe
- ใช้ `isDefinedError(error)` narrow error จาก `.errors()` ที่ define ไว้ใน procedure
- ถ้าเกือบทุก call ใช้ `safe()` ให้ `createSafeClient` wrap ให้อัตโนมัติ
- TanStack Query ผ่าน `createTanstackQueryUtils` — `orpc.<path>.queryOptions()`/`mutationOptions()` ให้ key + fn type-safe
- SSR/CSR environment ต่างกันใช้ `createIsomorphicFn` แยก link config

## Do / Don't

| Do | Don't |
|---|---|
| ใช้ `safe()`/`isDefinedError` สำหรับ expected errors | catch `unknown` แล้วเดา shape เอง |
| ตั้ง `interceptors: [onError(...)]` log รวมศูนย์ | toast/log error ซ้ำทุก call site |
| ใช้ `queryOptions`/`mutationOptions` กับ TanStack Query | เขียน `queryKey` string เอง |
| ส่ง auth token ผ่าน `headers` function | hardcode token ใน client config |
| Handle network error แยกจาก typed errors | assume error ทุกตัวคือ `ORPCError` |

## Common Pitfalls

- `safe()` คืน tuple — destructure `[error, data]` ผิดลำดับหรือลืมเช็ค error ทำให้ bug เงียบ
- `isDefinedError` เช็คเฉพาะ errors ที่ define ใน `.errors()` — common errors (`UNAUTHORIZED`) ต้อง handle แยกผ่าน `error.code`
- Type `RouterClient` ไม่ตรง router จริง — client drift เมื่อ server เปลี่ยน; import type จาก shared package เสมอ
- Query key mismatch — สร้าง key เองแทนใช้ `queryOptions` ทำให้ cache invalidation พลาด
- Error `message`/`data` อาจถูกแสดงต่อ user — server ต้องไม่ leak sensitive info ตั้งแต่ต้นทาง

## Performance Notes

- Client เบา — bundle impact น้อย แต่ `RouterClient` type inference บน router ใหญ่ชะลอ TS; แยก router เป็น sub-types ถ้าช้า
- TanStack Query caching ลด duplicate calls — ตั้ง `staleTime` ให้เหมาะกับ data volatility
- Batch เมื่อมีหลาย query พร้อมกัน — oRPC รองรับ batching ผ่าน link config
- WebSocket/event iterator สำหรับ realtime — ใช้ `@orpc/client` event iterator แทน polling loop

## Ecosystem / Integration

- TanStack Query utils → `@orpc/tanstack-query`
- OpenAPI contract testing → `/deep-test api`, `/follow-tool-bruno`
- Error codes mapping กับ HTTP status — OpenAPI handler map อัตโนมัติ
