---
name: update-github-task
description: อัปเดต fields และสถานะของงานใน GitHub Project
---

## Goal

อัปเดตสถานะงาน, priority, assignee, หรือ custom fields

## Scope

ใช้เมื่องานใน project ต้องเปลี่ยน metadata

## Execute

### 1. Find task
> Goal: ค้นหางาน

1. รัน `gh project item-list`
1. รับ item ID

### 2. Edit fields
> Goal: แก้ไข fields

1. รัน `gh project item-edit` พร้อม field-id และ value
1. อัปเดต status, priority, assignee

### 3. Verify
> Goal: ตรวจสอบ

1. รัน `gh project item-list` อีกครั้ง
1. ยืนยันการเปลี่ยนแปลง

### 4. Report
> Goal: รายงาน

1. ส่งสรุปงานที่อัปเดตแล้วกลับ

## Rules

- ใช้ `--json` เพื่อรับ field และ item IDs
- ระบุ owner และ project number
- ห้ามเปลี่ยนสถานะโดยไม่มี context

## Expected Outcome

- fields ของงานถูกอัปเดต
- Project สะท้อนสถานะใหม่
