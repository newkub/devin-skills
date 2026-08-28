---
name: open-web-from-env
description: อ่าน .env files แล้วเปิด URL เพื่อไปเอา API keys หรือ secrets
argument-hint: "[env-file]"
related:
  - follow-service-infisical
  - open-env-website
---

## Goal

อ่าน `.env.*` แล้วเปิด URL ของ services เพื่อไปเอา API keys มาใส่

## Scope

ใช้ `open-web-from-env` สำหรับงานเฉพาะและ workflows ที่ครอบคลุม

## Execute

### 1. Parse Env Files

> Goal: อ่าน env files และระบุ variables ที่ต้องการ keys

1. อ่าน `.env.example`, `.env.local`, `.env.*` ทั้งหมด
2. ระบุ variables ที่ต้องการ keys: `*_API_KEY`, `*_SECRET`, `*_TOKEN`, `*_PASSWORD`, หรือ placeholder
3. จับคู่แต่ละ variable กับ service name

### 2. Map and Open URLs

> Goal: จับคู่ variables กับ service URLs และเปิดในเบราว์เซอร์

1. ใช้หลักการ mapping:
   - `OPENAI_*` → `https://platform.openai.com/api-keys`
   - `ANTHROPIC_*` → `https://console.anthropic.com/settings/keys`
   - `GOOGLE_*` → `https://aistudio.google.com/app/apikey`
   - `GITHUB_*` → `https://github.com/settings/tokens`
   - `SUPABASE_*` → `https://supabase.com/dashboard`
   - ถ้าไม่รู้ URL ให้ถามผู้ใช้
2. ใช้ `open <url>` (macOS) หรือ `start <url>` (Windows) เปิดแต่ละ URL
3. บอกผู้ใช้ว่าต้องเอา key ตัวไหนจาก URL ไหน

## Rules

1. เปิด URL เฉพาะที่จำเป็นตาม env files
2. เก็บ secrets ใน `/follow-service-infisical` ไม่ใช่ `.env.local` ธรรมดา
3. ห้าม commit secrets ไป git

## Expected Outcome

- เปิด URLs ของ services ที่ต้องใช้ API keys
- ผู้ใช้รู้ว่าต้องเอา key อะไรจากที่ไหน
- กรอกค่าใน `/follow-service-infisical` ได้ถูกต้อง