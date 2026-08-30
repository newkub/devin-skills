---
name: report
description: สรุป naming findings
---

# Report

## Goal

สรุป findings พร้อม recommendations

## Checks

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง: Name, Type, Issue, Severity, Suggested Name
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป
