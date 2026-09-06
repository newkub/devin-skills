---
name: optimize-workspace
description: Optimize monorepo task graph — affected-only runs, remote cache และ pipeline tuning
argument-hint: "[task-or-workspace]"
related:
  - check-monorepo-boundaries
  - optimize-build
  - optimize-ci
  - follow-tool-moonrepo
  - follow-tool-turborepo
  - follow-monorepo
  - report-before-after
---

## Goal

ลดเวลาและต้นทุนของ monorepo workflows — ให้ tasks รันเฉพาะ packages ที่ได้รับผล, cache ถูก reuse ข้ามเครื่อง/CI และ pipeline graph ไม่ทำงานซ้ำ

## Scope

- ตรวจ monorepo task runners: Turborepo, moonrepo, Nx, pnpm/bun workspaces scripts
- ครอบคลุม: task graph correctness, `dependsOn`/`inputs`/`outputs` declarations, local+remote cache, affected filtering, CI integration
- Action-oriented: แก้ config จริง — วัด pipeline time ก่อน-หลัง

## Execute

### 1. Measure Current Pipeline

> Goal: วัดเวลา task runs ปัจจุบัน

1. รัน pipeline หลัก (`build`, `test`, `lint`, `typecheck`) จับเวลา cold + warm
2. ดู task graph: จำนวน tasks, parallelism, critical path (`turbo run --graph`, `moon query`)
3. flag: tasks ที่รันทุก package ทั้งที่ affected น้อย

### 2. Audit Task Config

> Goal: ตรวจ correctness ของ task declarations

1. **Inputs/outputs ครบไหม**: cache keys ขาด inputs → stale cache; outputs ผิด → cache miss ตลอด
2. **DependsOn ถูกไหม**: build ต้องรอ deps' build, test ต้องรอ codegen ฯลฯ
3. **Global deps**: env files, lockfile changes ควร invalidate ที่เกี่ยว ไม่ใช่ทั้ง repo
4. flag: `cache: false` ที่ไม่จำเป็น, tasks ที่ไม่ deterministic แต่ถูก cache

### 3. Apply Optimizations

> Goal: แก้ config ตาม findings

1. **Affected filtering**: `--filter=[origin/main]`, `moon run :build --affected` — รันเฉพาะที่เปลี่ยน
2. **Fix declarations**: เติม inputs/outputs/dependsOn ให้ครบ — cache hit ขึ้น
3. **Remote cache**: เปิด remote caching (Turborepo remote, moonbase, Nx Cloud หรือ self-hosted)
4. **Parallelism**: ปรับ concurrency ตามเครื่อง/CI runners
5. **Split heavy tasks**: แยก slow tasks เป็น parallel units (per-package tests)

### 4. Integrate CI

> Goal: ให้ CI ใช้ affected + cache

1. CI ต้อง fetch base ref สำหรับ affected computation (`fetch-depth: 0` หรือ merge-base)
2. Wire remote cache secrets/config ใน workflows — ทำ `/optimize-ci` ร่วม
3. Path filters ให้สอดคล้องกับ task graph

### 5. Verify

> Goal: ยืนยันเร็วขึ้นและถูกต้อง

1. Cold run vs warm run vs affected run — ตัวเลขแต่ละแบบ
2. เปลี่ยน 1 package → ยืนยันเฉพาะ dependents ที่รัน
3. `/report-before-after` แสดง pipeline time delta

## Rules

### 1. Correctness First

- affected/caching ที่ผิด = builds ที่ขาด — declarations ต้องถูกก่อน optimize ความเร็ว
- deterministic tasks เท่านั้นที่ cache ได้

### 2. Measure First

- มี baseline ต่อ pipeline — รายงานตัวเลขจริง
- แยก cold/warm/affected ในรายงาน

### 3. Tooling Native

- ใช้ features ของ runner ที่ project ใช้ — ไม่สร้าง orchestration เอง
- ถ้า project ไม่มี task runner → เสนอ adopt ผ่าน `/ask-me` ก่อน

## Expected Outcome

- Pipeline เร็วขึ้นจาก affected filtering + cache hits
- Task declarations ถูกต้อง — cache ไม่ stale/miss ผิด
- CI integration ใช้ affected + remote cache ครบ
