---
name: detect-unused-skills
description: หา skills ที่ไม่ถูกอ้างถึงโดย skill อื่น
---

# Detect Unused Skills

## Goal

หา skills ที่ไม่ถูกอ้างถึงโดย skill อื่น

## Checks

1. ทำ `/check-reference` เพื่อหา skills ที่ไม่มีใครอ้างถึงใน `related`
2. ตรวจ `AGENTS.md` ว่ามีอ้างถึง skill นั้นไหม
3. แยก unused skills ออกเป็น: standalone (ใช้เองได้) กับ orphan (ไม่มี context)
4. บันทึก unused skills เป็นตาราง: skill, type, recommendation

