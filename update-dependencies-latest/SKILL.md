---
name: update-dependencies-latest
description: อัพเดท dependencies ในทุก workspace ให้เป็น latest version ทั้ง major, minor, patch
argument-hint: "[scope]"
related:
  - update-project
  - update-version-latest
  - update-config
  - run-check
  - deep-validate
---

## Goal

อัพเดท dependencies ในทุก workspace/package ให้เป็น latest version ทั้งหมด ไม่ว่าจะเป็น major, minor หรือ patch updates

## Scope

อัพเดท dependencies ในทุก workspace, packages ใน monorepo และ manifest ของทุก ecosystem ทีตรวจพบ ไม่รวม runtime หรือ global tools
- ดูรายละเอียด CLI, manifests และ ecosystem update methods ใน `references/`

- ดูเพิ่มเติม: /update-project

## Execute

### 1. Pre-Update Analysis

> Goal: วิเคราะห์ dependencies ก่อนอัพเดท

1. รัน `bun src/cli.ts update --dry-run`
2. แยกตามประเภทการอัพเดท: major, minor, patch
3. ตรวจสอบ breaking changes จาก major updates

### 2. Update Dependencies

> Goal: อัพเดท dependencies ให้เป็น latest

1. รัน `bun src/cli.ts update --type patch --write`
2. รัน `bun src/cli.ts update --type minor --write`
3. รัน `bun src/cli.ts update --type major --write` (ระวัง breaking changes)

### 3. Post-Update Verification

> Goal: ยื่นยันว่า project ยังทำงานได้หลังอัพเดท

1. รัน `bun src/cli.ts retest` (หรือ `bun src/cli.ts retest --temp`)
2. รัน `bun src/cli.ts refactor` เพื่อ lint / refactor
3. รัน `bun src/cli.ts commit -m "chore: update deps" --push`

## Rules

### 1. Update Strategy

- อัพเดททีละประเภท: patch -> minor -> major
- ไม่อัพเดททุกอย่างพร้อมกันในครั้งเดียวถ้ามี breaking changes
- แยก commit ตามประเภทการอัพเดท

### 2. Safety First

- รัน tests ก่อนและหลังอัพเดท
- ใช้ `--dry-run` ก่อน `--write`
- `convert-submodules --push` ต้องยืนยันก่อน หรือใช้ `--force`

### 3. Tooling

- ใช้ `bun` เป็นหลัก ห้ามใช้ npm/pnpm
- `bunx taze` สำหรับ Node/Bun
- `cargo update` สำหรับ Rust
- `go get -u ./...` สำหรับ Go
- ใช้ registry APIs ถ้า CLI tool ไม่อยู่

### 4. Automated Updates

- แนะนำ Renovate / Dependabot
- กำหนด schedule สำหรับ automated updates
- ตั้ง auto-merge สำหรับ patch updates ทีผ่าน tests

- ใช้ /update-version-latest ถ้าจำเป็น
- ใช้ /update-config ถ้าจำเป็น
- ใช้ /run-check ถ้าจำเป็น
- ใช้ /deep-validate ถ้าจำเป็น

## Expected Outcome

- ทุก dependencies อัพเดทเป็น latest versions
- Lock file อัพเดทและไม่มี conflicts
- Tests ยังผ่านหลังอัพเดท
- ไม่มี security vulnerabilities ใหม่
- รายการอัพเดทมีรายละเอียดครบถ้วน
- Version consistency ใน monorepo
