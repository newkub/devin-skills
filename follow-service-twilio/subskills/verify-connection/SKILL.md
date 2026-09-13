---
name: follow-service-twilio-verify-connection
description: ยืนยัน Twilio credentials ใช้งานได้ — account fetch ตอบกลับ, phone numbers พร้อม
argument-hint: "[account-sid]"
related:
  - follow-secret-manager
  - report
---

## Goal

ยืนยันหลัง setup/config ว่า Twilio เชื่อมต่อได้จริง — Account SID/Auth Token valid, messaging service/numbers พร้อม

## Scope

- ใช้เมื่อ `/follow-service-twilio` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่ส่ง SMS/calls

## Execute

### 1. Check Credentials

> Goal: SID และ token มีครบ

1. ตรวจ `TWILIO_ACCOUNT_SID` (`AC...` format) และ `TWILIO_AUTH_TOKEN` มี (ไม่ print ค่า)
2. ถ้าใช้ messaging service → `TWILIO_MESSAGING_SERVICE_SID` (`MG...`) มี

### 2. Smoke Test API Call

> Goal: account fetch ตอบกลับ

1. `twilio api:core:v2010:accounts:fetch` หรือ `client.api.accounts(sid).fetch()`
2. 200 = credentials valid; 401 = invalid token, 404 = wrong SID
3. บันทึก account status (`active`/`suspended`)

### 3. Check Numbers And Webhooks

> Goal: sending capability พร้อม

1. `client.incomingPhoneNumbers.list({limit: 5})` — มี numbers ที่ส่งได้
2. ตรวจ webhook URLs ที่ config ไว้ตรงกับ app endpoints
3. flag: ไม่มี number, number ไม่มี SMS capability

### 4. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `no-numbers` / `webhook-mismatch`

## Rules

- ใช้ fetch/list calls เท่านั้น — ห้ามส่ง message/call
- ไม่ print auth token
- suspended account = flag ทันที

## Expected Outcome

- Verdict พร้อม account status + numbers evidence
