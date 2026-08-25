---
name: update-dot-devin
description: สร้าง .devin structure ครบถ้วนรวม rules และ hooks โดยไม่มี workflows directory
---

## Goal

สร้าง `.devin` structure ครบถ้วนสำหรับ project workspace รวม rules และ hooks โดยไม่มี `workflows/` directory

## Scope

ใช้สำหรับสร้าง `.devin` structure ใน project workspace ใดๆ ถ้าเป็น monorepo ให้สร้าง `.devin` เฉพาะที่ root เท่านั้น แต่ละ workspace มี `AGENTS.md` ของตัวเอง ไม่สร้าง `.devin/` ใน sub-workspace

## Execute

### 1. Check Project Type

> Goal: ตรวจสอบประเภท project เพื่อกำหนด structure

1. ทำ `/check-monorepo` เพื่อตรวจสอบว่า project เป็น monorepo หรือไม่
2. ถ้าเป็น monorepo ให้ทำตาม Monorepo section ด้านล่าง
3. ถ้าไม่ใช่ monorepo ให้ทำตาม Single Project section

### 2. Analyze Project

> Goal: วิเคราะห์ project เพื่อดู tech stack, structure, และ patterns

1. ทำ `/analyze-project` เพื่อดู tech stack, structure, และ patterns
2. อ่าน `package.json` ทั้ง root และ workspace เพื่อดู dependencies ทั้งหมด

### 3. Setup Root Rules And Hooks

> Goal: สร้าง root `.devin` structure สำหรับ shared rules และ hooks

1. อ่าน https://docs.devin.ai/cli/extensibility/rules เพื่อเข้าใจ rules
2. สร้าง `.devin/rules` directory พร้อม subdirectories: `always-on/`, `model_decision/`, `glob/`
3. ทำ `/update-devin-project-rules` เพื่อเขียน rules ตาม dependencies จริง
4. ทำ `/follow-write-devin-skills` เพื่อสร้าง project-specific workflows
5. ทำตาม Rules section ด้านล่างสำหรับ frontmatter และ format

### 4. Setup Hooks

> Goal: สร้าง hooks สำหรับ Cascade

1. อ่าน https://docs.devin.ai/cli/extensibility/hooks/overview เพื่อเข้าใจ hooks
2. สร้าง `.devin/hooks` directory
3. สร้าง TypeScript scripts: `run-lint.ts`, `run-typecheck.ts`
4. สร้าง `.devin/hooks/hooks.json` configuration
5. ทำตาม Rules section ด้านล่างสำหรับ hook format

### 5. Setup Workspace AGENTS.md (Monorepo Only)

> Goal: ถ้าเป็น monorepo ให้สร้าง `AGENTS.md` สำหรับแต่ละ workspace โดยไม่สร้าง `.devin/` ใน sub-workspace

1. ระบุ workspaces ทั้งหมดจาก root `package.json` `workspaces` field
2. สำหรับแต่ละ workspace:
   1. ทำ `/update-agents-md` สำหรับ workspace นั้น เพื่อเขียน `AGENTS.md`
   2. อ้างอิง dependencies ใน `<workspace>/package.json` เพื่อเขียน workspace-specific instructions
3. ทำ `/update-agents-md` สำหรับ root `AGENTS.md` โดยระบุว่าให้ทำตาม `AGENTS.md` ของแต่ละ workspace
4. ตรวจสอบว่าไม่มี `.devin/` directory ใน sub-workspace ใดๆ

### 6. Setup Skills And MCP (Optional)

> Goal: ตั้งค่า skills และ MCP servers (ถ้า project มีความต้องการเฉพาะ)

1. อ่าน https://docs.devin.ai/cli/extensibility/skills/overview เพื่อเข้าใจ skills
2. อ่าน https://docs.devin.ai/cli/extensibility/mcp/overview เพื่อเข้าใจ MCP
3. ตั้งค่า skills และ MCP servers ตามความจำเป็นของ project

