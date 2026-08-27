---
name: check-skills-related
description: ตรวจสอบความสัมพันธ์ระหว่าง skills แบบ recursive ว่า skill ไหนเรียก skills ไหน
argument-hint: "[skill-name]"
allowed-tools:
  - exec
  - grep
  - glob
  - find_file_by_name
  - read
related:
  - check-broken-refs
  - check-circular-dependencies
  - review-references
  - use-scripts
  - report-table
---

## Goal

สร้าง call graph ของ skills โดยระบุว่า skill ใดเรียก skills ใดบ้าง ทั้งตรงและแบบ recursive จนกระทั่่งรู้ความสัมพันธ์ทั้งหมด

## Scope

ใช้สำหรับ scan skills directory (global หรือ project) เพื่อหา dependency relations ระหว่าง skills จาก `related:` frontmatter และ `/<skill-name>` references ใน body โดยมี script ช่วยรัน

## Execute

### 1. Identify Target

> Goal: ระบุ target directory

1. รับ target directory จาก argument หรือใช้ `%APPDATA%\devin\skills` เป็น default
2. ยืนยันว่า target directory มีอยู่จริง
3. ถ้าไม่มี → stop และ report

### 2. Run Check Script

> Goal: สร้าง call graph ด้วย script

1. รัน `scripts/check-skills-related.ps1` ด้วย `exec`
2. ถ้ามี target skill → ส่ง argument `<skill-name>` เพื่อดู tree ของ skill นั้น
3. ถ้าไม่มี target → รันโดยไม่มี argument เพื่อดู graph ทั้งหมด
4. ตรวจสอบว่า script รันสำเร็จและให้ output

### 3. Parse Relations

> Goal: แยกความสัมพันธ์ทีถูกต้อง

1. อ่าน `SKILL.md` ของทุก skill ใน target directory
2. ดึง `name` จาก frontmatter (ถ้าไม่มี ใช้ directory name)
3. ดึง `related:` list จาก frontmatter เป็น direct callee
4. ดึง `/<skill-name>` references จาก body (ไม่รวม URL, file path, frontmatter)
5. รวม direct relations จาก `related` และ `/` references

### 4. Build And Traverse Graph

> Goal: รู้ว่า skill ไหนเรียก skills ไหน

1. สร้าง adjacency list: `caller -> [callees]`
2. ใช้ DFS เพื่อหา transitive closure ของแต่ละ skill
3. ถ้าพบ circular references → รายงาน cycle path
4. ใช้ DFS พร้อม track recursion stack เพื่อหลีกเลี่ยง infinite loop และ detect circular references

### 5. Report Findings

> Goal: รายงาน call graph ให้อ่านง่าย

1. ใช้ `/report-table` แสดง: skill, direct callees, all related (transitive), max depth
2. ถ้ามี target skill → แสดง tree ของ target ก่อน
3. สรุปสถิติ: total skills, total relations, circular count, orphan count
4. ถ้าพบ cycle → แนะนำ `/check-circular-dependencies` หรือ `/update-references`

## Rules

### 1. What Counts As Related

- `/<skill-name>` ใน body หมายถึง skill นี้เรียก skill นั้น
- `related:` entries ใน frontmatter หมายถึงความสัมพันธ์โดยตรง
- URL (`https://...`) ไม่นับเป็น skill reference
- File path (`references/foo.md`, `scripts/bar.ps1`) ไม่นับเป็น skill reference
- Markdown headings, anchors, code comments ไม่นับถ้าไม่อยู่ในรูปแบบ `/<skill-name>`

### 2. Recursion Until Complete

- ตรวจซ้ำจนกระทั่่งไม่พบ skill ใหม่ (transitive closure)
- ถ้ามี cycle → หยุด branch นั้นและ report cycle
- ไม่ count self-reference เป็น relation (กรองออก)

### 3. Reproducible Output

- ใช้ `scripts/check-skills-related.ps1` สำหรับ scan ซับซ้อน
- ผลลัพธ์ต้อง reproducible และอ้างอิงไฟล์/บรรทัดได้
- หลีกเลี่ยงการตรวจด้วยตาเปล่า

### 4. No Auto-Fix

- `check-skills-related` ตรวจและรายงานเท่านั้น
- ถ้าต้องการแก้ `related` หรือ body references → ใช้ `/update-references`

## Expected Outcome

- Call graph ครบถ้วนของ skills ทั้งหมดใน target directory
- รายงาน direct และ transitive relations ของแต่ละ skill
- ระบุ circular references ถ้ามี
- สถิติรวม: skills, relations, cycles, orphans
- แนะนำ next action เมื่องานเสร็จ
