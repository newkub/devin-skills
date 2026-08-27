---
title: Issue Severity And Recommendation
description: กำหนด severity และ next action ของ issue
related:
  - review-issue
---

## Goal

สร้างรายงานการตรวจสอบ issue พร้อม severity และข้อแนะนำ

## Checks

1. กำหนด severity: Critical, High, Medium, Low, Info
2. จัดกลุ่มผลการตรวจตาม severity พร้อม quote หรือ reference evidence
3. แนะนำ next action สำหรับแต่ละผลการตรวจ: ขอรายละเอียด, แยก issue, ดำเนินการ หรือใช้ skill เฉพาะ
4. ใช้ `report-table` หรือ `report-review` เพื่อสรุป
5. รัน `suggest-next-action`

## Severity

- Critical: issue ไม่พร้อม implement, ขาด goal หรือ scope
- High: ขาด acceptance criteria หรือ evidence
- Medium: ambiguous requirement, scope ยังไม่ชัด
- Low: minor improvement, formatting