### 7. Update Ast-Grep Rules

> Goal: เขียน ast-grep rules ใน `rules/` directory ที่ project root ตาม devin rules ที่สร้างขึ้น

1. ทำ `/update-rules` เพื่อแปลง devin rules เป็น ast-grep YAML format
2. สร้าง ast-grep rules ใน `rules/always-on/`, `rules/model_decision/`, และ `rules/glob/` ที่ project root (แยกจาก `.devin/rules/` ที่เก็บ devin rules เป็น Markdown)
3. อัพเดท `sgconfig.yml` ให้ `ruleDirs` ชี้ไปที่ `rules/always-on`, `rules/model_decision`, และ `rules/glob`
4. ตั้งค่า `sgconfig.yml` `languageAliases` สำหรับ TypeScript และ JavaScript file extensions
5. ตั้งค่า `sgconfig.yml` `devPaths` สำหรับ source directories ที่ต้องการ scan
6. รัน `bunx ast-grep scan --inspect summary` เพื่อตรวจสอบว่า rules parse ได้
7. รัน `bun run scan` เพื่อ scan ทั้ง codebase

### 8. Remove Workflows Directory

> Goal: ลบ `.devin/workflows/` directory ถ้ามีอยู่

1. ตรวจสอบว่า `.devin/workflows/` directory มีอยู่หรือไม่
2. ถ้ามี ให้ลบทิ้งทั้ง directory

### 9. Test And Validate

> Goal: ทดสอบและตรวจสอบ

1. ทดสอบ hooks ด้วยการแก้ไข code
2. ตรวจสอบ exit codes และ output
3. ตรวจสอบ JSON configuration ถูกต้อง
4. ตรวจสอบว่าไม่มี `.devin/workflows/` directory
5. ตรวจสอบว่า ast-grep rules ใน `rules/` ที่ project root ทำงานได้

## Rules

### 1. No Workflows Directory

- ห้ามมี `.devin/workflows/` directory
- ถ้ามีอยู่ ให้ลบทิ้ง

### 2. Content Language

- เนื้อหาทั้งหมดใน `.devin/` ต้องเป็นภาษาอังกฤษ

### 3. File Structure

- ต้องมี `.devin/rules` directory พร้อม subdirectories: `always-on/`, `model_decision/`, `glob/`
- ตั้งชื่อไฟล์ด้วย `kebab-case.md`
- ถ้าเป็น monorepo แต่ละ workspace ต้องมี `AGENTS.md` ของตัวเอง ไม่สร้าง `.devin/` ใน sub-workspace

### 4. Frontmatter Validation

- `always-on` rules ต้องมี `trigger: always_on`
- `model_decision` rules ต้องมี `trigger: model_decision`
- `glob` rules ต้องมี `trigger: glob` พร้อม `globs:` list

### 5. Rules Update

- ใช้ `/update-devin-project-rules` สำหรับเขียนและอัพเดท rules ที่ root เท่านั้น ไม่สร้าง rules ใน sub-workspace
- ใช้ `/follow-write-devin-skills` สำหรับสร้าง project-specific workflows
- Rules ต้องสอดคล้องกับ dependencies ใน `package.json`

### 6. AGENTS.md Update

- ใช้ `/update-agents-md` สำหรับเขียน `AGENTS.md` ทั้ง root และ workspace
- Root `AGENTS.md` ต้องระบุว่าให้ทำตาม `AGENTS.md` ของแต่ละ workspace
- แต่ละ workspace ต้องมี `AGENTS.md` ของตัวเอง

### 7. Hook Format

- รูปแบบ hooks configuration อ้างอิงจาก https://docs.devin.ai/cli/extensibility/hooks/overview
- ใช้ `post_write_code` event สำหรับรัน lint หลังจากเขียน code
- รัน hooks ด้วย `bun .devin/hooks/run-lint.ts`

