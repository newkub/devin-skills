---
name: follow-service-workos-config-workos
description: ตั้งค่า WorkOS AuthKit, SSO connections, Directory Sync และ redirect URIs
argument-hint: "[project-path]"
related:
  - follow-service-workos
  - follow-secret-manager
  - open-web-for-config-secret
  - check-secrets
  - check-config-drift
  - run-verify
---

## Goal

ตั้งค่า/แก้ไข WorkOS configuration — AuthKit, SSO connections, Directory Sync, redirect URIs และ session config — โดยไม่ clobber settings เดิม

## Scope

- กำหนด env vars และ redirect URIs
- ตั้งค่า AuthKit/User Management หรือ legacy `sso.*` flow
- สร้าง organization, connection (SAML/OIDC) และ Directory Sync webhook
- ไม่ครอบคลุม first-time SDK install → ใช้ `subskills/setup-workos/SKILL.md`

## Execute

### 1. Read Current Config

> Goal: รู้สถานะปัจจุบันก่อนแก้

1. อ่าน `.env*` และ auth module ที่มีอยู่เพื่อระบุ flow ที่ใช้ (AuthKit vs `sso.*`)
2. ทำ `/check-secrets env-vars` เพื่อระบุ vars ที่ขาด
3. ตรวจ redirect URIs และ connections ที่ตั้งไว้แล้วใน dashboard — ใช้ `/open-web-for-config-secret` (service workos)
4. ถ้ายังไม่มี SDK/credentials → ทำ `subskills/setup-workos/SKILL.md` แทน

### 2. Configure Env And Redirects

> Goal: ตั้งค่า env vars และ redirect URIs ให้ครบ

1. กำหนด `WORKOS_API_KEY`, `WORKOS_CLIENT_ID` (server-only สำหรับ API key)
2. ถ้าใช้ AuthKit sessions → กำหนด cookie password env เช่น `WORKOS_COOKIE_PASSWORD` (ค่าสุ่มยาว เก็บใน `/follow-secret-manager`)
3. ตั้ง redirect URI และ allowed origins ใน dashboard ให้ตรงกับ app routes เช่น `/callback`
4. Merge เฉพาะ keys ที่จำเป็น — ห้าม overwrite env/config เดิม

### 3. Configure AuthKit Or SSO

> Goal: เปิด auth flow ที่ถูกต้องตาม product

1. AuthKit (modern path): เปิด AuthKit ใน dashboard และใช้ User Management APIs สำหรับ authorization URL, code exchange, session
2. Legacy SSO: ใช้ `workos.sso.getAuthorizationURL` และ `workos.sso.getProfileAndToken`
3. สร้าง organization และ connection ตาม provider (SAML, OIDC, Google, Microsoft)
4. ตั้งค่า `state` และ PKCE (`code_challenge`) สำหรับ flow ที่รองรับ

### 4. Configure Directory Sync And Webhooks

> Goal: รับ user/group events อย่างปลอดภัย

1. สร้าง directory สำหรับ connection ที่ต้อง sync
2. กำหนด webhook endpoint ใน dashboard และเก็บ webhook secret ใน `/follow-secret-manager`
3. Verify webhook signature ทุกครั้งตาม official docs
4. Map `dsync.*` events ไปยัง user/group handlers ของ app

### 5. Verify

> Goal: ยืนยันว่า auth flow ทำงานได้ end-to-end

1. ทดสอบ authorization URL → callback → session ใน dev
2. ทำ `/run-verify` และทดสอบ webhook delivery ถ้ามี
3. ถ้า fail → revert keys ที่แก้ ทำ `resolve-errors` แล้ว report diff

## Rules

- ใช้ environment-based config — ห้าม hardcode keys หรือ commit secrets
- AuthKit/User Management API เป็น modern path — `sso.*` ใช้เฉพาะ legacy flow ที่มีอยู่แล้ว
- Validate webhook signatures ทุกครั้ง
- Redirect URIs ใน dashboard ต้องตรงกับ routes จริงทุก environment
- ถ้า option/method ไม่แน่ใจ → ดู official docs หรือ `learn` (web)

## Expected Outcome

- AuthKit/SSO flow ทำงานได้ตั้งแต่ authorize ถึง session
- Redirect URIs, connections, organizations ถูกต้องตาม environment
- Directory Sync webhook ปลอดภัยและรับ events ได้
- Config merge โดยไม่ clobber settings เดิม
