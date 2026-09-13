---
name: resolve-merge-conflicts-verify-resolved
description: ยืนยัน conflicts หมดจริง — ไม่มี markers, ทั้งสองฝั่งรักษาไว้, build/test ผ่าน
argument-hint: "[scope]"
related:
  - run-verify
  - report
---

## Goal

ยืนยันหลัง `/resolve-merge-conflicts` ว่า conflicts หมดจริง ไม่มี markers หลุม ไม่เสีย changes ฝั่งไหน และ project ยัง green

## Scope

- ใช้เมื่อ parent dispatch มาที่ `verify` หรือเรียกหลัง resolve เสร็จ
- ครอบคลุม: conflict markers, unmerged paths, intent preservation, build/test
- Read-only: ตรวจสอบ — ไม่ re-resolve

## Execute

### 1. Check No Conflict Residue

> Goal: markers และ unmerged paths หมด

1. `rg '^(<<<<<<<|=======|>>>>>>>)'` ทั้ง tree — ต้องไม่เจอ
2. `git status` → ไม่มี unmerged paths (`UU`, `AA`)
3. `git diff --check` → ไม่มี conflict artifacts

### 2. Check Intent Preservation

> Goal: ทั้งสองฝั่งของ conflict ไม่หาย

1. `git diff` ไฟล์ที่เคย conflict — ตรวจว่า changes ของทั้ง ours/theirs ยังอยู่ตาม intent ที่ user ยืนยัน
2. flag hunks ที่ resolution ลบ changes ฝั่งใดฝั่งหนึ่งโดยไม่ตั้งใจ

### 3. Verify Project Green

> Goal: merge result ใช้งานได้

1. รัน typecheck/build best-effort (`bun run typecheck`, `bun run build`)
2. ถ้า conflict แตะ critical paths → ทำ `/run-verify`
3. ถ้า fail → verdict `broken-merge` พร้อมรายการไฟล์ที่ต้อง re-resolve

### 4. Report

> Goal: สรุป resolution status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `clean` / `residue-found` / `intent-lost` / `broken-merge`

## Rules

- marker พบจริง = `residue-found` — report ทันที
- intent-lost = changes หายโดยไม่ตั้งใจ — severity สูงกว่า build fail
- ไม่แก้ conflicts ใน subskill นี้ — report กลับให้ parent

## Expected Outcome

- Verdict ว่า merge resolution สะอาดจริงพร้อม evidence
- รายการไฟล์ที่ต้อง re-resolve ถ้ามี
