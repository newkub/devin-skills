# Fix Guide — I/O And Persistence

## Goal

ลด serialization + write cost — debounce, batch, cache, narrow queries

## Scope

ใช้กับ persist middleware, auto-save, storage layers, DB/file access — frontend และ native sides

## Execute

### 1. Debounce And Batch Writes

> Goal: write ต่อ flush ไม่ใช่ต่อ mutation

1. persist middleware → debounce/throttle per key (เช่น flush ทุก 500ms-2s หรือตอน idle/blur/hidden)
2. serialize ครั้งเดียวต่อ flush — ไม่ใช่ `JSON.stringify` ต่อ mutation
3. coalesce rapid changes — pending value ตัวเดียว write ล่าสุดแทน queue ทุก mutation
4. flush-on-exit paths — `beforeunload`, `visibilitychange` → hidden, app quit — ข้อมูลไม่หาย

### 2. Cache And Narrow Reads

> Goal: ไม่ re-read ค่าเดิม

1. static config/schema/ports → cached promise/value ครั้งเดียวต่อ session
2. file reads → cache + mtime/version check แทน re-read ทุก call
3. IPC payloads → ส่ง id/delta แทน full object เมื่อ receiver มีของอยู่แล้ว

### 3. Fix Query Patterns

> Goal: queries เฉพาะที่ต้อง batch ตามที่ทำได้

1. N+1 → single query ด้วย `IN (...)`, join, หรือ batch loader
2. `SELECT *` → เฉพาะ columns ที่ใช้ — ลด serialization + memory
3. sequential queries ที่ independent → `Promise.all`/parallel
4. writes หลาย rows → transaction เดียว (bulk insert/upsert)
5. hot queries → เช็ค index ครอบคลุม (`EXPLAIN`/`EXPLAIN QUERY PLAN`)

### 4. Move I/O Off Main Thread

> Goal: disk work ไม่ block UI/IPC thread

1. sync `fs`/`DB` calls ใน async handler → `spawn_blocking`, worker, หรือ async API
2. large serialize/parse → worker เมื่อขนาด > ~1MB และอยู่บน UI thread
3. file enumeration → incremental (watch + diff) แทน full rescan ต่อ poll

### 5. Verify

> Goal: write frequency + bytes ลด, durability เหมือนเดิม

1. นับ writes/serialize calls ต่อ interaction — ลดตาม interval ที่ตั้งไว้
2. crash/kill ระหว่าง pending write → ข้อมูลล่าสุดที่ flush แล้วยังอยู่ (acceptable loss window ชัดเจน)
3. queries คืนผลเดิม — tests ผ่าน
4. typecheck + tests + build ผ่าน

## Rules

- debounce window ต้อง balance freshness vs write cost — ระบุ loss window ใน comment
- flush-on-exit ครบทุก path — ข้อมูลหายตอน quit = regression ใหญ่
- cache invalidation ต้องชัด — mtime/version/event-driven ไม่ใช่ TTL เดา
- transactions preserve atomicity เดิม — ห้าม batch ข้าม boundary ที่ต้อง atomic
- ใช้ /loop-until-complete ถ้า verify ต้อง iterate

## Expected Outcome

- storage writes ลดจาก per-mutation เป็น per-flush — jank ระหว่างพิมพ์/drag หาย
- queries เฉพาะที่ต้อง ไม่มี N+1 บน hot path
- I/O ไม่ block UI/IPC thread
