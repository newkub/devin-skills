# ioredis — Data Access และ Performance

## Recommended Patterns

### Pipelining และ Transactions

- batch commands ด้วย `redis.pipeline()` — ส่งหลาย commands ใน round-trip เดียว ลด latency มาก
- `redis.multi()` สำหรับ transaction (atomic EXEC) — ใช้เมื่อ commands ต้อง all-or-nothing
- pipeline + multi ต่างกัน: pipeline = batch (ไม่ atomic), multi = transaction (atomic, WATCH support)
- pipeline ขนาดใหญ่แยกเป็น chunks (~hundreds per batch) — pipeline หมื่น commands กิน memory สองฝั่ง

### Key Patterns

- `SCAN` แทน `KEYS` — `KEYS *` block server บน keyspace ใหญ่; `scanStream()` iterate เป็น stream
- `keyPrefix` option ตั้ง prefix อัตโนมัติทุก command — ระวังเมื่อใช้กับ Cluster (hash tag constraints) และเมื่ออ่าน key ที่เขียนด้วย client อื่น
- expire keys เสมอสำหรับ cache — `SET key val EX 300` หรือ `EXPIRE` ทีหลัง — memory leak จาก keys ไม่มี TTL เป็นเรื่องจริง
- ใช้ `SET key val NX EX` สำหรับ distributed lock — atomic check-and-set

### Atomic Operations

- ใช้ Lua script ผ่าน `redis.eval`/`defineCommand` เมื่อต้อง atomic read-modify-write ที่ multi ทำไม่ได้
- `defineCommand` register script เป็น method — reuse ง่ายกว่า eval ดิบ
- prefer `EVALSHA` semantics ผ่าน `defineCommand` — script cached ฝั่ง server

### Monitoring

- `INFO` ดู memory/clients/hit ratio — `used_memory`, `connected_clients`, `keyspace_hits/misses`
- `SLOWLOG` หา commands ช้า — O(N) commands บน collection ใหญ่มักอยู่ในนี้
- `MONITOR` เฉพาะ debug — log ทุก command แพงมากบน production

## Do / Don't

| Do | Don't |
|---|---|
| `pipeline()` สำหรับ batch reads/writes | `await` ทีละ command ใน loop |
| `multi()` เมื่อต้อง atomicity | ใช้ pipeline แล้วคาดหวัง atomic |
| `SCAN`/`scanStream` iterate keyspace | `KEYS *` บน production |
| ตั้ง TTL ทุก cache key | ปล่อย keys ไม่มี expire จน memory เต็ม |
| Lua script สำหรับ read-modify-write | GET → modify → SET แยก (race condition) |
| chunk pipeline ใหญ่ | pipeline หมื่น commands batch เดียว |

## Common Pitfalls

- `KEYS` หรือ `SMEMBERS` บน collection ใหญ่ → block event loop ฝั่ง Redis
- pipeline ไม่มี `.exec()` → commands ไม่ส่ง
- `multi().exec()` return array of `[err, result]` — ต้องเช็ค errors เอง promise ไม่ reject รวม
- `keyPrefix` + Cluster → CROSSSLOT errors ถ้า prefix ไม่มี hash tag `{...}`
- GET→SET แยกสำหรับ counter → race condition; ใช้ `INCR` หรือ Lua

## Performance Notes

- pipeline ลด RTT — 100 commands: ~100 RTT → 1 RTT (win ใหญ่บน remote Redis)
- `multi` มี overhead กว่า pipeline เล็กน้อย (EXEC wrapping) — ใช้เฉพาะเมื่อต้อง atomic
- hash (`HSET`) ประหยัด memory กว่า flat keys เมื่อเก็บ object fields จำนวนมาก
- large values (>100KB) ควร compress หรือเก็บที่ object storage — Redis เป็น memory store

## Ecosystem / Integration

- BullMQ ต้อง `maxRetriesPerRequest: null` + `enableReadyCheck: false` บน client ที่แชร์
- cache-aside pattern: GET → miss → DB → SET EX — standard ไม่ต้อง lib เพิ่ม
- สำหรับ edge runtimes ที่ไม่มี TCP → REST-based client (Upstash) แทน
- v6 RESP3 default — `replyStyle: 'resp3'` เมื่อต้องการ RESP3 reply shapes, `protocol: 2` ถ้า stack เดิมต้อง RESP2
