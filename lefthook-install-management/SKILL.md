---
name: lefthook-install-management
description: Manage lefthook install only in root package.json
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

จัดการ `lefthook install` ให้มีเฉพาะที่ root package.json เท่านั้น

## Scope

Monorepo ที่ใช้ lefthook สำหรับ git hooks automation

## Execute

### 1. Verify Root Package.json

ตรวจสอบว่า root package.json มี `lefthook install` ใน `prepare` script

1. อ่าน root package.json
2. ตรวจสอบ `prepare` script มี `bunx lefthook install`
3. ถ้าไม่มีให้เพิ่ม: `"prepare": "bunx taze -r -w -i && bunx lefthook install"`

### 2. Remove From Workspace Package.json

ลบ `lefthook install` ออกจาก prepare script ในทุก workspace package.json

1. ใช้ `Grep` ค้นหา `lefthook install` ใน `packages/` directory
2. แก้ไข prepare script จาก `"bunx taze -r -w -i && bunx lefthook install"` เป็น `"bunx taze -r -w -i"`
3. ทำซ้ำสำหรับทุกไฟล์ที่พบ

### 3. Verify Changes

ตรวจสอบว่าไม่มี `lefthook install` ใน workspace packages

1. ใช้ `Grep` ค้นหา `lefthook install` ใน `packages/` directory อีกครั้ง
2. ถ้ายังพบให้แก้ไขให้ครบถ้วน

## Rules

### 1. Root Only Rule

- `lefthook install` ต้องอยู่เฉพาะที่ root package.json เท่านั้น
- ไม่มี `lefthook install` ใน workspace package.json ใด้ๆ

### 2. Monorepo Structure

- ใช้ turbo หรือ moon สำหรับ task orchestration
- root package.json จัดการ git hooks สำหรับทั้ง monorepo
- workspace packages ไม่ต้องจัดการ git hooks

### 3. Prepare Script Pattern

- Root: `"prepare": "bunx taze -r -w -i && bunx lefthook install"`
- Workspace: `"prepare": "bunx taze -r -w -i"`

### 4. Verification

- ใช้ `Grep` ตรวจสอบไม่มี `lefthook install` ใน workspace packages
- ใช้ `Grep` ตรวจสอบมี `lefthook install` ใน root package.json

## Expected Outcome

- Root package.json มี `lefthook install` ใน prepare script
- ไม่มี `lefthook install` ใน workspace package.json ทั้งหมด
- Git hooks ถูกติดตั้งเฉพาะที่ root
- ไม่มีการ duplicate การติดตั้ง git hooks
