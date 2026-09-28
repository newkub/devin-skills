---
name: idea-convert-devin-skills-to-mcp
description: สร้างไอเดียและ draft แปลง Devin skills เป็น MCP server (tools/resources/prompts)
argument-hint: "[skill-name|family]"
related:
  - idea-convert-my-global-cli-to-skills
  - update-devin-global-skills
  - review-mcp
  - check-my-global-cli
  - create-plan-in-dot-devin
  - deep-validate
  - report
  - then-apply
---

## Goal

สร้างไอเดียและ draft สำหรับแปลง Devin skills เป็น MCP server — map skill capabilities ไปยัง MCP primitives (tools, resources, prompts) ตามมาตรฐาน

## Scope

ใช้เมื่อต้องการให้ skills เข้าถึงได้จาก MCP clients อื่น หรือรวม skill logic เข้ากับ MCP ecosystem:

- สำรวจ skills/families ที่มี executable logic (scripts, CLIs, data-returning checks)
- ประเมินว่า skill ไหนเหมาะเป็น MCP tool/resource/prompt
- เขียน draft MCP server design (ไม่ implement จริงจนกว่า user confirm → `/then-apply`)
- รองรับทั้ง single skill, skill family (`check-*`, `run-*`) และทั้ง repo

## Execute

### 1. Select Skills

> Goal: ระบุ skills ที่จะ evaluate

1. ถ้า argument ระบุ skill/family → ใช้ตรงๆ; ถ้าไม่ → ถาม user หรือ survey ทั้ง repo
2. อ่าน `SKILL.md` + `src/`, `scripts/`, `references/` ของแต่ละ skill
3. เลือก 1-5 skills ต่อรอบ — ถ้ามากกว่านั้นให้ทำ `/create-plan-in-dot-devin`

### 2. Map Skill To MCP Primitives

> Goal: แต่ละ skill ได้ primitive ที่ถูกต้อง ไม่บังคับทุกอย่างเป็น tool

| Skill characteristic | MCP primitive |
|---------------------|---------------|
| executable action — script/CLI รันแล้วคืนผล | `tool` |
| เอกสารอ้างอิง/read-only data (`references/`, catalogs) | `resource` |
| workflow/instructions ล้วน (Goal/Execute/Rules) | `prompt` |
| dispatcher ที่ route ไปหลาย actions | `prompt` + หลาย `tools` |

1. skill ที่เป็น workflow ล้วน (ไม่มี executable code) → ไม่ควรเป็น MCP tool — เป็น `prompt` หรือไม่ convert เลย
2. skill ที่มี `src/`/`scripts/` → ห่อเป็น `tool` — input schema จาก CLI args, output จาก stdout/exit code
3. `references/*.md`, catalogs → `resource` ให้ client ดึงเอง

### 3. Evaluate Conversion Candidates

> Goal: ประเมินว่า skill ไหนคุ้มเป็น MCP

1. ใช้ criteria:
   - มี executable logic จริง (script/CLI/binary) — ไม่ใช่ prompt ล้วน
   - ผลลัพธ์ structured ใช้ต่อได้ (JSON, findings, paths)
   - มีประโยชน์ข้าม AI tools/clients ที่รองรับ MCP
   - stateless หรือ state จัดการได้ผ่าน MCP lifecycle
2. ให้คะแนน 1-5 ต่อ criterion แล้วรวม: High (≥14), Medium (9-13), Low (<9)
3. Low → ข้าม — skill ที่เป็น pure instructions อยู่เป็น skill ต่อดีกว่า

### 4. Group Into Servers

> Goal: จัดกลุ่ม tools เป็น server ตาม concern

1. รวม tools ที่ domain เดียวกันเป็น server เดียว เช่น `check-*` ast-grep metrics → `code-metrics` server
2. ชื่อ server รูป `<domain>-mcp` หรือ `devin-<domain>`; ห้าม server เดียวรวมทุกอย่าง
3. กำหนด transport: `stdio` (default, local) — `http` เฉพาะเมื่อต้อง remote
4. เลือก implementation: Bun/TypeScript SDK `@modelcontextprotocol/sdk` (ตาม tech stack ของ repo)

### 5. Draft MCP Servers

> Goal: เขียน draft design ต่อ server

1. ต่อ server ระบุ:
   - `name`, `description`, transport
   - tools: `name`, `description`, input schema (zod/JSON Schema), output shape — map จาก skill Execute steps
   - resources: URI pattern สำหรับ references/catalogs
   - prompts: workflow instructions จาก SKILL.md (Goal/Execute/Rules ย่อ)
2. Draft `mcp.json`/`server.json` config entry สำหรับ registration
3. ทำ `/report` table: `No.`, `Server`, `Tool/Resource/Prompt`, `Source Skill`, `Priority`, `Notes`

### 6. Validate And Suggest

> Goal: ตรวจสอบและนำเสนอทิศทางถัดไป

1. ทำ `/deep-validate` ตรวจ draft — schema ครบ, ไม่มี tool ชื่อซ้ำ, transport เหมาะสม
2. ทำ `/review-mcp` ถ้ามี — review draft เทียบ MCP best practices
3. ตรวจว่าไม่ duplicate กับ MCP servers ที่ติดตั้งอยู่แล้ว (`/check-my-global-cli` หรือ `.devin/config.json` mcpServers)
4. ถ้า draft ผ่าน → เสนอ `/then-apply` เพื่อ implement จริง; ถ้าไม่มี candidates → `/suggest-next-action`

## Rules

### 1. Conversion Criteria

- ห้าม convert skill ที่เป็น pure instructions ให้เป็น tool — นั่นคือ prompt ไม่ใช่ executable capability
- ไม่ duplicate กับ MCP servers ที่มีอยู่ — ตรวจติดตั้งก่อน
- หนึ่ง tool = หนึ่ง action ที่ input/output ชัดเจน ไม่ห่อทั้ง workflow เป็น tool เดียว
- tool names `snake_case` สื่อความหมาย: `<verb>_<noun>` เช่น `check_long_files`

### 2. Draft Quality

- input schema ต้องครบทุก flag/arg ที่ source skill ใช้จริง
- output ต้อง structured (JSON) — ไม่คืน raw prose ถ้า consumer เป็น agent
- ระบุ error cases: exit codes, missing deps, timeout
- drafts เก็บใน `.devin/plan/<workspace>/` หรือ report — ไม่เขียน server code จนกว่า confirm
- ใช้ /review-mcp ถ้าจำเป็น

## Expected Outcome

- รายการ skills ที่เหมาะ convert พร้อมคะแนนและ primitive mapping
- draft MCP server designs (tools/resources/prompts + config) สำหรับ High priority
- ตารางสรุป server → source skills → next action
