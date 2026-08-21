---
name: improve-code-duplication
description: ตรวจจับ code duplication ด้วย jscpd
---

## Goal

ตรวจจับและรายงาน code duplication ใน codebase

## Scope

ใช้สำหรับตรวจจับ code duplication — ส่งต่อไป `/follow-jscpd` สำหรับการตั้งค่าและการใช้งานเต็มรูปแบบ

## Execute

### 1. Run Duplication Check

ทำ `/follow-jscpd` เพื่อตรวจจับ code duplication แบบครบถ้วน

> Goal: ได้ผลลัพธ์ duplication report พร้อม priority สำหรับ refactor

1. ทำ `/follow-jscpd` ตั้งแต่ setup config จนถึง analyze results
2. ใช้ผลลัพธ์จาก `/follow-jscpd` สำหรับส่งต่อไป `/refactor`

## Rules

- ใช้ `/follow-jscpd` สำหรับ configuration และ CLI options เต็มรูปแบบ
- ไม่ duplicate config — อ้างอิง `.jscpd.json` จาก `/follow-jscpd`

## Expected Outcome

- Duplication report จาก jscpd
- รายการ duplicates พร้อม priority สำหรับ refactor
