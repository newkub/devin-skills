---
name: follow-create-devin-skills
description: สร้าง Devin skill package ใหม่หนึ่งตัวตามมาตรฐานของ global skills repo
argument-hint: "[skill-name]"
related:
  - update-devin-global-skills
  - update-devin-global-subagents
  - follow-global-rules
  - follow-my-tech-stack
  - review-techstack
  - prepare-skills-context
  - check-skills-related
  - update-references
  - deep-validate
  - ship
---

## Goal

สร้าง skill ใหม่หนึ่งตัวใน `%APPDATA%\devin\skills\<skill-name>\` ให้พร้อมใช้งานและผ่านมาตรฐาน

## Scope

ใช้เมื่อ user ต้องการสร้าง Devin skill ใหม่ ไม่ว่าจะเป้น `follow-*`, `check-*`, `report-*`, `run-*`, หรือ `review-*` สำหรับ project หรือ global use

## Execute

### 1. Identify Skill Name And Scope

> Goal: รู้ว่าจะสร้าง skill อะไร

1. รับ `skill-name` จาก argument หรือถาม user
2. ถ้าไม่ระบุ → ถามก่อนดำเนินการ
3. ตรวจ `%APPDATA%\devin\skills\<skill-name>` ว่ามีอยู่หรือไม่
4. ถ้ามีอยู่ → ถามว่าจะอัปเดตหรือสร้างชื่อใหม่

### 2. Prepare Context

> Goal: เข้าใจ standards และเลือก template

1. ทำ `/follow-my-tech-stack` ถ้าสร้าง skill ท่ีมี code/src
2. ทำ `/review-techstack` เพื่อ review ถ้าจำเป็น
3. ทำ `/prepare-skills-context` เพื่อเลือก AI tool, template, และ directory pattern
4. ทำ `/check-skills-related` เพื่อหา skills ท่ีซ้ำหรือเกี่ยวข้อง
5. ถ้าซ้ำ → ทำ `/use-in-another-skills` ก่อนดำเนินการต่อ

### 3. Select Template And Create Structure

> Goal: skill มีโครงสร้างเริ่มต้นท่ีเหมาะสม

1. อ่าน `update-devin-global-skills/references/create-devin-skills.md`
2. เลือก template ตาม prefix เช่น `follow-`, `check-`, `report-`, `run-`, `review-`
3. สร้าง `%APPDATA%\devin\skills\<skill-name>\`
4. ถ้าต้องการ code หรือ CLI → สร้าง `src/` ตาม stack
5. ถ้ามี dependencies หรือ examples จำเป็น → สร้าง `references/`

### 4. Write SKILL.md

> Goal: เอกสาร skill ถูกต้องตาม spec

1. เขียน YAML frontmatter ครบ `name`, `description`, `argument-hint`, `related`
2. เขียน `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
3. แบ่ง `## Execute` เป้น steps ไม่เกิน 10 ขั้นตอน
4. ใช้ backticks สำหรับ commands, paths, skill names
5. ไม่ใช้ `**` bold markers
6. ระบุ `related` ให้ครบ ไม่เกิน 15 skills

### 5. Add Code Or References

> Goal: รองรับงานซับซ้อนโดยไม่ทำให้ SKILL.md ยาวเกิน

1. ถ้ามี code → สร้าง `src/` ตาม `/follow-create-cli` หรือ `/follow-create-web`
2. ถ้ามี dependencies → สร้าง `references/index.md` และไฟล์ย่อย
3. ถ้ามี rules → สร้าง `.devin/rules/<rule-name>/RULE.md`
4. ทุกไฟล์ย่อยไม่เกิน 250 บรรทัด

### 6. Validate And Align

> Goal: skill ผ่านมาตรฐาน

1. ทำ `/deep-validate` เพื่อตรวจ frontmatter, ความยาว, TODO/placeholder
2. ทำ `/review-devin-global-skills` เพื่อตรวจ conventions
3. ทำ `/follow-global-rules` เพื่อตรวจความสอดคล้อง
4. ถ้าไม่ผ่าน → แก้ไขและ recheck ไม่เกิน 3 รอบ

### 7. Update References

> Goal: references ครบถ้วน

1. ทำ `/update-references` เพื่ออัปเดตลิงก์ระหว่าง skills
2. อัปเดต `AGENTS.md` ถ้ามีการเปลี่ยนแปลง project rules
3. อัปเดต `global_rules.md` ถ้าเกี่ยวข้อง

### 8. Ship

> Goal: ส่งมอบ skill

1. ทำ `/ship`
2. ถ้า skill มี `src/` → ทำ `/convert-to-git-submodules` ก่อน ship
3. รายงาน path, name, และ status

## Rules

### 1. Naming

- `name` ต้องตรงกับ directory name
- ใช้ kebab-case ทั้งหมด
- ห้ามสร้างทับ skill ท่ีมีอยู่ ถ้าซ้ำให้ rename หรือ extend

### 2. Content

- `description` ไม่เกิน 100 ตัวอักษร
- `SKILL.md` ไม่เกิน 250 บรรทัด
- ไม่มี TODO/MOCK/placeholder
- ใช้ `## Execute` steps ไม่เกิน 10 ขั้นตอน
- ใช้ backticks สำหรับ code, paths, commands

### 3. Safety

- ทำ dry run ก่อน overwrite skill ท่ีมีอยู่
- ถ้ามี overwrite → ขอ confirmation
- ไม่ลบหรือทำลาย references ของ skills อื่น

### 4. Src Projects

- ถ้า skill มี `src/` ต้องทดสอบรันได้
- CLI ใช้ `src/presentation/cli.ts` หรือ `src/main.rs`
- Web ใช้ `src/index.ts` หรือ `src/main.ts`
- ทำ `/ship` หลัง validation ผ่าน

- ใช้ /update-devin-global-subagents ถ้าจำเป็น

## Expected Outcome

- Skill package ใหม่ถูกสร้างท่ี `%APPDATA%\devin\skills\<skill-name>\`
- `SKILL.md` มี frontmatter ครบ เนื้อหาถูกต้อง ไม่เกิน 250 บรรทัด
- `related` ครบและไม่มี broken references
- ผ่าน `/deep-validate` และ `/follow-global-rules`
- ถ้ามี code ก็ผ่าน `/ship` หรือ `/convert-to-git-submodules`

