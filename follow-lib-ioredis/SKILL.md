---
name: follow-lib-ioredis
description: ใช้ ioredis สำหรับ Redis client — connection, pipeline, pub/sub, cluster, Sentinel
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test-unit
---

## Goal

ใช้ ioredis สำหรับ Redis client — connection, pipeline, pub/sub, cluster, Sentinel

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices (lib ioredis)

- Latest: `ioredis@6.0.0` (v6 major — ตรวจ changelog เมื่อ migrate จาก v5) (verified 2026-09-11)

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. สร้าง client ด้วย `new Redis(url)` หรือ `Redis.Cluster` สำหรับ cluster
1. ใช้ `pipeline()`/`multi()` สำหรับ batch commands
1. ใช้ separate connections สำหรับ pub/sub (subscriber mode บล็อก commands อื่น)
1. จัดการ reconnect strategy ด้วย `retryStrategy` และ `lazyConnect` ตาม use case

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test-unit` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (lib ioredis)

## Rules

- ไม่ share subscriber connection กับ command client
- ตั้ง `maxRetriesPerRequest` ให้เหมาะสม (null สำหรับ BullMQ)
- ใช้ TLS option เมื่อ connect ผ่าน network สาธารณะ
- บน Cloudflare Workers ใช้ REST/Upstash แทน (ioredis ต้อง TCP)

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (lib ioredis)
- ไม่มี security/performance pitfalls ที่รู้จัก (lib ioredis)
- Lint, typecheck, tests ผ่าน
