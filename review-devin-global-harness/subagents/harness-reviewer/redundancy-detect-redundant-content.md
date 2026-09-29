---
name: detect-redundant-content
description: หา content ที่ซ้ำกันในหลาย skills
---

# Detect Redundant Content

## Goal

หา content ที่ซ้ำกันในหลาย skills

## Checks

1. ใช้ `/use-scripts` สร้าง script ใน `$env:TEMP` เพื่อ hash content ของแต่ละ skill
2. เปรียบเทียบ `## Rules` และ `## Expected Outcome` ระหว่าง skills
3. หา blocks ของ text ที่เหมือนกัน >50% ระหว่าง skills
4. บันทึก redundant content เป็นตาราง: skill A, skill B, duplicated section, line range

