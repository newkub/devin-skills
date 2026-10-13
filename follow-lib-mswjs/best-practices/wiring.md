# MSW — Dev Worker และ Test Server Wiring

## Recommended Patterns

### Browser Dev Mode

- start worker เฉพาะเมื่อ flag เปิด: wrap ใน `if (import.meta.env.DEV && import.meta.env.VITE_MSW === '1')` — ห้ามบังคับทุก dev ใช้ mock
- `await worker.start({ onUnhandledRequest: 'bypass' })` ก่อน render app — race ระหว่าง worker start กับ first fetch ทำให้ request แรกหลุด mock
- `mockServiceWorker.js` อยู่ใน `public/` (generate ด้วย `msw init`) — commit เข้า repo เพื่อทีมไม่ต้อง init เอง; อัปเดตเมื่อ msw version bump (`msw init public/ --save` ซ้ำ)
- ใช้ `onUnhandledRequest: 'warn'` ใน dev — เห็น endpoints ที่ยังไม่ mock ใน console ทันที
- opt-out path: env flag ที่อ่านได้ทั้ง local dev server และ storybook — อย่าผูกกับ hostname เช็คเอง

### Node Test Server

- ไฟล์เดียว `src/mocks/node.ts` export `server` จาก `setupServer(...handlers)` — test setup file import เจ้านี้เท่านั้น
- lifecycle ใน setup file: `beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))`, `afterEach(() => server.resetHandlers())`, `afterAll(() => server.close())`
- ใช้ `onUnhandledRequest: 'error'` ใน tests — test ที่ยิง endpoint ใหม่โดยไม่ตั้งใจต้อง fail ทันทีไม่ใช่ผ่านเงียบ
- ชี้ setup file ใน `test.setupFiles` ของ `vitest.config.ts` — อย่า import server แยกในแต่ละ spec

### Dual Environment

- แชร์ `handlers.ts` เดียวกันระหว่าง `browser.ts` และ `node.ts` — mock behavior เดียวกัน dev/test
- browser worker กับ Node server คนละ implementation แต่ API เหมือนกัน — ห้ามเขียน handler เวอร์ชัน dev-only
- environments อื่น (Storybook, Playwright component tests) reuse `setupServer`/`setupWorker` เดียวกัน ผ่าน entry ของ tool นั้น

### Auth และ State Simulation

- auth flows: handler `/api/auth/login` return token + set header ที่ client คาด — อย่า hard-code cookie ใน test code
- stateful mocks (cart, draft): เก็บ in-memory state ใน module ของ handler + export `resetMockState()` ให้ test เรียก — หลีกเลี่ยง stateful mock ถ้าไม่จำเป็น

## Do / Don't

| Do | Don't |
|---|---|
| `VITE_MSW=1` opt-in flag | enable mock โดย default ทุก `bun run dev` |
| `server.listen({ onUnhandledRequest: 'error' })` ใน tests | `bypass` ใน tests — request หลุดไป network จริงโดยเงียบ |
| commit `mockServiceWorker.js` | gitignore มัน — ทีมจะ version mismatch กัน |
| `resetHandlers` ใน `afterEach` | reset ใน `beforeEach` อย่างเดียว — test ที่ override ตอนท้ายจะค้าง |
| reuse handlers เดียว dev+test | fork handler sets — drift กันแน่ |

## Common Pitfalls

- `worker.start()` ไม่ await ก่อน render → first-page requests ผ่าน network จริง — symptom: data จริงปะปน mock
- `mockServiceWorker.js` version เก่ากว่า `msw` package → worker update warning/พฤติกรรมแปลก; regenerate หลัง upgrade
- Node server ไม่ close → process ค้าง; ใส่ `afterAll(server.close)` เสมอ
- service worker scope: worker อยู่ `public/` root ควบคุมทั้ง origin — sub-path deploy ต้องตั้ง `serviceWorker.url` ให้ตรง
- parallel test runners + `server.use` race → state แชร์ข้าม test files ใน process เดียว; เก็บ override ใน test scope เดียว

## Performance Notes

- `onUnhandledRequest: 'warn'` เพิ่ม console noise เล็กน้อย — คุ้มใน dev, ปิดได้ใน production-like preview
- Node server startup ถูก (~ms) — อย่า lazy-init ต่อ test; setup file ครั้งเดียวพอ
- ปิด MSW ใน test files ที่ไม่ต้องใช้ด้วย `server.close()` เฉพาะ suite ถ้า suite หนัก — แต่ปกติไม่จำเป็น
