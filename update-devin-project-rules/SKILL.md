---
name: update-devin-project-rules
description: อัพเดท .devin/rules ตาม project analysis และ dependencies
---

## Goal

อัพเดท `.devin/rules/` ที่ root ทั้ง `always-on/`, `model_decision/`, และ `glob/` ตาม project analysis และ dependencies จริง โดยจัดกลุ่ม `always-on/` เป็น `libs/`, `code-quality/`, และ `architecture/` ไม่สร้าง `.devin/` ใน sub-workspace

## Scope

ใช้สำหรับอัพเดท rules ใน `.devin/rules/` directory ที่ root ของ project ใดๆ ที่มี `.devin` structure อยู่แล้ว ถ้ายังไม่มี `.devin` ให้ทำ `/update-dot-devin` ก่อน ไม่สร้าง `.devin/` ใน sub-workspace

## Execute

### 1. Verify Devin Structure

> Goal: ตรวจสอบว่า `.devin` structure มีอยู่แล้ว
> Goal: ยืนยันว่า .devin/rules/ พร้อม subdirectories ครบถ้วน

1. ตรวจสอบว่า `.devin/rules/` directory ที่ root มีอยู่พร้อม subdirectories: `always-on/`, `model_decision/`, `glob/`
2. ถ้าไม่มี ให้ทำ `/update-dot-devin` ก่อนเพื่อสร้าง structure ครบถ้วน
3. ตรวจสอบว่าไม่มี `.devin/` directory ใน sub-workspace ใดๆ ถ้ามีให้ลบทิ้ง
4. อ่าน rules ที่มีอยู่ทั้งหมดในแต่ละ subdirectory เพื่อเข้าใจสถานะปัจจุบัน

### 2. Analyze Project

> Goal: วิเคราะห์ project เพื่อระบุ rules ที่ต้องอัพเดท
> Goal: รู้ tools, domains, และ file patterns ที่ต้องมี rules

1. ทำ `/analyze-project` เพื่อวิเคราะห์ codebase, tech stack, และ patterns
2. อ่าน `package.json` ทั้ง root และ workspace เพื่อดู dependencies ทั้งหมด — rules เขียนเฉพาะที่ root `.devin/rules/`
3. ระบุ tools และ frameworks ที่ใช้ (เช่น `biome`, `turborepo`, `drizzle`, `solidjs`)
4. ระบุ domain patterns (เช่น `api`, `auth`, `payment`, `database`, `deployment`)
5. ระบุ file patterns ที่ต้องการ glob rules (เช่น `/schema//*.ts`, `/server//*.ts`)

### 3. Update Always-On Rules

> Goal: อัพเดท rules ใน `.devin/rules/always-on/` โดยจัดกลุ่มเป็น 3 subdirectories: `libs/`, `code-quality/`, `architecture/`
> Goal: Always-on rules ครอบคลุม tools ทั้งหมด จัดกลุ่มเป็น libs, code-quality, architecture

1. สร้าง subdirectories ใน `.devin/rules/always-on/`: `libs/`, `code-quality/`, `architecture/`
2. ย้าย rule files ที่มีอยู่เข้ากลุ่มที่เหมาะสม
3. สำหรับแต่ละกลุ่ม ให้ตรวจสอบและอัพเดท rules ดังนี้:

`libs/` — rules สำหรับ libraries และ tools ที่ใช้ใน project:
- ระบุ tools จาก dependencies (เช่น `biome`, `bun`, `typescript`, `turborepo`, `lefthook`, `ast-grep`, `monorepo`, `knip`, `vite`, `solidjs`, `unocss`, `vitest`, `drizzle`, `orpc`, `zod`, `supabase`, `stripe`, `playwright`, `capacitor`, `vitepress`, `mcp-sdk`)
- ตรวจสอบ config files เพื่อเขียน rules ให้ครอบคลุม settings จริง
- ถ้า tool ใหม่ที่ไม่มี rule ให้สร้างไฟล์ใหม่
- ถ้า tool เก่าที่ไม่ใช้แล้วให้ลบไฟล์ทิ้ง
- พยายามเขียน rules ให้ครอบคลุม: commands, config locations, naming conventions, anti-patterns, integration points

