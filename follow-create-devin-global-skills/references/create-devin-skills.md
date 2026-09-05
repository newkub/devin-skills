# Create Devin Skills Reference

## Goal

สร้างหรือปรับปรุง skill package ทั้งหมด โดย focus ที่การเลือก template, สร้าง directory structure, และจัดการ references

## Scope

ใช้สำหรับสร้าง skill ใหม่หรือแก้ไข skill ใน `.devin/skills/`, `.windsurf/skills/`, `.agents/skills/`, `~/.config/devin/skills/`, `~/.codeium/<channel>/skills/`, หรือ `%APPDATA%\devin\skills\` โดยครอบคลุม directory, template selection, validation, references และการสร้าง `src/` สำหรับ CLI หรือ web ถ้าจำเป็น โดยไม่ทำลาย references เดิม

ดูตัวอย่าง skill ใน [../examples/review-skill.md](../examples/review-skill.md)

## Execute

### 1. Prepare Context

> Goal: ทราบ target AI tool, directory, dependencies, template

1. ทำ `/prepare-skills-context` เพื่อตรวจจับ AI tool, อ่าน `global_rules.md`, related skills, และเลือก template ตาม prefix
2. ทำ `/check-skills-related` เพื่ออ่าน skills ที่เกี่ยวข้อง และทำ `/use-in-another-skills` เพื่อพิจารณาว่า skill นี้สามารถใช้ร่วมหรือขยายจาก skills อื่นได้หรือไม่
3. ถ้า skill มีอยู่แล้ว → อ่านไฟล์เดิมและระบุสิ่งที่ต้องปรับปรุง
4. ทำ `/learn-from-web` จาก Devin CLI docs เมื่อต้องการ verify spec
5. ถ้า context ไม่ชัดหรือ skill ซ้ำ → stop และ `/ask-me`
6. ถ้า skill มี dependencies (จำเป็นหรือ optional) จึงสร้าง `references/` → ดู [dependencies.md](dependencies.md)

### 2. Select Template

> Goal: skill มีโครงสร้างเริ่มต้นที่เหมาะสม

1. เลือก template ตาม prefix ดูรายละเอียดใน [../templates/index.md](../templates/index.md)
2. ถ้าไม่ตรง template → ใช้โครงสร้างมาตรฐาน `Goal` → `Scope` → `Execute` → `Rules` → `Expected Outcome`
3. อ่าน execute pattern จาก template ที่เลือก แล้วดูตัวอย่าง skill ครบรูปแบบใน [../examples/review-skill.md](../examples/review-skill.md)
4. สร้าง directory structure ตาม pattern ใน template ที่เลือก

### 3. Create From Url (if needed)

> Goal: สร้าง skill จาก URL หรือ domain ถ้า user ระบุ

1. ถ้ามี URL หรือ domain จาก user → ใช้ [create-from-url.md](create-from-url.md) เป็น guide
2. ทำตามขั้นตอนใน reference เพื่อดึงเนื้อหา จัดกลุ่ม และสร้าง subskills
3. หลังจากสร้าง parent และ subskills → ดำเนินตาม `### 4. Write SKILL.md`
4. ถ้าไม่มี URL หรือ domain → ข้าม step นี้

### 4. Write SKILL.md

> Goal: `SKILL.md` ถูกต้องตาม Devin CLI spec

1. เขียน YAML frontmatter ตาม [frontmatter.md](frontmatter.md)
2. เขียน prompt body ตามลำดับ: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
3. `## Execute` แบ่งเป็น steps ไม่เกิน 10 โดยใช้ `### N. Step Name`, description, `> Goal:`, และ numbered list
4. ใช้ `## Key Concepts`, `## Principles`, `## Guide`, หรือ `## Examples` เมื่อต้องการเน้นรูปแบบหรือตัวอย่าง
5. ใช้ backticks สำหรับ `tools`, `commands`, `paths`, `skill-name`. ห้ามใช้ `**` bold markers

### 5. Add Directory Contents

> Goal: skill directory รองรับไฟล์ย่อยโดยไม่ทำให้ `SKILL.md` ยาวเกินไป

1. ดูรายละเอียดใน [directory-structure.md](directory-structure.md)
2. ทุกไฟล์ใน file structure ต้องทำตาม `/follow-single-responsibility` — แต่ละไฟล์มีหน้าที่เดียวชัดเจน ไม่ผสมหลาย responsibilities ในไฟล์เดียว

### 6. Create Src (if needed)

> Goal: skill ที่ระบุ CLI หรือ web มี `src/` directory พร้อมรันและ ship

1. ดูรายละเอียดใน [src.md](src.md)
2. เลือก entry point ตาม stack ที่เลือก เช่น `src/presentation/cli.ts` สำหรับ Bun/TS หรือ `src/main.rs` สำหรับ Rust
3. ใช้ `src/` เก็บ web app code หรือ MCP server code ตามประเภท
4. ถ้า skill มี `src/` → ทำ `/convert-to-git-submodules` เพื่อแยกเป็น repo อิสระ
5. ถ้า skill มี `src/` → ทำ `/ship` เลยหลัง validation ผ่าน (ไม่ต้องถาม user)

