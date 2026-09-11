---
name: improve-security
description: Apply security fixes จาก review-security findings — headers, secrets, injection, auth, deps
argument-hint: "[scope]"
related:
  - review-security
  - check-security-headers
  - check-secrets-leak
  - check-supply-chain
  - run-audit
  - follow-secret-manager
  - use-subagents
  - run-check
  - report
  - suggest-next-action
---

## Goal

แก้ security issues ที่ `/review-security` พบ — security headers, secrets exposure, injection sinks, auth gaps, vulnerable deps — พร้อม verify ว่า fix ทำงานจริง

## Scope

ใช้หลัง `/review-security` มี findings หรือเมื่อต้องการ security hardening pass — apply fixes ไม่ใช่ report-only

- ถ้ายังไม่ได้ review → ทำ `/review-security` ก่อน
- ถ้า scope ใหญ่หลาย layers → dispatch ผ่าน `/use-subagents`

## Execute

### 1. Collect Findings

> Goal: รู้ว่าต้องแก้อะไร

1. ทำ `/review-security` หรืออ่าน findings เดิม
2. เสริมด้วย `/check-security-headers`, `/check-secrets-leak`, `/check-supply-chain`, `/run-audit` ตามที่เกี่ยวข้อง
3. จัดกลุ่ม: headers, secrets, injection, auth/session, deps, config

### 2. Fix Security Headers

> Goal: headers ครบตาม `/check-security-headers`

1. เพิ่ม/แก้: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options` หรือ CSP `frame-ancestors`
2. CSP เริ่มจาก report-only ถ้ากลัว break — ค่อย enforce
3. verify ด้วย curl บน deployed URL หรือ dev server

### 3. Fix Secrets Exposure

> Goal: ไม่มี secrets รั่ว

1. secrets ใน code/repo → ย้ายไป env/secret manager ตาม `/follow-secret-manager`, rotate key ที่รั่วแล้ว
2. client-side bundle ต้องไม่มี server secrets — ตรวจ env vars ที่ leak เข้า build
3. `.gitignore` + git history ถ้าเคย commit secrets → แนะนำ rotate (ไม่ rewrite history โดยไม่ได้รับอนุญาต)

### 4. Fix Injection And Input Handling

> Goal: ปิด injection sinks

1. SQL/command/XSS injection sinks → parameterized queries, escaping, sanitization
2. user input ทุกจุดผ่าน validation — schema validation ที่ boundary
3. dangerous APIs (`innerHTML`, `eval`, raw SQL string concat) → safe alternatives

### 5. Fix Auth And Session

> Goal: auth surface ปลอดภัย

1. session cookies: `HttpOnly`, `Secure`, `SameSite` ถูกต้อง
2. auth checks ที่ server ทุก protected action — ห้ามพึ่ง client-side guard อย่างเดียว
3. rate limiting/lockout สำหรับ auth endpoints

### 6. Fix Dependencies

> Goal: ไม่มี known vulnerabilities

1. `/run-audit` findings → upgrade/patch ตาม severity (Critical/High ก่อน)
2. deps ที่ unmaintained หรือ supply-chain risky → เสนอ alternative
3. lockfile integrity — ไม่มี typosquat candidates

### 7. Verify And Report

> Goal: ยืนยัน fixes จริง

1. re-run checks ที่เกี่ยวข้อง — headers curl, secrets scan, audit
2. `/run-check` + tests ผ่าน — security fixes ห้ามทำ functionality พัง
3. ทำ `/report` — findings fixed per category, residual risks, recommendations
4. ทำ `/suggest-next-action`

## Rules

### 1. Fix Not Weaken

- ห้ามแก้ security issue โดยลด security อื่น (เช่นเปิด CORS `*` เพื่อแก้ปัญหา auth)
- CSP ห้าม `unsafe-inline`/`unsafe-eval` เว้นแต่จำเป็นจริงและ document ไว้

### 2. Verify On Deployed Surface

- headers/cookies ต้อง verify บน response จริง ไม่ใช่แค่ config file
- secrets ที่รั่วไปแล้วต้อง rotate — ลบออกจาก code อย่างเดียวไม่พอ

### 3. No Breaking Auth

- auth/session fixes ต้อง test login/logout flows หลังแก้
- ถ้า fix เสี่ยง lock users out → flag ให้ user confirm

### 4. Evidence

- ทุก fix มี evidence — header response, scan output, audit result ก่อน/หลัง

## Expected Outcome

- security headers ครบและ verify บน response จริง
- ไม่มี secrets ใน code/bundle, keys ที่รั่วถูก rotate
- injection sinks ปิด, auth checks อยู่ server-side
- vulnerable deps patched, audit ผ่าน
