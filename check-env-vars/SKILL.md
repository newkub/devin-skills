---
name: check-env-vars
description: ตรวจ env vars เทียบ .env, .env.example และ code usage หา keys ที่ขาดหรือเกิน
argument-hint: "[path]"
related:
  - follow-secret-manager
  - check-secrets-leak
  - open-web-for-config-secret
  - search-files-patterns
  - report
---

## Goal

ตรวจสอบ environment variables ของ project ให้สอดคล้องกันระหว่าง `.env`, `.env.example`, `.env.*` variants และ code usage — หา keys ที่ขาด, เกิน, หรือถูก hardcode

## Scope

- ใช้เมื่อต้องการ audit env vars ของ project ก่อน deploy หรือ onboarding คนใหม่
- ครอบคลุม `.env`, `.env.local`, `.env.example`, `.env.production`, `.env.development`, `wrangler.toml`, `docker-compose.yml`, CI env references
- ตรวจ code usage เช่น `process.env.*`, `Bun.env.*`, `import.meta.env.*`, `os.environ`, `std::env::var`
- Read-only: ไม่แก้ไขไฟล์ ไม่เปิดเผย secret values

## Execute

### 1. Collect Env Files

> Goal: รวบรวม env files และ keys ทั้งหมด

1. ใช้ `find_file_by_name` หา `.env*` และ env-related configs ใน project
2. อ่าน keys (ไม่ใช่ values) จากแต่ละไฟล์
3. แยกกลุ่ม: `.env.example` (canonical), `.env*` (local), CI/deploy configs
4. ถ้าไม่มี `.env.example` → ใช้ `.env` เป็น baseline และ flag ใน report

### 2. Scan Code Usage

> Goal: หา env vars ที่ code ใช้จริง

1. ใช้ `grep` หา patterns: `process.env.<NAME>`, `Bun.env.<NAME>`, `import.meta.env.<NAME>`, `os.environ`, `std::env::var`
2. รวม unique env var names พร้อม file:line
3. แยก vars ที่มี default fallback ออกจาก vars ที่ required

### 3. Compare Sets

> Goal: เทียบ keys ระหว่างไฟล์และ code

1. Missing in `.env`: keys ที่ code ใช้แต่ไม่มีใน `.env`
2. Missing in `.env.example`: keys ที่มีใน `.env` แต่ไม่มีใน example (คนใหม่จะพัง)
3. Unused: keys ใน `.env` ที่ code ไม่ได้ใช้
4. Drift: keys ที่มีในบาง env variants แต่ขาดใน variants อื่น

### 4. Check Secret Safety

> Goal: ตรวจว่าไม่มี secrets หลุด

1. ทำ `/check-secrets-leak` เพื่อตรวจ `.env*` ที่ commit เข้า repo
2. ตรวจ `.env.example` ต้องไม่มี real values — เฉพาะ placeholder เช่น `KEY=your-key-here`
3. ตรวจ `.gitignore` ครอบคลุม `.env*` (ยกเว้น `.env.example`)
4. ถ้าพบ secrets หลุด → แนะนำ `/follow-secret-manager` และ `/open-web-for-config-secret`

### 5. Report

> Goal: สรุปผลให้แก้ไขได้ทันที

1. ทำ `/report` คอลัมน์: `No.`, `Key`, `Status`, `Found In`, `Action`
2. Status: `missing-env`, `missing-example`, `unused`, `drift`, `leaked`
3. สรุป counts และจัดลำดับ `leaked`/`missing-env` ก่อน
4. แนะนำ next action ต่อ finding

## Rules

### 1. No Secret Exposure

- ห้ามแสดง secret values ใน output — แสดงเฉพาะ key names
- ห้าม copy values จาก `.env` ไป `.env.example`
- ถ้าพบ secret จริงใน repo → รายงานทันทีและไม่ log value

### 2. Read-Only

- ตรวจสอบและรายงานเท่านั้น ไม่แก้ไข env files
- ไม่เพิ่ม keys อัตโนมัติ — เสนอ diff ให้ user เลือก

### 3. Coverage

- ตรวจทุก `.env*` variant และ framework-specific patterns (`NEXT_PUBLIC_`, `VITE_`, `NUXT_`)
- ตรวจ env references ใน CI (`env:` blocks) และ deployment configs

- ใช้ /follow-secret-manager ถ้าจำเป็น
- ใช้ /check-secrets-leak ถ้าจำเป็น
- ใช้ /search-files-patterns ถ้าจำเป็น

## Expected Outcome

- รู้ครบว่า env vars ไหนขาด เกิน หรือ drift ระหว่าง files และ code
- `.env.example` ครบและไม่มี real secrets
- รายงาน prioritized พร้อม action ต่อ finding
