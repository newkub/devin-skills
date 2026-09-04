---
name: update-version-latest
description: อัปเดต dependencies ให้ latest เวอร์ชัน ตรวจ breaking changes, test และ verify
argument-hint: "[package-or-scope]"
related:
  - ship
  - follow-monorepo
  - run-verify
  - run-test
  - resolve-errors
  - report-table
  - suggest-next-action
---

## Goal

อัปเดต dependencies ใน project ให้เป็นเวอร์ชันล่าสุดที stable ตรวจ breaking changes แล้ว verify ว่า build/test ยังผ่าน

## Scope

ใช้กับ project ทีใช้ bun, npm, pnpm, yarn โดย update dependencies, devDependencies, catalog versions และตรวจสอบผลกระทบ

## Execute

### 1. Detect Package Manager And Current Versions

> Goal: รู้ว่าใช้ package manager อะไรและ dependencies มีอะไรบ้าง

1. ตรวจ `package.json`, `packageManager` field
2. ตรวจ `bun.lockb`, `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`
3. บันทึก dependencies, devDependencies, peerDependencies

### 2. Check Outdated Packages

> Goal: รู้ว่ามี dependencies ใด outdated

1. รัน `bun outdated` หรือ package manager equivalent
2. บันทึก major, minor, patch updates
3. ระบุ packages ทีมี security advisories

### 3. Update Dependencies

> Goal: อัปเดต dependencies

1. อัปเดต minor/patch ก่อน (`bun update`)
2. ถ้ามี catalog → อัปเดต `catalog:` versions ใน root
3. อัปเดต major ทีละ package พร้อมตรวจ changelog
4. บันทึก changes

### 4. Check Breaking Changes

> Goal: หาความเสี่ยงจากการ update

1. อ่าน changelogs ของ major updates
2. ตรวจ API ที deprecated หรือ removed
3. ตรวจ peer dependencies conflicts
4. ถ้ามี breaking change สูง → `/ask-me`

### 5. Verify Build And Tests

> Goal: ยืนยันว่า update ไม่พัง

1. รัน `bun install` เพื่อ refresh lockfile
2. รัน `moon run :typecheck` หรือ `turbo run typecheck`
3. รัน `moon run :build` หรือ `turbo run build`
4. รัน `moon run :test` หรือ `turbo run test`
5. รัน `moon run :lint` หรือ `turbo run lint`
6. ถ้า fail → `/resolve-errors`

### 6. Report

> Goal: สรุปผล update

1. ใช้ `/report-table` แสดง package, old version, new version, status
2. ทำ `/suggest-next-action`

## Rules

### 1. Stable Only

- ไม่อัปเดต major เวอร์ชันเดียวกับ release ไม่กี่วัน
- ตรวจ `minimumReleaseAge` ถ้ามี security policy
- ใช้ `latest` เฉพาะเมื่อ stable

### 2. Incremental Updates

- อัปเดตทีละ batch
- แยก major/minor/patch
- test หลังแต่ละ batch

### 3. Lockfile Consistency

- อัปเดต lockfile ให้สอดคล้อง
- ไม่ commit ถ้า lockfile ไม่ match
- ตรวจ workspace dependencies ใน monorepo

### 4. Security

- อัปเดตก่อนถ้ามี security advisory
- ใช้ `bun audit` หรือ `npm audit`
- ไม่ downgrade เพื่อแก้ปัญหา

### 5. No Silent Failures

- ต้อง run build/test หลัง update
- ไม่อัปเดตแล้วไม่ verify

## Expected Outcome

- Dependencies อัปเดตเป็น latest stable
- Lockfile ถูกอัปเดต
- Build, typecheck, test, lint ผ่าน
- Report table สรุป versions และผลตรวจสอบ
