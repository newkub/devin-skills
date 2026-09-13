---
name: follow-tool-turborepo-optimize-cache
description: ปรับ Turborepo cache, remote cache, filtering และ affected runs ให้เร็วขึ้น
argument-hint: "[scope]"
related:
  - follow-monorepo
  - run-build
  - check-bottlenecks
---

## Goal

เพิ่ม cache hit rate และลดเวลา `turbo run` — local/remote cache tuning, task filtering และ `--affected` โดยวัดผลก่อนและหลัง

## Scope

ใช้เมื่อ monorepo ที่ใช้ Turborepo ช้าหรือ cache miss บ่อย — ไม่ครอบคลุม first-time setup หรือ task definitions (ดู `subskills/setup-turborepo/SKILL.md` และ `subskills/config-pipeline/SKILL.md`)

## Execute

### 1. Baseline

> Goal: เก็บตัวเลขเดิมก่อน optimize

1. รัน `bunx turbo run build` แบบ cold (`turbo run build --force` เพื่อ bypass cache) และจับเวลา
2. รัน warm run ซ้ำ — บันทึก cache hit rate จาก output (`FULL TURBO` / cache miss tasks)
3. รัน `bunx turbo run build --dry=json` เพื่อดู task graph และ hash inputs ที่ affect cache

### 2. Fix Cache Misses

> Goal: ลด cache miss จาก config ที่ไม่แม่น

1. ตรวจ `inputs` — ถ้ากว้างเกิน (เช่น default รวม lockfile ทุก package) → จำกัดเฉพาะ source globs ที่ affect output
2. ตรวจ `env` — env vars ที่เปลี่ยนบ่อย (timestamps, CI run ids) เข้า hash ทำให้ miss เสมอ → ย้ายไป `passThroughEnv`
3. ตรวจว่า tasks ที่ deterministic ทั้งหมดมี `cache: true` (default)
4. ทีละจุด — แก้ทีละ key แล้ววัดซ้ำ ห้ามแก้หลายจุดพร้อมกัน

### 3. Remote Cache

> Goal: ตั้งค่า remote cache สำหรับ team/CI

1. ตั้งค่า remote cache ด้วย `bunx turbo link` (Vercel) หรือ self-hosted remote cache ตาม official docs
2. ใช้ `TURBO_TOKEN` และ `TURBO_TEAM` สำหรับ authentication — เก็บเป็น secrets ผ่าน `/follow-secret-manager` ห้าม commit
3. ใน CI ให้ pass env vars เหล่านั้น — verify ด้วย cache hit ข้ามเครื่อง/CI runs
4. พิจารณา `cacheMaxSize`/`cacheMaxAge` ถ้า local cache โตเกิน

### 4. Filtering And Affected

> Goal: รันเฉพาะสิ่งที่จำเป็น

1. ใช้ `--filter=<package>` รันเฉพาะ package และ dependents (`...` suffix) หรือ dependencies (`...` prefix)
2. ใช้ `--affected` ใน CI เพื่อรันเฉพาะ packages ที่เปลี่ยนเทียบ base ref
3. ใช้ `--dry=json` ตรวจว่า filter เลือก packages ถูกก่อนรัน

### 5. Compare And Report

> Goal: วัดผลหลังแก้เทียบ baseline

1. รัน cold + warm runs ซ้ำ — compare เวลาและ hit rate กับ step 1
2. ถ้าไม่ดีขึ้นหรือ regression → revert จุดนั้นแล้ว report
3. ผ่าน → `/report-before-after` ด้วยตัวเลขจริง

## Rules

### 1. Evidence-Based

- baseline ก่อนเสมอ — ห้าม optimize โดยไม่มีตัวเลขเดิม
- แก้ทีละจุดเรียง impact มาก → น้อย (inputs/env ก่อน micro-tuning)

### 2. Cache Correctness

- preserve behavior — optimize ≠ เปลี่ยน build output
- ไม่เพิ่ม cache hit ด้วยการตัด `inputs` ที่ affect output จริง (stale cache = bug)
- ปิด `cache` สำหรับ tasks ที่ไม่ deterministic

### 3. Secrets

- `TURBO_TOKEN`/`TURBO_TEAM` ผ่าน env/secrets manager เท่านั้น

- ใช้ /check-bottlenecks ถ้าจำเป็น
- ใช้ /follow-monorepo ถ้าจำเป็น
- ใช้ /run-build ถ้าจำเป็น

## Expected Outcome

- Cache hit rate ดีขึ้นวัดได้จากก่อน/หลัง
- Remote cache ทำงานข้าม local และ CI
- `--filter`/`--affected` ใช้ใน CI ลดงานที่ไม่จำเป็น
