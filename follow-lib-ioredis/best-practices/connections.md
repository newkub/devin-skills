# ioredis — Connection Management

## Recommended Patterns

### Client Lifecycle

- สร้าง client เดียว share ทั้ง app (singleton) — `new Redis(url)` หรือ `new Redis({host, port, ...})`
- reuse connection ไม่ต้องเปิด/ปิดต่อ request — TCP handshake + AUTH แพง
- credentials จาก `REDIS_URL`/env เสมอ — ห้าม hardcode (ดู `/follow-secret-manager`)
- graceful shutdown: `await redis.quit()` ให้ pending commands เสร็จ — `redis.disconnect()` เฉพาะเมื่อต้องตัดทิ้งทันที

### Reconnect Strategy

- `retryStrategy(times)` คืน delay ms (หรือ `null` หยุด retry) — ใช้ exponential backoff: `Math.min(times * 200, 2000)`
- `maxRetriesPerRequest` จำกัด retry ต่อ command — default รองรับทั่วไป; BullMQ ต้อง `null`
- `lazyConnect: true` เมื่ออยาก defer connection จน command แรก — เหมาะกับ serverless ที่ import แต่อาจไม่ได้ใช้
- `enableOfflineQueue` — default `true` queue commands ระหว่าง reconnect; ตั้ง `false` เมื่ออยาก fail fast

### Ready vs Connect Events

- `connect` = TCP พร้อม, `ready` = client พร้อมใช้งานจริง (AUTH/select db เสร็จ)
- ส่ง commands จาก `ready` listener ไม่ใช่ `connect` — โดยเฉพาะเมื่อ `enableOfflineQueue: false` (commands ใน connect listener อาจ reject)
- ใน v6 RESP3 mode subscriber connection รัน regular commands ได้ขณะ subscribe — แต่แยก connection ยังเป็น pattern ที่ชัดเจนกว่า

### Pub/Sub Isolation

- แยก subscriber connection ออกจาก command client — RESP2 subscriber mode บล็อก commands อื่นทั้งหมด
- publisher ใช้ client ปกติได้ — publish ไม่ต้อง dedicated connection
- `psubscribe` สำหรับ pattern-based channels — เช็ค event `pmessage` แยกจาก `message`

### Cluster และ Sentinel

- `new Redis.Cluster([{host, port}, ...], {redisOptions: {...}})` — per-node options ใส่ใน `redisOptions` ใน v6
- `clusterRetryStrategy` ควบคุม slot refresh/retry ระหว่าง topology change
- Sentinel: `new Redis({sentinels: [...], name: 'mymaster'})` — ตั้ง `sentinelPassword` แยกจาก `password` ถ้าต่างกัน
- MOVED/ASK redirects จัดการอัตโนมัติ — ไม่ต้อง handle เอง

## Do / Don't

| Do | Don't |
|---|---|
| share client instance เดียวทั้ง app | `new Redis()` ทุก request |
| `await redis.quit()` ตอน shutdown | `disconnect()` ตัดทิ้ง pending commands |
| ส่ง commands จาก `ready` listener | ส่งจาก `connect` เมื่อ offline queue ปิด |
| แยก subscriber connection | share subscriber กับ command client (RESP2) |
| ตั้ง `maxRetriesPerRequest: null` สำหรับ BullMQ | ใช้ default กับ BullMQ แล้ว job หาย |
| TLS เมื่อผ่าน network สาธารณะ | เปิด Redis port บน public internet โดยไม่ TLS |

## Common Pitfalls

- `new Redis()` ใน request handler → connection leak, Redis `maxclients` เต็ม
- ลืม `quit()` ตอน shutdown → pending commands หายหรือ process hang
- BullMQ `maxRetriesPerRequest` default → blocking commands fail หลัง retry limit
- assume `connect` event พร้อมส่ง commands → command reject ก่อน AUTH เสร็จ
- Cluster `redisOptions` ใส่ผิด level (top-level แทน nested) → options ไม่ถูก apply

## Performance Notes

- connection reuse = latency win หลัก — handshake + AUTH มีต้นทุน
- `retryStrategy` ที่ aggressive (retry เร็วเกิน) กด server ตอนมันล่ม — backoff + jitter
- offline queue กิน memory เมื่อ reconnect นาน — `enableOfflineQueue: false` สำหรับ fail-fast services

## Ecosystem / Integration

- บน Cloudflare Workers/edge runtimes ไม่มี TCP → ใช้ REST client (Upstash) แทน
- TLS option `{tls: {}}` หรือ `rediss://` URL — managed Redis (ElastiCache, Upstash) บังคับ TLS
- v6 default RESP3 (`HELLO 3` + auto-fallback RESP2) — `protocol: 2` คง v5 wire behavior
