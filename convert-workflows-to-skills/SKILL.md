---
name: convert-workflows-to-skills
description: แปลง global workflows เป็น skills format พร้อม directory structure และ SKILL.md
---

## Goal

แปลง global workflows ที่มีอยู่เป็น skills format โดยสร้าง directory structure, `SKILL.md`, และ content files ที่สอดคล้องกับ `/write-devin-skills`

## Scope

ใช้สำหรับแปลง global workflows (เช่น `follow-*`, `run-*`, `check-*`) เป็น skills ใน `~/.codeium/windsurf/skills/` — ไม่รวมการเขียน skills ใหม่ทั้งหมด (ใช้ `/write-devin-skills`) หรือปรับปรุง skills ที่มี (ใช้ `/improve-all-skills`)

## Execute

### 1. Identify Source Workflows

ระบุ workflows ที่ต้องการแปลงเป็น skills

> Goal: รู้ว่าจะแปลง workflows ไหน และมีอยู่จริง

1. ระบุ workflow ที่ต้องการแปลง: เดียว, กลุ่ม, หรือทั้งหมดที่ขึ้นต้นด้วย `follow-*`
2. ตรวจสอบว่า workflow มีอยู่จริงใน `~/.codeium/windsurf/global_workflows/`
3. ตรวจสอบว่า skill ปลายทางมีอยู่แล้วหรือไม่ — ถ้ามี → confirm ก่อน overwrite
4. ถ้า workflow ไม่มี → stop และ report

### 2. Analyze Workflow Structure

วิเคราะห์โครงสร้างของ workflow เพื่อวางแผนการแปลง

> Goal: เข้าใจ content ของ workflow เพื่อ map ไป skill structure ได้

1. อ่าน workflow file ทั้งหมด: frontmatter, Goal, Scope, Execute, Rules, Expected Outcome
2. จำแนก content:
   - Guide: how-to, setup, installation, migration → `guide/`
   - Key Concepts: terminology, core concepts, architecture overview → `key-concepts/`
   - Principles: best practices, rules, conventions → `principles/`
   - References: API, CLI, configuration, external docs → `references/`
   - Workflows: step-by-step procedures → `workflows/`
   - Templates: code templates, config templates → `templates/`
3. ระบุ external documentation URLs สำหรับ `references/website.md`
4. ถ้า workflow มี content น้อยเกินไป (<50 บรรทัด) → พิจารณารวมกับ skill ที่เกี่ยวข้องแทนการสร้าง skill ใหม่

### 3. Create Skill Directory Structure

สร้าง directory structure ตาม `/write-devin-skills` มาตรฐาน

> Goal: Skill directory พร้อมสำหรับ content files

1. สร้าง skill directory: `~/.codeium/windsurf/skills/<skill-name>/`
2. สร้าง subdirectories ตาม content ที่จำแนกจาก Step 2:
   - `guide/` — ถ้ามี how-to content
   - `key-concepts/` — ถ้ามี concept content
   - `principles/` — ถ้ามี rules และ best practices
   - `references/` — ถ้ามี API/CLI/config docs
   - `workflows/` — ถ้ามี step-by-step procedures
   - `templates/` — ถ้ามี code/config templates
   - `scripts/` — ถ้ามี automation scripts
3. ถ้า skill มีอยู่แล้วและมี subdirectories → ใช้ที่มี ไม่สร้างซ้ำ

### 4. Write SKILL.md

เขียน `SKILL.md` ตามมาตรฐาน `/write-devin-skills`

> Goal: `SKILL.md` เป็น entry point ที่ชัดเจน

1. Frontmatter: `title` Title Case ตรง skill name, `description` ≤100 ตัวอักษร, `auto_execution_mode: 3`
2. `## Goal` สอดคล้องกับ workflow Goal เดิม
3. `## Scope` สอดคล้องกับ workflow Scope เดิม
4. `## Execute` เป็น bullet list อ้างถึง content files ในแต่ละ subdirectory:
   - `อ่าน guide/xxx.md สำหรับ ...`
   - `อ่าน key-concepts/xxx.md สำหรับ ...`
   - `ทำตาม workflows/xxx.md สำหรับ ...`
   - `ดู references/xxx.md สำหรับ ...`