`code-quality/` — rules สำหรับ code quality standards:
- ระบุ quality concerns (เช่น `madge`, `knip`, code duplication, unused exports, circular dependencies)
- เขียน rules ครอบคลุม: detection commands, thresholds, fix strategies, prevention patterns

`architecture/` — rules สำหรับ architecture และ project structure:
- ระบุ architecture patterns ของแต่ละ workspace (เช่น `apps/website` ใช้ SolidJS + TanStack Start, `apps/docs` ใช้ VitePress)
- เขียน rules ครอบคลุม: directory structure, module boundaries, import rules, export rules, workspace-specific patterns
- ถ้าเป็น monorepo ให้เขียน architecture rules สำหรับแต่ละ workspace แยกกัน

4. อัพเดทเนื้อหา rules ให้สอดคล้องกับ version และ config ปัจจุบัน

### 4. Check Library Release Changelogs

> Goal: ตรวจสอบ release changelogs ของ dependencies ที่มีการเปลี่ยนแปลง
> Goal: รู้ breaking changes, features, และ fixes ของ libraries ก่อนเขียน rules

1. ระบุ dependencies ที่มี version เปลี่ยนแปลงหรือเพิ่มใหม่จาก `package.json`
2. ทำ `/check-release-changelog` โดยระบุ repo และ tags (from → to) ของแต่ละ dependency
3. ทำ `/report-release-changelog` เพื่อสรุปข้อมูลทีสำคัญ
4. นำข้อมูล breaking changes, new features, และ anti-patterns มาปรับปรุง rules ใน `.devin/rules/always-on/libs/`

### 5. Update Model Decision Rules

> Goal: อัพเดท rules ใน `.devin/rules/model_decision/` สำหรับ domain patterns
> Goal: Model decision rules ครอบคลุม domain patterns ที่มีใน project

1. ระบุ domain patterns ที่ต้องมี model decision rules จาก project structure และ codebase analysis
2. สแกน codebase เพื่อหา domain patterns เพิ่มเติม (เช่น `api`, `auth`, `database`, `payment`, `deployment`, `mobile`, `testing`, `solidjs`, `mcp`, `ai`, `i18n`, `realtime`, `seo`, `security`, `performance`)
3. สำหรับแต่ละ domain ให้ตรวจสอบ rule file ที่มีอยู่ว่ายังถูกต้องหรือไม่
4. ถ้า domain ใหม่ที่ไม่มี rule ให้สร้างไฟล์ใหม่
5. ถ้า domain เก่าที่ไม่ใช้แล้วให้ลบไฟล์ทิ้ง
6. พยายามเขียน rules ให้ครอบคลุม: architecture, data flow, error handling, security, testing, integration points, anti-patterns

### 6. Update Glob Rules

> Goal: อัพเดท rules ใน `.devin/rules/glob/` สำหรับ file patterns
> Goal: Glob rules ครอบคลุม file patterns ที่สำคัญใน project

1. ระบุ file patterns ที่ต้องมี glob rules จาก project structure และ directory analysis
2. สแกน directory structure เพื่อหา file patterns เพิ่มเติม
3. สำหรับแต่ละ pattern ให้ตรวจสอบ rule file ที่มีอยู่ว่ายังถูกต้องหรือไม่
4. ถ้า pattern ใหม่ที่ไม่มี rule ให้สร้างไฟล์ใหม่
5. ถ้า pattern เก่าที่ไม่ใช้แล้วให้ลบไฟล์ทิ้ง
6. อัพเดท `globs:` list ให้สอดคล้องกับ directory structure ปัจจุบัน

### 7. Validate And Finalize

