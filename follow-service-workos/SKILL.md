---
name: follow-service-workos
description: ใช้งาน WorkOS สำหรับ SSO, Directory Sync, และ Authentication
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - follow-create-product
  - follow-lib-better-auth

---

## Goal

กำหนดค่าและใช้งาน WorkOS APIs สำหรับ authentication และ identity management

## Scope

ใช้ใน project ที่ต้องการ WorkOS SSO, SCIM, User Management หรือ Admin Portal

## Execute

### Workflows

> Goal: dispatch ไปยัง workflow ที่ตรงกับ topic

- Setup: SDK install, `WORKOS_API_KEY`/`WORKOS_CLIENT_ID`, client init → `workflows/setup-workos/SKILL.md`
- Config: AuthKit/SSO, redirect URIs, organizations/connections, Directory Sync webhooks → `workflows/config-workos/SKILL.md`
- Verify: API key/client id valid, organizations reachable → `workflows/verify-connection/SKILL.md`

### 1. Install SDK

เตรียม SDK สำหรับ WorkOS
> Goal: ติดตั้ง SDK และเตรียม credentials ให้พร้อมใช้งาน

Latest: `@workos-inc/node@10.14.0` (verified 2026-09-24) — AuthKit/User Management API เป็น modern path, `sso.*` เป็น legacy flow

1. install package ตาม runtime (`bun add @workos-inc/node`, `workos-python`, etc.)
2. สร้าง API key จาก WorkOS Dashboard
3. เก็บ `WORKOS_API_KEY` และ `WORKOS_CLIENT_ID` ใน `/follow-secret-manager` แล้ว inject เข้า environment

### 2. Configure WorkOS

กำหนดค่า WorkOS ให้พร้อมใช้งาน
> Goal: กำหนดค่า environment, redirect URI และ organization

1. กำหนด `WORKOS_API_KEY` และ `WORKOS_CLIENT_ID`
2. กำหนด redirect URI และ allowed origins
3. สร้าง organization และ connection ตาม provider (SAML, OIDC, Microsoft, Google)

### 3. Implement SSO

ใช้งาน SSO ด้วย WorkOS APIs
> Goal: สร้าง authorization flow และจัดการ user session

1. สร้าง `authorization_url` ด้วย `workos.sso.getAuthorizationURL`
2. รับ `code` callback และเรียก `workos.sso.getProfileAndToken`
3. สร้าง/อัปเดต user session
4. ตรวจสอบ `state` และ `code_challenge` สำหรับ PKCE

### 4. Directory Sync

จัดการ Directory Sync และ webhook events
> Goal: Directory Sync

1. สร้าง directory สำหรับ connection
2. กำหนด webhook endpoint สำหรับ events
3. จัดการ users/groups จาก `dsync.*` APIs
4. ตรวจสอบ webhook signature

## Rules

### 1. Security

- ไม่ hardcode API key ใน code
- เก็บ `WORKOS_API_KEY` ใน `/follow-secret-manager`
- validate webhook signatures ทุกครั้ง
- จัดการ state อย่างปลอดภัย

### 2. Configuration

- ใช้ environment-based config

- ใช้ /open-web-for-config-secret ถ้าจำเป็น (service workos)
- ใช้ /follow-create-product ถ้าจำเป็น
- ใช้ /follow-lib-better-auth ถ้าจำเป็น

## Merged Details

### config-workos

##### Goal

ตั้งค่า/แก้ไข WorkOS configuration — AuthKit, SSO connections, Directory Sync, redirect URIs และ session config — โดยไม่ clobber settings เดิม

##### Scope

- กำหนด env vars และ redirect URIs
- ตั้งค่า AuthKit/User Management หรือ legacy `sso.*` flow
- สร้าง organization, connection (SAML/OIDC) และ Directory Sync webhook
- ไม่ครอบคลุม first-time SDK install → ใช้ `workflows/setup-workos/SKILL.md`

##### Execute

###### 1. Read Current Config

> Goal: รู้สถานะปัจจุบันก่อนแก้

1. อ่าน `.env*` และ auth module ที่มีอยู่เพื่อระบุ flow ที่ใช้ (AuthKit vs `sso.*`)
2. ทำ `/check-secrets env-vars` เพื่อระบุ vars ที่ขาด
3. ตรวจ redirect URIs และ connections ที่ตั้งไว้แล้วใน dashboard — ใช้ `/open-web-for-config-secret` (service workos)
4. ถ้ายังไม่มี SDK/credentials → ทำ `workflows/setup-workos/SKILL.md` แทน

