---
name: check-safety
description: ลด risk ของ workflow
---

# Check Safety

## Goal

ลด risk ของ workflow

## Checks

1. ตรวจสอบ dry-run / confirmation สำหรับ destructive actions
2. ตรวจสอบ error handling ในทุก external call
3. ตรวจสอบว่าไม่ expose secrets หรือ sensitive data
4. ตรวจสอบ rollback path