> Goal: ตรวจสอบและ finalize rules ทั้งหมด
> Goal: Rules ทั้งหมดถูกต้อง สอดคล้องกับ dependencies ไม่ซ้ำซ้อน

1. ตรวจสอบว่า rules สอดคล้องกับ dependencies ใน `package.json`
2. ตรวจสอบว่าไม่มี rules ที่ซ้ำซ้อนกัน
3. ตรวจสอบว่าทุกไฟล์ใช้ `kebab-case.md` naming
4. ตรวจสอบว่า `always-on/` มี 3 subdirectories: `libs/`, `code-quality/`, `architecture/`

## Rules

### 1. Always-On Grouping

- `.devin/rules/always-on/` ต้องมี 3 subdirectories: `libs/`, `code-quality/`, `architecture/`
- `libs/` — rules สำหรับ libraries และ tools ที่ใช้ใน project
- `code-quality/` — rules สำหรับ code quality standards (เช่น `madge`, `knip`, duplication)
- `architecture/` — rules สำหรับ architecture และ project structure ของแต่ละ workspace
- ห้ามมี rule files โดยตรงใน `always-on/` root — ต้องอยู่ใน subdirectory ใด subdirectory หนึ่ง

### 2. Frontmatter Format

- ทุกไฟล์ต้องมี `title` และ `description` ใน frontmatter
- `always-on` rules ต้องมี `trigger: always_on`
- `model_decision` rules ต้องมี `trigger: model_decision`
- `glob` rules ต้องมี `trigger: glob` พร้อม `globs:` list

### 3. Content Language

- เนื้อหาทั้งหมดใน `.devin/rules/` ต้องเป็นภาษาอังกฤษ
- ใช้ backticks สำหรับ `concepts`, `tools`, `terms`, และ `commands`

### 4. Content Format

- ใช้ numbered list สำหรับ rules ในแต่ละไฟล์
- หัวข้อเป็น Title Case พร้อม `#` heading
- ตั้งชื่อไฟล์ด้วย `kebab-case.md`

### 5. Architecture Rules Per Workspace

- ถ้าเป็น monorepo ให้เขียน architecture rules สำหรับแต่ละ workspace แยกกันใน `architecture/` ที่ root `.devin/rules/always-on/architecture/`
- ตัวอย่าง: `architecture/website.md` สำหรับ `apps/website`, `architecture/docs.md` สำหรับ `apps/docs`
- แต่ละ workspace architecture rule ต้องระบุ: directory structure, module boundaries, framework patterns

### 6. Selective Addition

- เพิ่มเฉพาะ patterns ที่ project ใช้จริง
- ตรวจสอบ `package.json` หรือ `Cargo.toml` ว่ามี dependencies ของ tools หรือไม่
- ถ้าไม่ใช้ tool → ไม่ต้องใส่ patterns ของ tool นั้น

### 7. Dependency Validation

- Library rules ต้องสอดคล้องกับ dependencies ใน `package.json` ทั้ง root และ workspace แต่เขียน rules เฉพาะที่ root `.devin/rules/`
- ถ้า dependency เปลี่ยน version ให้อัพเดท rule content ให้สอดคล้อง

## Expected Outcome

- `.devin/rules/always-on/libs/` ครอบคลุม libraries และ tools ทั้งหมดจาก `package.json`
- `.devin/rules/always-on/code-quality/` ครอบคลุม code quality standards
- `.devin/rules/always-on/architecture/` ครอบคลุม architecture ของแต่ละ workspace
- `.devin/rules/model_decision/` ครอบคลุม domain patterns ที่มีใน project
- `.devin/rules/glob/` ครอบคลุม file patterns ที่สำคัญ
- ไม่มี rules ที่ซ้ำซ้อนหรือล้าสมัย
- ทุกไฟล์มี frontmatter ถูกต้องและเนื้อหาเป็นภาษาอังกฤษ
