---
name: run-typecheck
description: Run typecheck with config check
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related: []
---
## Goal

รัน typecheck ตามที่กำหนดใน package manifest พร้อมตรวจสอบ config

## Scope

รัน typecheck สำหรับทุก workspace ใน monorepo ตามที่กำหนดใน package manifest

## Execute

### 1. Check Config
> Goal: Check Config

1. ทำ `config` เพื่อตรวจสอบ config
2. ห้ามแก้ไข config ใดๆ

### 2. Run Typecheck
> Goal: Run Typecheck

1. ห้ามใช้ ignore comments/attributes ทุกภาษา
2. รัน typecheck ตามที่กำหนดใน package manifest

### 3. Analyze Errors
> Goal: Analyze Errors

1. รัน `/deep-review` เพื่อวิเคราะห์และจัดลำดับ errors ที่เกิดจาก typecheck
2. `/deep-review` จะตัดสินใจว่าควรไป workflow ไหนต่อ:
   - ถ้าเป็น cascade issues → `/debug-issue` → `/deep-debug` → `/resolve-errors`
   - ถ้าเป็น isolated errors → `/resolve-errors`

## Rules

- ทำ `config` เพื่อตรวจสอบ config แต่ห้ามแก้ไข
- ห้ามใช้ ignore comments/attributes ทุกภาษา แก้ปัญหาที่ source
- แก้ไขข้อผิดพลาดที่เกิดขึ้นจาก typecheck ก่อนดำเนินการต่อ

## Expected Outcome

โค้ดที่ผ่าน typecheck โดยไม่มีข้อผิดพลาด