###### 2. Configure Env And Redirects

> Goal: ตั้งค่า env vars และ redirect URIs ให้ครบ

1. กำหนด `WORKOS_API_KEY`, `WORKOS_CLIENT_ID` (server-only สำหรับ API key)
2. ถ้าใช้ AuthKit sessions → กำหนด cookie password env เช่น `WORKOS_COOKIE_PASSWORD` (ค่าสุ่มยาว เก็บใน `/follow-secret-manager`)
3. ตั้ง redirect URI และ allowed origins ใน dashboard ให้ตรงกับ app routes เช่น `/callback`
4. Merge เฉพาะ keys ที่จำเป็น — ห้าม overwrite env/config เดิม

###### 3. Configure AuthKit Or SSO

> Goal: เปิด auth flow ที่ถูกต้องตาม product

1. AuthKit (modern path): เปิด AuthKit ใน dashboard และใช้ User Management APIs สำหรับ authorization URL, code exchange, session
2. Legacy SSO: ใช้ `workos.sso.getAuthorizationURL` และ `workos.sso.getProfileAndToken`
3. สร้าง organization และ connection ตาม provider (SAML, OIDC, Google, Microsoft)
4. ตั้งค่า `state` และ PKCE (`code_challenge`) สำหรับ flow ที่รองรับ

###### 4. Configure Directory Sync And Webhooks

> Goal: รับ user/group events อย่างปลอดภัย

1. สร้าง directory สำหรับ connection ที่ต้อง sync
2. กำหนด webhook endpoint ใน dashboard และเก็บ webhook secret ใน `/follow-secret-manager`
3. Verify webhook signature ทุกครั้งตาม official docs
4. Map `dsync.*` events ไปยัง user/group handlers ของ app

###### 5. Verify

> Goal: ยืนยันว่า auth flow ทำงานได้ end-to-end

1. ทดสอบ authorization URL → callback → session ใน dev
2. ทำ `/run-verify` และทดสอบ webhook delivery ถ้ามี
3. ถ้า fail → revert keys ที่แก้ ทำ `resolve-errors` แล้ว report diff

##### Rules

- ใช้ environment-based config — ห้าม hardcode keys หรือ commit secrets
- AuthKit/User Management API เป็น modern path — `sso.*` ใช้เฉพาะ legacy flow ที่มีอยู่แล้ว
- Validate webhook signatures ทุกครั้ง
- Redirect URIs ใน dashboard ต้องตรงกับ routes จริงทุก environment
- ถ้า option/method ไม่แน่ใจ → ดู official docs หรือ `learn` (web)

##### Expected Outcome

- AuthKit/SSO flow ทำงานได้ตั้งแต่ authorize ถึง session
- Redirect URIs, connections, organizations ถูกต้องตาม environment
- Directory Sync webhook ปลอดภัยและรับ events ได้
- Config merge โดยไม่ clobber settings เดิม

### setup-workos

##### Goal

ติดตั้ง WorkOS SDK, สร้าง credentials จาก dashboard และ init client ให้พร้อมเรียก APIs — first-time setup เท่านั้น

##### Scope

- ติดตั้ง SDK ตาม runtime (`@workos-inc/node`, `workos-python`, ฯลฯ)
- สร้างและเก็บ `WORKOS_API_KEY`, `WORKOS_CLIENT_ID` อย่างปลอดภัย
- Init client และ smoke check
- ไม่ครอบคลุม AuthKit/SSO/Directory config → ใช้ `workflows/config-workos/SKILL.md`

##### Execute

###### 1. Check Prerequisites

> Goal: ยืนยัน runtime และสถานะปัจจุบัน (idempotent)

1. อ่าน `package.json` เพื่อระบุ runtime และ package manager
2. ตรวจว่ามี `@workos-inc/node` หรือ SDK อื่นติดตั้งแล้ว → ถ้ามี skip ไป verify
3. ทำ `/check-secrets env-vars` เพื่อดูว่า `WORKOS_API_KEY`, `WORKOS_CLIENT_ID` มีอยู่หรือยัง
4. ถ้าไม่มี WorkOS account → stop และแจ้ง user สร้างจาก dashboard

###### 2. Install SDK

> Goal: ติดตั้ง SDK ตาม runtime

1. Node/Bun: `bun add @workos-inc/node` (หรือ package manager ที่ตรวจพบ)
2. Python: `pip install workos` — ภาษาอื่นดู official docs
3. ยืนยันว่า dependency อยู่ใน manifest ของ project

