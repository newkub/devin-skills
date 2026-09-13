---
name: follow-lib-line-liff
description: ใช้ @line/liff สร้าง LIFF mini-apps — init, profile, login, shareTargetPicker
argument-hint: "[target-or-scope]"
related:
  - follow-secret-manager
  - run-verify
  - run-test
---

## Goal

ใช้ @line/liff สร้าง LIFF mini-apps — init, profile, login, shareTargetPicker

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ `@line/liff` — LIFF SDK ฝั่ง client (browser/LINE app) เท่านั้น (lib line liff)

- `@line/liff` เป็น browser-only SDK — ใช้ใน SPA/frontend เท่านั้น ไม่ใช่ server-side
- Server-side: verify ID token ผ่าน LINE verify endpoint + Messaging API อยู่นอก scope ของ skill นี้
- Channel secrets/credentials จัดการผ่าน `/follow-secret-manager` — ห้าม commit

- Latest: `@line/liff@2.31.0` (verified 2026-09-13)
- References: [apis](references/apis.md) | [package-manifest](references/package-manifest.md) | [routes](references/routes.md) | [website](references/website.md)

## Execute

### 1. Check Preconditions

> Goal: เตรียม LIFF app และ channel ก่อนเขียน code

1. สร้าง LIFF app ใน LINE Developers Console ผูกกับ channel — ได้ `liffId`
1. ตั้ง endpoint URL ของ LIFF app ใน console ให้ตรงกับ URL ที่ host app จริง
1. ติดตั้ง `bun add @line/liff` — types รวมอยู่ใน package
1. เก็บ `liffId` ใน env/config — ห้าม hardcode ถ้าแยกตาม environment

### 2. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. init ด้วย `liff.init({liffId})` ใน client — await promise ก่อนใช้ API อื่น; `withLoginOnExternalBrowser` สำหรับ auto-login นอก LINE app
1. เช็ค `liff.isInClient()`/`isLoggedIn()` ก่อนใช้ APIs — นอก LINE app ต้อง `liff.login()` (OAuth redirect, รับ `redirectUri` ได้)
1. ใช้ `liff.getProfile()` สำหรับ display และ `liff.getIDToken()` ส่งไป verify ฝั่ง server — ห้ามเชื่อ profile ฝั่ง client
1. ใช้ `shareTargetPicker`, `sendMessages`, `scanCodeV2`, `getContext()` (type, userId, chatId) ตาม feature — บาง API ใช้ได้เฉพาะใน LINE app

### 3. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (lib line liff)

## Rules

- verify ID token ฝั่ง server ด้วย LINE API เสมอ
- LIFF v2 — SDK ทำงานใน LINE app หรือ external browser (behavior ต่างกัน)
- test ทั้ง in-client และ external browser mode
- handle init failures — liff.init เป็น promise

- ใช้ `/follow-secret-manager` ถ้าต้องจัดการ channel secrets
- ใช้ `/run-verify` ถ้าจำเป็น
- ใช้ `/run-test` ถ้าจำเป็น

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (lib line liff)
- ไม่มี security/performance pitfalls ที่รู้จัก (lib line liff)
- Lint, typecheck, tests ผ่าน
