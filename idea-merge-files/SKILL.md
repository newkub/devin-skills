---
name: idea-merge-files
description: สร้างไอเดียการ merge ไฟล์หรือ skills ที่ซ้ำซ้อนให้เป็นหน่วยเดียว
argument-hint: "[target]"
---

## Goal

สร้างไอเดียการ merge ไฟล์หรือ skills ที่ซ้ำซ้อนให้เป็นหน่วยเดียวพร้อม continuous numbering

## Scope

ใช้เมื่อต้องการวิเคราะห์ว่าควร merge ไฟล์หรือ skills ใดเข้าด้วยกัน — ไม่รวมการ execute merge ให้ทำตาม `merge` ต่อ

## Execute

### 1. Analyze Targets

> Goal: รวบรวม context ก่อนสร้างไอเดีย merge

1. ระบุ target จาก user หรือ context (ไฟล์, skills, หรือ directory)
2. ทำ `/scan-codebase` เพื่อดู file structure และ dependencies
3. ทำ `/review-redundancy` เพื่อหา skills ที่ซ้ำซ้อนกัน
4. อ่าน `SKILL.md` ของแต่ละ target เพื่อเปรียบเทียบ Goal, Scope, Execute
5. ตรวจสอบ line counts และ section overlap

### 2. Identify Merge Opportunities

> Goal: ระบุคู่ที่ควร merge

1. ระบุ skills ที่มี description คล้ายกันหรือทับซ้อน
2. ระบุ skills ที่อยู่ในกลุ่มเดียวกันและทำงานคล้ายกัน
3. ระบุ skills ที่อ้างถึงกันและกันอย่างหนาแน่น
4. ระบุ skills ที่มี line count น้อยและเป็นส่วนย่อยของ skill ใหญ่กว่า
5. ระบุ spelling inconsistencies ที่ควร rename พร้อม merge

### 3. Evaluate Merge Options

> Goal: ประเมินวิธี merge ที่เหมาะสม

1. ประเมินแต่ละ opportunity ตามเงื่อนไข:
   - `merge` — ถ้า skills ซ้ำซ้อนหรือ changes together
   - `rename` — ถ้าชื่อผิดหรือไม่สื่อความหมาย
   - `keep` — ถ้า cohesion สูงและไม่มี benefit ชัดเจน
2. ทำ `/dont-over-engineer` เพื่อกรองไอเดียที่ซับซ้อนเกินไป
3. พิจารณา target skill ที่จะรับ content จาก source skill
4. ตรวจสอบว่า merged file จะไม่เกิน 250 บรรทัด

### 4. Plan Merge Strategy

> Goal: วางแผนการ merge สำหรับแต่ละคู่

1. ระบุ target skill (ตัวรับ) และ source skill (ตัวที่จะลบ)
2. ระบุ sections ที่จะย้ายจาก source ไป target
3. ระบุ references ที่ต้องอัปเดตหลัง merge
4. วางแผนการลบ source directory หลัง merge เสร็จ
5. ระบุลำดับการ merge ถ้ามีหลายคู่

### 5. Generate Ideas

> Goal: สร้างไอเดีย merge แบบ actionable

1. สร้างไอเดียสำหรับแต่ละ merge opportunity
2. ใช้ continuous numbering ต่อจากไอเดียเดิมถ้ามี
3. ระบุ scope: `quick win`, `short-term`, `long-term`
4. ระบุ impact, effort และ action: `merge`, `rename`, `keep`
5. ระบุ target skill, source skill, sections ที่จะย้าย

### 6. Report

> Goal: รายงานไอเดียและ next action

1. ทำ `/report-markdown-table`
2. คอลัมน์: number, source(s), target, issue, idea, action, scope, impact, effort
3. จัดลำดับตาม impact/effort ratio
4. ทำ `/suggest-next-action`
5. ถ้าพร้อม execute → แนะนำให้ทำ `/merge`

## Rules

### 1. Focus On File Merges

- เน้นการ merge ไฟล์หรือ skills ที่ซ้ำซ้อน
- ไม่ลงมือ execute การ merge ด้วยตรง
- ใช้ `merge` สำหรับ execution

### 2. Evidence-Based

- ทุกไอเดียต้องมาจาก analysis จริง
- ระบุ file path, skill name, section overlap ที่เกี่ยวข้อง
- อ้างอิง line counts และ description overlap

### 3. Actionable And Numbered

- ใช้ continuous numbering
- ระบุ action ชัดเจน: `merge`, `rename`, `keep`
- ระบุ target skill, source skill, sections ที่จะย้าย

### 4. No Over-Engineering

- ไม่เสนอ merge ที่ไม่มี benefit ชัดเจน
- ไม่ merge เพื่อลดจำนวน skills อย่างเดียว
- ทำ `/dont-over-engineer`

### 5. Line Count Safety

- ตรวจสอบว่า merged file จะไม่เกิน 250 บรรทัด
- ถ้าเกิน → แนะนำให้ trim content ก่อน merge
- ระบุ estimated line count หลัง merge

## Expected Outcome

- รายการไอเดีย merge แบบ continuous numbering
- ทุกไอเดียมี source, target, action, scope, impact, effort
- ตาราง `report-markdown-table` พร้อม next action
- ไอเดียพร้อม execute ด้วย `/merge`
