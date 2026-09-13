---
name: check-supply-chain-lockfile
description: ตรวจ lockfile integrity — resolve ตรง manifest, missing hashes, non-standard sources
argument-hint: "[lockfile-path]"
related:
  - review-dependencies
  - report
---

## Goal

ตรวจ lockfile integrity — lockfile ไม่ถูกแกะ, versions ตรง declared ranges, integrity fields ครบ, sources ปลอดภัย

## Scope

- ใช้เมื่อ `/check-supply-chain` dispatch มาที่ `lockfile` หรือเรียกเดี่ยวๆ
- ครอบคลุม: `bun.lock`, `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `Cargo.lock`, `go.sum`
- Read-only: รายงาน — แก้ผ่าน `/review-dependencies`

## Execute

### 1. Manifest Consistency

> Goal: resolved versions ตรง declared ranges

1. เทียบ lockfile กับ manifest — versions ที่ resolve ตรง declared ranges ไหม
2. flag resolved versions ที่อยู่นอก declared range (แกะ lockfile หรือ manual edit)

### 2. Integrity And Sources

> Goal: hashes ครบ sources น่าเชื่อถือ

1. หา integrity fields ที่ขาดหรือแปลก (missing hashes, `http://` URLs)
2. flag deps ที่ resolve จาก non-standard registries หรือ direct URLs/git
3. บันทึก findings พร้อม evidence (lockfile line)

### 3. Report

> Goal: ส่ง findings กลับ parent

1. ตาราง: `No.`, `Finding`, `Package/Location`, `Severity`, `Evidence`, `Fix`

## Rules

- ทุก flag ต้องมี artifact จริง — lockfile line หรือ resolved URL
- แยก "น่าสงสัย" จาก "ผิดปกติแต่ปกติใน context" (เช่น internal registry)

## Expected Outcome

- Findings ของ lockfile integrity พร้อม severity และ evidence
