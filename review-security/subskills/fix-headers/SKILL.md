---
name: review-security-fix-headers
description: Apply security headers findings — CSP, HSTS, X-Frame-Options, Referrer-Policy
argument-hint: "[app-or-route]"
related:
  - review-security
  - check-security-headers
  - follow-best-practice
  - run-check
  - report-before-after
---

## Goal

แก้ security headers findings จาก `/review-security` จริง — เพิ่ม/แก้ CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy แล้ว verify บน response จริง

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้ — review/report-only โดย default
- ครอบคลุม: missing/weak headers ที่ framework level, server/proxy config, CDN/platform headers
- ไม่ครอบคลุม TLS/cert config (infra) — multi-domain fix → `/deep-review-then-fix`

## Execute

### 1. Map Current Headers

> Goal: รู้ว่า headers ปัจจุบันออกจาก layer ไหน

1. curl deployed response หรือ dev server — บันทึก headers จริงต่อ route หลัก
2. ระบุ layer ที่ set headers: framework config/middleware, server config (`nginx`, `Caddyfile`), platform/CDN (`vercel.json`, `_headers`, `wrangler`)
3. map findings → header ที่ขาดหรือ weak → layer ที่ต้องแก้

### 2. Set Headers At Right Layer

> Goal: headers ออกจากจุดเดียวที่ถูกต้อง

1. เลือก layer เดียวต่อ header — platform/CDN config ก่อน ถ้าไม่มีให้ใช้ framework headers/middleware
2. ห้าม set ซ้ำหลาย layer — ค่าขัดกันทำ debug ยาก
3. headers มาตรฐานที่ควรมี:
   - `Strict-Transport-Security` — เฉพาะบน HTTPS
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options` หรือ CSP `frame-ancestors`
   - `Referrer-Policy`
   - `Permissions-Policy` — ปิด features ที่ไม่ใช้

### 3. Configure CSP Carefully

> Goal: CSP แน่นแต่ไม่ break app

1. app ใหญ่ → เริ่ม `Content-Security-Policy-Report-Only` เก็บ violations ก่อน enforce
2. หลีกเลี่ยง `unsafe-inline`/`unsafe-eval` — ใช้ nonce/hash ตามที่ framework รองรับ
3. allowlist เฉพาะ origins ที่ใช้จริง — syntax ละเอียดดู official docs (MDN/framework)

### 4. Verify On Real Response

> Goal: headers ออกจริงบน response ไม่ใช่แค่ config

1. `/run-check` ผ่าน แล้ว curl response จริงทุก route หลัก — headers ต้องอยู่ใน response headers
2. ทำ `/check-security-headers` ซ้ำ — findings เดิมต้องหาย
3. ถ้ามี CSP → เปิด app ใช้งานจริง ไม่มี console violations ที่ block ทรัพยากร
4. `/report-before-after` — headers ก่อน/หลังต่อ route

## Rules

- verify ด้วย curl บน response จริงเสมอ — config อย่างเดียวไม่นับ
- ห้ามใช้ `unsafe-inline`/`unsafe-eval` ใน CSP เว้นแต่ไม่มีทางเลือก — ระบุเหตุผลใน report
- `X-Frame-Options` กับ `frame-ancestors` ต้องสอดคล้องกัน
- แยก commit ต่อ layer: platform config → framework → CSP

## Expected Outcome

- security headers ครบและออกจาก layer ที่ถูกต้อง ตรวจด้วย response จริง
- CSP enforce หรือ report-only พร้อมแผน enforce
- report before/after ครบทุก finding

