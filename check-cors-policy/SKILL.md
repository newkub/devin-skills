---
name: check-cors-policy
description: ตรวจ CORS configuration — wildcard origins, credentials exposure และ over-permissive policies
argument-hint: "[url-or-config]"
related:
  - improve-security
  - report-table
---

## Goal

ตรวจ CORS policy ของ API/app ว่าปลอดภัย — wildcard origins ที่อันตราย, credentials ที่เปิดเกิน, methods/headers ที่ permissive เกินความจำเป็น

## Scope

- ตรวจ CORS config ใน code (middleware settings) และ actual responses (`Access-Control-*` headers)
- ครอบคลุม: `Allow-Origin`, `Allow-Credentials`, `Allow-Methods`, `Allow-Headers`, `Max-Age`, preflight handling
- Read-only: รายงาน — แก้ผ่าน `/improve-security`

## Execute

### 1. Locate CORS Config

> Goal: หาจุดที่ CORS ถูกตั้งค่า

1. ค้น cors middleware/plugins: `cors(`, `@elysiajs/cors`, `Access-Control` headers, framework config
2. ตรวจ per-route vs global — global permissive อาจ cover endpoints ที่ไม่ควร
3. ตรวจ platform-level CORS (Cloudflare, CDN, API gateway) ด้วย

### 2. Test Actual Responses

> Goal: ดู CORS behavior จริงไม่ใช่แค่ config

1. ส่ง preflight: `curl -X OPTIONS -H "Origin: https://evil.example" -H "Access-Control-Request-Method: POST" <url>`
2. ตรวจว่า origin ที่ไม่ได้ตั้งใจถูก reflect/allow ไหม
3. ทดสอบ `Origin: null`, subdomain patterns, credentials flag จริง

### 3. Evaluate Policy

> Goal: flag misconfigurations ตาม risk

1. Critical: `Allow-Origin: *` ร่วมกับ `Allow-Credentials: true` (browsers ปฏิเสธ แต่ config ผิด), origin reflection ที่ reflect ทุก origin + credentials
2. High: `*` origin บน endpoints ที่ return sensitive data
3. Medium: `Allow-Methods: *`, `Allow-Headers: *` เกินจำเป็น, `Max-Age` สูงเกิน
4. Info: missing CORS บน API ที่ browser clients ต้องใช้
5. ตรวจ regex origin patterns ที่ bypass ได้ (`*.example.com` ที่ match `evil-example.com`)

### 4. Report

> Goal: สรุป CORS posture พร้อม fixes

1. ใช้ `/report-table`: `No.`, `Endpoint/Scope`, `Origin Policy`, `Credentials`, `Risk`, `Severity`, `Fix`
2. แนะนำ allowlist ที่ถูกต้องต่อ environment
3. ระบุว่า fix อยู่ที่ code config หรือ platform layer

## Rules

### 1. Test Not Just Read

- CORS config ใน code อาจไม่ตรง actual headers (proxy/middleware ทับ) — ทดสอบจริงเสมอ
- preflight + actual request ต่างกัน — ตรวจทั้งคู่

### 2. Read-Only

- ไม่แก้ config — รายงานให้ `/improve-security`
- ทดสอบด้วย benign origins เท่านั้น — ไม่ exploit

### 3. Context Aware

- Public APIs ที่ตั้งใจ `*` ไม่ใช่ violation — flag info พร้อมเงื่อนไข
- Internal services ที่ไม่ควรมี CORS เลย — flag ถ้าเปิดไว้

## Expected Outcome

- CORS posture ที่ชัดเจนต่อ endpoint/environment
- Misconfig findings พร้อม severity และ actual-header evidence
- Allowlist recommendations ที่เหมาะสม
