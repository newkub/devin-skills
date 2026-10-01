# LINE LIFF — Init, Auth และ API Boundaries

## Recommended Patterns

### Initialization

- `await liff.init({liffId})` ก่อนใช้ API อื่นทั้งหมด — init เป็น promise, เรียก API ก่อน resolve = error
- เก็บ init ใน async setup หลักของ app — handle failure ด้วย `try/catch` หรือ `.catch` (invalid liffId, endpoint mismatch)
- `withLoginOnExternalBrowser: true` เมื่อต้อง auto-login นอก LINE app — ไม่ต้อง manual `liff.login()`
- `liffId` จาก LINE Developers Console — เก็บใน env/config ไม่ hardcode ถ้าแยกตาม environment

### Environment Detection

- `liff.isInClient()` = เปิดใน LINE app หรือไม่ — behavior ต่างกันมาก
- `liff.isLoggedIn()` เช็ค auth state — นอก LINE app ต้อง `liff.login()` (OAuth redirect)
- `liff.login({redirectUri})` redirect ไป LINE login แล้วกลับมา — redirectUri ต้องตรง endpoint ใน console
- ใน LINE app: user login อัตโนมัติผ่าน LINE session — ไม่ต้อง login flow

### Identity และ Token

- `liff.getProfile()` ได้ displayName/pictureUrl — display only ห้ามเชื่อ identity ฝั่ง client
- `liff.getIDToken()` ส่งไป verify ฝั่ง server ผ่าน LINE verify endpoint — นี่คือ source of truth
- `liff.getContext()` ได้ `type`, `userId`, `chatId`, `groupId` — ใช้ปรับ UX ตาม context (1:1, group, room)
- `liff.getAccessToken()` สำหรับ LINE API calls ฝั่ง client — scope จำกัด

### Feature APIs

- `liff.shareTargetPicker([{...}])` — share message ไปยัง friends/groups, `isMultiple` เลือกหลาย target
- `liff.sendMessages([{...}])` — ส่งเข้า chat ปัจจุบัน (เฉพาะใน LINE app)
- `liff.scanCodeV2()` — QR/barcode scanner (เฉพาะใน LINE app)
- บาง API ใช้ได้เฉพาะ `isInClient()` — เช็คก่อนเสมอ ไม่งั้น throw error บน external browser

## Do / Don't

| Do | Don't |
|---|---|
| `await liff.init()` ก่อน API อื่น | เรียก `liff.getProfile()` ก่อน init resolve |
| verify ID token ฝั่ง server เสมอ | เชื่อ `getProfile()` ฝั่ง client เป็น identity |
| เช็ค `isInClient()` ก่อนใช้ in-app APIs | assume `sendMessages` ทำงานบน external browser |
| handle `liff.init()` rejection | ignore init error แล้ว app hang นิ่ง |
| test ทั้ง in-client และ external browser | test แค่ใน LINE app แล้ว deploy |
| เก็บ `liffId` ใน env/config | hardcode liffId ใน code โดยตรง |

## Common Pitfalls

- `liff.init` ยังไม่ resolve → API calls fail — wrap ใน async init function
- endpoint URL ใน console ไม่ตรงกับ URL ที่ host จริง → init fail หรือ redirect loop
- คิดว่า `isInClient()` = mobile — external browser บนมือถือก็ `false`
- `getProfile()` display อย่างเดียว — attacker ปลอมได้ ต้อง verify `getIDToken()` ฝั่ง server
- `sendMessages`/`scanCodeV2`/`shareTargetPicker` บน external browser → error — ต้อง feature-check ก่อน
- `liff.login()` redirect แล้วกลับมา page reload — state ใน memory หาย ต้อง persist ก่อน redirect

## Performance Notes

- `liff.init` มี network call — แสดง loading state ระหว่าง init
- `getProfile`/`getIDToken`/`getAccessToken` เป็น async — batch หลาย calls พร้อมกันด้วย `Promise.all` เมื่อไม่ depend กัน
- LIFF app size มีผลต่อ load ใน LINE app — bundle optimization สำคัญกว่า web ปกติ
- `liff.getContext()` เป็น sync — ไม่มี cost

## Ecosystem / Integration

- `@line/liff` เป็น browser-only SDK — ใช้ใน SPA/frontend เท่านั้น ไม่ใช่ server-side
- server-side: verify ID token ผ่าน LINE verify endpoint + Messaging API (send push, reply) — นอก scope skill นี้
- LIFF app สร้างใน LINE Developers Console ผูกกับ channel — ได้ `liffId`
- endpoint URL ใน console ต้องตรงกับ deployed URL — SPA ต้องใช้ URL เดียวกัน (หรือ dynamic endpoint ถ้า console รองรับ)
- scope `profile` + `openid` สำหรับ `getProfile` + `getIDToken` — ตั้งใน console
