---
name: update-devin-global-skills
description: สร้างหรืออัปเดต skill หนึ่งตัวหรือหลายตัวใน devin skills repo ตามมาตรฐาน
argument-hint: "[@files...]"
related:
  - use-in-another-skills
  - scan-codebase
  - review-devin-global-skills
  - follow-global-rules
  - alignment
  - deep-validate
  - check-reference
  - update-references
  - review-issue
  - ship
  - deep-research-and-update-skills
  - follow-create-cli
  - follow-create-web
  - follow-create-mcp
  - follow-my-tech-stack
  - review-techstack
  - follow-skills-map
---

## Goal

สร้างหรืออัปเดต skill หนึ่งตัวหรือหลายตัวใน `%APPDATA%\devin\skills` ให้ถูกต้องตามมาตรฐานและพร้อมใช้งาน

## Scope

ใช้เมื่อต้องสร้าง skill ใหม่หรืออัปเดต skill ที่มีอยู่ รองรับทั้งกรณีระบุ skill เดียว หลาย skill หรือไม่ระบุเลย พร้อม detect ecosystem จาก package manifest เพื่อเลือกภาษา คำสั่ง และ dependencies ที่เหมาะสม

## Execute

### 1. Identify Targets

> Goal: รู้ว่าต้องสร้างหรืออัปเดต skill ใดบ้าง

1. รับ `@files...` จาก argument หรือ context
2. ถ้าไม่มี `@files` → อ่าน `%APPDATA%\devin\skills` ทั้งหมดเพื่อ update/merge ทุก skill
3. ถ้ามี `@files` → อัปเดตเฉพาะ skill ที่ระบุ
4. ตรวจสอบว่าแต่ละ `<skill-name>\SKILL.md` มีอยู่หรือไม่
5. ถ้าไม่มี → สร้างใหม่; ถ้ามี → อัปเดต
6. ถ้าชื่อไม่ชัด → ทำ `/ask-me` ก่อนดำเนินการ
7. ทำ `/follow-skills-map` เพื่อดูกลุ่ม skills ทีเกี่ยวข้องก่อนดำเนินการต่อ

### 2. Create Or Update Each Skill

> Goal: สร้างหรืออัปเดตแต่ละ skill ตามมาตรฐาน

1. ถ้าต้องสร้าง skill ใหม่หรืออัปเดต skill ทีมี topic/library เปลี่ยน → ทำ `/deep-research-and-update-skills` เพื่อหาข้อมูลล่าสุดก่อน
2. สำหรับ skill ใหม่ → ทำ `/scan-codebase` เพื่อตรวจว่าไม่ซ้ำกับ skills ที่มีอยู่
3. ถ้าซ้ำ → ทำ `/use-in-another-skills` เพื่อเสนอ extend หรือ rename ก่อน
4. สร้าง directory `%APPDATA%\devin\skills\<skill-name>\`
5. ตรวจ ecosystem ของ target workspace จาก `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, `requirements.txt` เพื่อเลือก commands, package manager และ dependencies ที่ถูกต้อง
6. ถ้า skill ต้องสร้าง app แทน script → เลือก `follow-create-*` ตามประเภท:
   - CLI → `/follow-create-cli` (ใช้ `/follow-my-tech-stack` สำหรับ table/command/prompt/TUI)
   - Website → `/follow-create-web`
   - MCP server → `/follow-create-mcp` (พยายามใช้ Rust MCP ก่อน ถ้าไม่เหมาะจึง fallback ไป TypeScript MCP)
7. ถ้า skill เป็น `follow-create-*` ให้บังคับมีขั้นตอนนี้ก่อนเขียน `SKILL.md`:
   - ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
   - ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
   - เพิ่มทั้งสอง skill เข้า `related`
   - ใส่เป็นขั้นตอนแรกใน `## Execute` ก่อนขั้นตอนอื่น
8. ถ้าสร้าง MCP server → อัปเดต `%APPDATA%\devin\mcp_config.json` เพื่อ register server ที่สร้าง
9. ทำตาม [references/create-devin-skills.md](references/create-devin-skills.md) เพื่อเลือก template, เขียน `SKILL.md`, directory structure, references และ `src/` ถ้าจำเป็น
10. กำหนด `name` ให้ตรงกับ directory name และ `description` ไม่เกิน 100 ตัวอักษร
11. ถ้าไฟล์เกิน 250 บรรทัด → แยกออกไปยัง `references/` หรือ `subskills/`
12. ตรวจ markdown links ใน `SKILL.md` ชี้ไปยังไฟล์ที่มีอยู่จริง
13. วิเคราะห์ file structure ของ skills ที่คล้ายกัน ถ้าพบ pattern ที่ใช้ซ้ำ → สร้าง template ใน `references/` หรือ `templates/` แล้วให้ skill ใหม่อ้างอิง template แทนที่จะเขียนซ้ำ

### 3. Align With Catalog And Global Rules

> Goal: skill ใหม่หรือ skill ที่อัปเดตสอดคล้องกับ repo standards และ global rules

