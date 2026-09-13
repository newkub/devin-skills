---
name: follow-service-cloudflare-verify-connection
description: ยืนยัน Cloudflare connection — wrangler auth, account access, bindings พร้อม
argument-hint: "[project]"
related:
  - use-wrangler
  - report
---

## Goal

ยืนยันหลัง setup/config ว่า Cloudflare เชื่อมต่อได้จริง — wrangler authenticated, account เข้าถึงได้, bindings ตอบกลับ

## Scope

- ใช้เมื่อ `/follow-service-cloudflare` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่แก้ config/bindings

## Execute

### 1. Check Wrangler Auth

> Goal: wrangler login และ account พร้อม

1. `wrangler whoami` — ต้องแสดง account name/id
2. ถ้าใช้ `CLOUDFLARE_API_TOKEN` → ตรวจ token มีและ permissions ครบ
3. ถ้า auth fail → แนะนำ `subskills/setup-wrangler/SKILL.md` — ไม่ login เอง

### 2. Check Resource Access

> Goal: bindings/resources ที่ config อ้างเข้าถึงได้

1. `wrangler kv namespace list`, `wrangler r2 bucket list`, `wrangler d1 list` ตามที่ `wrangler.toml`/`wrangler.jsonc` ใช้
2. flag bindings ที่ config อ้างแต่ resource ไม่มีใน account
3. ถ้ามี Worker → `wrangler deployments list` ดู deployment ล่าสุด

### 3. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `missing-resources` / `partial`

## Rules

- ใช้ list/read commands เท่านั้น — ห้าม deploy/put/delete
- ไม่ print token values
- missing resource → รายงาน binding name + resource ที่ขาด

## Expected Outcome

- Verdict connection พร้อม account + resources evidence
