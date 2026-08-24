---
name: merge
description: merge ไฟล์เข้าด้วยกันและลบไฟล์เดิม
---

## Goal

merge ไฟล์เข้าด้วยกันและลบไฟล์เดิม

## Scope

Use `merge` for the specific tasks and workflows it covers

## Execute

### 1. Merge Files
> Goal: Merge Files

merge ไฟล์เข้าด้วยกัน

1. ระบุไฟล์ที่ต้อง merge
2. ทำ `/deep-analyze` ไฟล์ต้นทาง (source) เพื่อเข้าใจโครงสร้างและความสัมพันธ์
3. ทำ `/deep-analyze` ไฟล์ปลายทาง (destination) เพื่อเข้าใจโครงสร้างและความสัมพันธ์
4. อ่าน content ของไฟล์ทั้งหมด
5. merge content เข้าด้วยกัน

### 2. Delete Old Files
> Goal: Delete Old Files

ลบไฟล์เดิม

1. ลบไฟล์เดิมหลังจาก merge
2. ทำ `/deep-validate` เพื่อตรวจสอบ merge

## Rules

- ตรวจสอบว่า merge ถูกต้องก่อนลบไฟล์เดิม
- ใช้ git สำหรับ file operations ถ้าเป็นไปได้
- ตรวจสอบว่าไม่มี data loss
- ถ้าต้องตัดสินใจระหว่างหลายตัวเลือก ให้ทำ `/deep-validate` แล้วเลือกสิ่งที่ดีที่สุด

## Expected Outcome

- ไฟล์ถูก merge เข้าด้วยกัน
- ไฟล์เดิมถูกลบ
- ไม่มี data loss