### 8. TypeScript Scripts

- สร้าง scripts ใน `.devin/hooks/` directory
- รันด้วย `bun .devin/hooks/run-lint.ts`
- Parse JSON input จาก stdin

### 9. Ast-Grep Rules

- ใช้ `/update-rules` สำหรับสร้าง ast-grep rules ใน `rules/` ที่ project root
- `sgconfig.yml` ต้องชี้ `ruleDirs` ไปที่ `rules/always-on`, `rules/model_decision`, และ `rules/glob`
- ast-grep rules (YAML) อยู่ใน `rules/` ที่ project root แยกจาก devin rules (Markdown) ใน `.devin/rules/`
- `sgconfig.yml` ต้องมี `languageAliases` สำหรับ `ts`, `tsx`, `js`, `jsx`
- `sgconfig.yml` ต้องมี `devPaths` สำหรับ source directories ของแต่ละ workspace

### 10. Sgconfig Configuration

- `sgconfig.yml` ต้องอยู่ที่ project root
- `ruleDirs` ต้องระบุครบทั้ง 3 directories: `rules/always-on`, `rules/model_decision`, `rules/glob`
- `languageAliases` ต้อง map `ts` และ `tsx` เป็น `TypeScript`, `js` และ `jsx` เป็น `JavaScript`
- `devPaths` ต้องระบุ source directories ของแต่ละ workspace สำหรับ scan ที่แม่นยำ
- `testConfigs` ใช้สำหรับ test directory ของ ast-grep rules
- ถ้าเป็น monorepo ให้ระบุ `devPaths` ของทุก workspace ที่มี source code

### 11. Workspace-Specific Rules

- ถ้าเป็น monorepo แต่ละ workspace อาจมี ast-grep rules เฉพาะใน `rules/` ที่ project root โดยใช้ `files` field เพื่อจำกัด scope
- ใช้ `files` field ใน ast-grep rules เพื่อระบุ workspace ที่ rule ใช้
- ใช้ `ignores` field เพื่อยกเว้นไฟล์ที่ไม่ต้องการตรวจสอบ
- Workspace-specific devin rules อยู่ใน `.devin/rules/` ที่ root เป็น Markdown ไม่มี `.devin/` ใน sub-workspace
- Workspace-specific ast-grep rules อยู่ใน `rules/` ที่ project root เป็น YAML โดยใช้ `files` field จำกัด scope

### 12. Hook Scripts Best Practices

- Hook scripts ต้องใช้ `bun` runtime เท่านั้น ไม่ใช้ `node` หรือ `npx`
- Hook scripts ต้อง parse JSON input จาก stdin
- Hook scripts ต้องมี `shebang` `#!/usr/bin/env bun`
- Hook scripts ต้องมี `try/catch` สำหรับ error handling
- Hook scripts ต้องมี `process.exit(0)` สำหรับ success และ `process.exit(1)` สำหรับ failure
- `hooks.json` ต้องระบุ `show_output: true` เพื่อแสดง output ใน IDE

## Expected Outcome

- `.devin` มี rules และ hooks ครบถ้วน ไม่มี `workflows/` directory
- ถ้าเป็น monorepo แต่ละ workspace มี `AGENTS.md` ของตัวเอง ไม่มี `.devin/` ใน sub-workspace
- Root `AGENTS.md` บอกให้ทำตาม workspace `AGENTS.md`
- Rules จัดรูปแบบถูกต้องตามมาตรฐาน
- Hooks ทำงานตาม events ที่กำหนด ใช้ `bun` runtime
- ast-grep rules อยู่ใน `rules/` ที่ project root แยกจาก `.devin/rules/`
- `sgconfig.yml` ครบถ้วน: `ruleDirs`, `languageAliases`, `devPaths`
- `bunx ast-grep scan --inspect summary` แสดง rules ทั้งหมด effective
- `bun run scan` ทำงานได้และ report ผลลัพธ์
