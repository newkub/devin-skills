---
name: confirm
description: ขอ approval ก่อน fix
---

# Confirm

## Goal

ขอ approval ก่อน fix

## Checks

1. ใช้ `ask_user_question` ถาม user ว่าตกลงแก้ไขหรือไม่
2. ถ้า user ปฏิเสธ → stop และ report
3. ถ้า user ตกลง → ทำต่อ