###### 3. Create And Store Credentials

> Goal: เตรียม API key และ client ID อย่างปลอดภัย

1. สร้าง API key และอ่าน client ID จาก WorkOS Dashboard — ใช้ `/open-web-for-config-secret` (service workos) ถ้าต้องเปิด dashboard
2. เก็บ `WORKOS_API_KEY` และ `WORKOS_CLIENT_ID` ใน `/follow-secret-manager` ห้ามใส่ `.env` จริง
3. Inject เข้า environment ของ dev/staging/prod แยกกัน

###### 4. Init Client And Verify

> Goal: init client และ smoke check กับ API จริง

1. สร้าง client เช่น `new WorkOS(process.env.WORKOS_API_KEY)` ใน server-side module
2. Smoke check ด้วย read-only call เช่น list users/organizations — ดู official docs สำหรับ method ล่าสุด
3. ทำ `/run-verify` — ถ้า fail → ทำ `resolve-errors` max 3 รอบ แล้ว stop report

##### Rules

- ห้าม hardcode API key หรือ commit secrets — ใช้ `/follow-secret-manager` เสมอ
- Client ต้อง init ฝั่ง server เท่านั้น ห้าม expose `WORKOS_API_KEY` ไป browser
- แยก keys ตาม environment (dev/staging/prod)
- ถ้า API/method ไม่แน่ใจ → ดู official docs หรือ `learn` (web) ก่อน

##### Expected Outcome

- WorkOS SDK ติดตั้งและอยู่ใน manifest
- `WORKOS_API_KEY`, `WORKOS_CLIENT_ID` ปลอดภัยและ inject ถูกต้อง
- Client init และ smoke check ผ่าน

### verify-connection

##### Goal

ยืนยันหลัง setup/config ว่า WorkOS เชื่อมต่อได้จริง — `WORKOS_API_KEY`/`WORKOS_CLIENT_ID` valid, API ตอบกลับ

##### Scope

- ใช้เมื่อ `/follow-service-workos` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่แก้ organizations/connections

##### Execute

###### 1. Check Credentials

> Goal: key และ client id ครบ

1. ตรวจ `WORKOS_API_KEY` (`sk_...` test / live format) และ `WORKOS_CLIENT_ID` (`client_...`) มี — ไม่ print ค่า
2. flag test keys ใน production config (หรือกลับกัน)
3. ถ้าใช้ webhooks → `WORKOS_WEBHOOK_SECRET` มี

###### 2. Smoke Test API Call

> Goal: WorkOS API ตอบกลับ

1. เรียก `workos.organizations.listOrganizations({limit: 1})` หรือ equivalent minimal call
2. 200 = key valid; 401 = invalid key
3. ถ้าใช้ AuthKit → ตรวจ redirect URI config ตรง app

###### 3. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `env-mismatch` / `webhook-missing`

##### Rules

- ใช้ list calls เท่านั้น — ห้าม create/update/delete
- ไม่ print key values — แสดงแค่ prefix/environment
- auth failure → แนะนำ `/follow-secret-manager` — ไม่แก้เอง

##### Expected Outcome

- Verdict พร้อม environment (test/live) evidence

### references/package-manifest

#### Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/deep-review` runs.

##### Primary Package

| Field | Value |
|-------|-------|
| Package | `@workos-inc/node` |
| Registry | `npm` |
| Latest Version | `10.13.0` |
| Release Date | `2026-08-31` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | WorkOS |
| License | `MIT` |
| Repository | `https://github.com/workos/workos-node` |
| Website | `https://workos.com/` |
| Documentation | `https://workos.com/docs` |
| Releases / Changelog | `https://github.com/workos/workos-node/releases` |

##### Install

```bash
bun add @workos-inc/node
```

##### Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `workos` | `PyPI` | `unknown` | `workos-python` SDK for Python backends |
| `@workos-inc/authkit-nextjs` | `npm` | `unknown` | AuthKit helpers for Next.js apps |

##### Notes

- Breaking changes in latest major: AuthKit / User Management API is the modern path; `sso.*` calls are the legacy flow
- Version pinned in SKILL.md: `10.13.0`

## Expected Outcome

- WorkOS SDK พร้อมใช้งานและกำหนดค่าถูกต้อง
- SSO/Dsync พร้อมใช้งาน
- Credentials ปลอดภัย
- User data sync ถูกต้อง
