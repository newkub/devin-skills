---
name: recommend-actions
description: แนะนำการจัดการกับ redundancy
---

# Recommend Actions

## Goal

แนะนำการจัดการกับ redundancy

## Checks

1. สำหรับ duplicate purpose → แนะนำ: merge, rename, หรือ split
2. สำหรับ overlapping scope → แนะนำ: ปรับ `## Scope` ให้ชัดเจน
3. สำหรับ redundant content → แนะนำ: ย้ายไป `references/` หรือสร้าง shared reference
4. สำหรับ unused skills → แนะนำ: keep, document, หรือ remove
5. ทำ `/report-table` สรุป recommendations: skill, issue, action, priority
6. ทำ `/suggest-next-action` เพื่อแนะนำขั้นตอนถัดไป

