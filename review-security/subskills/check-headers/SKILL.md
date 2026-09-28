---
name: review-security-check-headers
description: Check security headers, CSP และ CORS — เทียบ config กับ deployed response จริง
argument-hint: "[url-or-scope]"
related:
  - check-security-headers
  - check-cors-policy
  - report
---

## Goal

Run the headers/CSP/CORS dimension of `/review-security` แบบ focused — verify headers บน deployed response จริง ไม่ใช่แค่ config file

## Scope

- ใช้เมื่อ `/review-security` dispatch มาที่ `headers`/`csp`/`cors` หรือเรียก standalone บน URL/config
- ครอบคลุม: CSP, HSTS, X-Frame-Options/frame-ancestors, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CORS policy
- Mechanical header scan → delegate ไป `/check-security-headers`; CORS deep check → `/check-cors-policy`

## Execute

### 1. Config Review

> Goal: header config ใน code ถูกต้อง

1. หา header config: middleware, `next.config`, `wrangler.jsonc`, nginx/CDN rules, helmet config
2. flag: CSP ที่มี `unsafe-inline`/`unsafe-eval`, missing HSTS, wildcard CORS origin กับ credentials

### 2. Deployed Verification

> Goal: response จริงตรงกับ config

1. ทำ `/check-security-headers` บน deployed URL (curl `-I`) — config ≠ effective response ถ้ามี CDN/proxy
2. ทำ `/check-cors-policy` เมื่อ API รับ cross-origin requests
3. flag drift: config มีแต่ response ไม่มี (proxy strip, layer ผิด)

### 3. Report

> Goal: findings พร้อม severity

1. ทำ `/report` ตาราง: `No.`, `Header/Policy`, `Severity`, `Finding`, `Evidence`, `Fix`
2. fix ทำใน `## Fix` ของ parent (headers step — single layer, CSP Report-Only ก่อน enforce)

## Rules

- Review เท่านั้น ไม่แก้ไข config ระหว่าง check
- ทุก finding ต้องมี evidence: config file line หรือ actual response header
- missing CSP / unrestricted CORS = High; missing HSTS/minor header = Medium

## Expected Outcome

- Header/CSP/CORS findings แยก config issue vs deployed drift
- Evidence จาก response จริง ไม่ใช่แค่ config
