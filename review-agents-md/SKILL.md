---
name: review-agents-md
description: ตรวจสอบ AGENTS.md เพื่อดูโครงสร้าง, references ที่ถูกต้อง และความครอบคลุมของ workspace
---

## Goal

ตรวจสอบไฟล์ `AGENTS.md` เพื่อให้แน่ใจว่าเป็นไปตามรูปแบบที่ถูกต้อง, อ้างอิง skills ที่ถูกต้อง และครอบคลุมทุก workspace ใน monorepo

## Scope

ตรวจสอบไฟล์ `AGENTS.md` ระดับ root และ workspace ใน `.devin/` หรือ root ของโปรเจกต์ ไม่แก้ไข logic ของ source code

## Execute

### 1. Locate AGENTS.md

> Goal: ค้นหาไฟล์ `AGENTS.md` ทั้งหมดในโปรเจกต์

1. ใช้ `glob` เพื่อค้นหา `**/AGENTS.md`
2. ระบุไฟล์ `AGENTS.md` ระดับ root และระดับ workspace
3. หากไม่มี `AGENTS.md` ให้หยุดและรายงาน

### 2. Validate Frontmatter

> Goal: ตรวจสอบ frontmatter ของแต่ละ `AGENTS.md`

1. ตรวจว่า `name` ตรงกับ workspace หรือโปรเจกต์
2. ตรวจว่า `description` มีอยู่และกระชับ
3. ตรวจว่า `related` มีเฉพาะ skills ที่มีอยู่จริง
4. ตรวจ `auto_execution_mode` หากมี

### 3. Validate Sections

> Goal: ตรวจสอบว่ามี sections ที่จำเป็นในลำดับที่ถูกต้อง

1. ยืนยัน `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
2. ยืนยันว่า `## Rules` มี `### Architecture` พร้อม `tech: /follow-<tech>`
3. ยืนยันว่า `### Skills` map `skill-name: /skill-name`
4. ยืนยันว่าไม่มี section `## Workflows` หรือ `### Workflows`

### 4. Check References

> Goal: ตรวจสอบ skill references ทั้งหมดใน `AGENTS.md`

1. ดึง references `skill-name` ทั้งหมด
2. ยืนยันว่า directory ของแต่ละ skill เป้าหมายมีอยู่
3. ตรวจ mappings `tech: /follow-<tech>` และ `skill-name: /skill-name`
4. รายงาน references ที่หายไปหรือไม่ถูกต้อง

### 5. Check Workspace Coverage

> Goal: สำหรับ monorepo ตรวจสอบว่าแต่ละ workspace มี `AGENTS.md`

1. ใช้ `/check-monorepo` เพื่อยืนยันรายการ workspace
2. เปรียบเทียบ directories ของ workspace กับตำแหน่ง `AGENTS.md`
3. สำหรับแต่ละ `AGENTS.md` ของ workspace ตรวจว่าอ้างอิง workspaces ที่ใช้
4. ตรวจให้แน่ใจว่า `AGENTS.md` ระดับ workspace ไม่ซ้ำเนื้อหาของ root

### 6. Report Findings

> Goal: สรุปผลการตรวจสอบ

1. ใช้ `/report-table` สำหรับปัญหา
2. จัดกลุ่มปัญหาตามความรุนแรง: critical, high, medium, low
3. ระบุ file path และ line number สำหรับแต่ละผลการตรวจ
4. แนะนำ next action

## Rules

### 1. Format Compliance

- `AGENTS.md` ต้องเป็นไปตามรูปแบบ `/follow-write-devin-skills`
- frontmatter `name`, `description`, `related` จำเป็นต้องมี
- sections ตามลำดับ: `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
- ห้ามมี section `## Workflows`

### 2. Reference Validity

- `skill-name` ทั้งหมดต้องเป็น skills ที่มีอยู่จริง
- `tech: /follow-<tech>` ควร map ไปยัง skill `follow-*` จริงหากเป็นไปได้
- `skill-name: /skill-name` ควร map ไปยัง skill จริง

### 3. Workspace Rules

- `AGENTS.md` ระดับ root ต้องมี `### Workspaces` ที่ระบุแต่ละ workspace
- `AGENTS.md` ของแต่ละ workspace ต้องอ้างอิง workspaces ที่ใช้
- `AGENTS.md` ของ workspace ต้องไม่ซ้ำ conventions ของ root

### 4. High Impact

- รายงานเฉพาะปัญหาที่กระทบการทำงานหรือความถูกต้อง
- หลีกเลี่ยงการติเรื่อง style เพียงอย่างเดียว เว้นแต่ทำให้ parsing เสีย
- ระบุ evidence พร้อม file path และ line number

## Expected Outcome

- ไฟล์ `AGENTS.md` เป็นไปตามรูปแบบมาตรฐาน
- skill references ทั้งหมดถูกต้อง
- ทุก workspace มี `AGENTS.md` ระดับ workspace ใน monorepo
- รายงานพร้อมผลการตรวจและ next actions
