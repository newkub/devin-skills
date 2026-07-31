---
title: Update Publish
description: Publish packages ด้วย Changesets
auto_execution_mode: 3
---

## Goal

Publish packages ไปยัง registry ด้วย Changesets

## Scope

ครอบคลุมการ publish packages สำหรับ release

## Execute

### 1. Build Packages

Build packages ก่อน publish:

```bash
bun run build
```

### 2. Run Tests

ทดสอบ packages:

```bash
bun test
```

### 3. Publish Packages

Publish packages ไปยัง registry:

```bash
bunx changeset publish
```

### 4. Verify Publish

ตรวจสอบว่า publish สำเร็จ:
- Check registry
- Verify version
- Test installation

## Expected Outcome

- Packages build เรียบร้อย
- Tests ผ่านทั้งหมด
- Packages publish เรียบร้อย
- Publish ตรวจสอบเรียบร้อย
