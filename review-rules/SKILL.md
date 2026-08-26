---
name: review-rules
description: ตรวจสอบ .devin/rules, ast-grep rules และ AGENTS.md ให้ถูกต้อง ครบถ้วน ไม่ซ้ำซ้อน
---

## Goal

ปรับปรุง rules ทั้งใน `.devin/rules/`, ast-grep `rules/` และไฟล์ `AGENTS.md` ให้ถูกต้อง ไม่ซ้ำซ้อน และครอบคลุมทุก workspace

## Scope

ใช้สำหรับ project ที่มี `.devin/rules/`, `rules/`, `sgconfig.yml` หรือ `AGENTS.md` ไม่แก้ไข logic ของ source code

## Execute

### 1. Scan Rules And AGENTS.md

> Goal: ค้นหา rules และไฟล์ `AGENTS.md` ทั้งหมด

1. ใช้ `/scan-codebase` ใน `.devin/rules/` และ `rules/`
2. ใช้ `glob` เพื่อค้นหา `**/AGENTS.md`
3. ระบุ duplicate rules (เช่น `import-alias` vs `import-aliases`)
4. ระบุ rules ที่ขาด frontmatter หรือ metadata ไม่ครบ
5. หากไม่มี `AGENTS.md` ให้รายงานและข้ามไปยังขั้นตอน rules
6. บันทึก findings

### 2. Check Rules Alignment

> Goal: ตรวจสอบความสอดคล้องของ rules

1. เปรียบเทียบ `.devin/rules` กับ ast-grep `rules/`
2. ตรวจสอบว่า frontmatter ถูกต้อง (`trigger: always_on`, `model_decision`, `glob`)
3. ตรวจสอบ filenames ใช้ kebab-case
4. ตรวจสอบ `ruleDirs` ใน `sgconfig.yml`
5. ดูรายละเอียดเพิ่มเติมใน `references/devin-rules.md` และ `references/ast-grep-rules.md`

### 3. Validate AGENTS.md

> Goal: ตรวจสอบโครงสร้างและ references ของ `AGENTS.md`

1. ตรวจ frontmatter: `name`, `description`, `related`
2. ยืนยัน sections ตามลำดับ: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
3. ยืนยันว่า `## Rules` มี `### Architecture` พร้อม `tech: /follow-<tech>`
4. ยืนยันว่า `### Skills` map `skill-name: /skill-name`
5. ยืนยันว่าไม่มี section `## Workflows` หรือ `### Workflows`
6. ดูรายละเอียดเพิ่มเติมใน `references/agents-md.md`

### 4. Check References And Coverage

> Goal: ตรวจสอบ skill references และ workspace coverage

1. ดึง references `skill-name` ทั้งหมดจาก `AGENTS.md`
2. ยืนยันว่า directory ของแต่ละ skill เป้าหมายมีอยู่
3. ตรวจ mappings `tech: /follow-<tech>` และ `skill-name: /skill-name`
4. ใช้ `/check-monorepo` เพื่อยืนยันรายการ workspace
5. เปรียบเทียบ directories ของ workspace กับตำแหน่ง `AGENTS.md`
6. ตรวจว่า `AGENTS.md` ระดับ workspace ไม่ซ้ำเนื้อหาของ root

### 5. Fix Issues

> Goal: แก้ไขปัญหาที่พบ

1. ลบ duplicate rules หลัง user confirm
2. เพิ่ม missing rules ตาม `.devin/rules`
3. แก้ frontmatter ให้ถูกต้อง
4. อัปเดต `sgconfig.yml` ให้ match directory structure
5. แก้ broken references ใน `AGENTS.md`

### 6. Validate And Score

> Goal: ตรวจสอบผลลัพธ์และให้คะแนน

1. รัน `ast-grep scan` หรือ `bun run scan`
2. ทำ `/validate` เพื่อ verify rule files
3. ทำ `/check-reference` เพื่อตรวจ broken references
4. คำนวณ score ตาม `references/scoring.md`

### 7. Report

> Goal: สรุปการปรับปรุง

1. ใช้ `/report-table` สำหรับปัญหา
2. จัดกลุ่มตามความรุนแรง: critical, high, medium, low
3. ระบุ file path และ line number สำหรับแต่ละผลการตรวจ
4. รายงาน rules ที่แก้ไขและที่ยังเหลือ
5. แนะนำ next actions

## Rules

### 1. No Duplicates

- ไม่เก็บ rules ซ้ำซ้อน
- ถ้ามีหลาย rules คล้ายกัน ให้ merge หรือเลือก canonical

### 2. Frontmatter Standard

- `trigger: always_on`, `model_decision`, หรือ `glob`
- `title` Title Case
- `description` ไม่เกิน 100 ตัวอักษร

### 3. AGENTS.md Format Compliance

- `AGENTS.md` ต้องเป็นไปตามรูปแบบ `/follow-create-devin-skills`
- frontmatter `name`, `description`, `related` จำเป็นต้องมี
- sections ตามลำดับ: `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
- ห้ามมี section `## Workflows`

### 4. Reference Validity

- `skill-name` ทั้งหมดต้องเป็น skills ที่มีอยู่จริง
- `tech: /follow-<tech>` ควร map ไปยัง skill `follow-*` จริงหากเป็นไปได้
- `skill-name: /skill-name` ควร map ไปยัง skill จริง

### 5. Workspace Rules

- `AGENTS.md` ระดับ root ต้องมี `### Workspaces` ที่ระบุแต่ละ workspace
- `AGENTS.md` ของแต่ละ workspace ต้องอ้างอิง workspaces ที่ใช้
- `AGENTS.md` ของ workspace ต้องไม่ซ้ำ conventions ของ root

### 6. Safety

- ไม่ลบ rule โดยไม่ user confirm
- ไม่เปลี่ยน rule intent โดยไม่ record
- รายงานเฉพาะปัญหาที่กระทบการทำงานหรือความถูกต้อง
- ระบุ evidence พร้อม file path และ line number

## Expected Outcome

- `.devin/rules` และ `rules/` sync กัน
- ไม่มี duplicate rules
- ไม่มี broken references
- `ast-grep scan` ผ่าน
- ไฟล์ `AGENTS.md` เป็นไปตามรูปแบบมาตรฐาน
- skill references ทั้งหมดถูกต้อง
- ทุก workspace มี `AGENTS.md` ระดับ workspace ใน monorepo
- รายงานพร้อมผลการตรวจและ next actions
