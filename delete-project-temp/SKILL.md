---
name: delete-project-temp
description: ลบ .devin/temp/ ทั้งหมดใน project (report, plan) อย่างปลอดภัย พร้อม dry-run + confirm
argument-hint: ""
related:
  - delete
  - cleanup
  - cleanup-artifact
  - create-plan-in-dot-devin
  - create-report-in-dot-devin
  - review-bundle
  - ask-me
  - report
  - suggest-next-action

---

## Goal

ลบ `.devin/temp/` ทั้ง directory ใน project อย่างปลอดภัย — ครอบคลุม `report/` และ `plan/` artifacts ที่สร้างโดย `/create-report-in-dot-devin` และ `/create-plan-in-dot-devin` — ด้วย dry-run และ user confirmation ก่อนลบ

## Scope

- target เดียว: `.devin/temp/` ที่ project root เท่านั้น
- ใช้เมื่อต้องการล้าง temp artifacts (reports, plans) ทั้งหมดใน project
- ไม่ครอบ `.devin/` ส่วนอื่น (`rules/`, `hooks/`, `skills/`, `mcp_config.json`)
- ไม่ใช้ลบไฟล์เดี่ยวหรือ subdir เดียว — ถ้าต้องการลบเฉพาะบางไฟล์ให้ใช้ `/delete`

## Execute

### 1. Locate And Inspect

> Goal: ยืนยันว่ามี `.devin/temp/` และรู้ว่าข้างในมีอะไร

1. ตรวจว่า `.devin/temp/` มีอยู่ที่ project root
2. ถ้าไม่มี → รายงานว่าไม่มีอะไรให้ลบและจบ
3. list contents ทั้งหมด (`report/`, `plan/` และไฟล์อื่น) พร้อมจำนวนไฟล์
4. วัดขนาดรวมด้วย `/review-bundle` scope `size` หรือ `du -sh .devin/temp`

### 2. Dry Run And Confirm

> Goal: แสดงสิ่งที่จะถูกลบและขอ confirm

1. แสดง tree/รายการทั้งหมดที่จะถูกลบ พร้อมขนาดรวม
2. เตือนว่า plan files ใน `.devin/temp/plan/` ที่ยังไม่ implement จะหายถาวร
3. ทำ `/ask-me` เพื่อ confirm — `proceed` หรือ `cancel`
4. ถ้าอยู่ใน `/dont-ask-me` mode → ข้าม confirm แต่ยังแสดง dry-run เสมอ
5. ถ้า user cancel → จบโดยไม่ลบ

### 3. Delete

> Goal: ลบ `.devin/temp/` ทั้งหมด

1. ลบ recursive ตาม platform:
   - bash: `rm -rf .devin/temp`
   - PowerShell: `Remove-Item -Recurse -Force .devin/temp`
2. ถ้าลบไม่ได้ (file locked, permission denied) → report error และ stop
3. ถ้าเหลือ `.devin/temp` เปล่าหรือ residue → ลบให้หมด

### 4. Validate And Report

> Goal: ยืนยันว่าลบสำเร็จและสรุปผล

1. ตรวจว่า `.devin/temp/` ไม่มีอยู่แล้ว
2. ทำ `/report` สรุปจำนวนไฟล์และขนาดที่ลบ
3. ทำ `/suggest-next-action`

## Rules

### 1. Safety

- dry-run + confirm เสมอก่อนลบ — ห้ามลบโดยไม่แสดงรายการก่อน
- scope เฉพาะ `.devin/temp/` เท่านั้น — ห้ามขยายไป `.devin/` หรือ project files อื่น
- ห้ามลบ `.git`, config, secrets หรือไฟล์นอก `.devin/temp/`
- ถ้า `.devin/temp/` เป็น symlink/junction → ลบ link อย่างเดียว ห้ามตามไปลบ target

### 2. No Backup Needed

- temp artifacts เป็น disposable โดย design — ไม่ต้อง backup
- ถ้า plan/report ใดยังจำเป็น user ต้อง cancel ตอน confirm หรือย้ายออกก่อน

## Expected Outcome

- `.devin/temp/` ถูกลบทั้งหมด หรือไม่มีการเปลี่ยนแปลงถ้า user cancel
- มีรายงานจำนวนและขนาดของ items ที่ลบ
- ไม่มี residue หรือ partial delete ค้าง