### 7. Validate Skill

> Goal: skill package ผ่านเกณฑ์ทั้งหมด

1. ดูรายละเอียดใน [validation.md](validation.md)

### 8. Update References And Agents

> Goal: skill package พร้อมใช้งาน references ครบถ้วน

1. ทำ `/update-references` เพื่ออัปเดต references ที่เกี่ยวข้อง
2. ทำ `/update-agents-md` เพื่ออัปเดต `AGENTS.md` ของ repo
3. ทำ `/suggest-next-action` เพื่อแนะนำ skills ถัดไป
4. ถ้า reference update ล้มเหลว → retry (max 3 → stop/report)

## Rules

### 1. Template Selection

- ใช้ skill type template ตาม prefix เป็น canonical structure. `follow-*-architecture` ใช้ architecture template ไม่ใช่ follow
- ถ้าไม่ตรง template → ใช้โครงสร้างมาตรฐาน `Goal` → `Scope` → `Execute` → `Rules` → `Expected Outcome`
- ถ้า skill เบี่ยงเบนจาก template → ระบุเหตุผลใน `## Scope`

### 1.1. Follow Prefixes

`follow-*` skills แบ่งตาม nature ของเป้าหมาย:

| Prefix | สำหรับ | ตัวอย่าง |
|--------|--------|----------|
| `follow-lang-` | programming language / runtime | `follow-lang-rust`, `follow-lang-python`, `follow-lang-typescript` |
| `follow-framework-` | meta-framework / app framework | `follow-framework-nuxt`, `follow-framework-tauri` |
| `follow-service-` | external service / cloud platform | `follow-service-supabase`, `follow-service-vercel`, `follow-service-aws-sdk` |
| `follow-lib-` | library / package ที่ import ใน app code | `follow-lib-drizzle`, `follow-lib-zod`, `follow-lib-pinia`, `follow-lib-vue` |
| `follow-tool-` | CLI tool / dev tool / build tool | `follow-tool-biome`, `follow-tool-vite`, `follow-tool-ast-grep` |
| `follow-create-` | สร้าง plugins / extensions / CLI / lib | `follow-create-bun-cli`, `follow-create-eslint-plugins` |
| `follow-` (คงเดิม) | concept / practice / workflow / process | `follow-architecture`, `follow-tdd`, `follow-deploy`, `follow-plan` |

- ถ้า skill ไม่ตรง prefix ใด → ใช้ `follow-` คงเดิม
- ถ้า skill ครอบคลุมหลาย category → เลือก prefix ตาม primary responsibility

### 2. Package Structure

- `SKILL.md` เป็น entry point หลัก ไม่เกิน 250 บรรทัด โดยค่าเริ่มต้น skill ใหม่มีเฉพาะ `SKILL.md`
- ถ้า skill มี dependencies, CLI, web, templates, หรือ examples คงทีจำเป็น → จึงเพิ่ม `references/`, `src/`, `templates/`, `examples/`, `scripts/`, `subskills/`, `guide/` หรือ `.devin/rules/` ตามความเหมาะสม แล้ว refactor file structure ให้ SRP ชัดเจน
- ถ้ามี CLI หรือ web ต้องมี `src/` เป็น root ของ code. CLI entry point ที่ `src/presentation/cli.ts`. directory name ต้องตรงกับ `name` ใน frontmatter. ไฟล์ย่อยทุกไฟล์ไม่เกิน 250 บรรทัด
- ถ้า `references/` มี nested directories → ใช้ `/follow-flat-files`. ถ้า flat ทั้ง skill package → ใช้ `/follow-flat-folders`
- ทุกไฟล์ใน file structure ต้องทำตาม `/follow-single-responsibility` — แต่ละไฟล์รับผิดชอบหน้าที่เดียวชัดเจน ถ้าไฟล์รวมหลาย responsibilities → แยกเป็นไฟล์ย่อย

### 3. Safety

- ทำ dry run ก่อน destructive หรือ high-risk actions. ถ้ามี overwrite ไฟล์เดิม → user confirmation ก่อน. ไม่ทำลาย references หรือ existing skills
- `permissions` ระบุ `deny` สำหรับ system paths ที่เสี่ยง. `ask` สำหรับ write ที่สำคัญ. ไม่ใส่ secrets, credentials หรือ hardcoded paths ที่ sensitive ใน prompt

### 4. Check And Validate Skills

- ถ้า skill ขึ้นต้นด้วย `check-` → พยายามใช้ tools หรือ `/use-scripts` ใน `## Execute`. `allowed-tools` ต้องรวม `exec`, `grep`, `glob`, `find_file_by_name`
- หลีกเลี่ยงการให้ตรวจด้วยตาเปล่า. ใช้ commands, scripts, หรือ linters. ผลลัพธ์ต้อง reproducible และอ้างอิงไฟล์/บรรทัด

