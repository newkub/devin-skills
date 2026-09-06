---
name: follow-service-firebase-admin
description: ใช้ firebase-admin ฝั่ง server — Auth, Firestore, FCM, storage, service account
argument-hint: "[target-or-scope]"
related:
  - follow-best-practice
  - run-verify
  - run-test
  - report-table
---

## Goal

ใช้ firebase-admin ฝั่ง server — Auth, Firestore, FCM, storage, service account

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. initialize ด้วย `admin.initializeApp({credential: cert(serviceAccount)})` — key จาก env
1. ใช้ `getAuth()` สำหรับ verifyIdToken/custom claims, `getFirestore()` สำหรับ DB
1. ใช้ `getMessaging()` สำหรับ FCM push notifications
1. batch operations ด้วย `bulkWriter`/`writeBatch` — ระวัง quotas

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ

## Rules

- service account JSON เก็บใน secrets — ห้าม commit
- admin SDK bypass security rules — validate input เองเสมอ
- reuse app instance (singleton) — อย่า init ซ้ำ
- ทดสอบกับ emulator suite ใน dev

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices
- ไม่มี security/performance pitfalls ที่รู้จัก
- Lint, typecheck, tests ผ่าน