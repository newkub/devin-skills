---
name: follow-create-devin-global-skills
description: มาตรฐานการสร้าง global Devin skills ใน %APPDATA%\devin\skills พร้อม templates และ references
argument-hint: "[skill-name...]"
related:
  - update-devin-global-skills
  - follow-create-devin-project-skills
  - create-devin-global-skills
  - new-skills
  - follow-skills-map
  - check-skills-related
  - use-in-another-skills
  - prepare-skills-context
  - follow-my-tech-stack
  - review-techstack
  - follow-create-cli
  - follow-create-web
  - follow-create-mcp
  - follow-global-rules
  - review-devin-global-skills
---

## Goal

กำหนดมาตรฐานการสร้าง global Devin skills ใน `%APPDATA%\devin\skills` — naming, structure, templates, content rules และ ecosystem detection ที่ skills อื่นอ้างอิงเมื่อสร้าง skill ใหม่

## Scope

ใช้เป็น reference หลักเมื่อสร้าง skill ใหม่ใน `%APPDATA%\devin\skills` — skill อื่นที่สร้าง skill (เช่น `/new-skills`, `/create-devin-global-skills`) ต้อง follow มาตรฐานนี้ ส่วน project-local skills ใน `.devin/skills/` ใช้ `/follow-create-devin-project-skills`

ดูเพิ่มเติม: /update-devin-global-skills, /follow-create-devin-project-skills, /check-skills-related, /follow-skills-map

## Execute

### 1. Identify Skill Name And Check Duplicates

> Goal: รู้ว่าจะสร้าง skill อะไรและไม่ซ้ำกับที่มีอยู่

1. ทำ `/prepare-skills-context` เพื่อเตรียม AI tool, directory และ conventions
2. รับ `skill-name` จาก argument หรือ context — ถ้าไม่ชัด → ทำ `/ask-me`
3. ใช้ kebab-case และ `name` ใน frontmatter ต้องตรงกับ directory name
4. ทำ `/follow-skills-map` เพื่อดูกลุ่ม skills ที่เกี่ยวข้อง
5. ทำ `/check-skills-related` หรือ `/scan-codebase` เพื่อหา skills ที่ซ้ำหรือคล้ายกัน
6. ถ้าซ้ำ → ทำ `/use-in-another-skills` เพื่อเสนอ extend หรือ rename แทนการสร้างทับ
7. ห้ามสร้างทับ skill ที่มีอยู่โดยไม่ได้รับ confirmation

### 2. Select Template And Structure

> Goal: skill มีโครงสร้างเริ่มต้นที่ถูกต้องตาม prefix

1. อ่าน [references/index.md](references/index.md) และ [references/create-devin-skills.md](references/create-devin-skills.md)
2. เลือก execute pattern template ตาม prefix จาก `templates/` โดยใช้ longest match ก่อน:
   - `run-*` → `templates/run.md`
   - `follow-lib-*` → `templates/lib.md`
   - `follow-create-*` → `templates/follow-create.md` ถ้ามี หรือ `templates/follow.md` ถ้ายังไม่มี
   - `follow-*-architecture` → `templates/follow-architecture.md`
   - `follow-*` → `templates/follow.md`
   - `check-*` → `templates/check.md`
   - `analyze-*` → `templates/analyze.md`
   - `deep-*` → `templates/deep.md`
   - `review-*` → `templates/review.md`
   - `idea-*` → `templates/idea.md`
   - `report-*` → `templates/report.md`
3. สร้าง directory `%APPDATA%\devin\skills\<skill-name>\`
4. ดูตัวอย่างจริงใน `examples/` และ skills ที่มี prefix เดียวกัน
5. ถ้าพบ pattern ที่ใช้ซ้ำจาก skills ที่คล้ายกัน → เพิ่ม template ใน `templates/` หรือ `references/` แทนการเขียนซ้ำ

### 3. Detect Ecosystem

> Goal: เลือก commands และ dependencies ที่ถูกต้องตาม target

1. ตรวจ manifest ของ target workspace: `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, `requirements.txt`
2. Bun/Node → `bun add`/`bun install` (ยกเว้น project ใช้ npm เป็นหลัก)
3. Rust → `cargo add`, Go → `go get`, Python → `pip install`
4. Global CLI ที่เป็น npm package → `mise use -g npm:<package>` ก่อน แล้วค่อย `scoop`/`brew`/`winget`

### 4. Handle App-Type Skills

> Goal: skill ที่ต้องสร้าง app มี workflow ที่ถูกต้อง