### 5. Src Support

- ถ้า skill ต้องการ CLI → เรียก `/follow-create-cli` ก่อน validation. เลือก entry point ตาม stack ที่เลือก เช่น `src/presentation/cli.ts` สำหรับ Bun/TS หรือ `src/main.rs` สำหรับ Rust. ตรวจสอบว่า dev/build ทำงานได้ด้วยคำสั่งที่เหมาะสม
- ถ้า skill ต้องการ web → เรียก `/review-frontend` ก่อนสร้าง `src/`. ใช้ `/visualize-in-web` เพื่อสร้าง HTML entry. ตรวจสอบว่า dev server หรือ `/open-web` ทำงานได้
- ถ้า skill ต้องการ MCP server → เรียก `/follow-create-mcp` (พยายาม Rust ก่อน) แล้วอัปเดต `mcp_config.json`
- รักษา package structure ที่ไม่เกิน 250 บรรทัด
- ถ้า skill มี `src/` → ทำ `/convert-to-git-submodules` เพื่อแยกเป็น repo อิสระหลัง validation ผ่าน
- ถ้า skill มี `src/` → ทำ `/ship` เลยหลัง validation ผ่าน ไม่ต้องถาม user

### 6. Subagent And Model

- ใช้ `subagent: true` สำหรับงาน focused, self-contained. ใช้ `agent: <profile>` เมื่อต้องการ profile เฉพาะ. ถ้าตั้งทั้ง `agent` และ `subagent` → `agent` มี precedence. skill ที่รันเป็น subagent จะไม่ spawn nested subagents

### 7. Dependencies

- ดูรายละเอียดใน [dependencies.md](dependencies.md)
- install commands ใน `SKILL.md` และ `references/` ใช้ `bun add` เป็น default สำหรับ JS/TS projects และ `bun add -g` สำหรับ global CLI (ยกเว้น project ใช้ npm/pnpm/yarn เป็นหลัก)

### 8. References

- ถ้า skill มี `references/` → ต้องมี `references/index.md` ทีอ้างถึงไฟล์ย่อยทั้งหมดด้วยตาราง `| File | Responsibility |`
- ต้องมี `references/website.md` พร้อม official `Website`, `Documentation`, `Repository`, `Package Registry` (ถ้ามี) และ description สั้นๆ
- `references/cli.md` สำหรับ CLI tool ใช้ตาราง 4 คอลัมน์: `| commands | description | default | options |`
- `references/apis/index.md` สำหรับ `follow-lib-*`, `follow-framework-*`, `follow-service-*`, `follow-create-*-plugins/extensions/bots` ทีมี dependencies ประกอบด้วย:
  - `## Install` ด้วยคำสั่่งทีเหมาะสมกับ ecosystem เช่น `bun add -D <package>`, `cargo add <crate>`, `pip install <pkg>`
  - `## Version` ระบุ latest version, Package Registry, Repository
  - `## Dependencies` สั้นๆ
  - `## Common API / Commands` ตาราง `| commands | description | default | options |`
  - `## Source` ลิงก์ official docs
- ห้ามใช้ placeholder หรือข้อความทีระบุว่ายังไม่เสร็จ ใน `references/`; ข้อมูลต้อง research จาก official docs หรือ package registry จริง
- ทุกไฟล์ใน `references/` ไม่เกิน 250 บรรทัด

## Expected Outcome

- Skill package ทั้งหมดถูกต้องตามมาตรฐาน. `SKILL.md` valid ตาม Devin CLI spec. frontmatter ครบถ้วนและถูกต้อง. prompt body มี `Goal`, `Scope`, `Execute`, `Rules`, `Expected Outcome`
- Template ที่เลือกตรงกับ prefix ของ skill. Directory contents ครบถ้วนและไม่เกิน 250 บรรทัดต่อไฟล์
- ถ้าต้องการ CLI จะมี `src/presentation/cli.ts` ที่ทดสอบผ่านแล้ว. ถ้าต้องการ web จะมี `src/` directory ที่ทดสอบผ่านแล้ว
- ถ้า skill มี `src/` จะถูกแปลงเป็น submodule ผ่าน `/convert-to-git-submodules` และ ship ผ่าน `/ship` เลย
- ถ้าต้องการ project rules จะมี `.devin/rules/` ที่ตรวจสอบผ่านแล้ว. references อัปเดตครบถ้วน. `AGENTS.md` อัปเดตผ่าน `/update-agents-md`
- ทุก skill ที่มี dependencies ต้องมี `references/` ทีเขียนจริงโดย `/learn-from-web` ครบทุก dependency ไม่มี placeholder; ถ้าไม่มี dependencies ให้เริ่มต้นด้วย `SKILL.md` เพียงไฟล์เดียว
- install commands ใช้ `bun add` เป็น default สำหรับ JS/TS projects และ `bun add -g` สำหรับ global CLI (ยกเว้น project ใช้ npm/pnpm/yarn เป็นหลัก)


