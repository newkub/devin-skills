---
name: report
description: รายงาน aggregate findings พร้อม actionable recommendations
---

# Report

รายงานผล review ในรูปแบบตาราง

## Goal

รายงาน aggregate findings พร้อม actionable recommendations

## Checks

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง aggregate findings จากทุก section
3. ทำ `/suggest-next-action`

## Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

