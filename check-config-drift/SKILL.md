---
name: check-config-drift
description: ตรวจ config files ว่า parse ได้ ตรง schema และไม่ drift จาก defaults หรือ env อื่น
argument-hint: "[env-or-config-file]"
related:
  - report-config-files
  - check-env-vars
  - update-config
  - report
---

## Goal

ตรวจ configuration files ทั้ง project ว่า parse ได้จริง ตรง schema/defaults และไม่ drift ระหว่าง environments (dev/staging/prod) หรือระหว่าง config กับ code ที่อ่านมัน

## Scope

- Config files: `*.json`, `*.yaml`, `*.toml`, `*.ini`, `*.config.*`, `wrangler.toml`, `next.config.*`, `vite.config.*`, `tsconfig.json`
- เทียบ config ข้าม env (`.env.*`, `config/*.yaml`, deployment configs)
- เทียบ config keys กับ code ที่ consume (`process.env.*`, `Bun.env.*`, `import.meta.env.*`, config loaders)
- Read-only: รายงาน drift — แก้ไขผ่าน `/update-config`

## Execute

### 1. Inventory Config Files

> Goal: รวบรวม config ทั้งหมดใน project

1. ใช้ `search-files-patterns` หา config files ตาม extensions และชื่อมาตรฐาน
2. จัดกลุ่ม: app config, build config, env files, CI config, infra config
3. ใช้ `/report-config-files` เป็น baseline ถ้าต้องการรายการแบบละเอียด

### 2. Parse And Validate

> Goal: ยืนยันว่าทุก config parse ได้และตรง schema

1. Parse ทุกไฟล์ — flag ไฟล์ที่ syntax พัง
2. ถ้ามี schema (JSON Schema, zod schema, zodios config) → validate เทียบ schema
3. flag keys ที่ไม่รู้จัก, type ผิด, หรือ required keys ที่ขาด
4. ตรวจ duplicate keys ใน YAML/JSON และ conflicting settings

### 3. Detect Cross-Env Drift

> Goal: เทียบ config ระหว่าง environments

1. เทียบ `.env.development` vs `.env.production` vs `.env.example` — keys ต่างกัน
2. เทียบ config ต่อ env (เช่น `config/dev.yaml` vs `config/prod.yaml`) — keys ที่มีใน env เดียว
3. flag values ที่เหมือนกันทุก env แต่น่าจะต่าง (เช่น `debug: true` ใน prod)
4. ทำ `/check-env-vars` เพื่อเทียบ env keys กับ code usage

### 4. Detect Config-Code Drift

> Goal: หา config keys ที่ code ไม่ใช้หรือ code อ่านแต่ไม่มีใน config

1. ค้น code สำหรับ config access patterns (`process.env.X`, `Bun.env.X`, `config.get`, `useRuntimeConfig`)
2. เทียบกับ keys ที่ define ใน config files
3. flag: keys ใน config ที่ไม่มี code ใช้ (dead config) และ code อ่าน key ที่ไม่มีใน config

### 5. Report

> Goal: สรุป drift ทุกประเภทพร้อม severity

1. ใช้ `/report` คอลัมน์: `No.`, `Config File`, `Drift Type`, `Detail`, `Severity`, `Fix`
2. Drift types: `parse-error`, `schema-violation`, `env-mismatch`, `dead-key`, `missing-key`, `suspicious-value`
3. แนะนำ `/update-config` สำหรับไฟล์ที่ต้องแก้

## Rules

### 1. Evidence-Based

- ทุก finding ต้องระบุไฟล์และ key ที่ drift จริง
- ไม่ flag ความต่างระหว่าง env ที่เป็นธรรมชาติ (เช่น API URL ต่าง env)

### 2. Read-Only

- ไม่แก้ config — รายงานแล้วทำ `/update-config` ถ้า user ยืนยัน
- ไม่แสดงค่า secrets ในรายงาน — mask เสมอ

### 3. Context Aware

- monorepo อาจมี config หลายชั้น — ตรวจ inheritance/extends ก่อน flag duplicate
- บาง keys อาจ inject จาก platform (Cloudflare/Vercel) ไม่ได้อยู่ในไฟล์

## Expected Outcome

- รายการ config files ที่ parse ไม่ได้หรือผิด schema
- ตาราง drift ข้าม env และข้าม config-code พร้อม severity
- dead config keys และ missing keys ที่ต้องแก้
