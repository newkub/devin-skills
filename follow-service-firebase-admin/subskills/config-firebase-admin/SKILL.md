---
name: follow-service-firebase-admin-config-firebase-admin
description: ตั้งค่า firebase-admin app options และ emulator config โดยไม่ clobber ของเดิม
argument-hint: "[target-or-scope]"
related:
  - follow-secret-manager
  - check-config-drift
  - run-verify
  - run-test
---

## Goal

ตั้งค่า/แก้ไข firebase-admin configuration — app options (projectId, databaseURL, storageBucket) และ Emulator Suite — โดย merge กับ config เดิม

## Scope

- ครอบคลุม `initializeApp` options, env keys และ emulator env vars
- ถ้ายังไม่ได้ install/service account → ทำ `subskills/setup-firebase-admin/SKILL.md` ก่อน

## Execute

### 1. Read Current Config

> Goal: รู้ config ปัจจุบันก่อนแก้

1. อ่าน init module ปัจจุบัน, env keys (`FIREBASE_*`, `GOOGLE_APPLICATION_CREDENTIALS`) และ `firebase.json` ถ้ามี
2. ทำ `/check-config-drift` ถ้าต้องเทียบ env กับ code
3. ถ้าไม่พบ init → ทำ `subskills/setup-firebase-admin/SKILL.md` ก่อน

### 2. Configure App Options

> Goal: app options ตรง Firebase project

1. ระบุ options ที่จำเป็นใน `initializeApp` เช่น `projectId`, `databaseURL`, `storageBucket` — เพิ่มเฉพาะที่ใช้
2. ผูก services ที่ใช้จริง: `getAuth()`, `getFirestore()`, `getMessaging()`, `getStorage()`
3. secrets/SIDs ทั้งหมดผ่าน `/follow-secret-manager` — merge กับ env เดิม

### 3. Configure Emulator

> Goal: dev/test ใช้ Emulator Suite แทน production

1. ตั้ง emulator env vars เช่น `FIRESTORE_EMULATOR_HOST`, `FIREBASE_AUTH_EMULATOR_HOST`, `FIREBASE_STORAGE_EMULATOR_HOST` เฉพาะ dev/test
2. กำหนด emulators section ใน `firebase.json` ถ้า project ใช้ Firebase CLI — ดู official docs สำหรับ ports/keys ล่าสุด
3. guard ด้วย `NODE_ENV` — ห้ามชี้ไป emulator บน production
4. รัน emulator ด้วย `firebase emulators:start` เมื่อทดสอบ local

### 4. Verify

> Goal: config ทำงานทั้ง prod-mode และ emulator-mode

1. ทดสอบกับ emulator: write/read Firestore, verifyIdToken กับ test user
2. ทำ `/run-verify` และ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ถ้าพัง → revert key ที่เพิ่งแก้แล้ว report diff

## Rules

- แก้เฉพาะ keys/options ที่จำเป็น — ห้าม overwrite init module ทั้งไฟล์
- emulator env vars ต้องถูก unset บน production
- admin SDK bypass security rules — validate input เองเสมอ
- ระวัง quotas — ใช้ `writeBatch`/`bulkWriter` สำหรับ bulk operations

## Expected Outcome

- app options ถูกต้องและ init เป็น singleton
- emulator ใช้ได้ใน dev/test โดยไม่กระทบ production
- lint, typecheck, tests ผ่าน