1. ทำ `/review-devin-global-skills` เพื่อตรวจสอบว่า skill ตรงกับ conventions, naming, structure, และ content quality ของ repo
2. ทำ `/follow-global-rules` เพื่อตรวจสอบว่า skill ไม่ขัดแย้งกับ `global_rules.md`
3. ถ้ามี misalignment → ปรับแก้ก่อน validate
4. บันทึก findings และการแก้ไข

### 4. Validate

> Goal: skill ผ่านเกณฑ์ทั้งหมด

1. ทำ `/deep-validate` เพื่อตรวจ frontmatter, sections, ความยาว, `related` missing/unused, TODO/MOCK/placeholder
2. ตรวจทุกไฟล์ไม่เกิน 250 บรรทัด
3. ทำ `/check-circular-dependencies` ถ้ามีการแก้ `related`
4. ถ้าไม่ผ่าน → แก้และ recheck (max 3 รอบ → stop และ report)

### 5. Review Issue And Reference Coverage

> Goal: ตรวจ issues และ references ที่เกี่ยวข้อง

1. ถ้ามี issue หรือ gap ที่พบระหว่าง update → ทำ `/review-issue` เพื่อประเมินความสำคัญ
2. บันทึก findings พร้อม severity และ recommendation
3. ถ้ามี skill ที่เกี่ยวข้องกับ `global_rules.md` หรือ `follow-global-rules` → อัปเดต references ทั้งสองทาง

### 6. Update References

> Goal: references ทั้งหมดถูกต้อง

1. ทำ `/update-references` เพื่ออัปเดต references ระหว่าง skills
2. อัปเดต `AGENTS.md` ถ้ามีการ rename หรือย้าย skill
3. ถ้า skill ที่ update เกี่ยวข้องกับ global rules → อัปเดต `global_rules.md` และ `/follow-global-rules` ด้วย
4. ตรวจว่า skills อื่นที่อ้างถึง skill นี้ยังถูกต้อง
5. ถ้ามี broken references → แก้ทันที

### 7. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะและ stop
3. ทำ `/report-table` สรุป before-after, findings, actions และ next actions

## Rules

### 1. Target And Naming

- สร้างหรืออัปเดต skill ใน `%APPDATA%\devin\skills`
- directory name ต้องตรงกับ `name` ใน frontmatter
- ห้ามสร้างทับ skill ที่มีอยู่ ถ้าซ้ำให้ extend หรือ rename

### 2. Content Standard

- ทำตาม `references/create-devin-skills.md` สำหรับ `SKILL.md`, template และ directory structure
- `description` ไม่เกิน 100 ตัวอักษร
- ใช้ backticks สำหรับ `tools`, `commands`, `file paths`, `skill-name`
- ไม่เกิน 250 บรรทัดต่อไฟล์

### 3. Safety

- ทำ dry run ก่อน destructive หรือ high-risk actions
- ถ้ามี overwrite ไฟล์เดิม → user confirmation ก่อน
- ไม่ทำลาย references หรือ existing skills

### 4. Validation

- skill ต้องผ่าน `/deep-validate` ก่อน ship
- ไม่มี TODO/MOCK/placeholder
- install commands ใช้ตาม ecosystem หลัก: `bun add`/`bun install` สำหรับ Bun/Node ecosystem (ยกเว้น project ใช้ npm เป็นหลัก), `cargo add` สำหรับ Rust, `go get` สำหรับ Go, `pip install` สำหรับ Python
- สำหรับ global CLI ที่เป็น npm package ใน Bun/Node ecosystem ให้ใช้ `mise use -g npm:<package>`

### 5. Language

- global skills ใน `%APPDATA%\devin\skills` เขียนเนื้อหาเป็นภาษาไทย โดยคงคำศัพท์เทคนิคไว้เป็นภาษาอังกฤษ
- คำศัพท์เทคนิค เช่น tool names, skill names, commands, paths, `git`, `lint`, `AST`, `CLI`, `JSON`, `API` ไม่ต้องแปล
- project-local skills เขียนเนื้อหาเป็นภาษาอังกฤษทั้งหมด
- ถ้าพบ global skill ทีเขียนเนื้อหาเป็นภาษาอังกฤษทั้งหมด ให้แปลเป้นภาษาไทยโดยคงคำศัพท์เทคนิคไว้

- ใช้ /alignment ถ้าจำเป็น
- ใช้ /check-reference ถ้าจำเป็น

## Expected Outcome

- skill ใหม่ถูกสร้างหรือ skill เดิมถูกอัปเดตที่ `%APPDATA%\devin\skills\<skill-name>\`
- `SKILL.md` ผ่าน `/deep-validate`, ไม่เกิน 250 บรรทัด, ไม่มี TODO/MOCK/placeholder
- `related` ครบถ้วน, ไม่มี missing/unused
- directory structure ครบถ้วนตาม `references/create-devin-skills.md`
- skill รองรับหลาย ecosystem และสถานการณ์ ไม่ผูกติดกับ stack เดียว
- ถ้าพบ pattern จาก file structure ของ skills ที่คล้ายกัน มี template ใน `references/` หรือ `templates/`
- ถ้ามีการสร้าง MCP server → `%APPDATA%\devin\mcp_config.json` ถูกอัปเดตพร้อม register server
- references อัปเดตครบทั้ง `AGENTS.md`, `global_rules.md`, `/follow-global-rules` และ skills อื่นที่เกี่ยวข้อง

