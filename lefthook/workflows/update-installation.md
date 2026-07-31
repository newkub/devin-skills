---
title: Update Installation
description: ติดตั้ง Lefthook สำหรับจัดการ Git hooks
auto_execution_mode: 3
---

## Goal

ติดตั้ง Lefthook สำหรับใช้งานใน project

## Scope

ครอบคลุมการติดตั้ง Lefthook ผ่าน bun

## Execute

### 1. Install Lefthook

ติดตั้ง Lefthook ผ่าน bun:

```bash
bun add -D lefthook
```

### 2. Initialize Lefthook

สร้าง configuration:

```bash
bunx lefthook install
```

### 3. Verify Installation

ตรวจสอบการติดตั้ง:

```bash
bunx lefthook version
```

## Expected Outcome

- Lefthook ติดตั้งเรียบร้อย
- Configuration สร้างเรียบร้อย
- Git hooks ติดตั้งเรียบร้อย
- พร้อมใช้งานสำหรับ Git hooks
