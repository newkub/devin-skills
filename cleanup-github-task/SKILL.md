---
name: cleanup-github-task
description: เก็บถาวรหรือลบ tasks ใน GitHub Projects
argument-hint: "[target]"
---

## Goal

ลบหรือเก็บถาวร tasks ที่เสร็จแล้ว/ค้างอยู่ใน GitHub Projects

## Scope

ใช้สำหรับทำความสะอาด project board

## Execute

### 1. List tasks
> Goal: แสดงรายการ tasks

1. รัน `gh project item-list` พร้อม filters
1. ระบุ tasks ที่ค้างอยู่หรือเสร็จแล้ว

### 2. Confirm
> Goal: ยืนยัน

1. ถาม user ก่อนเก็บถาวรหรือลบ

### 3. Execute
> Goal: ดำเนินการ

1. รัน `gh project item-archive` หรือ `item-delete`
1. ตรวจสอบด้วย `item-list`

### 4. Report
> Goal: รายงาน

1. สรุป tasks ที่ทำความสะอาดแล้ว

## Rules

- เลือกเก็บถาวรมากกว่าลบ
- ยืนยัน actions ที่ทำลายข้อมูล
- ห้ามเก็บถาวร tasks ที่กำลังดำเนินการโดยไม่มีเหตุผล

## Expected Outcome

- Project board สะอาด
- Tasks ที่เก็บถาวร/ลบถูกรายงาน
