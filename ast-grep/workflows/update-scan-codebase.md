---
title: Update Scan Codebase
description: รัน ast-grep scan บน codebase เพื่อค้นหา patterns
auto_execution_mode: 3
---

## Goal

รัน ast-grep scan บน codebase เพื่อค้นหา patterns และ apply rules

## Scope

ครอบคลุมการรัน scan ด้วย configuration และ ad-hoc patterns

## Execute

### 1. Run Full Scan

รัน scan ด้วย configuration:

```bash
ast-grep scan --config sgconfig.yml
```

### 2. Scan Specific Directory

รัน scan บน directory เฉพาะ:

```bash
ast-grep scan ./src
```

### 3. Scan with Pattern

รัน scan ด้วย ad-hoc pattern:

```bash
ast-grep run -p 'console.log($ARG)' --lang ts ./src
```

### 4. Interactive Mode

รัน scan ใน interactive mode:

```bash
ast-grep scan --interactive
```

### 5. JSON Output

รัน scan และ export เป็น JSON:

```bash
ast-grep scan --json > results.json
```

### 6. Apply Fixes

Apply fixes อัตโนมัติ:

```bash
ast-grep scan --rewrite
```

## Expected Outcome

- Scan ทำงานได้ถูกต้อง
- Patterns ถูกค้นหา
- Fixes สามารถ apply ได้
- Results สามารถ export ได้
