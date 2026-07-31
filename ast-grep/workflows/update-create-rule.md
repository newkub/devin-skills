---
title: Update Create Rule
description: สร้าง ast-grep rule สำหรับ code search และ transformation
auto_execution_mode: 3
---

## Goal

สร้าง ast-grep rule สำหรับ custom lint และ code transformation

## Scope

ครอบคลุมการสร้าง rule file ตั้งแต่ basic ไปจนถึง advanced

## Execute

### 1. Create Rule File

สร้าง rule file ใน `rules/` directory:

```bash
touch rules/my-rule.yml
```

### 2. Define Basic Rule

กำหนด rule structure พื้นฐาน:

```yaml
id: my-rule
language: ts
severity: warning
message: My custom rule
rule:
  pattern: console.log($ARG)
```

### 3. Add Fix Pattern

เพิ่ม fix pattern สำหรับ auto-rewrite:

```yaml
id: no-console-log
language: ts
severity: warning
message: Avoid console.log in production
rule:
  pattern: console.log($ARG)
fix: logger.info($ARG)
```

### 4. Add Test Cases

เพิ่ม test cases สำหรับ validation:

```yaml
id: no-console-log
language: ts
severity: warning
message: Avoid console.log in production
rule:
  pattern: console.log($ARG)
fix: logger.info($ARG)
test:
  - valid: logger.info($ARG)
  - invalid: console.log($ARG)
```

### 5. Test Rule

ทดสอบ rule:

```bash
ast-grep test
```

### 6. Run Scan

รัน rule บน codebase:

```bash
ast-grep scan
```

## Expected Outcome

- Rule file สร้างเรียบร้อย
- Rule ทำงานได้ถูกต้อง
- Test cases ผ่าน
- Rule สามารถ scan codebase ได้
