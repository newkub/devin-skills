---
title: Frontend Reporting
description: รายงาน aggregate frontend findings พร้อม metrics และ next action
related:
  - review-frontend
---

## Goal

รายงานผล review ในรูปแบบตารางพร้อม actionable recommendations

## Checks

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง findings: Dimension, Finding, Severity, Location, Impact, Recommendation
3. คำนวณ review score ตามสูตรใน `references/scoring.md`
4. สร้าง Metrics Summary ตาม dimension พร้อม status indicators และ score
5. จัดกลุ่ม findings ตาม dimension และเรียงตาม severity
6. ทำ `/suggest-next-action`

## Severity

- Critical: ไม่สามารถ report ได้, missing critical findings
- High: score ผิด, missing severity
- Medium: unclear recommendation
- Low: formatting
