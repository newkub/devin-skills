---
name: follow-service-firebase-admin-setup-firebase-admin
description: ติดตั้ง firebase-admin SDK และตั้งค่า service account ให้พร้อมใช้งาน
argument-hint: "[project-path]"
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - run-verify
  - resolve-errors
  - suggest-next-action
---

## Goal

ติดตั้ง `firebase-admin` และเตรียม service account credentials ให้ server initialize app ได้ — first-time setup

## Scope

- ติดตั้ง package และสร้าง singleton `admin.initializeApp`
- ตั้งค่า service account ผ่าน secret manager
- ถ้า setup แล้ว → verify เท่านั้น; app/emulator config → `subskills/config-firebase-admin/SKILL.md`

## Execute

### 1. Check Prerequisites

> Goal: ยืนยัน project พร้อมและยังไม่ได้ setup

1. ตรวจ `package.json` ว่ามี `firebase-admin` แล้วหรือยัง — ถ้ามี → skip ไป verify
2. ตรวจ env/secrets ว่ามี service account (`FIREBASE_SERVICE_ACCOUNT` หรือ `GOOGLE_APPLICATION_CREDENTIALS`) หรือยัง
3. ถ้าขาด service account → ทำ `/open-web-for-config-secret` ชี้ user ไป Firebase Console → Project settings → Service accounts → Generate new private key

### 2. Install SDK

> Goal: ติดตั้ง firebase-admin ฝั่ง server

1. รัน `bun add firebase-admin` (หรือ package manager ของ project)
2. ยืนยัน import ได้ด้วย `import admin from 'firebase-admin'`

### 3. Configure Service Account

> Goal: credentials ปลอดภัย ไม่ commit

1. เก็บ service account JSON ผ่าน `/follow-secret-manager` — ห้าม commit `.json` หรือวางใน `.env` จริง
2. เลือกวิธีอ่าน: `GOOGLE_APPLICATION_CREDENTIALS` (path ไป JSON) หรือ env JSON string `FIREBASE_SERVICE_ACCOUNT`
3. เพิ่ม path/env ใน `.gitignore` ถ้าจำเป็น

### 4. Initialize App

> Goal: singleton app พร้อมใช้

1. สร้าง init module เช่น `admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })`
2. guard ด้วย `admin.apps.length` เพื่อไม่ init ซ้ำ — reuse instance เดียว
3. รัน smoke check เช่น `admin.auth().listUsers(1)` หรือ `getFirestore()` ping เพื่อยืนยัน auth

### 5. Verify

> Goal: SDK ทำงานได้จริง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report
3. สำเร็จ → ทำ `/suggest-next-action`

## Rules

- service account JSON เก็บใน secrets — ห้าม commit หรือ log
- admin SDK bypass security rules — validate input เองเสมอ
- ทำงานฝั่ง server เท่านั้น — ห้าม bundle เข้า client
- ใช้ official docs https://firebase.google.com/docs/admin/setup ถ้าไม่แน่ใจ

## Expected Outcome

- `firebase-admin` ติดตั้งและ initialize เป็น singleton
- service account อยู่ใน secret manager
- smoke check ผ่าน — พร้อมไป `subskills/config-firebase-admin/SKILL.md`
