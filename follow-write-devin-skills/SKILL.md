---
name: follow-write-devin-skills
description: สร้างหรือปรับปรุง skill package โดยเลือก template และจัดการ directory
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
  - prepare-skills-context
  - follow-devin-skills-md
  - use-scripts
  - follow-create-bun-cli
  - follow-create-cli
  - follow-web-design
  - visualize-in-web
  - validate
  - review-devin-global-skills
  - check-circular-dependencies
  - update-reference
  - suggest-next-action
---

## Goal

สร้างหรือปรับปรุง skill package ทั้งหมด โดย focus ที่การเลือก template, สร้าง directory structure, และจัดการ references

## Scope

ใช้สำหรับสร้าง skill ใหม่หรือแก้ไข skill ใน `%APPDATA%\devin\skills\` หรือ workspace `.devin/skills/` โดยครอบคลุม directory, template selection, validation, references และการสร้าง CLI ถ้าจำเป็น โดยไม่ทำลาย references เดิม

## Execute

### 1. Prepare Context

เตรียม context ก่อนเขียน skill
> Goal: ทราบ target AI tool, directory, dependencies, template

1. ทำ `/prepare-skills-context` เพื่อตรวจจับ AI tool, อ่าน `global_rules.md`, `references/file-structure.md`, related skills, และเลือก template ตาม prefix
2. ถ้า skill มีอยู่แล้ว → อ่านไฟล์เดิมและระบุสิ่งที่ต้องปรับปรุง
3. ถ้า context ไม่ชัดหรือ reference ไม่มี → stop และ report
4. ถ้ามี dependencies จำเป็น → install พร้อมเขียน references ลง `references/`

### 2. Select Template

เลือก template ตามประเภท skill
> Goal: skill มีโครงสร้างเริ่มต้นที่เหมาะสม

1. เลือก template ตาม prefix:
   - `run-*` → `references/skill-type-run.md`
   - `follow-*` → `references/skill-type-follow.md` ยกเว้น `follow-*-architecture` → `references/skill-type-architecture.md`
   - `check-*` → `references/skill-type-check.md`
   - `analyze-*` → `references/skill-type-analyze.md`
   - `deep-*` → `references/skill-type-deep.md`
   - `review-*` → `references/skill-type-review.md`
   - `report-*` → `references/skill-type-report.md`
   - `idea-*` → `references/skill-type-idea.md`
2. ถ้าไม่ตรง template → ใช้ `/follow-devin-skills-md` เป็น fallback
3. อ่าน template ที่เลือกเพื่อดู sections, rules, file structure pattern และ example template
4. สร้าง directory structure ตาม pattern ใน template ที่เลือก

### 3. Write SKILL.md

สร้างหรือปรับปรุง `SKILL.md` โดยใช้ `/follow-devin-skills-md`
> Goal: `SKILL.md` ถูกต้องตาม Devin CLI spec

1. ทำ `/follow-devin-skills-md` เพื่อเขียน frontmatter และ prompt body
2. ตรวจสอบว่า `name` ตรงกับ directory name
3. กำหนด `description` ไม่เกิน 100 ตัวอักษร
4. ตั้งค่า `allowed-tools` และ `permissions` ตามความเหมาะสม
5. ถ้า skill ขึ้นต้นด้วย `check-` → กำหนด `allowed-tools` ให้รองรับ `exec`, `grep`, `glob`, `find_file_by_name` และวางแผนใช้ `/use-scripts` สำหรับ scan ซับซ้อน

### 4. Add Directory Contents

สร้างส่วนประกอบเพิ่มเติมถ้าจำเป็น
> Goal: skill directory รองรับไฟล์ย่อยโดยไม่ทำให้ `SKILL.md` ยาวเกินไป

1. ถ้าต้องการ external references หรือ dependencies → สร้าง `references/` และพยายามเขียน references ให้ครบถ้วน
2. ถ้าต้องการ helper scripts → สร้าง `scripts/` ตาม `/use-scripts`
3. ถ้าต้องการ expanded documentation → สร้าง `guide/` หรือ `examples/`
4. ถ้าต้องการ Devin workflows → สร้าง `workflows/`
5. ตรวจสอบว่าไฟล์ย่อยทุกไฟล์ไม่เกิน 250 บรรทัด

### 5. Create CLI (if needed)

สร้าง CLI ถ้า skill ต้องการ executable
> Goal: skill ที่ระบุ CLI มี entry point และรันผ่าน `bun run dev`

1. ถ้า `## Execute` ระบุว่าต้องใช้ CLI หรือทำงานผ่าน terminal → สร้าง CLI
2. ใช้ `/follow-create-bun-cli` หรือ `/follow-create-cli` เลือก framework
3. ใช้ `/use-scripts` สำหรับ helper scripts
4. วาง entry point ที่ `src/presentation/cli.ts`
5. รันทดสอบด้วย `bun run dev` หรือ `bun run src/presentation/cli.ts -- --help`
6. เก็บ generated files ให้ไม่เกิน 250 บรรทัดต่อไฟล์

### 6. Create Web (if needed)

สร้าง web app ถ้า skill ต้องการ visual หรือ browser
> Goal: skill ที่ระบุ web มี `web/` directory พร้อมรัน

