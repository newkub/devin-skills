# Fix Guide — Concurrency

## Goal

งานหนักออกจาก main thread — independent work ขนาน, locks แคบ, queues bounded

## Scope

ใช้กับ CPU-heavy work บน UI/IPC thread, sequential awaits, blocking I/O ใน async context, lock contention — frontend และ native

## Execute

### 1. Offload CPU Work

> Goal: main thread ไม่ทำงาน > 50ms ต่อ interaction

1. หา parse/transform/encode/hash/compress ขนาดใหญ่บน UI thread → ย้าย Web Worker (หรือ `spawn_blocking`/async task ฝั่ง native)
2. worker protocol — ส่ง transferable/buffer แทน clone ใหญ่; reuse worker แทน spawn ต่อ task
3. รักษา progress/cancel — worker ต้องรับ abort เพื่อไม่ทำงานเสร็จแล้วทิ้ง
4. งานที่ต้อง DOM/state ห้าม offload — เลือกเฉพาะ pure compute

### 2. Parallelize Independent Work

> Goal: hot paths ไม่รอ sequential

1. หา `await` chains ที่ independent นอก startup — loaders, batch handlers, fan-out fetches → `Promise.all`/`join_all`
2. คง sequencing ของ calls ที่พึ่งกัน — dependent chain เหมือนเดิม
3. bounded parallelism สำหรับ fan-out ใหญ่ — `p-limit`/`tokio::sync::Semaphore` เมื่อ N ใหญ่
4. dedup in-flight — concurrent callers ของ work เดียวกัน share promise เดียว

### 3. Fix Blocking And Locks

> Goal: ไม่มี sync I/O ใน async path — locks ถือสั้นสุด

1. sync `fs`/DB/subprocess ใน async handler → async API หรือ `spawn_blocking`
2. locks ข้าม `.await` → เก็บ data ออกมาแล้วปล่อย lock ก่อน await (clone/extract → drop guard → await)
3. coarse lock → per-key/sharded locks เมื่อ contention วัดได้ — ห้าม split เพราะเดา
4. read-heavy state → `RwLock`/atomic แทน Mutex เมื่อ reads >> writes

### 4. Bound Queues And Retries

> Goal: burst ไม่ทำ memory/CPU พุ่ง

1. unbounded `spawn`/channel → capacity limit + backpressure strategy (drop policy ชัดเจน)
2. retries → exponential backoff + jitter + max attempts — ห้าม retry storms
3. abort propagation — cancel tokens ส่งลงทุก dependent task

### 5. Verify

> Goal: main thread ว่าง, throughput ดีขึ้น, ไม่มี race ใหม่

1. long-task profile หลังแก้ — main thread blocks หาย/ลด
2. race conditions — parallelize แล้ว ordering/state ยังถูก (tests + stress ครั้งเดียว)
3. deadlocks — lock ordering คงเดิม, timeouts ครบ
4. typecheck + tests + build ผ่าน

## Rules

- offload เฉพาะ pure compute — งานที่แตะ DOM/reactive state อยู่บน main thread
- parallelize แล้วต้องเช็ค ordering guarantees เดิม — อย่าทำลาย happens-before ที่ระบบพึ่ง
- lock splits เฉพาะเมื่อ contention วัดได้ — sharding เพราะเดาเพิ่ม complexity ฟรีๆ
- bounded queues ต้องมี drop/backpressure policy เป็น explicit choice
- ใช้ /loop-until-complete ถ้า verify ต้อง iterate

## Expected Outcome

- ไม่มี CPU work หนักบน main thread — INP/jank ลด
- independent work ขนาน — latency ต่อ batch ลด
- queues bounded, retries มี backoff — burst ไม่ทำลาย app
