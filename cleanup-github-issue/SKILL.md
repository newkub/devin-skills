---
name: cleanup-github-issue
description: ปิด ลบ หรือจัดระเบียบ GitHub issues ที่ค้างอยู่
---

## Goal

ทำความสะอาด issues ที่ค้างอยู่ ซ้ำกัน หรือแก้ไขแล้ว ผ่าน `gh` CLI

## Scope

ใช้สำหรับดูแล issue backlog

## Execute

### 1. Identify targets
> Goal: ระบุเป้าหมาย

1. แสดงรายการ open issues พร้อม filters
1. ค้นหา issues ที่ซ้ำกันหรือค้างอยู่

### 2. Confirm
> Goal: ยืนยัน

1. ถาม user ก่อนปิดหรือลบ
1. เลือกปิดมากกว่าลบ

### 3. Execute
> Goal: ดำเนินการ

1. รัน `gh issue close` หรือ `gh issue delete`
1. เพิ่ม closing comment ถ้าจำเป็น

### 4. Report
> Goal: รายงาน

1. สรุป issues ที่ปิด/ลบ
1. เรียก `/suggest-next-action`

## Rules

- ห้ามลบ issues โดยไม่มีการยืนยันจาก user อย่างชัดเจน
- ปิดพร้อม comment อธิบายเหตุผล
- ห้าม mass-close โดยไม่ได้รับอนุมัติ

## Expected Outcome

- Issues ที่ค้างอยู่ถูกปิดหรือลบ
- Backlog สะอาดพร้อม log
