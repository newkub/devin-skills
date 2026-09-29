---
name: scan
description: หาส่วนทีอ่านยากใน code และ text
---

# Scan

## Goal

หาส่วนทีอ่านยากใน code และ text

## Checks

1. ทำ `/scan-codebase` หา long functions, deep nesting, complex expressions
2. หาไฟล์ skill ทีเกิน 250 บรรทัด
3. ระบุ comment ทีพูดเรื่อง what แทน why
4. หา complex conditionals, magic numbers, nested callbacks
