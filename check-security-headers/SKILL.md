---
name: check-security-headers
description: Audit HTTP security headers ของ web app ครอบคลุม CSP, HSTS, X-Frame-Options และ cookie flags
argument-hint: "[url-or-config]"
related:
  - review-security
  - analyze-attack-surface
  - improve-security
  - report-table
---

## Goal

ตรวจ HTTP response headers และ cookie flags ของ web app หรือ API เทียบกับ security baseline — หา headers ที่ขาดหรือตั้งค่าผิด

## Scope

- ใช้กับ running app (local หรือ deployed URL) และ config files ที่ set headers (`next.config.*`, `wrangler.toml`, `nginx.conf`, `vercel.json`, middleware)
- ครอบคลุม: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`/`frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-*` และ `Set-Cookie` flags
- Read-only: ตรวจและรายงาน — แก้ไขให้ทำ `/improve-security`

## Execute

### 1. Identify Target

> Goal: รู้ว่าจะ audit อะไร

1. รับ `url` จาก argument หรือใช้ local dev URL จาก `/run-dev`
2. ถ้าไม่มี running app → audit config files ที่ set headers ใน repo แทน
3. บันทึก target URL(s) และ routes ที่จะตรวจ (หน้าแรก + auth pages + API endpoints)

### 2. Fetch Headers

> Goal: เก็บ response headers จริง

1. รัน `curl -sI <url>` หรือ `curl -sD - -o NUL <url>` ต่อ target
2. เก็บ response headers และ `Set-Cookie` ทุก entry
3. ถ้าเป็น SPA → ตรวจทั้ง document response และ API responses
4. บันทึก status code ประกอบ (headers บน error pages อาจต่างกัน)

### 3. Evaluate Against Baseline

> Goal: ให้คะแนนแต่ละ header

1. `Strict-Transport-Security`: ต้องมีบน HTTPS, `max-age >= 31536000`, แนะนำ `includeSubDomains`
2. `Content-Security-Policy`: ต้องมี, ห้าม `unsafe-inline`/`unsafe-eval` ถ้าไม่จำเป็น, flag `*` sources
3. `X-Content-Type-Options: nosniff` ต้องมี
4. `X-Frame-Options: DENY/SAMEORIGIN` หรือ CSP `frame-ancestors`
5. `Referrer-Policy`: แนะนำ `strict-origin-when-cross-origin` หรือเข้มกว่า
6. `Permissions-Policy`: ปิด features ที่ไม่ใช้ (camera, mic, geolocation)
7. `Set-Cookie`: flag cookies ที่ขาด `Secure`, `HttpOnly`, `SameSite`
8. `Server`/`X-Powered-By`: flag ถ้า leak stack info

### 4. Review Config Sources

> Goal: หาจุดที่ควร set headers ใน code

1. ค้น config: `headers()` ใน `next.config.*`, `[[headers]]` ใน `wrangler.toml`/`_headers`, `vercel.json`, nginx `add_header`
2. เช็คว่า headers ที่ขาด set ได้ที่ platform level หรือต้อง app middleware
3. ระบุ single point ที่ควรแก้ — หลีกเลี่ยง set ซ้ำหลายชั้น

### 5. Report

> Goal: สรุป grade และ fixes

1. ทำ `/report-table` คอลัมน์: `No.`, `Header`, `Expected`, `Actual`, `Severity`, `Fix`
2. Severity: `critical` (CSP/HSTS ขาด), `warning`, `info`
3. สรุป overall grade (A-F ตาม coverage)
4. ส่งต่อ `/improve-security` สำหรับการแก้ไข

## Rules

### 1. Evidence-Based

- ทุก finding ต้องมี actual header value หรือ `missing`
- อย่า flag header ที่ไม่ relevant กับ app type (เช่น HSTS บน localhost HTTP)

### 2. Read-Only

- ไม่แก้ config หรือ code — ส่งต่อ `/improve-security`
- ไม่ fuzz หรือ attack target — audit headers เท่านั้น

### 3. Context Aware

- API-only endpoints ไม่จำเป็นต้องมี CSP/X-Frame-Options — ประเมินตาม content type
- ระบุเมื่อ header ถูก set โดย platform (Cloudflare/Vercel) ไม่ใช่ app

- ใช้ /review-security ถ้าจำเป็น
- ใช้ /improve-security ถ้าจำเป็น
- ใช้ /analyze-attack-surface ถ้าจำเป็น

## Expected Outcome

- รายการ security headers ที่ขาด/ผิดพร้อม severity และ fix location
- Cookie flags audit ครบ
- Overall grade และ prioritized recommendations
