---
name: follow-tool-drizzle-kit-config-drizzle-kit
description: ตั้งค่า `drizzle.config.ts` — dialect, schema path, dbCredentials, out dir
argument-hint: "[scope]"
related:
  - run-drizzle-studio
  - run-verify
  - follow-secret-manager
---

## Goal

ตั้งค่า `drizzle.config.ts` ให้ถูกต้อง — `dialect`, `schema`, `out`, `dbCredentials` — ให้ generate/migrate/push ทำงาน

## Scope

ใช้เมื่อต้องสร้าง/แก้ drizzle-kit config — migration workflow อยู่ใน `subskills/migrate-schema/SKILL.md`

## Execute

### 1. Read Current Config

> Goal: อ่าน config เดิมก่อนแก้

1. หา `drizzle.config.ts` (หรือ `.js`/`.json`) ที่ root — บันทึก keys ปัจจุบัน
2. ระบุ schema entrypoint — เช่น `./src/db/schema.ts` หรือ glob `./src/**/schema.ts` สำหรับ multi-file
3. ถ้าไม่มี config → สร้าง `drizzle.config.ts` ที่ root

### 2. Core Options

> Goal: ตั้งค่า keys หลัก

1. ใช้ `defineConfig` จาก `drizzle-kit` — type safety
2. `dialect` — `"postgresql"`, `"mysql"`, `"sqlite"`, `"turso"` ฯลฯ ตาม database จริง (ดู official docs สำหรับ dialect names)
3. `schema` — path/glob ไปยัง schema files
4. `out` — directory สำหรับ generated migrations เช่น `"./drizzle"` หรือ `"./migrations"`
5. `dbCredentials` — `url` หรือ fields เฉพาะ dialect (host/port/user/database) — อ่านจาก env vars เสมอ (`process.env.DATABASE_URL!`) ห้าม hard-code

### 3. Additional Options

> Goal: ตั้งค่า options เสริมตามต้องการ

1. `strict`/`verbose` — สำหรับ generate/push safety และ logging
2. `tablesFilter` — จำกัด tables ที่ drizzle-kit จัดการ
3. `migrations` options — prefix/table settings ถ้าต้องการ (ดู official docs)
4. หลาย databases/configs → สร้างหลาย config files แล้วเลือกด้วย `--config=<path>`

### 4. Verify

> Goal: ตรวจ config ทำงาน

1. รัน `bunx drizzle-kit generate` บน schema ที่ไม่เปลี่ยน — ต้อง parse config ผ่าน (อาจบอก no changes)
2. หรือ `bunx drizzle-kit check` ตรวจ migration consistency ถ้ามี migrations อยู่แล้ว
3. รัน `bunx drizzle-kit studio` หรือ `/run-drizzle-studio` ตรวจ dbCredentials connect ได้จริง (ถ้า DB พร้อม)
4. ถ้าพัง → revert keys ที่แก้แล้ว report diff

## Rules

### 1. Config Discipline

- `defineConfig` เสมอ; merge กับ config เดิม ห้าม overwrite
- `dbCredentials` จาก env เท่านั้น — ใช้ `/follow-secret-manager` สำหรับ secrets
- `schema` path ต้องตรง entrypoint จริง — wrong glob = generate ผิด/ว่าง

### 2. Dialect

- `dialect` ต้องตรง database จริง — ผิด = SQL ผิด dialect ทั้งหมด
- ถ้าไม่แน่ใจ key name ให้ดู official docs — ห้ามเดา

### 3. Multi-Config

- หลาย DBs → หลาย config files + `--config` flag — อย่ายัดทุกอย่างใน config เดียว

- ใช้ /follow-secret-manager ถ้าจำเป็น
- ใช้ /run-drizzle-studio ถ้าจำเป็น

## Expected Outcome

- `drizzle.config.ts` ถูกต้อง — dialect/schema/out/dbCredentials ตรงจริง
- `drizzle-kit` commands parse config และทำงานได้
- Credentials ปลอดภัยผ่าน env vars
