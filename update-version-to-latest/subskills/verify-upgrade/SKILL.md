---
name: update-version-to-latest-verify-upgrade
description: ยืนยัน upgrade สมบูรณ์ — versions bumped จริง, lockfile consistent, build/test/usage ผ่าน
argument-hint: "[scope]"
related:
  - run-verify
  - test-usage
  - resolve-errors
  - report
---

## Goal

ยืนยันหลัง `/update-version-to-latest` ว่า versions ถูก bump จริง, lockfile consistent และ project ยังทำงาน — เรียก standalone เมื่อต้อง re-verify หรือสงสัยว่า upgrade ครบไหม

## Scope

- ใช้เมื่อ parent dispatch มาที่ `verify`/`verify-upgrade` หรือเรียกหลัง update เสร็จ
- ครอบคลุม: manifest versions, lockfile consistency, build/test/typecheck, usage examples
- Read-only: ตรวจสอบ — ไม่ re-update

## Execute

### 1. Verify Versions Actually Bumped

> Goal: manifests แสดง versions ใหม่จริง

1. `git diff` manifests — versions เปลี่ยนตามที่ report ไว้
2. `bunx taze` dry-run อีกครั้ง → ไม่ควรเหลือ updates (หรือเหลือเฉพาะที่ defer)
3. flag packages ที่ claimed updated แต่ manifest ยังเป็น version เดิม

### 2. Verify Lockfile Consistency

> Goal: lockfile ตรง manifest ไม่มี drift

1. `bun install --frozen-lockfile` (dry check) หรือ `cargo metadata`/`go mod verify` ตาม ecosystem
2. flag lockfile ที่ resolve versions ไม่ตรง manifest ranges
3. ตรวจไม่มี duplicate/conflicting resolutions

### 3. Verify Project Green

> Goal: upgrade ไม่พังอะไร

1. ทำ `/run-verify` — build, typecheck, lint, test
2. ทำ `/test-usage` — usage examples ยังทำงาน
3. ถ้า fail → รายงาน package ที่น่าสงสัย (diff ล่าสุด) เป็น rollback candidate — ไม่ rollback เอง

### 4. Report

> Goal: สรุป upgrade health

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`, `Notes`
2. Verdict: `clean-upgrade` / `partial` / `broken` พร้อม packages ที่เป็น rollback candidates

## Rules

- claimed-but-not-bumped = inconsistency ที่ต้อง report เสมอ
- runtime verification (dev server, actual run) เพิ่มเติมจาก typecheck ถ้า major upgrade
- ไม่ re-update หรือ downgrade ใน subskill นี้

## Expected Outcome

- ยืนยัน versions/lockfile/project สอดคล้องกันหลัง upgrade
- รายการ rollback candidates ถ้า verify fail
