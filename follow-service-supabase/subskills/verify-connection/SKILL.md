---
name: follow-service-supabase-verify-connection
description: ยืนยัน Supabase connection — URL/keys valid, auth health, query ตอบกลับ
argument-hint: "[project-ref]"
related:
  - follow-secret-manager
  - report
---

## Goal

ยืนยันหลัง setup/config ว่า Supabase เชื่อมต่อได้จริง — URL/anon/service keys valid, project healthy, query ตอบกลับ

## Scope

- ใช้เมื่อ `/follow-service-supabase` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่แก้ schema/RLS

## Execute

### 1. Check Credentials

> Goal: URL และ keys ครบ format ถูก

1. ตรวจ `SUPABASE_URL` (หรือ `NEXT_PUBLIC_SUPABASE_URL`) + `SUPABASE_ANON_KEY` มี
2. ถ้าใช้ server-side → `SUPABASE_SERVICE_ROLE_KEY` มี — flag ถ้าหลุดไป client bundle
3. local dev → `supabase status` ดู local stack รันอยู่

### 2. Smoke Test

> Goal: API ตอบกลับจริง

1. `curl <SUPABASE_URL>/auth/v1/health` → 200 = project up
2. init client → query `select 1` หรือ read table ที่มีอยู่
3. flag: 401 (invalid key), 404 (wrong URL/ref), RLS block ที่ไม่คาด

### 3. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `project-down` / `rls-blocked`

## Rules

- ใช้ read calls เท่านั้น — ห้าม insert/update/delete
- ไม่ print service role key — แสดงแค่ key type ที่พบ
- service key ใน client-side code = Critical finding

## Expected Outcome

- Verdict พร้อม project-ref + health evidence
