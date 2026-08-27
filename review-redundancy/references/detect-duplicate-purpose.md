---
name: detect-duplicate-purpose
description: หา skills ที่ทำหน้าที่เดียวกัน
---

# Detect Duplicate Purpose

## Goal

หา skills ที่ทำหน้าที่เดียวกัน

## Checks

1. เปรียบเทียบ `description` และ `## Goal` ของ skills ในกลุ่มเดียวกัน
2. หา skills ที่มี purpose ซ้อนทับ >70% → ระบุเป็น duplicate candidates
3. หา skills ที่ prefix ต่างกันแต่ purpose ใกล้กัน (เช่น `check-*` กับ `review-*`)
4. บันทึก duplicate candidates เป็นตาราง: skill A, skill B, overlap %, recommendation

