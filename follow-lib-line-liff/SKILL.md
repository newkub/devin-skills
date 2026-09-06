---
name: follow-lib-line-liff
description: ใช้ @line/liff สร้าง LIFF mini-apps — init, profile, login, shareTargetPicker
argument-hint: "[target-or-scope]"
related:
  - follow-best-practice
  - run-verify
  - run-test
  - report-table
---

## Goal

ใช้ @line/liff สร้าง LIFF mini-apps — init, profile, login, shareTargetPicker

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. init ด้วย `liff.init({liffId})` ใน client — liffId จาก LINE Developers console
1. เช็ค `liff.isInClient()`/`isLoggedIn()` ก่อนใช้ APIs
1. ใช้ `liff.getIDToken()` ส่งไป verify ฝั่ง server — ห้ามเชื่อ profile ฝั่ง client
1. ใช้ `shareTargetPicker`, `sendMessages`, `scanCodeV2` ตาม feature

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ

## Rules

- verify ID token ฝั่ง server ด้วย LINE API เสมอ
- LIFF v2 — SDK ทำงานใน LINE app หรือ external browser (behavior ต่างกัน)
- test ทั้ง in-client และ external browser mode
- handle init failures — liff.init เป็น promise

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices
- ไม่มี security/performance pitfalls ที่รู้จัก
- Lint, typecheck, tests ผ่าน