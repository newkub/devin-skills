---
title: Update Version Packages
description: Version packages ด้วย Changesets
auto_execution_mode: 3
---

## Goal

Version packages ด้วย Changesets สำหรับ release

## Scope

ครอบคลุมการ version packages และ generate changelog

## Execute

### 1. Run Version Command

Version packages:

```bash
bunx changeset version
```

### 2. Review Changes

ตรวจสอบการเปลี่ยนแปลง:
- package.json ถูก update
- CHANGELOG.md ถูก generate
- Changeset files ถูกลบ

### 3. Commit Version Changes

Commit version changes:

```bash
git add .
git commit -m "chore: version packages"
```

### 4. Create Release PR

สร้าง release PR:
- Push ไปยัง remote
- สร้าง PR สำหรับ review
- Review changelog

## Expected Outcome

- Packages version เรียบร้อย
- Changelog generate เรียบร้อย
- Changeset files ลบเรียบร้อย
- Version changes commit เรียบร้อย
