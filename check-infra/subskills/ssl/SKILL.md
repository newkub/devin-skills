---
name: check-infra-ssl
description: ตรวจ TLS certificate expiry, chain, renewal readiness
argument-hint: "[target]"
---

## Goal

ตรวจ TLS certificates ของ domains ที่ project ใช้ — expiry dates, renewal readiness, chain issues — เพื่อไม่ให้ cert หมดอายุจน service ล่ม

## Scope

- ตรวจ certs ของ domains/endpoints ที่ project serve หรือพึ่งพา
- ครอบคลุม: expiry dates, SAN coverage, chain validity, renewal mechanism (auto vs manual), cert transparency
- Read-only: ตรวจ certs จาก remote — ไม่แก้ config

## Execute

### 1. Inventory Endpoints

> Goal: รวบรวม domains ที่ต้องเช็ค cert

1. หาจาก deploy configs, env vars, docs, DNS records (ทำ `/check-dns-health` ร่วม)
2. รวม external dependencies ที่ HTTPS-critical: APIs, CDNs, webhook targets
3. ระบุ cert provider ต่อ domain: Let's Encrypt, Cloudflare, ACM, manual

### 2. Check Certificate Status

> Goal: ดึง cert info ต่อ endpoint

1. เช็ค cert จาก remote: PowerShell `TcpClient`+`SslStream` หรือ `openssl s_client -connect <domain>:443 -servername <domain>`
2. เก็บ: expiry date, days remaining, issuer, SANs, chain validity
3. flag: expiry <30 วัน (`high`), <7 วัน (`critical`), expired (`critical+`)

### 3. Check Renewal Readiness

> Goal: ตรวจว่า renewal จะทำงานเมื่อถึงเวลา

1. Auto-renewal: platform-managed certs (Cloudflare, Vercel, ACM, Let's Encrypt via certbot/Caddy) — ตรวจว่า renewal job/service มีอยู่และทำงาน
2. Manual certs: flag ทุกตัวที่ expiry <60 วันและไม่มี auto-renewal
3. ACME challenges: HTTP-01 ต้องเข้าถึง `/.well-known/` ได้, DNS-01 ต้องมี API access — flag blockers
4. SAN coverage: cert ครอบ subdomains ที่ใช้จริงไหม (mismatch = browser warnings)

### 4. Check Chain And Protocol

> Goal: ตรวจ cert chain และ TLS hygiene

1. Chain completeness — missing intermediates = some clients fail
2. Protocol versions: TLS 1.0/1.1 ที่ยังเปิด = flag (deprecated)
3. Weak ciphers ที่ยัง accept — ทำ `/check-security-headers` ร่วม

### 5. Report

> Goal: สรุป cert health พร้อม timeline

1. ใช้ `/report-table`: `No.`, `Domain`, `Expiry`, `Days Left`, `Renewal`, `Severity`, `Action`
2. เรียงตาม days remaining — ใกล้หมดก่อน
3. แนะนำ: renewal steps, auto-renewal setup, monitoring/alerting สำหรับ expiry

## Rules

### 1. Evidence-Based

- expiry จาก cert จริงที่ serve — ไม่เดาจาก provider docs
- ระบุ check time — cert เปลี่ยนได้

### 2. Read-Only

- ไม่ renew หรือแก้ cert config — รายงานให้ user/provider จัดการ
- ไม่ probe ports นอกเหนือ 443 โดยไม่จำเป็น

### 3. Coverage

- SANs/wildcards ต้องครอบ domains ที่ใช้จริง — mismatch คือ finding
- internal/staging domains ที่ self-signed โดยตั้งใจ — flag info

## Expected Outcome

- Cert inventory พร้อม expiry timeline
- Renewal readiness ต่อ domain — auto vs manual
- Early warnings ก่อน cert หมดอายุ
