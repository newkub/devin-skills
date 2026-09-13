---
name: follow-lib-ioredis-setup-ioredis
description: ติดตั้ง ioredis และตั้งค่า client — standalone, cluster, sentinel options
argument-hint: "[mode-or-url]"
related:
  - follow-lib-ioredis
  - follow-secret-manager
  - learn
  - resolve-errors
---

## Goal

ติดตั้ง `ioredis` และสร้าง Redis client — standalone, Cluster หรือ Sentinel — ให้ connect และ command ได้จริง — first-time setup เท่านั้น

## Scope

- ใช้เมื่อ project ยังไม่มี ioredis (ถ้ามีอยู่แล้ว → verify เท่านั้น)
- ครอบคลุม: install, `new Redis()`, `Redis.Cluster`, Sentinel options, retry strategy
- ไม่ครอบคลุม perf tuning — ทำ `subskills/optimize-pool/SKILL.md` แทน

## Execute

### 1. Check Precondition

> Goal: ตรวจสอบ environment ก่อน setup

1. อ่าน `package.json` — ถ้ามี `ioredis` แล้ว → skip ไป verify; ตรวจ version (v6 ต้อง Node ≥20, RESP3 default)
2. ระบุ Redis topology: standalone, Sentinel หรือ Cluster — ถ้าไม่รู้ → ถาม user หรือดู infra config
3. ตรวจ `REDIS_URL`/credentials — ถ้าขาด → stop แจ้ง user; เก็บผ่าน `/follow-secret-manager`
4. ตรวจ runtime — ioredis ต้อง TCP; บน Cloudflare Workers ใช้ REST/Upstash แทน

### 2. Install

> Goal: ติดตั้ง ioredis เป็น runtime dependency

1. รัน `bun add ioredis` (หรือ package manager ตาม lockfile)
2. ยืนยัน `ioredis` อยู่ใน `dependencies`

### 3. Create Client

> Goal: client ที่ตรง topology

1. Standalone: `new Redis(process.env.REDIS_URL)` หรือ `new Redis({ host, port, password })`
2. Cluster: `new Redis.Cluster([{ host, port }], { redisOptions: {...} })` — v6 ใส่ per-node options ใต้ `redisOptions`
3. Sentinel: `new Redis({ sentinels: [{ host, port }], name: "<master-name>" })` — ดู official docs สำหรับ options เพิ่ม
4. ตั้ง `retryStrategy` ให้เหมาะ use case; `lazyConnect: true` ถ้าต้อง defer connect
5. TLS (`tls: {}`) เมื่อ connect ผ่าน network สาธารณะ
6. Export client instance เดียว — pub/sub ต้อง separate connection (RESP2 subscriber บล็อก commands อื่น)

### 4. Basic Usage

> Goal: commands พื้นฐานทำงาน

1. `get`/`set`/`del`/`expire` ฯลฯ เป็น promise-based — `await redis.set("k", "v")`
2. `pipeline()`/`multi()` สำหรับ batch (รายละเอียดใน `optimize-pool`)
3. ตั้ง `maxRetriesPerRequest` ให้เหมาะสม — `null` ถ้าใช้กับ BullMQ
4. v6 + `enableOfflineQueue: false` → ส่ง commands จาก `ready` listener ไม่ใช่ `connect`

### 5. Verify

> Goal: smoke command ผ่านจริง

1. `await redis.set("smoke", "1")` แล้ว `get` กลับ — ค่าตรง
2. ตรวจ `redis.status` เป็น `ready`; ถ้า cluster ตรวจว่า discover nodes ครบ
3. รัน lint/typecheck — ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report; ผ่าน → `/suggest-next-action`

## Rules

- Idempotent — ถ้า setup ไปแล้วให้ verify เท่านั้น ห้ามสร้าง client ซ้ำ
- Credentials/URL จาก env เสมอ — ห้าม hardcode
- Client instance เดียวต่อ role (command, subscriber, publisher แยก connection)
- ถ้า topology/option ไม่แน่ใจ → ทำ `/learn web` ดู official docs (github.com/redis/ioredis)

## Expected Outcome

- `ioredis` ติดตั้ง, client ตรง topology (standalone/cluster/sentinel)
- Smoke command ผ่าน, status `ready`
- พร้อมทำ `subskills/optimize-pool/SKILL.md` ถ้าต้อง perf tuning
