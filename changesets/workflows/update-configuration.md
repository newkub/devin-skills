---
title: Update Configuration
description: ตั้งค่า Changesets configuration สำหรับ monorepo
auto_execution_mode: 3
---

## Goal

ตั้งค่า config.json สำหรับ Changesets

## Scope

ครอบคลุมการตั้งค่า configuration สำหรับ monorepo

## Execute

### 1. Create Config File

สร้างไฟล์ `.changeset/config.json`:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

### 2. Configure Access Level

ตั้งค่า access level สำหรับ packages:

```json
{
  "access": "public"
}
```

### 3. Configure Linked Packages

ตั้งค่า linked packages:

```json
{
  "linked": ["@my/ui", "@my/components"]
}
```

### 4. Configure Fixed Packages

ตั้งค่า fixed packages:

```json
{
  "fixed": ["@my/core", "@my/utils"]
}
```

### 5. Verify Configuration

ตรวจสอบ configuration:

```bash
bunx changeset status
```

## Expected Outcome

- config.json สร้างเรียบร้อย
- Access level ตั้งค่าเรียบร้อย
- Linked/fixed packages ตั้งค่าเรียบร้อย
- Configuration ทำงานได้ถูกต้อง
