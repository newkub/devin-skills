---
name: open-web
description: เปิด website ด้วย open command
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

## Goal

เปิด website ด้วย open command

## Execute

### 1. Open Website

เปิด website ด้วย open command

1. รับ URL ที่ต้องเปิด
2. ใช้ command `open <url>` เพื่อเปิด website
3. ตรวจสอบว่า website เปิดถูกต้อง

## Rules

- ใช้ `open <url>` command
- ตรวจสอบ URL ว่าถูกต้อง
- ใช้ default browser ของระบบ

## Expected Outcome

- Website เปิดใน browser
- URL ถูกต้อง
