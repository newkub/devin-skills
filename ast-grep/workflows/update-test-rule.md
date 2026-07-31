---
title: Update Test Rule
description: ทดสอบ ast-grep rule ด้วย test cases
auto_execution_mode: 3
---

## Goal

ทดสอบ ast-grep rule ด้วย test cases เพื่อความมั่นใจในความถูกต้อง

## Scope

ครอบคลุมการเขียน test cases และรัน test สำหรับ ast-grep rules

## Execute

### 1. Add Test Cases

เพิ่ม test cases ใน rule file:

```yaml
test:
  - valid: foo?.()
  - valid: bar?.()
  - invalid: foo && foo()
  - invalid: bar && bar()
```

### 2. Run Tests

รัน test สำหรับ rule:

```bash
ast-grep test
```

### 3. Test Specific Rule

ทดสอบ rule เฉพาะ:

```bash
ast-grep test -r my-rule.yml
```

### 4. Watch Mode

รัน test ใน watch mode:

```bash
ast-grep test --watch
```

### 5. Verify Fix Behavior

ทดสอบ fix behavior:

```yaml
test:
  - invalid: foo && foo()
  - fix: foo?.()
```

## Expected Outcome

- Test cases ครอบคลุม
- Tests ผ่านทั้งหมด
- Fix behavior ถูกต้อง
- Rule มั่นใจในความถูกต้อง
