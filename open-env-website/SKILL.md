---
name: open-env-website
description: อ่าน .env.example แล้วเปิด external services websites เพื่อกรอก API keys
argument-hint: "[env-file]"
---

## Goal

อ่าน `.env.example` แล้วเปิด websites ของ external services ที่ต้องกรอก API keys

## Scope

ครอบคลุมการอ่าน `.env.example`, แยก external services, ค้นหาหน้ากรอก API keys, และเปิด websites เหล่านั้นใน browser

## Execute

### 1. Read Env Example

> Goal: Read Env Example

อ่านไฟล์ `.env.example`

1. ค้นหา `.env.example` ใน workspace
2. อ่านเนื้อหาไฟล์ด้วย `read_file`
3. แยก environment variables ออกมา

### 2. Identify External Services

> Goal: Identify External Services

ระบุ external services จาก environment variables

1. ระบุ service names จาก variable names (เช่น `SUPABASE_URL`, `STRIPE_SECRET_KEY`)
2. กรอง internal services ออก (localhost, 127.0.0.1)
3. รวบรวมรายชื่อ services ที่ต้อง API keys

### 3. Deep Research API Key Pages

> Goal: Deep Research API Key Pages

ค้นหาหน้ากรอก API keys ของแต่ละ service ด้วย `/deep-research`

1. ทำ `/deep-research` สำหรับแต่ละ service ที่ต้อง API keys
2. ค้นหาว่าหน้ากรอก API keys ของแต่ละ service คืออะไร
3. รวบรวม URLs ที่ถูกต้องสำหรับแต่ละ service

Service Mapping:
- Supabase: https://supabase.com/dashboard/project/_/settings/api-keys/
- Stripe: https://dashboard.stripe.com/test/apikeys (API keys) + https://dashboard.stripe.com/webhooks (webhook secret)
- OpenAI: https://platform.openai.com/api-keys
- Cloudflare: https://dash.cloudflare.com/profile/api-tokens/ (API token) + https://dash.cloudflare.com/ (Account ID, Zone ID)
- LINE Developers: https://developers.line.biz/console/ (LIFF tab)

### 4. Open Websites

> Goal: Open Websites

เปิด websites ของ external services

1. ใช้ `read_url_content` หรือ `bash` เปิด URLs ใน browser
2. เปิด websites ที่เป็น external services เท่านั้น
3. รอให้ user กรอก API keys

## Rules

- ระบุ services ที่ต้อง API keys จาก variable names
- กรอง internal services ออก (localhost, 127.0.0.1)
- ทำ `/deep-research` ก่อนเปิด websites เพื่อหา URLs ที่ถูกต้อง
- เปิด websites ที่เป็น external services เท่านั้น
- ใช้ `read_url_content` หรือ `bash` ตามความเหมาะสม

## Expected Outcome

- `.env.example` ถูกอ่านและแยก environment variables
- External services ถูกระบุ
- URLs สำหรับกรอก API keys ถูกค้นหาด้วย `/deep-research`
- Websites ของ external services ถูกเปิดใน browser
- User สามารถกรอก API keys ได้