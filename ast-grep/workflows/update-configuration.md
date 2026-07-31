---
title: Update Configuration
description: ตั้งค่า ast-grep configuration สำหรับ project
auto_execution_mode: 3
---

## Goal

ตั้งค่า sgconfig.yml และ project structure สำหรับ ast-grep

## Scope

ครอบคลุมการสร้าง configuration file และ project structure

## Execute

### 1. Create sgconfig.yml

สร้างไฟล์ `sgconfig.yml` ที่ root directory:

```yaml
ruleDirs:
  - rules
  - .ast-grep/rules

testDirs:
  - __tests__
  - tests

ignore:
  - node_modules
  - dist
  - build

language:
  ts:
    strictness: smart
  js:
    strictness: smart
```

### 2. Create Rules Directory

สร้าง directory สำหรับเก็บ rules:

```bash
mkdir -p rules
```

### 3. Create Test Directory

สร้าง directory สำหรับเก็บ tests:

```bash
mkdir -p __tests__
```

### 4. Verify Configuration

ตรวจสอบ configuration:

```bash
ast-grep scan --config sgconfig.yml
```

## Expected Outcome

- sgconfig.yml สร้างเรียบร้อย
- rules/ directory สร้างเรียบร้อย
- __tests__/ directory สร้างเรียบร้อย
- Configuration ทำงานได้ถูกต้อง
