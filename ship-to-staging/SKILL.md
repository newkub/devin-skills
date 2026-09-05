---
name: ship-to-staging
description: Deploy feature branch ไปยัง staging environment แล้วรัน smoke tests
argument-hint: "[app-or-package]"
related:
  - ship
  - ship-to-production
  - run-deploy
  - watch-deploy
  - resolve-errors
  - run-test
  - run-verify
  - report-table
  - ask-me
---

## Goal

Deploy feature branch ไปยัง staging environment แล้วรัน smoke tests เพื่อยืนยันว่าพร้อมไป production

## Scope

ใช้จาก `/ship` หรือ standalone — ทำงานบน feature branch ปัจจุบัน, deploy ไป staging, ไม่ merge หรือ deploy production

## Execute

### 1. Confirm Branch And Commit

> Goal: แน่ใจว่า deploy จาก feature branch ที่ถูกต้อง

1. ตรวจ `git status` — ถ้ามี uncommitted changes ที่ยังไม่ได้ commit บน feature branch → ทำ `git commit` หรือ `/git-commit-and-push-features-branch` ก่อน
2. บันทึก branch name และ current commit hash
3. ถ้าไม่อยู่บน feature branch → `/ask-me`

### 2. Verify Build

> Goal: แน่ใจว่า artifact พร้อม deploy

1. ทำ `/run-verify` เบื้องต้น — build, lint, typecheck
2. ถ้ามี `e2e` หรือ `integration` tests สำหรับ staging → ทำ `/run-test`
3. ถ้าไม่ผ่าน → `/resolve-errors` ก่อน deploy

### 3. Detect Staging Environment

> Goal: รู้ว่า staging อยู่ที่ไหน

1. อ่าน `AGENTS.md` หรือ config หา staging URL/deployment command
2. ตรวจ `package.json` scripts (`deploy:staging`, `ship:staging`, ฯลฯ)
3. ถ้าไม่พบ staging env → หยุดและ report ว่าไม่มี staging

### 4. Deploy To Staging

> Goal: ขึ้น staging จริง

1. รัน staging deploy command ตาม `AGENTS.md` หรือ `package.json` — ใช้ `/run-deploy` ถ้ามี skill สำหรับ target
2. บันทึก deploy URL, commit hash, deploy time
3. ถ้า deploy fail → `/resolve-errors` ไม่ไป production

### 5. Smoke Test Staging

> Goal: ตรวจว่า staging ทำงานได้

1. ทำ `/watch-deploy` หรือ health check endpoints
2. รัน smoke tests: critical user flows, API health, database connectivity
3. ถ้ามี `/test-uxui-by-agent-browser` สำหรับ critical routes → รันด้วย

### 6. Report Status

> Goal: บอกผล staging

1. ทำ `/report-table` สรุป staging deploy, tests, status
2. ถ้าผ่าน → ระบุ `ready-for-production: true` พร้อม commit hash แล้วส่งต่อ `/ship-to-production`
3. ถ้าไม่ผ่าน → report findings และ stop

## Rules

### 1. Feature Branch Only

- deploy staging จาก feature branch ปัจจุบัน ไม่ใช่ `main`
- ถ้าอยู่บน `main` ให้หยุดและถาม `/ask-me`

### 2. Gate To Production

- staging ไม่ผ่าน → ห้ามไป production โดยไม่มี user confirm และ clear reason
- ทุก finding ใน staging ต้องมี evidence

### 3. No Production Touch

- skill นี้ห้าม deploy ไป production
- ห้าม merge/PR/force-push

## Expected Outcome

- feature branch ถูก deploy ไป staging และผ่าน smoke tests
- รายงาน `ready-for-production` ชัดเจนพร้อม commit hash
- ถ้าไม่ผ่าน มี findings ไม่ให้ไป production
