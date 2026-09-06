---
name: follow-tool-capgo
description: ใช้ @capgo/capacitor-updater OTA updates และ native-biometric auth ใน Capacitor apps
argument-hint: "[target-or-scope]"
related:
  - follow-best-practice
  - run-verify
  - run-test
  - report-table
---

## Goal

ใช้ @capgo/capacitor-updater OTA updates และ native-biometric auth ใน Capacitor apps

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. updater: `CapacitorUpdater.notifyAppReady()` หลัง boot สำเร็จ — ไม่งั้น rollback
1. updater: ตั้ง `autoUpdate` หรือ manual `download()`/`set()` flow
1. biometric: `NativeBiometric.isAvailable()` ก่อน `verifyIdentity()` — fallback เป็น PIN
1. biometric: เก็บ credentials ด้วย `setCredentials()` (Keychain/Keystore) ไม่ใช่ storage ธรรมดา

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ

## Rules

- OTA update เฉพาะ web assets — native changes ต้องผ่าน app store
- test rollback path — broken bundle ต้อง revert อัตโนมัติ
- biometric ต้องมี fallback เมื่อ hardware ไม่รองรับ

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices
- ไม่มี security/performance pitfalls ที่รู้จัก
- Lint, typecheck, tests ผ่าน