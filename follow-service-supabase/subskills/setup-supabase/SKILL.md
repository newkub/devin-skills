---
name: follow-service-supabase-setup-supabase
description: ติดตั้ง Supabase CLI, init/link project และสร้าง client ให้พร้อมใช้งาน
argument-hint: "[project-path]"
related:
  - follow-service-supabase
  - follow-secret-manager
  - check-secrets
  - resolve-errors
  - run-verify
  - suggest-next-action
---

## Goal

ติดตั้ง Supabase CLI, สร้าง local project, link กับ remote project และ init `@supabase/supabase-js` client ให้พร้อมใช้งาน — first-time setup เท่านั้น

## Scope

- ติดตั้งและ authenticate Supabase CLI
- `supabase init`, `supabase link`, `supabase start` สำหรับ local development
- สร้าง client จาก env vars
- ไม่ครอบคลุม env/RLS/config ขั้นสูง → ใช้ `subskills/config-supabase/SKILL.md`

## Execute

### 1. Check Prerequisites

> Goal: ยืนยัน prerequisites ก่อนติดตั้ง (idempotent)

1. อ่าน `package.json` เพื่อระบุ package manager (`bun`, `npm`, `pnpm`)
2. ตรวจว่ามี `supabase/config.toml` หรือ `supabase/` directory อยู่แล้ว → ถ้ามี skip ไป verify
3. ตรวจ Docker สำหรับ local stack — ถ้าไม่มี → stop และแจ้ง user ติดตั้ง
4. ถ้าไม่มี Supabase account/project → stop และแจ้ง user สร้างจาก dashboard

### 2. Install And Authenticate CLI

> Goal: ติดตั้งและ login Supabase CLI

1. ติดตั้ง CLI ด้วย `bun add -D supabase` หรือ package manager ของระบบ (`brew`, `scoop`)
2. ตรวจสอบ version ด้วย `supabase --version`
3. Login ด้วย `supabase login` หรือตั้ง `SUPABASE_ACCESS_TOKEN` สำหรับ CI
4. ยืนยัน authentication ด้วย `supabase projects list`

### 3. Initialize And Link Project

> Goal: สร้าง local project และเชื่อมกับ remote

1. Initialize ด้วย `supabase init` → สร้าง `supabase/config.toml`
2. Link remote ด้วย `supabase link --project-ref <project-ref>`
3. Start local stack ด้วย `supabase start`
4. รัน `supabase status` เพื่ออ่าน local `API URL`, `anon key`, `service_role key`

### 4. Install Client And Verify

> Goal: สร้าง client ที่อ่านค่าจาก env และทดสอบ connection

1. ติดตั้ง client SDK ด้วย `bun add @supabase/supabase-js`
2. เก็บ `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` ใน `/follow-secret-manager` แล้ว inject เข้า `.env`
3. สร้าง client ด้วย `createClient(url, anonKey)` ใน `src/lib/supabase.ts` (หรือ path ที่เหมาะสม)
4. ทำ `/run-verify` และทดสอบ query เบื้องต้น — ถ้า fail → ทำ `resolve-errors` max 3 รอบ

## Rules

- ใช้ `supabase/config.toml` เป็น single source of truth
- ห้าม hardcode keys หรือ commit secrets — ใช้ `/follow-secret-manager` เสมอ
- `SUPABASE_SERVICE_ROLE_KEY` ใช้ฝั่ง server เท่านั้น ห้าม expose ไป client
- ถ้า command/API ไม่แน่ใจ → ดู official docs หรือทำ `learn` (web) ก่อน
- เสร็จแล้วทำ `/suggest-next-action`

## Expected Outcome

- Supabase CLI ติดตั้ง, login, link project สำเร็จ
- Local stack รันได้และ `supabase status` แสดงค่าครบ
- Client พร้อมใช้งานและ query ผ่าน verify
