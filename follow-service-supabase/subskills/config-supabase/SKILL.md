---
name: follow-service-supabase-config-supabase
description: ตั้งค่า Supabase env vars, RLS policies, auth และ client config โดยไม่ clobber เดิม
argument-hint: "[project-path]"
related:
  - follow-service-supabase
  - follow-secret-manager
  - check-env-vars
  - check-config-drift
  - run-verify
  - resolve-errors
---

## Goal

ตั้งค่า/แก้ไข Supabase configuration — env vars, `supabase/config.toml`, RLS policies และ client options — โดยไม่ overwrite config เดิม

## Scope

- จัดการ env vars (`SUPABASE_URL`, keys) ผ่าน secret manager
- แก้ `supabase/config.toml` (auth, storage, edge runtime)
- เปิด/แก้ RLS policies บน tables
- ไม่ครอบคลุม first-time install → ใช้ `subskills/setup-supabase/SKILL.md`

## Execute

### 1. Read Current Config

> Goal: รู้สถานะ config ปัจจุบันก่อนแก้

1. อ่าน `supabase/config.toml` และ `.env*` ที่มีอยู่
2. ทำ `/check-env-vars` เพื่อระบุ vars ที่ขาดหรือซ้ำ
3. ทำ `/check-config-drift` ถ้าสงสัยว่า local config ต่างจาก remote
4. ถ้าไม่มี `supabase/config.toml` เลย → ทำ `subskills/setup-supabase/SKILL.md` แทน

### 2. Configure Env Vars

> Goal: ตั้งค่า environment variables ให้ครบและปลอดภัย

1. กำหนด `SUPABASE_URL` และ `SUPABASE_ANON_KEY` สำหรับ client (public)
2. กำหนด `SUPABASE_SERVICE_ROLE_KEY` สำหรับ server เท่านั้น — เก็บใน `/follow-secret-manager`
3. ใช้ `NEXT_PUBLIC_`/`VITE_` prefix ตาม framework สำหรับค่าที่ expose ไป client
4. ห้ามแก้ config เดิมโดยไม่จำเป็น — merge เฉพาะ keys ที่ต้องการ

### 3. Configure Auth And Services

> Goal: แก้ `config.toml` เฉพาะ section ที่ต้องการ

1. แก้ `[auth]` section — `site_url`, `additional_redirect_urls`, providers ตามที่ใช้
2. แก้ `[storage]`, `[edge_runtime]` หรือ section อื่นเฉพาะ keys ที่จำเป็น
3. อ้างอิง `references/supabase-config.md` ของ parent หรือ official docs สำหรับ key names

### 4. Configure RLS And Client Options

> Goal: ป้องกัน data access และตั้ง client options ถูกต้อง

1. เปิด RLS บนทุก table ที่ expose ผ่าน API — `alter table <name> enable row level security`
2. สร้าง policies ด้วย `create policy` ผ่าน migration ไม่ใช่แก้ใน dashboard โดยตรง
3. ตั้ง client options เช่น `auth: { persistSession, autoRefreshToken }` ตาม use case
4. รัน `supabase db diff` ก่อน push เพื่อ review changes

### 5. Verify

> Goal: ยืนยันว่า config ใหม่ทำงานได้

1. รัน `supabase start`/`supabase status` เพื่อยืนยัน local stack รับ config ใหม่
2. ทำ `/run-verify` และทดสอบ query/auth flow เบื้องต้น
3. ถ้า fail → revert keys ที่แก้ ทำ `resolve-errors` max 3 รอบ แล้ว report diff

## Rules

- Merge กับ config เดิม — ห้าม overwrite `config.toml` ทั้งไฟล์
- Secrets ผ่าน `/follow-secret-manager` เท่านั้น ห้ามใส่ใน `config.toml` หรือ commit
- ทุก table ที่ client เข้าถึงต้องมี RLS enabled + explicit policies
- Test config ใน local ก่อน push remote
- ถ้า key name/option ไม่แน่ใจ → ดู official docs หรือ `learn-web`

## Expected Outcome

- Env vars ครบ ปลอดภัย และแยก client/server ชัดเจน
- `config.toml` ถูก merge โดยไม่ clobber settings เดิม
- RLS enabled พร้อม policies ผ่าน migration
- Verify ผ่านและ report before/after สั้นๆ
