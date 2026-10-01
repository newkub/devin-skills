# MSW — Request Handler Patterns

## Recommended Patterns

### Handler Structure

- แยก handlers ตาม domain: `src/mocks/handlers/users.ts`, `orders.ts` — export array แล้วรวมใน `handlers.ts` ด้วย spread
- ใช้ `http.get`/`http.post`/etc. กับ path ตรงกับ API จริง — relative path (`/api/users`) สำหรับ same-origin, absolute URL เมื่อ third-party
- GraphQL: ใช้ `graphql.query('OperationName', resolver)` ผูกกับ operation name ไม่ใช่ path — client libs ยิง endpoint เดียวกัน
- response ใช้ `HttpResponse.json(data, { status })` — อย่า return plain object หรือ `Response` manual ถ้าไม่จำเป็น

### Response Realism

- handlers ต้องตรง API contract จริง — field names, types, error shape เหมือน backend; ถ้า backend เปลี่ยนให้อัปเดต handler พร้อมกัน
- cover cases ต่อ endpoint: happy path, 4xx (validation/auth), 5xx (server error), network error (`HttpResponse.error()`), empty state
- ใช้ `await delay(150)` หรือ `delay('infinite')` เพื่อทดสอบ loading/timeout UI — อย่า delay ทุก request โดยไม่จำเป็น (test ช้า)
- parametrize handler ด้วย `params`/`request.json()` แทนสร้าง handler แยกต่อ ID — `http.get('/api/users/:id', ({ params }) => ...)`

### Test Overrides

- base handlers = default happy path; per-test override ด้วย `server.use(http.get(...))` ใน test นั้น
- `server.resetHandlers()` ใน `afterEach` คืน base — override ห้ามรั่วข้าม test
- อย่าแก้ base handler เพื่อ test เดียว — ทุก test อื่นจะเปลี่ยนพฤติกรรมตาม
- runtime handler สำหรับ dev ใช้ `worker.use()` — มีประโยชน์กับ debug panel ที่ toggle error states

### Data Factories

- แยก mock data เป็น factories (`buildUser({...overrides})`) ไม่ใช่ literal ยาวใน handler — ปรับ shape เดียวกระจายทุก test
- เก็บ factories ใน `src/mocks/factories/` — ไม่ใช่ production code ที่ handler import กลับเข้า app
- deterministic data: seed หรือ fixed IDs ใน tests — random data ทำ snapshot/assertion flaky

## Do / Don't

| Do | Don't |
|---|---|
| intercept ที่ network layer ด้วย MSW | patch `fetch`/`axios`/`vi.mock` http client — bypass ทั้ง response pipeline |
| mirror backend error shape (`{ error: { code, message } }`) | return `HttpResponse.json({})` ว่างสำหรับ error |
| override ต่อ test ด้วย `server.use()` | แก้ shared base handler ให้ test เคสเดียวผ่าน |
| ใช้ `onUnhandledRequest: 'warn'` หา gaps | ปล่อย unhandled requests เงียบ — test ผ่านแบบไม่รู้ตัว |
| co-locate handlers ใกล้ domain | ไฟล์ `handlers.ts` เดียวพันบรรทัด |

## Common Pitfalls

- `HttpResponse.json` กับ `ReadableStream`/file uploads ต้องใช้ `HttpResponse` + body เอง — json() ไม่รับ stream
- ลืม `server.resetHandlers()` → test ก่อนหน้า override ค้าง test ถัดไป fail แบบไม่เกี่ยวกัน
- interceptor order สำคัญ: specific path ต้องมาก่อน wildcard — MSW match ตามลำดับที่ register
- cookie/credentials: `request.credentials`/`withCredentials` ต้องตั้งใน handler ถ้า API ใช้ cookies จริง
- binary/download endpoints — return `HttpResponse.arrayBuffer()` หรือ blob; `HttpResponse.json` จะ stringify ผิด

## Performance Notes

- หลีกเลี่ยง `delay()` ค่าเริ่มต้นใน test suite ทั้งหมด — ใช้เฉพาะ test ที่ assert loading state
- handlers จำนวนมากไม่ช้า (match ~O(n) แต่ n เล็ก) — จุดช้าคือ response payload ขนาดใหญ่ที่ build ทุก request; cache factory output ถ้าหนัก
- Node tests: `server.listen()` ครั้งเดียวใน setup file ไม่ใช่ต่อ test file — setupFiles ใน vitest config ทำให้แล้ว

## CI Notes

- test ต้องไม่พึ่ง external network เลย — MSW intercept ทำให้ deterministic บน CI ที่ egress จำกัด
- ถ้า CI test ผ่าน local แต่ fail CI → เกือบทุกครั้งคือ unhandled request ที่ local bypass ไป backend จริง; เปิด `onUnhandledRequest: 'error'` ใน CI ชั่วคราวเพื่อหา
