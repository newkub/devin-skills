---
name: check-webhook
description: ตรวจ webhook endpoints ด้าน security (signature, replay, auth) และ delivery (retries, dead-letter)
argument-hint: "[endpoint-or-provider] [--security|--delivery]"
related:
  - review-auth
  - report-table

---

## Goal

ตรวจ webhook receivers ครบทั้งสองด้าน — security (verify signatures, กัน replay, จำกัดสิทธิ์ endpoint) และ delivery reliability (retries, ordering, dead-letter handling)

## Scope

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: check-webhook-security, check-webhook-delivery)
- ใช้กับ webhook endpoints ของ providers เช่น Stripe, GitHub, LINE, Slack
- `--security` → เช็คเฉพาะด้าน security; `--delivery` → เช็คเฉพาะ delivery; ไม่ระบุ → เช็คทั้งสอง
- Read-only: รายงาน — แก้ผ่าน section `## Fix` ของ `/review-auth` หรือ `review-*` ที่เกี่ยวข้อง

## Execute

### 1. Map Webhook Endpoints

> Goal: หา webhook receivers ทั้งหมด

1. ค้น route handlers ที่รับ webhook (`/webhook`, `/hooks`, provider-specific paths)
2. ระบุ provider ของแต่ละ endpoint
3. ตรวจ config ระดับ platform (gateway, Cloudflare, ngrok)

### 2. Check Security

> Goal: ตรวจด้าน security

1. Signature verification — ทุก endpoint ต้อง verify signature ก่อน process
2. Replay protection — timestamp tolerance, nonce, idempotency
3. Endpoint auth — path obscurity, IP allowlist, token ใน URL ห้ามมี
4. Secrets ที่ใช้ verify ต้องมาจาก secret manager ไม่ hardcode

### 3. Check Delivery Reliability

> Goal: ตรวจด้าน delivery

1. Retry handling — endpoint ต้อง idempotent ต่อ delivery ซ้ำ
2. Ordering — รองรับ events ที่มาไม่เรียงลำดับ
3. Dead-letter / failure logging — events ที่ process ไม่สำเร็จต้องถูกบันทึก
4. Response time — ตอบ 2xx เร็ว แล้ว process แบบ async ถ้างานหนัก

### 4. Report

> Goal: สรุปผลพร้อม severity และ fix

1. ใช้ `/report-table` คอลัมน์: No., Endpoint, Provider, Area, Finding, Severity, Fix
2. เรียงตาม Severity: Critical → Info

## Rules

- Evidence-based — อ่าน handler code จริง ไม่เดา
- Read-only — ไม่แก้ไข code
- ไม่ expose secrets ที่พบใน report

## Expected Outcome

- ตาราง findings ครอบคลุมทั้ง security และ delivery พร้อม severity และ fix suggestions
