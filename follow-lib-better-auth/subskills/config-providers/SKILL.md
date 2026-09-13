---
name: follow-lib-better-auth-config-providers
description: ตั้งค่า Better Auth social providers, email plugins และ options โดยไม่ clobber config เดิม
argument-hint: "[provider-or-plugin]"
related:
  - follow-lib-better-auth
  - follow-secret-manager
  - check-config-drift
  - report-before-after
  - learn
---

## Goal

ตั้งค่า Better Auth providers (social OAuth, email/password options) และ plugins ใน `auth.ts` ที่มีอยู่ — merge กับ config เดิม ไม่ overwrite

## Scope

- ใช้เมื่อ `auth.ts` setup แล้วและต้องเพิ่ม/แก้ providers, plugins, session options
- ครอบคลุม: `socialProviders`, `emailAndPassword` options, `plugins`, `trustedOrigins`, client plugin counterparts
- ถ้ายังไม่มี `auth.ts` → ทำ `subskills/setup-auth/SKILL.md` ก่อน

## Execute

### 1. Read Current Config

> Goal: เข้าใจ config เดิมก่อนแก้

1. อ่าน `auth.ts` ทั้งไฟล์ — ระบุ database, plugins, providers ที่มีอยู่
2. ตรวจ env vars ที่ใช้ (`BETTER_AUTH_*`, provider `CLIENT_ID`/`CLIENT_SECRET`)
3. ทำ `/check-config-drift` ถ้าสงสัย config ต่าง env — ถ้าไม่พบ config → ทำ `setup-auth` แทน

### 2. Configure Social Providers

> Goal: เพิ่ม OAuth providers ที่ถูกต้อง

1. เพิ่มใน `socialProviders` เช่น `github: { clientId, clientSecret }` — อ่านจาก env ห้าม hardcode
2. สร้าง OAuth app ที่ provider console แล้วตั้ง callback URL ให้ตรง `<BETTER_AUTH_URL>/api/auth/callback/<provider>`
3. เก็บ `clientId`/`clientSecret` ผ่าน `/follow-secret-manager`
4. Client side: `authClient.signIn.social({ provider: "github" })` — ตรวจ provider key ตรงกัน

### 3. Configure Email And Plugins

> Goal: เปิด email options และ plugins ที่จำเป็นเท่านั้น

1. `emailAndPassword`: `requireEmailVerification`, `sendResetPassword`, `minPasswordLength` ตามต้องการ — ต้องมี `sendEmail`/`sendVerificationEmail` implementation ถ้าเปิด verification
2. เพิ่ม plugins ใน `plugins: [...]` — เช่น `twoFactor()`, `organization()`, `passkey()`, `admin()`
3. ทุก plugin ที่มี client counterpart ต้องเพิ่มฝั่ง client ด้วย (`twoFactorClient()`, `organizationClient()` ฯลฯ)
4. หลังเพิ่ม plugin ที่มี schema → รัน `bunx auth@latest generate` หรือ `migrate` ให้ tables ตรง

### 4. Verify

> Goal: providers ทำงานจริงและ config เดิมไม่พัง

1. ทดสอบ OAuth flow จริงต่อ provider — callback กลับมา session ถูก set
2. ทดสอบ email flows ที่เปิด (verification, reset) — email ส่งได้จริงหรือ mock ใน dev
3. รัน lint/typecheck — config keys ต้อง type-check ผ่าน
4. ถ้าพัง → revert key ที่เพิ่งแก้แล้ว report diff; ผ่าน → `/report-before-after` สั้นๆ

## Rules

- อ่าน config เดิมก่อนเสมอ — merge เฉพาะ keys ที่จำเป็น ห้าม rewrite ทั้ง `auth.ts`
- Secrets (`clientSecret`, API keys) ผ่าน env vars เสมอ — ห้ามใส่ใน config file
- เปิดเฉพาะ providers/plugins ที่ใช้จริง — ทุก plugin เพิ่ม attack surface และ tables
- `trustedOrigins` ต้องครอบ origins ใหม่ที่เพิ่ม — แต่เข้มงวดเสมอ
- ถ้า option/plugin ไม่แน่ใจ → ทำ `/learn web` ดู official docs (better-auth.com)

## Expected Outcome

- Providers/plugins ที่ต้องการทำงานครบทั้ง server และ client side
- Config เดิมไม่เสีย — schema ตรงกับ plugins ที่เปิด
- OAuth/email flows verify ผ่านจริง
