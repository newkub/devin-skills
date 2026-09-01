---
name: list-devin-global-skills-relation
description: แสดงตารางความสัมพันธ์และ flow ของ devin global skills จาก `related` และ `/skill-name` references
argument-hint: "[skills-dir]"
allowed-tools:
  - read
  - write
  - edit
  - grep
  - exec
  - skill
  - find_file_by_name
  - report
  - report-table
  - ask_user_question
triggers:
  - user
  - model
related:
  - list-devin-global-skills
  - check-circular-dependencies
  - check-broken-skills-references
  - use-scripts
  - report-table
  - open-devin-in-web
---

## Goal

แสดงตารางความสัมพันธ์ของ devin global skills 3 คอลัมน์ พร้อม flow `a -> b -> c` โดยใช้ scripts สแกนจาก `related` และ `/skill-name` references

## Scope

- สแกน `SKILL.md` ทั้งหมดใน target skills directory
- ดึง `name`, `related`, และ `/skill-name` references จาก body
- สร้าง reverse relation: skills ทีเรียกใช้ skill นี้
- หา flow chain ความลึก 3 ระดับ
- ไม่เปลี่ยนแปลง skill files

## Execute

### 1. Scan Skills

> Goal: รวบรวม metadata ทั้งหมด

1. `glob` หา `*/SKILL.md` ใน target directory (default: `%APPDATA%/devin/skills`)
2. `read` แต่ละไฟล์แล้ว parse frontmatter `name`, `description`, `related`
3. สแกน body หา `/skill-name` references
4. รวม `related` + `/skill-name` references เป็น `outgoing` edges

### 2. Build Relation Map

> Goal: สร้าง graph ความสัมพันธ์

1. สร้าง nodes จาก `name`
2. สร้าง directed edges จาก `outgoing`
3. สร้าง `incoming` (skills ทีเรียกใช้ skill นี้)
4. เก็บ data เป็น `skills-relation.json`

### 3. Detect Flow Chains

> Goal: หา flow skill a -> b -> c

1. DFS หา paths ความยาว 2-3 edges จากทุก node
2. ตัด paths ซ้ำกัน
3. บันทึกลง `skills-relation.json`

### 4. Report Table

> Goal: แสดงผลเป้นตาราง

1. สร้างตาราง 3 คอลัมน์:
   - `Skill`
   - `Contains` (skills ทีอยู่ภายใน skill นี้)
   - `Called By` (skills ทีเรียกใช้ skill นี้)
2. แสดง flow chains ใต้ตาราง
3. ทำ `/report-table`

### 5. Optional Visualize

> Goal: ดู graph ถ้าต้องการ

1. ถ้าต้องการดู graph แบบ interactive → ทำ `/open-devin-in-web`
2. ถ้าต้องการตรวจ circular dependencies → ทำ `/check-circular-dependencies`

## Rules

- ใช้ `tools/scan-relations.ps1` หรือสคริปต์เทียบเท่าเท่านั้น ไม่ parse ด้วยมือ
- ไม่แก้ไข skill files ระหว่าง scan
- รองรับ target directory ผ่าน argument
- report ต้องมี 3 คอลัมน์หลัก: Skill, Contains, Called By
- flow chain แสดงสูงสุด 50 รายการเพื่อไม่ clutter
- ถ้าไม่มี skills directory → stop และ report

## Expected Outcome

- ไฟล์ `skills-relation.json` ใน OS temp directory
- ตาราง Skill / Contains / Called By
- รายการ flow chains `a -> b -> c`
- รายงานจำนวน skills, edges, และ isolated skills
