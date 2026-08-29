---
name: run-verify-on-local
description: รัน verify ใน local ครอบคลุม scan, lint, typecheck, test และ build
related:
  - run-scan
  - run-lint
  - run-typecheck
  - run-test
  - run-build
  - run-test-all
  - run-verify-on-ci-cd
  - ship-to-cloud
  - resolve-errors
  - report-table
  - suggest-next-action
---

## Goal

รัน verify task ใน local เพื่อตรวจสอบคุณภาพโค้ดก่อนส่งไป CI/CD

## Scope

ตรวจสอบคุณภาพโค้ดด้วย scripts ทีมีใน package manifest ใน local environment
ไม่แก้ไข project config, ไม่ push, ไม่ setup
ถ้าต้องการ verify แบบเต็มรูปแบบบน CI ให้ใช้ `/run-verify-on-ci-cd` หรือ `/ship-to-cloud`

## Execute

### 1. Run Checks

> Goal: รัน scan, lint, typecheck, test และ build

1. ทำ `/run-scan`, `/run-lint`, `/run-typecheck`, `/run-test`, `/run-build`
2. รัน parallel เท่าทีทำได้ตาม project config
3. ถ้า step ใด fail ให้เก็บ errors ทั้งหมดก่อนแก้

### 2. Fix Errors

> Goal: แก้ไขข้อผิดพลาด

1. ทำ `/resolve-errors` เพื่อแก้ไขข้อผิดพลาด
2. รัน verify ซ้ำ — retry max 3 → stop/report

## Rules

### 1. Verify Only

- ใช้ scripts ที่มีอยู่ใน package manifest
- ไม่เรียก `/follow-tasks`, `/review-delivery`, `/follow-gitignore` ใน verify
- ไม่ modify project config

### 2. Error Handling

- ใช้ `/resolve-errors` เมื่อพบ error
- รัน verify ซ้ำหลังจากแก้ไข — retry max 3 → stop/report
- ห้ามข้ามขั้นตอนที่มี errors

### 3. Local Scope

- ไม่ push, ไม่ release, ไม่ deploy
- ถ้าต้องการ full suite ให้ใช้ `/run-test-all` ต่อ หรือใช้ `/run-verify-on-ci-cd`

## Expected Outcome

- Code ผ่าน scan, lint, typecheck, และ test
- Build สำเร็จ
- ไม่มี scan, typecheck, lint, test หรือ build errors
