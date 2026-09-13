---
name: check-supply-chain-pinning
description: ตรวจ version pinning และ registry sources — floating versions, .npmrc, CI install flags
argument-hint: "[manifest-path]"
related:
  - review-dependencies
  - report
---

## Goal

ตรวจ reproducibility ของ supply chain — floating versions, registry config, CI install flags

## Scope

- ใช้เมื่อ `/check-supply-chain` dispatch มาที่ `pinning`/`sources` หรือเรียกเดี่ยวๆ
- Read-only: รายงาน — แก้ผ่าน `/review-dependencies`

## Execute

### 1. Version Pinning

> Goal: ไม่มี floating versions ที่ auto-resolve

1. flag: floating versions (`*`, `latest`) ที่ auto-resolve ไปเวอร์ชันใหม่
2. flag ranges ที่กว้างเกิน (`>=` โดยไม่มี upper bound) ใน deps ที่ sensitive

### 2. Registry And CI Config

> Goal: sources และ CI install ปลอดภัย

1. ตรวจ `.npmrc`/registry config — มี scope overrides หรือ auth tokens ถูก commit ไหม
2. ตรวจ CI: install ด้วย `--frozen-lockfile`/`--immutable` ไหม
3. บันทึก findings พร้อม evidence

### 3. Report

> Goal: ส่ง findings กลับ parent

1. ตาราง: `No.`, `Finding`, `Package/Location`, `Severity`, `Evidence`, `Fix`

## Rules

- committed auth token ใน `.npmrc` = Critical; floating version = High/Medium
- เสนอ hash pinning และ registry allowlist เป็น hardening steps

## Expected Outcome

- Findings ของ pinning/sources พร้อม severity และ evidence
