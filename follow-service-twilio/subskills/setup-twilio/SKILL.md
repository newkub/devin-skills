---
name: follow-service-twilio-setup-twilio
description: ติดตั้ง Twilio SDK และตั้งค่า Account SID/Auth Token ให้พร้อมใช้งาน
argument-hint: "[project-path]"
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - run-verify
  - resolve-errors
  - suggest-next-action
---

## Goal

ติดตั้ง Twilio SDK และเตรียม credentials (Account SID, Auth Token) ให้ server เรียก Twilio API ได้ — first-time setup ไม่ใช่ ongoing config

## Scope

- ติดตั้ง `twilio` package และสร้าง client ฝั่ง server
- ตั้งค่า `TWILIO_ACCOUNT_SID` และ `TWILIO_AUTH_TOKEN` ผ่าน secret manager
- ถ้า setup ไปแล้ว → verify เท่านั้น; config phone numbers/webhooks → `subskills/config-twilio/SKILL.md`

## Execute

### 1. Check Prerequisites

> Goal: ยืนยัน project พร้อมและยังไม่ได้ setup

1. ตรวจ `package.json` ว่ามี `twilio` แล้วหรือยัง — ถ้ามี → skip ไปขั้น verify
2. ตรวจ env/secrets ว่ามี `TWILIO_ACCOUNT_SID` และ `TWILIO_AUTH_TOKEN` หรือยัง
3. ถ้าขาด credentials → ทำ `/open-web-for-config-secret` ชี้ user ไป Twilio Console

### 2. Install SDK

> Goal: ติดตั้ง Twilio SDK ฝั่ง server

1. รัน `bun add twilio` (หรือ package manager ของ project)
2. ยืนยันว่า import ได้ด้วย `import twilio from 'twilio'`

### 3. Configure Credentials

> Goal: เก็บ credentials อย่างปลอดภัย

1. สร้าง/หา Account SID และ Auth Token จาก Twilio Console
2. เก็บ `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` ผ่าน `/follow-secret-manager` — ห้าม commit หรือ expose ฝั่ง client

### 4. Create Client

> Goal: client singleton พร้อมใช้

1. สร้าง client ด้วย `twilio(accountSid, authToken)` อ่านจาก env ฝั่ง server เท่านั้น
2. รัน smoke check เช่น `client.messages.list({ limit: 1 })` เพื่อยืนยัน auth ใช้ได้

### 5. Verify

> Goal: SDK ทำงานได้จริง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report
3. สำเร็จ → ทำ `/suggest-next-action`

## Rules

- ห้าม hardcode หรือ commit Account SID/Auth Token
- client ต้องอยู่ฝั่ง server เท่านั้น — ห้าม bundle เข้า client
- ใช้ official docs เป็นแหล่งหลัก ถ้าไม่แน่ใจ → ดู https://www.twilio.com/docs

## Expected Outcome

- `twilio` ติดตั้งและ client ทำงานได้ฝั่ง server
- credentials อยู่ใน secret manager ไม่มีใน code
- smoke check ผ่าน — พร้อมไป `subskills/config-twilio/SKILL.md`
