---
name: update-github-task
description: อัปเดต fields และสถานะของงานใน GitHub Project
argument-hint: "[task-id]"
related:
  - cleanup-github-task
  - implement-github-task
  - update-github-metadata
  - update-references
  - suggest-next-action
  - follow-best-practice
---

## Goal

อัปเดตสถานะงาน, priority, assignee, หรือ custom fields

## Scope

ใช้เมื่องานใน project ต้องเปลี่ยน metadata

## Execute

### 1. Find Task

> Goal: ค้นหางาน

1. รัน `gh project item-list`
2. รับ item ID

### 2. Edit Fields

> Goal: แก้ไข fields

1. รัน `gh project item-edit` พร้อม field-id และ value
2. อัปเดต status, priority, assignee

### 3. Verify

> Goal: ตรวจสอบ

1. รัน `gh project item-list` อีกครั้ง
2. ยืนยันการเปลี่ยนแปลง

### 4. Report

> Goal: รายงาน

1. ส่งสรุปงานที่อัปเดตแล้วกลับ

## Rules

- ใช้ `--json` เพื่อรับ field และ item IDs
- ระบุ owner และ project number
- ห้ามเปลี่ยนสถานะโดยไม่มี context

- ใช้ /cleanup-github-task ถ้าจำเป็น
- ใช้ /implement-github-task ถ้าจำเป็น
- ใช้ /update-github-metadata ถ้าจำเป็น
- ใช้ /update-references ถ้าจำเป็น
- ใช้ /suggest-next-action ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น

## Expected Outcome

- fields ของงานถูกอัปเดต
- Project สะท้อนสถานะใหม่