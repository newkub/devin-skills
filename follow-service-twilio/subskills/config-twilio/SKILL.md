---
name: follow-service-twilio-config-twilio
description: ตั้งค่า Twilio phone numbers, messaging service และ webhook config โดยไม่ clobber ของเดิม
argument-hint: "[target-or-scope]"
related:
  - follow-secret-manager
  - check-config-drift
  - run-verify
  - run-test
---

## Goal

ตั้งค่า/แก้ไข Twilio configuration — phone numbers, Messaging Service, Verify Service และ webhook callbacks — โดย merge กับ config เดิม

## Scope

- ครอบคลุม env keys, messaging/verify service SIDs และ webhook endpoints
- ถ้ายังไม่ได้ install SDK หรือไม่มี credentials → ทำ `subskills/setup-twilio/SKILL.md` ก่อน
- ไม่รวมการซื้อ number จริง — user ทำใน Twilio Console

## Execute

### 1. Read Current Config

> Goal: รู้ config ปัจจุบันก่อนแก้

1. อ่าน env keys ที่มีอยู่: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, `TWILIO_MESSAGING_SERVICE_SID`, `TWILIO_VERIFY_SERVICE_SID`
2. อ่าน code ที่สร้าง client และ webhook handlers ปัจจุบัน
3. ทำ `/check-config-drift` ถ้าต้องรู้ drift ระหว่าง env กับ code

### 2. Configure Phone Numbers And Services

> Goal: ระบุ sender identities ถูกต้อง

1. ระบุ `TWILIO_PHONE_NUMBER` (E.164 format) หรือ `TWILIO_MESSAGING_SERVICE_SID` สำหรับ SMS
2. ระบุ `TWILIO_VERIFY_SERVICE_SID` สำหรับ OTP ผ่าน Verify API
3. เก็บ SIDs ทั้งหมดผ่าน `/follow-secret-manager` — merge กับ env เดิม ห้าม overwrite

### 3. Configure Webhooks

> Goal: รับ callbacks อย่างปลอดภัย

1. ตั้ง status callback / inbound webhook URL ใน Twilio Console (phone number หรือ messaging service settings)
2. สร้าง route รับ webhook เช่น `/api/webhooks/twilio`
3. verify signature ด้วย `twilio.validateRequest` กับ `TWILIO_AUTH_TOKEN` ทุก request
4. ตอบ `200` ทันทีและ process async — Twilio retry ถ้า timeout

### 4. Verify

> Goal: config ทำงานได้จริง

1. ส่ง test SMS หรือ test OTP แล้วดู status callback เข้า webhook
2. ทำ `/run-verify` และ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ถ้าพัง → revert key ที่เพิ่งแก้แล้ว report diff

## Rules

- แก้เฉพาะ keys ที่จำเป็น — ห้าม overwrite env/config ทั้งชุด
- verify webhook signatures เสมอ — ห้าม trust request โดยไม่ตรวจ
- ไม่ log message bodies ที่มี PII/OTP
- ระวัง regional compliance (sender IDs, opt-out) — ดู official docs ถ้าไม่แน่ใจ

## Expected Outcome

- phone number/service SIDs ถูกต้องและอยู่ใน secret manager
- webhook route verify signature และรับ callbacks ได้
- test message/OTP ส่งสำเร็จ
