---
name: detect-overlapping-scope
description: หา skills ที่ scope ซ้อนทับกัน
---

# Detect Overlapping Scope

## Goal

หา skills ที่ scope ซ้อนทับกัน

## Checks

1. อ่าน `## Scope` ของ duplicate candidates จาก step 2
2. หา skills ที่ scope บอกว่า "ไม่ใช่" แต่จริงๆ ทำเหมือนกัน
3. หา skills ที่มี `related` อ้างถึงกันและกัน → อาจเป็น overlap แทน
4. ตรวจ `## Execute` ว่ามี steps ที่เหมือนกันมาก