1. ถ้า skill ต้องสร้าง app แทน script → เลือก `follow-create-*` ตามประเภท:
   - CLI → `/follow-create-cli` (ใช้ `/follow-my-tech-stack` สำหรับ table/command/prompt/TUI)
   - Website → `/follow-create-web`
   - MCP server → `/follow-create-mcp` (พยายาม Rust MCP ก่อน ถ้าไม่เหมาะค่อย fallback TypeScript MCP)
2. ถ้า `follow-create-*` ต้องสร้าง app, CLI, library หรือ plugin ทีมี dependencies ให้ทำก่อนเขียน `SKILL.md`:
   - ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack
   - ทำ `/review-techstack` เพื่อ review dependencies และ library design
   - เพิ่มทั้งสอง skill เข้า `related`
   - ใส่เป็นขั้นตอนแรกใน `## Execute`
3. ถ้าสร้าง MCP server → อัปเดต `%APPDATA%\devin\mcp_config.json` เพื่อ register server
4. ถ้า skill มี `src/` ต้องทดสอบรันได้ — CLI ใช้ `src/presentation/cli.ts` หรือ `src/main.rs`, Web ใช้ `src/index.ts` หรือ `src/main.ts`

### 5. Write SKILL.md

> Goal: เอกสาร skill ถูกต้องตาม spec

1. Frontmatter ครบ: `name` (ตรง directory), `description` ≤100 ตัวอักษร, `argument-hint`, `related` ≤15 skills
2. Sections ตามลำดับ: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
3. แบ่ง `## Execute` เป็น steps ไม่เกิน 10 ขั้นตอน แต่ละ step มี `> Goal:`
4. ใช้ backticks สำหรับ `tools`, `commands`, `paths`, `skill-name`
5. ไม่ใช้ `**` bold markers
6. ถ้าไฟล์เกิน 250 บรรทัด → แยกไป `references/` หรือ `subskills/` ตามลักษณะเนื้อหา
7. ตรวจ markdown links ใน `SKILL.md` ชี้ไปไฟล์ที่มีอยู่จริง

### 6. Apply Language Rules

> Goal: ภาษาของเนื้อหาถูกต้องตามประเภท skill

1. Global skills ใน `%APPDATA%\devin\skills` → เขียนเนื้อหาภาษาไทย คงคำศัพท์เทคนิคเป็นภาษาอังกฤษ
2. คำศัพท์เทคนิค เช่น tool names, skill names, commands, paths, `git`, `lint`, `AST`, `CLI`, `JSON`, `API` ไม่ต้องแปล
3. Project-local skills → เขียนภาษาอังกฤษทั้งหมด (ใช้ `/update-devin-project-skills`)
4. ถ้าพบ global skill ที่เขียนอังกฤษทั้งหมด → แปลเป็นไทยโดยคงคำศัพท์เทคนิค

### 7. Align Before Ship

> Goal: skill สอดคล้องกับ repo standards

1. ทำ `/review-devin-global-skills` เพื่อตรวจ conventions, naming, structure
2. ทำ `/follow-global-rules` เพื่อตรวจว่าไม่ขัด `global_rules.md`
3. ส่งต่อ `/update-devin-global-skills` สำหรับ validate, update references และ ship

## Rules

### 1. Structure And Naming

- `name` ตรง directory name, kebab-case เท่านั้น
- `description` ≤100 ตัวอักษร
- `related` ≤15 skills และทุกตัวต้องมี directory จริง
- ทุกไฟล์ใน skill ไม่เกิน 250 บรรทัด

### 2. No Duplication

- ตรวจซ้ำก่อนสร้างเสมอ — ซ้ำให้ extend หรือ rename
- ใช้ `references/` และ `templates/` แทนการเขียนเนื้อหาซ้ำใน `SKILL.md`

### 3. Content Quality

- ไม่มี TODO/MOCK/placeholder
- ทุก instruction ระบุ action, condition หรือ expected result ที่ตีความได้ทางเดียว
- ทำ dry run ก่อน destructive actions และขอ confirmation เมื่อ overwrite

### 4. References Discipline

- บันทึก external docs ลง `references/` พร้อม `references/index.md` เป็น index
- หลังสร้าง skill → skills ที่เกี่ยวข้องต้องอัปเดต `related` ถ้าเหมาะสม

## Expected Outcome

- Skill ใหม่ใน `%APPDATA%\devin\skills\<skill-name>\` มี structure ครบตาม `templates/` และ `references/`
- `SKILL.md` ผ่าน frontmatter spec, section order, 250-line limit และ language rules
- Ecosystem detection ถูกต้อง — commands/dependencies ตรง stack
- ไม่มี duplicate กับ skills เดิม และ references ไม่ broken
- พร้อมส่งต่อ `/update-devin-global-skills` สำหรับ validate และ ship
