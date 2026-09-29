---
name: aggregate-findings
description: รวม findings เป็นมุมมองเดียว
---

# Aggregate Findings

## Goal

รวม findings เป็นมุมมองเดียว

## Checks

1. ทำ `/deep-validate` เพื่อ cross-check evidence
2. Deduplicate ถ้าหลาย roleplay พบ issue เดียวกัน
3. รวม severity สูงสุด หรือ severity จากทุก roleplay ถ้าต่างกัน
4. จัดกลุ่มตาม dimension: security, ux, performance, growth, ops, compliance, business
5. ระบุ stakeholder ที่พบในแต่ละ finding

