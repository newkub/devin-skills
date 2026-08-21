---
title: Update Run Hook
description: รัน Git hook ด้วย Lefthook
auto_execution_mode: 3
---

## Goal

รัน Git hook ด้วย Lefthook

## Scope

ครอบคลุมการรัน hooks สำหรับ Git events

## Execute

### 1. Run pre-commit Hook

รัน pre-commit hook:

```bash
bunx lefthook run pre-commit
```

### 2. Run pre-push Hook

รัน pre-push hook:

```bash
bunx lefthook run pre-push
```

### 3. Run commit-msg Hook

รัน commit-msg hook:

```bash
bunx lefthook run commit-msg
```

### 4. Run All Hooks

รันทุก hooks:

```bash
bunx lefthook run
```

## Expected Outcome

- Hook รันเรียบร้อย
- Commands execute เรียบร้อย
- Results แสดงเรียบร้อย
