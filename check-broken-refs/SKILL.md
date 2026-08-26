---
name: check-broken-refs
description: ตรวจหา broken skill references ใน SKILL.md ของ devin skills repo
allowed-tools:
  - exec
  - grep
  - glob
  - find_file_by_name
  - read
---

## Goal

ตรวจหา broken skill references ใน `SKILL.md` ของ devin skills repo โดยเปรียบเทียบ references ที่อ้างถึงกับ skills ที่มีอยู่จริง

## Scope

ใช้สำหรับ scan devin skills repo เพื่อหา references ไปยัง skills ที่ไม่มีอยู่ ครอบคลุมทั้ง `/skill-name` patterns ใน prompt body และ `related` fields ใน frontmatter ไม่รวมการแก้ไข (ใช้ `/update-references` สำหรับแก้)

## Execute

### 1. Identify Target Directory

> Goal: รู้ว่าจะ scan ที่ไหน

1. รับ target directory จาก argument หรือใช้ `%APPDATA%\devin\skills` เป็น default
2. ยืนยันว่า target directory มีอยู่จริง
3. ถ้าไม่มี → stop และ report

### 2. Inventory All Skills

> Goal: รู้ skills ที่มีอยู่ทั้งหมด

1. ใช้ `glob` หา `*/SKILL.md` ใน target directory
2. สร้าง set ของ skill names จาก directory names
3. บันทึกจำนวน skills ทั้งหมด

### 3. Scan References

> Goal: หาทุก reference ใน SKILL.md ของทุก skill

1. สำหรับแต่ละ skill:
   - `read` ไฟล์ `SKILL.md`
   - ใช้ `grep` หา patterns `/[a-z][a-z0-9-]+` ในเนื้อหา
   - กรอง patterns ที่ไม่ใช่ skill references (เช่น URLs, file paths, npm packages)
2. รวบรวม reference → skill mapping
3. บันทึกจำนวน references ทั้งหมดที่ตรวจ

### 4. Check Broken References

> Goal: ระบุ references ที่ชี้ไปยัง skills ที่ไม่มีอยู่

1. เปรียบเทียบแต่ละ reference กับ skill set จาก Step 2
2. ถ้า reference ไม่อยู่ใน skill set → บันทึกเป็น broken
3. กรอง false positives:
   - ชื่อที่เป็นส่วนหนึ่งของ URL หรือ file path
   - ชื่อที่เป็น npm package หรือ command
   - ชื่อที่เป็น section heading ใน markdown
4. จัดกลุ่ม broken references ตาม skill ที่อ้างถึง

### 5. Check Related Fields

> Goal: ตรวจ `related` fields ใน frontmatter

1. สำหรับแต่ละ skill ที่มี `related` field ใน frontmatter:
   - Parse `related` entries
   - ตรวจว่าแต่ละ entry มีอยู่จริงใน skill set
2. บันทึก broken `related` entries แยกจาก body references

### 6. Report Findings

> Goal: รายงานผลเป็นตาราง

1. ทำ `/report-table` สรุป: skill, reference, type (body/related), status (broken/ok)
2. จัดลำดับตาม severity:
   - Critical: broken `related` reference
   - Warning: broken body reference
   - Info: skill ไม่มี references เลย
3. ถ้ามี Critical → แนะนำ `/update-references` หรือ `/resolve-errors`
4. ถ้าไม่พบ → "no broken references found"
5. สรุปสถิติ: total skills, total references, broken count, false positive count

## Rules

### 1. Use Scripts For Scanning

- ใช้ `scripts/check-broken-refs.ps1` สำหรับ scan ซับซ้อน
- ผลลัพธ์ต้อง reproducible และอ้างอิงไฟล์/บรรทัด
- หลีกเลี่ยงการตรวจด้วยตาเปล่า

### 2. Filter False Positives

- URL fragments (`https://...`) ไม่ใช่ skill references
- File paths (`references/foo.md`) ไม่ใช่ skill references
- npm packages (`@capacitor/...`) ไม่ใช่ skill references
- Markdown headings (`## Goal`) ไม่ใช่ skill references
- Section anchors (`#section`) ไม่ใช่ skill references

### 3. Severity Classification

- Critical: broken `related` field reference (affects skill discovery)
- Warning: broken body `/skill-name` reference (affects workflow)
- Info: skill has zero references (orphan, may need linking)

### 4. No Auto-Fix

- `check-broken-refs` ตรวจและรายงานเท่านั้น
- ถ้าต้องการแก้ → ทำ `/update-references` หลังจากนี้

## Expected Outcome

- รายงาน broken references ครบถ้วน พร้อม skill name, reference, type, severity
- สถิติ: total skills, total references checked, broken count
- False positives ถูกกรองออก
- ถ้ามี Critical → แนะนำ next action (`/update-references` หรือ `/resolve-errors`)
- ถ้าไม่พบ → "no broken references found"
