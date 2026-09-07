---
name: check-infra
description: ตรวจ infrastructure health — DNS records, TLS certificate expiry และ network endpoints
argument-hint: "[domain-or-endpoint] [--dns|--ssl]"
related:
  - review-security
  - check-open-ports
  - report-table
  - --
  - verify-email-deliverability
  - check-security-headers


## Goal

ตรวจสุขภาพ infrastructure ของ domains/endpoints — DNS records ถูกต้อง, TLS certificate ไม่ใกล้หมดอายุ, พร้อม renewal

## Scope

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: check-infra, check-infra)
- `--dns` → เช็คเฉพาะ DNS; `--ssl` → เช็คเฉพาะ certificate; ไม่ระบุ → เช็คทั้งสอง
- Read-only: รายงานสถานะ ไม่แก้ไข config

## Execute

### 1. Inventory Endpoints

> Goal: รวบรวม domains/endpoints ที่ต้องตรวจ

1. อ่านจาก argument, deploy config, `wrangler.toml`, `vercel.json`, DNS provider หรือ env vars
2. รวมทุก domain/subdomain ที่ project ใช้

### 2. Check DNS Health

> Goal: DNS records ถูกต้องและไม่ misconfigure

1. ตรวจ A/AAAA/CNAME records ด้วย `Resolve-DnsName` หรือ `nslookup`/`dig`
2. ตรวจ TTL, propagation, conflicting records
3. ตรวจ records ที่ชี้ไป service ที่เลิกใช้ (dangling)

### 3. Check TLS Certificates

> Goal: certificates ไม่หมดอายุเร็วๆ นี้

1. เช็ค expiry ของแต่ละ endpoint ด้วย `openssl s_client -connect <host>:443 -servername <host>`
2. Flag: <7 วัน Critical, <30 วัน High, <90 วัน Medium
3. ตรวจ chain completeness และ protocol/cipher ที่อนุญาต
4. ตรวจ renewal readiness (auto-renew configured, ACME working)

### 4. Report

> Goal: สรุปสถานะพร้อม action

1. ใช้ `/report-table` คอลัมน์: No., Endpoint, Area, Status, Severity, Action
2. ระบุวันหมดอายุและช่องทาง renewal

## Rules

- Evidence-based — ตรวจจริง ไม่เดา
- Read-only
- รายงานทั้ง endpoint ที่ผ่านและไม่ผ่าน

## Expected Outcome

- ตารางสุขภาพ DNS + TLS พร้อม severity และ renewal actions
