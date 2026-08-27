---
name: generate-stakeholder-report
description: สร้างรายงาน multi-stakeholder
---

# Generate Stakeholder Report

## Goal

สร้างรายงาน multi-stakeholder

## Checks

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Stakeholder, Dimension, Location, Issue, Impact, Recommendation
3. สร้าง stakeholder coverage map (เลือกอะไร, ไม่เลือกอะไร, เหตุผล)
4. สรุป top 5 findings ตาม severity
5. สรุป conflicts ระหว่าง stakeholder (ถ้ามี)
6. ทำ `/suggest-next-action`

