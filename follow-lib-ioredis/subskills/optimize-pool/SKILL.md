---
name: follow-lib-ioredis-optimize-pool
description: optimize ioredis — pipelining, connection reuse, retry/offline queue tuning
argument-hint: "[command-or-scope]"
related:
  - follow-lib-ioredis
  - check-bottlenecks
  - run-bench
  - scan-codebase
  - report-before-after
---

## Goal

ลด latency และ connection churn ของ ioredis — pipelining, connection reuse, retry/offline queue options — โดยวัดผลก่อนและหลัง ไม่เปลี่ยน output

## Scope

- ใช้เมื่อ Redis commands ช้าจาก round-trips, reconnect storms หรือ connection ถูกสร้างซ้ำ
- ครอบคลุม: `pipeline()`/`multi()`, connection reuse patterns, `retryStrategy`, `enableOfflineQueue`, `maxRetriesPerRequest`
- ถ้ายังไม่มี client → ทำ `subskills/setup-ioredis/SKILL.md` ก่อน

## Execute

### 1. Baseline

> Goal: ระบุ bottleneck จริงด้วยตัวเลข

1. ทำ `/run-bench` หรือจับเวลา command paths ที่ช้า — commands/sec, latency, RTT count
2. ทำ `/scan-codebase` หา: sequential `await` commands ใน loop, `new Redis()` ที่สร้างซ้ำต่อ request/function
3. ดู `MONITOR` หรือ `SLOWLOG` ฝั่ง Redis ถ้าเข้าถึงได้ — แยกช้าจาก RTT vs command เอง
4. ทำ `/check-bottlenecks` ถ้าต้อง wider analysis

### 2. Pipelining

> Goal: รวม commands ลด round-trips

1. Batch reads/writes อิสระกัน → `redis.pipeline()` แล้ว `exec()` — ลด RTT จาก N เป็น 1
2. ต้อง atomicity → `redis.multi()` (transaction) แทน pipeline
3. บน Cluster: pipeline commands ต้อง slot-compatible — group by key slot หรือใช้ hash tags
4. เช็ค result array จาก `exec()` — แต่ละ entry เป็น `[err, result]` ต้องตรวจ error ต่อ command

### 3. Connection Reuse

> Goal: ลด connection churn และเลือก topology ที่ถูก

1. Client instance เดียวต่อ process ต่อ role — ห้าม `new Redis()` ต่อ request; cache instance ที่ module level
2. แยก connections: command client / subscriber / publisher — subscriber (RESP2) บล็อก commands อื่น
3. `lazyConnect` สำหรับ clients ที่ใช้บางเส้นทาง — เลี่ยง connect เปล่าตอน startup
4. ถ้า hot path ต้อง minimal latency → พิจารณา dedicated connection แทน share กับ bulk work

### 4. Tune Retry And Queue

> Goal: reconnect behavior ไม่ amplify failures

1. `retryStrategy(times)` — backoff แบบ bounded (เช่น `Math.min(times * 50, 2000)`); `null` = หยุด retry
2. `maxRetriesPerRequest` — default จำกัด retries ต่อ command; `null` สำหรับ BullMQ blocking commands
3. `enableOfflineQueue: false` เมื่อต้อง fail fast แทนคิวค้าง (v6: ส่ง commands จาก `ready` listener)
4. `commandTimeout` เพื่อกัน commands hang — ค่าตาม SLO ของ path นั้น

### 5. Measure Again

> Goal: compare กับ baseline

1. วัดซ้ำ workload เดิม — RTT count, latency, commands/sec
2. ถ้าไม่ดีขึ้นหรือ regression → revert จุดนั้นแล้ว report
3. ผ่าน → `/report-before-after` พร้อมตัวเลข แล้ว `/suggest-next-action`

## Rules

- Baseline ก่อนเสมอ — ห้าม optimize โดยไม่มีตัวเลข
- แก้ทีละจุดเรียง impact — pipelining (RTT) มักใหญ่กว่า micro options
- ห้าม share subscriber connection กับ command client
- Preserve behavior — pipeline ต้องเช็ค per-command errors, multi ต้อง atomic จริง
- ถ้า option ไม่แน่ใจ → ดู official docs

## Expected Outcome

- Round-trips ลดลงผ่าน pipelining — ตัวเลขดีกว่า baseline
- Connection reuse ถูกต้อง — ไม่มี per-request connections
- Retry/queue behavior เหมาะ use case — ไม่ amplify outages
