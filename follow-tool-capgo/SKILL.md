---
name: follow-tool-capgo
description: ใช้ @capgo/capacitor-updater OTA updates และ native-biometric auth ใน Capacitor apps
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test
  - follow-secret-manager
  - setup-cicd
---

## Goal

ใช้ @capgo/capacitor-updater OTA updates และ native-biometric auth ใน Capacitor apps

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices (tool capgo)

- Boundary: Capgo ทำ OTA update เฉพาะ web assets ของ Capacitor app — native code changes ต้อง release ผ่าน App Store/Play Store เสมอ; สำหรับเว็บ release ทั่วไปดู `/follow-tool-changesets` หรือ `/follow-tool-changelogen`
- Latest: `@capgo/capacitor-updater@8.51.16` / `@capgo/cli@8.51.0` (verified 2026-09-16)
- References: [apis](references/apis.md) | [cli](references/cli.md) | [package-manifest](references/package-manifest.md) | [routes](references/routes.md) | [website](references/website.md)

## Execute

### 1. Install Plugins And CLI

> Goal: ติดตั้ง updater/biometric plugins และ Capgo CLI

1. ติดตั้ง updater ใน app: `bun add @capgo/capacitor-updater` — ต้องมี `@capacitor/core` `^8.0.0` เป็น peer dependency
2. ถ้าใช้ biometric: `bun add @capgo/capacitor-native-biometric`
3. ติดตั้ง CLI เป็น dev tooling: `bun add -D @capgo/cli`
4. Sync native projects หลังเพิ่ม plugin: `bunx cap sync`

### 2. Configure Capgo Account

> Goal: auth และ register app บน Capgo

1. เตรียม `CAPGO_TOKEN` ผ่าน `/follow-secret-manager` — ห้าม hardcode
2. รัน `bunx capgo init` หรือ `bunx capgo login --apikey <key>`
3. Register app: `bunx capgo app add --name <app-name>`
4. ถ้าต้องการ signed updates: `bunx capgo key save --key <key-file>`

### 3. Implement OTA Update Flow

> Goal: updater ทำงานถูกต้องและ rollback ได้

1. เรียก `CapacitorUpdater.notifyAppReady()` หลัง boot สำเร็จ — ถ้าไม่เรียก bundle จะ rollback อัตโนมัติ
2. เลือก `autoUpdate` หรือ manual `download()`/`set()` flow
3. ทดสอบ rollback path — broken bundle ต้อง revert เอง

### 4. Implement Biometric Auth

> Goal: biometric login พร้อม fallback

1. เช็ค `NativeBiometric.isAvailable()` ก่อน `verifyIdentity()` — fallback เป็น PIN เมื่อ hardware ไม่รองรับ
2. เก็บ credentials ด้วย `setCredentials()` (Keychain/Keystore) ไม่ใช่ storage ธรรมดา

### 5. Upload Bundle Via CI

> Goal: deploy web bundle ไป channel ผ่าน CI

1. Upload: `bunx capgo bundle upload --channel production --path dist`
2. Assign channel: `bunx capgo channel set --channel production --latest`
3. ตั้ง `CAPGO_TOKEN` ใน CI secrets — ดู `/setup-cicd` สำหรับ workflow

### 6. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (tool capgo)

## Rules

- OTA update เฉพาะ web assets — native changes ต้องผ่าน app store
- `@capgo/capacitor-updater` v8 ต้องใช้ `@capacitor/core` `^8.0.0` (peer dependency)
- test rollback path — broken bundle ต้อง revert อัตโนมัติ
- biometric ต้องมี fallback เมื่อ hardware ไม่รองรับ

- ใช้ /follow-secret-manager ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น
- ใช้ /run-verify ถ้าจำเป็น
- ใช้ /run-test ถ้าจำเป็น

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (tool capgo)
- ไม่มี security/performance pitfalls ที่รู้จัก (tool capgo)
- Lint, typecheck, tests ผ่าน
