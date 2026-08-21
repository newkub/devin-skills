---
name: run-verify
description: รัน verify task เพื่อตรวจสอบคุณภาพโค้ดตาม package manifest
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
  - run-scan
  - run-test
  - run-build
  - follow-gitignore
  - follow-tasks
---

## Goal

รัน verify task เพื่อตรวจสอบคุณภาพโค้ดตามที่กำหนดใน package manifest

## Scope

ตรวจสอบคุณภาพโค้ดด้วย verify script ที่รวม scan, typecheck, lint, test และ build

## Execute

### 1. Setup Tasks

> Goal: ตั้งค่า scripts และ config ก่อนรัน verify
> Goal: มี verify script และ config พร้อมรัน

1. ทำ `/follow-tasks` เพื่อตั้งค่า scripts มาตรฐานใน package manifest
2. ถ้า project ยังไม่มี verify script ให้สร้างตามมาตรฐาน
3. ทำ `/follow-config` เพื่อตั้งค่า config files ตาม dependencies
4. ทำ `/follow-gitignore` เพื่อตั้งค่า gitignore

### 2. Run Checks

> Goal: รัน scan, lint, typecheck และ test แบบ parallel เพื่อตรวจสอบคุณภาพโค้ด
> Goal: ไม่มี scan, lint, typecheck หรือ test errors

1. `/run-scan`, `/run-lint`, `/run-typecheck`, `/run-test`
2. ถ้า step ใด fail ให้เก็บ errors ทั้งหมดก่อนแก้ เพื่อลด rework
3. ถ้าไม่มี test files หรือ coverage ต่ำ ให้ทำ `/write-test` เพื่อเขียน tests ที่ขาด

### 3. Fix Errors

> Goal: แก้ไขข้อผิดพลาดจนกว่าจะผ่านทั้งหมด
> Goal: ไม่มี errors เหลือ

1. ทำ `/resolve-errors` เพื่อแก้ไขข้อผิดพลาดทั้งหมดที่พบจาก Step 2
2. รัน verify ซ้ำ — retry max 3 → stop/report

### 4. Run Build

> Goal: รัน build เพื่อสร้าง production-ready artifacts
> Goal: Build สำเร็จไม่มี errors

1. ทำ `/run-build` เพื่อสร้าง production-ready artifacts
2. ถ้าพบ build errors ให้ทำ `/resolve-errors` แล้วรันซ้ำ — retry max 3 → stop/report
3. ถ้าต้องการ CI pipeline ให้รัน `bun run ci` แทน `bun run verify` — `ci` = `verify && build`

## Rules

### 1. Verify Script Requirements

- ต้องมี verify script ใน package manifest ก่อนรัน
- verify script รวม scan, typecheck, lint, test และ build
- ci script รวม verify และ build สำหรับ CI/CD pipeline
- ใช้คำสั่งที่เหมาะสมกับ package manager (`bun`, `npm`, `pnpm`, `yarn`)

### 2. Error Handling

- ใช้ `/resolve-errors` เมื่อพบ error
- รัน verify ซ้ำหลังจากแก้ไข — retry max 3 → stop/report
- ห้ามข้ามขั้นตอนที่มี errors

### 3. Build

- ต้องรัน build หลังจาก verify ผ่าน
- ถ้า build ล้มเหลว ให้ทำ `/resolve-errors` แล้วรันซ้ำ — retry max 3 → stop/report

## Expected Outcome

- Code ผ่าน scan, lint, typecheck, และ test ทั้งหมด
- ไม่มี scan, typecheck, lint, หรือ test errors
- Build สำเร็จ ไม่มี build errors
- ถ้ารัน ci: Build artifacts ถูกสร้างอย่างถูกต้อง
