---
name: follow-service-twilio
description: ใช้ Twilio ส่ง SMS/OTP/verify — Messaging, Verify API, webhooks
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test

---

## Goal

ใช้ Twilio ส่ง SMS/OTP/verify — Messaging, Verify API, webhooks

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices (service twilio)

## Execute

### Workflows

| Topic  | Workflow |
|--------|----------|
| Setup  | `workflows/setup-twilio/SKILL.md` — SDK install, Account SID/Auth Token |
| Config | `workflows/config-twilio/SKILL.md` — phone numbers, messaging service, webhook config |
| Verify | `workflows/verify-connection/SKILL.md` — account fetch ตอบกลับ, numbers พร้อม |

อ่าน `workflows/<name>/SKILL.md` ตาม topic แล้วทำตาม flow ในนั้น — ไม่ execute จากตารางนี้โดยตรง

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

Latest: `twilio@6.1.1` (verified 2026-09-12) — install ด้วย `bun add twilio`

1. สร้าง client ด้วย accountSid/authToken จาก env — ไม่ expose ฝั่ง client
1. ใช้ Verify API (`verify.v2.services().verifications`) สำหรับ OTP — ไม่ต้องจัดการ code เอง
1. ใช้ Messaging (`messages.create`) สำหรับ SMS ทั่วไป — ตั้ง messagingServiceSid
1. รับ status callbacks ผ่าน webhook — verify signature ด้วย Twilio signature

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (service twilio)

## Rules

- ใช้ Verify API แทน self-managed OTP เมื่อเป็นไปได้
- verify webhook signatures เสมอ
- ระวัง regional compliance (sender IDs, opt-out)
- ไม่ log message bodies ที่มี PII/OTP

## Merged Details

### config-twilio

##### Goal

ตั้งค่า/แก้ไข Twilio configuration — phone numbers, Messaging Service, Verify Service และ webhook callbacks — โดย merge กับ config เดิม

##### Scope

- ครอบคลุม env keys, messaging/verify service SIDs และ webhook endpoints
- ถ้ายังไม่ได้ install SDK หรือไม่มี credentials → ทำ `workflows/setup-twilio/SKILL.md` ก่อน
- ไม่รวมการซื้อ number จริง — user ทำใน Twilio Console

##### Execute

###### 1. Read Current Config

> Goal: รู้ config ปัจจุบันก่อนแก้

1. อ่าน env keys ที่มีอยู่: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, `TWILIO_MESSAGING_SERVICE_SID`, `TWILIO_VERIFY_SERVICE_SID`
2. อ่าน code ที่สร้าง client และ webhook handlers ปัจจุบัน
3. ทำ `/deep-review` domain `review-config` ถ้าต้องรู้ drift ระหว่าง env กับ code

###### 2. Configure Phone Numbers And Services

> Goal: ระบุ sender identities ถูกต้อง

1. ระบุ `TWILIO_PHONE_NUMBER` (E.164 format) หรือ `TWILIO_MESSAGING_SERVICE_SID` สำหรับ SMS
2. ระบุ `TWILIO_VERIFY_SERVICE_SID` สำหรับ OTP ผ่าน Verify API
3. เก็บ SIDs ทั้งหมดผ่าน `/follow-secret-manager` — merge กับ env เดิม ห้าม overwrite

###### 3. Configure Webhooks

> Goal: รับ callbacks อย่างปลอดภัย

1. ตั้ง status callback / inbound webhook URL ใน Twilio Console (phone number หรือ messaging service settings)
2. สร้าง route รับ webhook เช่น `/api/webhooks/twilio`
3. verify signature ด้วย `twilio.validateRequest` กับ `TWILIO_AUTH_TOKEN` ทุก request
4. ตอบ `200` ทันทีและ process async — Twilio retry ถ้า timeout

###### 4. Verify

> Goal: config ทำงานได้จริง

1. ส่ง test SMS หรือ test OTP แล้วดู status callback เข้า webhook
2. ทำ `/run-verify` และ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ถ้าพัง → revert key ที่เพิ่งแก้แล้ว report diff

##### Rules

- แก้เฉพาะ keys ที่จำเป็น — ห้าม overwrite env/config ทั้งชุด
- verify webhook signatures เสมอ — ห้าม trust request โดยไม่ตรวจ
- ไม่ log message bodies ที่มี PII/OTP
- ระวัง regional compliance (sender IDs, opt-out) — ดู official docs ถ้าไม่แน่ใจ

##### Expected Outcome

- phone number/service SIDs ถูกต้องและอยู่ใน secret manager
- webhook route verify signature และรับ callbacks ได้
- test message/OTP ส่งสำเร็จ

### setup-twilio

##### Goal

ติดตั้ง Twilio SDK และเตรียม credentials (Account SID, Auth Token) ให้ server เรียก Twilio API ได้ — first-time setup ไม่ใช่ ongoing config

##### Scope

