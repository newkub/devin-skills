---
name: scan-concurrency
description: Scan concurrency — main-thread blocking, worker offload, parallelism in hot paths
---

# Scan Concurrency

## Goal

งานหนักไม่ block main/UI thread — independent work ขนานกัน, CPU work offload ได้

## Checks

1. Main-thread CPU work — parse/transform/compress/encrypt/hash ขนาดใหญ่ที่รันตรง UI thread (ควร Worker/`spawn_blocking`)
2. Sequential independent awaits — fetches, IPC calls, file reads ที่ `Promise.all`/`join` ได้ (นอก startup — hot paths, batch handlers, loaders)
3. Blocking I/O ใน async context — `fs.readFileSync`, sync DB calls, blocking locks ใน event loop/Tokio task
4. Lock contention — mutex ที่ถือข้าม `.await`, single lock รวมทุก state, lock ใน hot loops
5. Queue/backpressure — unbounded task spawn, channels ไม่มี capacity limit, work queue ที่โตตอน burst
6. Redundant concurrent work — หลาย tasks ทำงานเดียวกัน (dedup/join in-flight), retry storms ไม่มี jitter
7. Thread pool sizing — `spawn_blocking` ที่ overflow pool, sync tasks บน async executor
8. Race-driven rework — abort/cancel ที่ไม่ propagate ทำให้ทำงานเสร็จแล้วทิ้ง

## Severity

- Critical: CPU work > 100ms บน main thread ต่อ interaction — INP/jank ตรงๆ
- High: blocking I/O ใน async handler บน hot path, lock ข้าม await
- Medium: sequential awaits ที่ parallelize ได้, unbounded spawn
- Low: pool tuning, dedup in-flight calls