1. ถ้า `## Execute` ระบุว่าต้องแสดงผล web หรือ browser → สร้าง `web/`
2. ใช้ `/follow-web-design` เพื่อออกแบบ UI/UX
3. ใช้ `/visualize-in-web` สร้างไฟล์ HTML entry ใน `web/`
4. รันทดสอบด้วย `bunx serve web/` หรือ `/open-web`
5. เก็บ generated files ให้ไม่เกิน 250 บรรทัดต่อไฟล์

### 7. Validate Skill

ตรวจสอบคุณภาพก่อน finalize
> Goal: skill package ผ่านเกณฑ์ทั้งหมด

1. ทำตาม `/validate` เพื่อตรวจความถูกต้อง
2. ทำตาม `/review-devin-global-skills` เพื่อตรวจ: ไม่เกิน 250 บรรทัด, sections ครบ, `related` ไม่มี missing/unused, ไม่มี TODO/MOCK/placeholder
3. ทำ `/check-circular-dependencies` ถ้ามีการแก้ `related`
4. ถ้าพบ issue → แก้และ revalidate (max 3 → stop/report)

### 8. Update References

อัปเดต references และสรุป
> Goal: skill package พร้อมใช้งาน references ครบถ้วน

1. ทำ `/update-reference` เพื่ออัปเดต references ที่เกี่ยวข้อง
2. ทำ `/suggest-next-action` เพื่อแนะนำ skills ถัดไป
3. ถ้า reference update ล้มเหลว → retry (max 3 → stop/report)

## Rules

### 1. Template Selection

- ใช้ `references/skill-type-*.md` เป็น canonical structure ตาม prefix
- `follow-*-architecture` ใช้ `references/skill-type-architecture.md` ไม่ใช่ `follow`
- ถ้าไม่ตรง template → ใช้ `/follow-devin-skills-md` เป็น fallback
- ถ้า skill เบี่ยงเบนจาก template → ระบุเหตุผลใน `## Scope`

### 2. Package Structure

- `SKILL.md` เป็น entry point หลัก
- สามารถมี `references/`, `scripts/`, `workflows/`, `guide/`, `examples/`, `web/` ตามความจำเป็น
- ถ้ามี CLI ต้องมี `src/presentation/cli.ts` เป็น entry point
- directory name ต้องตรงกับ `name` ใน frontmatter
- ไฟล์ย่อยทุกไฟล์ไม่เกิน 250 บรรทัด

### 3. Flow And Parallelism

- เรียง Foundation → Dependencies → High impact → High-risk เพื่อ fail fast
- ใช้คำนำหน้า `parallel:` และคั่นด้วย `∥` ใน `## Execute` สำหรับรายการที่รันพร้อมกันได้
- ทุก skill ที่เรียกต้องนำหน้าด้วย `ทำตาม`

### 4. Safety

- ทำ dry run ก่อน destructive หรือ high-risk actions
- ถ้ามี overwrite ไฟล์เดิม → user confirmation ก่อน
- ไม่ทำลาย references หรือ existing skills

### 5. Check And Validate Skills

- ถ้า skill ขึ้นต้นด้วย `check-` → พยายามใช้ tools หรือ `/use-scripts` ใน `## Execute`
- `allowed-tools` ของ `check-*` ต้องรวม `exec`, `grep`, `glob`, `find_file_by_name`
- หลีกเลี่ยงการให้ตรวจด้วยตาเปล่า; ใช้ commands, scripts, หรือ linters
- ผลลัพธ์ต้อง reproducible และอ้างอิงไฟล์/บรรทัด

### 6. CLI Support

- ถ้า skill ต้องการ CLI → เรียก `/follow-create-bun-cli` หรือ `/follow-create-cli` ก่อน validation
- ใช้ `src/presentation/cli.ts` เป็น entry point
- ตรวจสอบว่า `bun run dev` และ `bun run build` ทำงานได้
- รักษา package structure ที่ไม่เกิน 250 บรรทัด

### 7. Web Support

- ถ้า skill ต้องการ web → เรียก `/follow-web-design` ก่อนสร้าง `web/`
- ใช้ `/visualize-in-web` เพื่อสร้าง HTML entry
- ตรวจสอบว่า `bunx serve web/` หรือ `/open-web` ทำงานได้
- รักษา package structure ที่ไม่เกิน 250 บรรทัด

### 8. Skill Type File Structure

- ใช้ `references/skill-type-<prefix>.md` เป็น canonical pattern สำหรับแต่ละประเภท
- แต่ละ template ระบุไฟล์/directory ที่ควรมี เช่น `references/`, `scripts/`, `workflows/`, `src/presentation/cli.ts`, `guide/`, `examples/`, `web/`
- directory structure ต้องสอดคล้องกับ template ที่เลือก ไม่เพิ่ม/ลดโดยไม่มีเหตุผล

## Expected Outcome

- Skill package ทั้งหมดถูกต้องตามมาตรฐาน
- `SKILL.md` valid ตาม Devin CLI spec ผ่าน `/follow-devin-skills-md`
- Template ที่เลือกตรงกับ prefix ของ skill
- Directory contents ครบถ้วนและไม่เกิน 250 บรรทัดต่อไฟล์
- ถ้าต้องการ CLI จะมี `src/presentation/cli.ts` ที่ทดสอบผ่านแล้ว
- ถ้าต้องการ web จะมี `web/` directory ที่ทดสอบผ่านแล้ว
- `related` ถูกต้อง ไม่มี missing/unused
- references อัปเดตครบถ้วน
