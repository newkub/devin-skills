---
title: Update Add Hook
description: เพิ่ม Git hook ใน lefthook.yml
auto_execution_mode: 3
---

## Goal

เพิ่ม Git hook ใน lefthook.yml

## Scope

ครอบคลุมการเพิ่ม hooks สำหรับ Git events

## Execute

### 1. Add pre-commit Hook

เพิ่ม pre-commit hook:

```yaml
pre-commit:
  commands:
    lint:
      run: bun run lint
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

### 4. Test Hook

ทดสอบ hook:

```bash
bunx lefthook run pre-commit
```

## Expected Outcome

- Hook เพิ่มเรียบร้อย
- Hook ทำงานได้ถูกต้อง
- Hook สามารถ test ได้
