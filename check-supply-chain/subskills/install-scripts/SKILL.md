---
name: check-supply-chain-install-scripts
description: Audit lifecycle install scripts — network calls, file writes, obfuscation
argument-hint: "[manifest-path]"
related:
  - review-dependencies
  - report
---

## Goal

ตรวจ lifecycle scripts (`preinstall`/`install`/`postinstall`) ที่รันโค้ดตอน install — network calls, file writes นอก package, spawn, obfuscation

## Scope

- ใช้เมื่อ `/check-supply-chain` dispatch มาที่ `install-scripts`/`scripts` หรือเรียกเดี่ยวๆ
- Read-only: รายงาน — ห้ามรัน install scripts เพื่อทดสอบ

## Execute

### 1. Inventory Install Scripts

> Goal: รวม deps ทั้งหมดที่มี lifecycle scripts

1. ค้น `preinstall`/`install`/`postinstall` ใน deps ทั้งหมด
2. จัดกลุ่ม: build scripts (node-gyp, esbuild) vs unknown scripts

### 2. Flag Dangerous Behavior

> Goal: หา scripts ที่ทำอะไรนอกเหนือ build

1. flag scripts ที่: เรียก network, เขียนไฟล์นอก package, spawn processes, obfuscated
2. ตรวจว่า project เปิด `--ignore-scripts` หรือไม่ — trade-off ที่ต้องระบุ
3. บันทึก findings พร้อม evidence (script content)

### 3. Report

> Goal: ส่ง findings กลับ parent

1. ตาราง: `No.`, `Finding`, `Package/Location`, `Severity`, `Evidence`, `Fix`

## Rules

- obfuscated script หรือ network call ใน install script = Critical
- known build scripts (node-gyp, esbuild, sharp) = ระบุแต่ไม่ flag เป็น risk

## Expected Outcome

- Findings ของ install scripts พร้อม severity และ evidence
