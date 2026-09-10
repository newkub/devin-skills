---
name: check-webhook
description: ตรวจ webhook endpoints ด้าน security (signature, replay, auth) และ delivery (retries, dead-letter)
argument-hint: "[endpoint-or-provider] [--security|--delivery]"
related:
  - review-auth
  - report

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

### 2. Dispatch To Subskills

> Goal: ตรวจแต่ละด้านผ่าน subskill ที่เฉพาะเจาะจง

| Flag         | Subskill |
|--------------|----------|
| `--security` | `subskills/security/SKILL.md` — signature, replay, endpoint auth |
| `--delivery` | `subskills/delivery/SKILL.md` — retries, ordering, dead-letter |

1. ถ้าระบุ `--security` → อ่านและทำตาม `subskills/security/SKILL.md`
2. ถ้าระบุ `--delivery` → อ่านและทำตาม `subskills/delivery/SKILL.md`
3. ถ้าไม่ระบุ → ทำทั้งสองตามลำดับ security ก่อน delivery

### 3. Report

> Goal: สรุปผลพร้อม severity และ fix

1. ใช้ `/report` คอลัมน์: No., Endpoint, Provider, Area, Finding, Severity, Fix
2. เรียงตาม Severity: Critical → Info

## Rules

- Evidence-based — อ่าน handler code จริง ไม่เดา
- Read-only — ไม่แก้ไข code
- ไม่ expose secrets ที่พบใน report

## Expected Outcome

- ตาราง findings ครอบคลุมทั้ง security และ delivery พร้อม severity และ fix suggestions
