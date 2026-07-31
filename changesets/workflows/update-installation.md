---
title: Update Installation
description: ติดตั้ง Changesets สำหรับ version management และ release automation
auto_execution_mode: 3
---

## Goal

ติดตั้ง Changesets สำหรับใช้งานใน monorepo

## Scope

ครอบคลุมการติดตั้ง Changesets ผ่าน bun

## Execute

### 1. Install Changesets

ติดตั้ง Changesets ผ่าน bun:

```bash
bun add -D @changesets/cli
```

### 2. Initialize Changesets

สร้าง configuration:

```bash
bunx changeset init
```

### 3. Verify Installation

ตรวจสอบการติดตั้ง:

```bash
bunx changeset --version
```

## Expected Outcome

- Changesets ติดตั้งเรียบร้อย
- Configuration สร้างเรียบร้อย
- พร้อมใช้งานสำหรับ version management
