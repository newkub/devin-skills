---
name: follow-service-firebase-admin-verify-connection
description: ยืนยัน Firebase Admin SDK ใช้งานได้ — service account valid, project เข้าถึงได้
argument-hint: "[project-id]"
related:
  - report
---

## Goal

ยืนยันหลัง setup/config ว่า Firebase Admin SDK เชื่อมต่อได้จริง — service account valid, project access, API call ตอบกลับ

## Scope

- ใช้เมื่อ `/follow-service-firebase-admin` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่แก้ credentials

## Execute

### 1. Check Service Account

> Goal: credentials มีและ project ถูก

1. ตรวจ `GOOGLE_APPLICATION_CREDENTIALS` path มีไฟล์จริง หรือ env-based credentials ครบ
2. ตรวจ `project_id` ใน service account ตรงกับ project ที่คาด

### 2. Smoke Test API Call

> Goal: Admin SDK call ตอบกลับ

1. เรียก `admin.auth().listUsers(1)` — minimal read call
2. ถ้าใช้ emulator → ตรวจ `FIREBASE_AUTH_EMULATOR_HOST` ตั้งไว้และ emulator รันอยู่
3. flag permission errors (insufficient IAM role)

### 3. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `wrong-project` / `emulator-down`

## Rules

- ใช้ read calls เท่านั้น — ห้าม create/delete user
- ไม่ print service account JSON
- auth failure → แนะนำ `/follow-secret-manager` — ไม่แก้เอง

## Expected Outcome

- Verdict connection พร้อม project-id evidence
