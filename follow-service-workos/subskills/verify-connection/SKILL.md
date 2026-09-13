---
name: follow-service-workos-verify-connection
description: ยืนยัน WorkOS credentials ใช้งานได้ — API key valid, client id, organizations reachable
argument-hint: "[client-id]"
related:
  - follow-secret-manager
  - report
---

## Goal

ยืนยันหลัง setup/config ว่า WorkOS เชื่อมต่อได้จริง — `WORKOS_API_KEY`/`WORKOS_CLIENT_ID` valid, API ตอบกลับ

## Scope

- ใช้เมื่อ `/follow-service-workos` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่แก้ organizations/connections

## Execute

### 1. Check Credentials

> Goal: key และ client id ครบ

1. ตรวจ `WORKOS_API_KEY` (`sk_...` test / live format) และ `WORKOS_CLIENT_ID` (`client_...`) มี — ไม่ print ค่า
2. flag test keys ใน production config (หรือกลับกัน)
3. ถ้าใช้ webhooks → `WORKOS_WEBHOOK_SECRET` มี

### 2. Smoke Test API Call

> Goal: WorkOS API ตอบกลับ

1. เรียก `workos.organizations.listOrganizations({limit: 1})` หรือ equivalent minimal call
2. 200 = key valid; 401 = invalid key
3. ถ้าใช้ AuthKit → ตรวจ redirect URI config ตรง app

### 3. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `env-mismatch` / `webhook-missing`

## Rules

- ใช้ list calls เท่านั้น — ห้าม create/update/delete
- ไม่ print key values — แสดงแค่ prefix/environment
- auth failure → แนะนำ `/follow-secret-manager` — ไม่แก้เอง

## Expected Outcome

- Verdict พร้อม environment (test/live) evidence
