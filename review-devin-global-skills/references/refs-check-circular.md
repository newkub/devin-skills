---
name: check-circular-dependencies
description: ไม่ให้ skills อ้างอิงกันเป็นวงกลม
---

# Check Circular Dependencies

## Goal

ไม่ให้ skills อ้างอิงกันเป็นวงกลม

## Checks

1. สร้าง graph จาก `related` และ in-body references
2. หา cycles (เช่น A → B → A)
3. หา self-references
4. รายงาน cycles พร้อม path