5. `## Rules` เป็น bullet list สรุป principles สำคัญจาก workflow Rules
6. `## Expected Outcome` สอดคล้องกับ workflow Expected Outcome เดิม
7. ไฟล์ไม่เกิน 250 บรรทัด

### 5. Write Content Files

แปลง workflow content เป็น content files ในแต่ละ subdirectory

> Goal: Content files ครอบคลุม workflow content เดิม ไม่สูญเสีย context

1. แปลง workflow Execute steps → `workflows/` files: แต่ละ step เป็น file แยกหรือรวมเป็น file เดียวตามความเหมาะสม
2. แปลง workflow Rules → `principles/` files: จัดกลุ่มตามหัวข้อ แต่ละหัวข้อเป็น file แยก
3. แปลง workflow Scope และ context → `key-concepts/` files ถ้ามี concept content
4. สร้าง `references/website.md` ถ้ามี external documentation URLs
5. สร้าง `references/cli.md` ถ้า workflow มี CLI commands
6. สร้าง `references/configuration.md` ถ้า workflow มี config options
7. แต่ละ file ไม่เกิน 250 บรรทัด — ถ้าเกิน → แบ่งเป็น files ย่อย
8. ใช้ backticks สำหรับ `tools`, `commands`, `file paths`, `/workflow-name`

### 6. Validate And Update References

ตรวจสอบ skill ที่สร้างและอัปเดท references

> Goal: Skill พร้อมใช้งาน ไม่มี broken references

1. ทำ `/validate`, ทำ `/check-reference` — ตรวจสอบ structure, references, ไม่มี missing files
2. ตรวจสอบว่า `SKILL.md` อ้างถึง files ที่มีอยู่จริงทุกไฟล์
3. ตรวจสอบว่าไม่มี content file เกิน 250 บรรทัด
4. ทำ `/update-reference` เพื่ออัปเดท references ใน global workflows ที่อ้างถึง workflow เดิม → เพิ่ม reference ถึง skill ใหม่
5. ถ้า validation fail → แก้แล้ว revalidate (max 3 → stop/report)
6. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Content Mapping

- workflow Execute → `workflows/` files — แต่ละ step ที่เป็น procedure แยกเป็น file
- workflow Rules → `principles/` files — จัดกลุ่มตามหัวข้อ single concern
- workflow Goal/Scope → `SKILL.md` Goal/Scope โดยตรง
- workflow Expected Outcome → `SKILL.md` Expected Outcome โดยตรง
- ไม่สร้าง content file ที่ซ้ำกับ `SKILL.md` — `SKILL.md` เป็น index อ้างถึง content files

### 2. Naming Conventions

- Skill directory: kebab-case ตรงกับ tool/library name (เช่น `bun`, `biome`, `ast-grep`)
- Content files: kebab-case สื่อความหมาย (เช่น `quick-start.md`, `best-practices.md`)
- `SKILL.md`: ต้องเป็นชื่อนี้เสมอ
- ห้ามใช้ spaces หรือ PascalCase ใน file/directory names

### 3. Safety And Non-Duplication

- ถ้า skill มีอยู่แล้ว → confirm ก่อน overwrite และแสดง dry run preview
- ไม่ลบ content เดิมที่มีอยู่ใน skill — ผสานกับ content ใหม่
- ใช้ references แทนการ duplicate — ถ้า global workflow อ้างถึง workflow อื่น ให้อ้างถึง skill ที่เกี่ยวข้องแทน
- ถ้า workflow เดิมยังจำเป็น → เก็บไว้ ไม่ลบ แต่เพิ่ม note ใน workflow ว่ามี skill แล้ว

### 4. High Impact Content

- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ
- ห้าม TODO, MOCK, placeholder — ไม่สร้าง empty files
- ถ้า content น้อยเกินไป → ไม่สร้าง subdirectory นั้น

## Expected Outcome

- Skill directory พร้อมใช้งาน: `SKILL.md` + content files ใน subdirectories
- Content ครอบคลุม workflow เดิม ไม่สูญเสีย context
- `SKILL.md` เป็น index อ้างถึง content files ทั้งหมด
- ไม่มี file เกิน 250 บรรทัด
- References ถูกต้อง — ไม่มี broken references
- Global workflows ที่เกี่ยวข้องอ้างถึง skill ใหม่
- ตาราง report: workflow | skill | files created | status
