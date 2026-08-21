---
title: Update Configuration
description: ตั้งค่า lefthook.yml สำหรับ Git hooks
auto_execution_mode: 3
---

## Goal

ตั้งค่า lefthook.yml สำหรับ Git hooks

## Scope

ครอบคลุมการตั้งค่า configuration สำหรับ Git hooks

## Execute

### 1. Create lefthook.yml

สร้างไฟล์ `lefthook.yml` ที่ root directory:

```yaml
pre-commit:
  parallel: true
  commands:
    lint:
      run: bun run lint
    format:
      run: bun run format
```

### 2. Add pre-push Hook

เพิ่ม pre-push hook:

```yaml
pre-push:
  commands:
    test:
      run: bun test
```

### 3. Add commit-msg Hook

เพิ่ม commit-msg hook:

```yaml
commit-msg:
  commands:
    conventional-commit:
      run: bunx commitlint --edit $1
```

### 4. Verify Configuration

ตรวจสอบ configuration:

```bash
bunx lefthook run pre-commit
```

## Expected Outcome

- lefthook.yml สร้างเรียบร้อย
- pre-commit hook ตั้งค่าเรียบร้อย
- pre-push hook ตั้งค่าเรียบร้อย
- commit-msg hook ตั้งค่าเรียบร้อย
- Configuration ทำงานได้ถูกต้อง