- ติดตั้ง `twilio` package และสร้าง client ฝั่ง server
- ตั้งค่า `TWILIO_ACCOUNT_SID` และ `TWILIO_AUTH_TOKEN` ผ่าน secret manager
- ถ้า setup ไปแล้ว → verify เท่านั้น; config phone numbers/webhooks → `workflows/config-twilio/SKILL.md`

##### Execute

###### 1. Check Prerequisites

> Goal: ยืนยัน project พร้อมและยังไม่ได้ setup

1. ตรวจ `package.json` ว่ามี `twilio` แล้วหรือยัง — ถ้ามี → skip ไปขั้น verify
2. ตรวจ env/secrets ว่ามี `TWILIO_ACCOUNT_SID` และ `TWILIO_AUTH_TOKEN` หรือยัง
3. ถ้าขาด credentials → ทำ `/open-web-for-config-secret` ชี้ user ไป Twilio Console

###### 2. Install SDK

> Goal: ติดตั้ง Twilio SDK ฝั่ง server

1. รัน `bun add twilio` (หรือ package manager ของ project)
2. ยืนยันว่า import ได้ด้วย `import twilio from 'twilio'`

###### 3. Configure Credentials

> Goal: เก็บ credentials อย่างปลอดภัย

1. สร้าง/หา Account SID และ Auth Token จาก Twilio Console
2. เก็บ `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` ผ่าน `/follow-secret-manager` — ห้าม commit หรือ expose ฝั่ง client

###### 4. Create Client

> Goal: client singleton พร้อมใช้

1. สร้าง client ด้วย `twilio(accountSid, authToken)` อ่านจาก env ฝั่ง server เท่านั้น
2. รัน smoke check เช่น `client.messages.list({ limit: 1 })` เพื่อยืนยัน auth ใช้ได้

###### 5. Verify

> Goal: SDK ทำงานได้จริง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report
3. สำเร็จ → ทำ `/suggest-next-action`

##### Rules

- ห้าม hardcode หรือ commit Account SID/Auth Token
- client ต้องอยู่ฝั่ง server เท่านั้น — ห้าม bundle เข้า client
- ใช้ official docs เป็นแหล่งหลัก ถ้าไม่แน่ใจ → ดู https://www.twilio.com/docs

##### Expected Outcome

- `twilio` ติดตั้งและ client ทำงานได้ฝั่ง server
- credentials อยู่ใน secret manager ไม่มีใน code
- smoke check ผ่าน — พร้อมไป `workflows/config-twilio/SKILL.md`

### verify-connection

##### Goal

ยืนยันหลัง setup/config ว่า Twilio เชื่อมต่อได้จริง — Account SID/Auth Token valid, messaging service/numbers พร้อม

##### Scope

- ใช้เมื่อ `/follow-service-twilio` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่ส่ง SMS/calls

##### Execute

###### 1. Check Credentials

> Goal: SID และ token มีครบ

1. ตรวจ `TWILIO_ACCOUNT_SID` (`AC...` format) และ `TWILIO_AUTH_TOKEN` มี (ไม่ print ค่า)
2. ถ้าใช้ messaging service → `TWILIO_MESSAGING_SERVICE_SID` (`MG...`) มี

###### 2. Smoke Test API Call

> Goal: account fetch ตอบกลับ

1. `twilio api:core:v2010:accounts:fetch` หรือ `client.api.accounts(sid).fetch()`
2. 200 = credentials valid; 401 = invalid token, 404 = wrong SID
3. บันทึก account status (`active`/`suspended`)

###### 3. Check Numbers And Webhooks

> Goal: sending capability พร้อม

1. `client.incomingPhoneNumbers.list({limit: 5})` — มี numbers ที่ส่งได้
2. ตรวจ webhook URLs ที่ config ไว้ตรงกับ app endpoints
3. flag: ไม่มี number, number ไม่มี SMS capability

###### 4. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `no-numbers` / `webhook-mismatch`

##### Rules

- ใช้ fetch/list calls เท่านั้น — ห้ามส่ง message/call
- ไม่ print auth token
- suspended account = flag ทันที

##### Expected Outcome

- Verdict พร้อม account status + numbers evidence

### references/package-manifest

#### Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/deep-review` runs.

##### Primary Package

| Field | Value |
|-------|-------|
| Package | `twilio` |
| Registry | `npm` |
| Latest Version | `6.1.1` |
| Release Date | `2026-09-10` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Twilio |
| License | `MIT` |
| Repository | `https://github.com/twilio/twilio-node` |
| Website | `https://www.twilio.com/` |
| Documentation | `https://www.twilio.com/docs/libraries/reference/twilio-node/` |
| Releases / Changelog | `https://github.com/twilio/twilio-node/releases` |

##### Install

```bash
bun add twilio
```

##### Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `twilio-cli` | `npm` | `unknown` | Optional CLI for local webhook testing / dev |

##### Notes

- Breaking changes in latest major: none documented for 6.x; use Verify API (`verify.v2`) instead of self-managed OTP
- Version pinned in SKILL.md: `6.1.1`

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (service twilio)
- ไม่มี security/performance pitfalls ที่รู้จัก (service twilio)
- Lint, typecheck, tests ผ่าน