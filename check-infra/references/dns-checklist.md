# check-dns-health (merged content)

## Goal

ตรวจ DNS configuration ของ domains ที่เกี่ยวข้อง — records ถูกต้อง, ไม่มี stale/missing records, TTLs เหมาะสม และไม่มี misconfig ที่ทำให้ down ได้

## Scope

- ตรวจ DNS records ของ domains ที่ project ใช้: A/AAAA, CNAME, MX, TXT, NS, CAA
- ครอบคลุม: record correctness, TTL sanity, dangling CNAMEs, DNSSEC, propagation consistency
- Read-only: ตรวจอ่าน DNS เท่านั้น — แก้ที่ DNS provider โดย user

## Execute

### 1. Inventory Domains

> Goal: รวบรวม domains/subdomains ที่เกี่ยวข้อง

1. หาจาก config: env vars, deploy configs (`wrangler.toml`, `vercel.json`), docs, certs
2. ระบุ apex + subdomains ที่ใช้งาน (www, api, app, staging)
3. ถ้า argument ระบุ domain → ตรวจตัวนั้นเจาะลึก

### 2. Check Core Records

> Goal: ตรวจ records หลักต่อ domain

1. `nslookup`/`Resolve-DnsName` per type: A/AAAA → IPs ที่ตอบ, CNAME → target ถูก
2. Dangling CNAME: target ที่ไม่ resolve แล้ว (subdomain takeover risk — severity สูง)
3. CNAME at apex: invalid ตาม DNS spec — flag
4. NS records: nameservers ตอบ consistent, ไม่มี lame delegation
5. CAA records: จำกัด CA ที่ออก cert ได้ — missing CAA = info

### 3. Check TTLs And Consistency

> Goal: ตรวจ TTL และ propagation

1. TTL sanity: ต่ำเกิน (<60s = resolver load), สูงเกินบน records ที่เปลี่ยนบ่อย
2. เช็คจากหลาย resolvers (8.8.8.8, 1.1.1.1, local) — propagation ไม่สม่ำเสมอ = recent change หรือ split-horizon
3. flag: records ที่ตอบต่างกันข้าม resolvers โดยไม่ตั้งใจ

### 4. Check Related Records

> Goal: ตรวจ records รองที่สำคัญ

1. MX records ถ้า domain รับ email — ทำ `/review-delivery` ในส่วน `## Verify` สำหรับ SPF/DKIM/DMARC
2. TXT records: verification tokens ที่ค้าง, legacy records
3. HTTPS/SVCB records ถ้ามี

### 5. Report

> Goal: สรุป DNS health

1. ใช้ `/report-table`: `No.`, `Domain`, `Record`, `Issue`, `Severity`, `Fix`
2. Severity: `critical` (dangling CNAME, NXDOMAIN บน live service), `high` (missing MX ที่ต้องมี), `medium` (TTL issues), `info` (missing CAA/DNSSEC)
3. ระบุ exact changes ที่ต้องทำที่ DNS provider

## Rules

### 1. Evidence-Based

- ทุก finding จาก actual DNS lookups — ระบุ resolver และเวลา
- propagation issues ต้องเช็คหลาย resolvers ก่อนสรุป

### 2. Read-Only

- ไม่แก้ DNS — ระบุ changes ที่ต้องทำให้ user ไปแก้ที่ provider
- ระวัง flag records ที่ตั้งใจ (CDN anycast, split-horizon)

### 3. Context Aware

- wildcard records, geo-DNS, failover configs อาจตอบต่างกันโดยตั้งใจ — flag info ไม่ใช่ violation
- TTL สูงบน stable records เป็นเรื่องดี — context matters

## Expected Outcome

- DNS health report ต่อ domain พร้อม actual records
- Dangling/misconfig findings พร้อม severity
- รายการ DNS changes ที่ต้องทำ
