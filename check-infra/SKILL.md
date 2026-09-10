---
name: check-infra
description: ตรวจ infrastructure health — DNS records, TLS certificate expiry และ network endpoints
argument-hint: "[domain-or-endpoint] [--dns|--ssl]"
related:
  - report

---

## Goal

ตรวจสุขภาพ infrastructure ของ domains/endpoints — DNS records ถูกต้อง, TLS certificate ไม่ใกล้หมดอายุ, พร้อม renewal

## Scope

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: check-dns-health, check-ssl-expiry)
- `--dns` → เช็คเฉพาะ DNS; `--ssl` → เช็คเฉพาะ certificate; ไม่ระบุ → เช็คทั้งสอง
- Read-only: รายงานสถานะ ไม่แก้ไข config

## Execute

### 1. Inventory Endpoints

> Goal: รวบรวม domains/endpoints ที่ต้องตรวจ

1. อ่านจาก argument, deploy config, `wrangler.toml`, `vercel.json`, DNS provider หรือ env vars
2. รวมทุก domain/subdomain ที่ project ใช้

### 2. Dispatch To Subskills

> Goal: ตรวจแต่ละด้านผ่าน subskill ที่เฉพาะเจาะจง

| Flag    | Subskill |
|---------|----------|
| `--dns` | `subskills/dns/SKILL.md` — A/AAAA/CNAME, TTL, dangling records |
| `--ssl` | `subskills/ssl/SKILL.md` — cert expiry, chain, renewal readiness |

1. ถ้าระบุ `--dns` → อ่านและทำตาม `subskills/dns/SKILL.md`
2. ถ้าระบุ `--ssl` → อ่านและทำตาม `subskills/ssl/SKILL.md`
3. ถ้าไม่ระบุ → ทำทั้งสองตามลำดับ

### 3. Report

> Goal: สรุปสถานะพร้อม action

1. ใช้ `/report` คอลัมน์: No., Endpoint, Area, Status, Severity, Action
2. ระบุวันหมดอายุและช่องทาง renewal

## Rules

- Evidence-based — ตรวจจริง ไม่เดา
- Read-only
- รายงานทั้ง endpoint ที่ผ่านและไม่ผ่าน

## Expected Outcome

- ตารางสุขภาพ DNS + TLS พร้อม severity และ renewal actions
