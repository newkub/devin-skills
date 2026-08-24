---
name: delete
description: ลบไฟล์หรือ folder พร้อมอัพเดท references ทั้งหมดในโปรเจกต์
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - check-reference
  - follow-barrel-export
  - scan-codebase
  - ship-code
  - update-reference
  - validate
---

## Goal

ลบไฟล์หรือ folder ออกจากโปรเจกต์ โดยไม่ทิ้ง broken references หรือ broken imports

## Scope

ใช้เมื่องานต้องลบไฟล์หรือ folder ออกจาก workspace หรือ skills repo แล้วต้องอัปเดท references ที่เกี่ยวข้อง

## Execute

### 1. Analyze References

> Goal: รู้ว่าไฟล์หรือ folder นี้ถูกอ้างอิงที่ไหนบ้าง

1. ระบุ target file/folder จาก user หรือ context
2. ทำ `/scan-codebase` เพื่อหา imports, exports, links, barrel files ที่อ้างอิง target
3. บันทึก locations ทั้งหมดที่ต้องอัปเดท
4. ถ้ามี circular dependencies หรือ impact สูง → ทำ `/ask-me` ก่อนลบ

### 2. Confirm And Delete

> Goal: ลบอย่างปลอดภัย

1. แสดงรายการ target และ references ที่จะอัปเดทให้ user ยืนยัน
2. ถ้า user ไม่ยืนยัน → หยุดและ report
3. ลบ target file/folder
4. ทำ `/update-reference` เพื่ออัปเดท references ทั้งหมด
5. อัปเดท imports หรือ barrel exports ตาม `/follow-barrel-export`
6. ทำ `/validate` เพื่อตรวจสอบว่าไม่มี broken references

## Rules

- ตรวจสอบ references ทั้งหมดก่อน delete
- ต้องได้ user confirmation ก่อนลบไฟล์หรือ folder
- อัปเดต references ทั้งหมดหลัง delete
- ตรวจสอบว่าไม่มี circular dependencies เกิดขึ้น
- ไม่ลบถ้าไม่มี backup หรือไม่สามารถย้อนกลับได้

## Expected Outcome

- ไฟล์หรือ folder ลบสำเร็จ
- References ทั้งหมดอัปเดตแล้ว
- ไม่มี broken references
- ผ่าน `/validate`
