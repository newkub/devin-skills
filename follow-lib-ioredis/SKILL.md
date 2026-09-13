---
name: follow-lib-ioredis
description: ใช้ ioredis สำหรับ Redis client — connection, pipeline, pub/sub, cluster, Sentinel
argument-hint: "[target-or-scope]"
related:
  - follow-secret-manager
  - run-verify
  - run-test
---

## Goal

ใช้ ioredis สำหรับ Redis client — connection, pipeline, pub/sub, cluster, Sentinel

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ ioredis — Redis client บน Node.js/Bun ที่เชื่อมผ่าน TCP (lib ioredis)

- บน Cloudflare Workers หรือ edge runtimes ที่ไม่มี TCP sockets → ใช้ REST-based client (เช่น Upstash) แทน — skill นี้ไม่ครอบคลุม
- Credentials/`REDIS_URL` จัดการผ่าน `/follow-secret-manager` — ห้าม hardcode
- First-time setup → `subskills/setup-ioredis/SKILL.md`; perf tuning → `subskills/optimize-pool/SKILL.md`

- Latest: `ioredis@6.0.0` (verified 2026-09-13) — v6 major (2026-07-31): ต้อง Node ≥20, ใช้ RESP3 โดย default (`HELLO 3` พร้อม auto-fallback เป็น RESP2 เมื่อ server ไม่รองรับ); ตั้ง `protocol: 2` เพื่อคง v5 wire protocol และ `replyStyle: "resp3"` เพื่อรับ RESP3 reply shapes (default `"legacy"` คงรูปแบบเดิม)
- References: [apis](references/apis.md) | [package-manifest](references/package-manifest.md) | [routes](references/routes.md) | [website](references/website.md)

## Execute

### Subskills

| Topic | Subskill |
|-------|----------|
| Setup | `subskills/setup-ioredis/SKILL.md` — install, cluster/sentinel options |
| Optimize | `subskills/optimize-pool/SKILL.md` — pipelining, connection reuse |

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. สร้าง client ด้วย `new Redis(url)` หรือ `Redis.Cluster` สำหรับ cluster — ใน v6 ใส่ per-node options ของ Cluster ใต้ `redisOptions`
1. ใช้ `pipeline()`/`multi()` สำหรับ batch commands
1. ใช้ separate connections สำหรับ pub/sub (RESP2 subscriber mode บล็อก commands อื่น; ใน v6 RESP3 connection รัน regular commands ขณะ subscribe ได้)
1. จัดการ reconnect strategy ด้วย `retryStrategy` และ `lazyConnect` ตาม use case
1. ใน v6 เมื่อ `enableOfflineQueue: false` ให้ส่ง commands (รวม `subscribe()`) จาก `ready` listener แทน `connect` เพราะอาจ reject ก่อน client พร้อม

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (lib ioredis)

## Rules

- ไม่ share subscriber connection กับ command client
- ตั้ง `maxRetriesPerRequest` ให้เหมาะสม (null สำหรับ BullMQ)
- ใช้ TLS option เมื่อ connect ผ่าน network สาธารณะ
- บน Cloudflare Workers ใช้ REST/Upstash แทน (ioredis ต้อง TCP)

- ใช้ `/follow-secret-manager` ถ้าต้องจัดการ credentials
- ใช้ `/run-verify` ถ้าจำเป็น
- ใช้ `/run-test` ถ้าจำเป็น

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (lib ioredis)
- ไม่มี security/performance pitfalls ที่รู้จัก (lib ioredis)
- Lint, typecheck, tests ผ่าน
