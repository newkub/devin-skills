---
title: Update Uninstall
description: ถอนการติดตั้ง Lefthook
auto_execution_mode: 3
---

## Goal

ถอนการติดตั้ง Lefthook จาก project

## Scope

ครอบคลุมการถอน Lefthook และ Git hooks

## Execute

### 1. Uninstall Lefthook

ถอน Lefthook:

```bash
bunx lefthook uninstall
```

### 2. Remove Dependency

ลบ dependency:

```bash
bun remove lefthook
```

### 3. Remove Configuration

ลบ configuration file:

```bash
rm lefthook.yml
```

## Expected Outcome

- Lefthook ถอนเรียบร้อย
- Git hooks ถอนเรียบร้อย
- Dependency ลบเรียบร้อย
- Configuration ลบเรียบร้อย
