---
name: update-rules
description: อัพเดท rules ทั้ง .devin/rules (libs/code-quality/architecture grouping) และ ast-grep rules พร้อมแปลงเป็น ast-grep YAML
---

## Goal

อัพเดท rules ทั้งหมดใน project ทั้ง `.devin/rules/` (devin rules) และ `rules/` (ast-grep rules) พร้อมแปลง devin rules เป็น ast-grep YAML ที่ครอบคลุม atomic, relational, และ composite rules

## Scope

ใช้สำหรับอัพเดท rules ทั้งระบบใน project workspace ใดๆ ที่มี `.devin` structure ครอบคลุม devin rules, ast-grep rules และ `sgconfig.yml` setup

## Execute

### 1. Update Devin Rules

> Goal: อัพเดท devin rules ทั้ง 3 subdirectories ตาม project analysis และ dependencies จริง โดยจัดกลุ่ม `always-on/` เป็น `libs/`, `code-quality/`, `architecture/`

1. ตรวจสอบว่า `.devin/rules/` ที่ root มี subdirectories: `always-on/`, `model_decision/`, `glob/` — ถ้าไม่มี ให้ทำ `/update-dot-devin` ก่อน
2. ตรวจสอบว่าไม่มี `.devin/` directory ใน sub-workspace ใดๆ ถ้ามีให้ลบทิ้ง — rules เขียนเฉพาะที่ root `.devin/rules/`
3. ทำ `/analyze-project` เพื่อวิเคราะห์ codebase, tech stack, และ patterns
4. อ่าน `package.json` ทั้ง root และ workspace เพื่อดู dependencies ทั้งหมด
5. สร้าง subdirectories ใน `.devin/rules/always-on/`: `libs/`, `code-quality/`, `architecture/` และย้าย rule files ที่มีอยู่เข้ากลุ่มที่เหมาะสม
6. อัพเดท `libs/` — rules สำหรับ libraries และ tools จาก dependencies (เช่น `biome`, `bun`, `typescript`, `turborepo`, `lefthook`, `ast-grep`, `knip`, `vite`, `solidjs`, `unocss`, `vitest`, `drizzle`, `orpc`, `zod`, `supabase`, `stripe`, `playwright`, `capacitor`, `vitepress`, `mcp-sdk`): ตรวจสอบ config files, สร้างไฟล์ใหม่สำหรับ tool ใหม่, ลบไฟล์ tool ที่ไม่ใช้ ครอบคลุม commands, config locations, naming conventions, anti-patterns, integration points
7. อัพเดท `code-quality/` — rules สำหรับ code quality standards (เช่น `madge`, `knip`, code duplication, unused exports, circular dependencies): ครอบคลุม detection commands, thresholds, fix strategies, prevention patterns
8. อัพเดท `architecture/` — rules สำหรับ architecture และ project structure ของแต่ละ workspace (เช่น `architecture/website.md` สำหรับ `apps/website`, `architecture/docs.md` สำหรับ `apps/docs`): ครอบคลุม directory structure, module boundaries, import rules, export rules, workspace-specific patterns
9. อัพเดท `.devin/rules/model_decision/` — rules สำหรับ domain patterns (เช่น `api`, `auth`, `database`, `payment`, `deployment`, `mobile`, `testing`, `mcp`, `ai`, `i18n`, `realtime`, `seo`, `security`, `performance`): ครอบคลุม architecture, data flow, error handling, security, testing, integration points, anti-patterns
10. อัพเดท `.devin/rules/glob/` — rules สำหรับ file patterns (เช่น `**/schema/*.ts`, `**/server/*.ts`): อัพเดท `globs:` list ให้สอดคล้องกับ directory structure ปัจจุบัน
11. ตรวจสอบ library release changelogs ของ dependencies ที่เปลี่ยน version ด้วย `/report-release-changelog` แล้วนำ breaking changes มาปรับปรุง rules ใน `libs/`
12. ลบ rules ที่ล้าสมัยหรือไม่ใช้แล้ว และอัพเดท references ทั้งหมด

### 2. Setup Ast-Grep Project

> Goal: ตั้งค่า project structure และ `sgconfig.yml`

1. ทำ `/follow-tool-ast-grep` สำหรับการตั้งค่า `sgconfig.yml` และ project structure
2. สร้าง `rules/always-on/`, `rules/model_decision/`, `rules/glob/` ที่ project root (แยกจาก `.devin/rules/`)
3. ตั้งค่า `sgconfig.yml`: `ruleDirs` ชี้ทั้ง 3 directories, `languageAliases` (`ts`/`tsx` → `TypeScript`, `js`/`jsx` → `JavaScript`), `devPaths` สำหรับ source directories, `testConfigs` สำหรับ `rule-tests/`
4. rule files ใช้ `kebab-case` filename

### 3. Convert Rules To Ast-Grep Format

> Goal: แปลง devin rules เป็น ast-grep YAML ครอบคลุมทุก devin rules ที่อัพเดทใน step 1

1. ทำ `/follow-tool-ast-grep` สำหรับ rule structure และ pattern syntax
2. ระบุ rules ที่เป็น code patterns (แปลงได้) แยกจาก configuration หรือ process guidelines (แปลงไม่ได้) — จัดกลุ่มตาม priority: `error` > `warning` > `info`
3. แปลง atomic rules: `pattern`, `kind`, `regex` (ใช้ `kind` ร่วม `pattern` เพื่อ match แม่นยำ)
4. แปลง relational rules: `inside`, `has`, `precedes`, `follows` (พร้อม `stopBy`, `field`)
5. แปลง composite rules: `all`, `any`, `not`, `matches`
6. ใช้ `$ARG` (single) และ `$$$ARGS` (multiple) — `constraints` ใช้กับ `$ARG` เท่านั้น
7. เพิ่ม `severity`, `message`, `note`, `files`, `ignores` สำหรับแต่ละ rule
8. เพิ่ม `fix` template สำหรับ auto-rewrite ถ้าปลอดภัย และ `utils` สำหรับ reuse
9. เขียน comment ในแต่ละ .yml อธิบาย rule, เหตุผล, และตัวอย่าง
10. ถ้า ast-grep ไม่เหมาะสม ให้ทำ `/use-scripts` แทน เช่น ต้องวิเคราะห์ context ข้ามไฟล์, ตรวจสอบ runtime behavior, หรือ pattern ที่ AST จับไม่ได้
11. ลบ ast-grep rules ที่ล้าสมัยหรือไม่ใช้แล้ว และอัพเดท `sgconfig.yml` และ references ทั้งหมด

### 4. Scan And Validate

> Goal: ตรวจสอบ rules กับ codebase จริง

1. ทำ `/run-scan` เพื่อรัน `ast-grep scan` กับ codebase และตรวจสอบผลลัพธ์
2. ปรับ `ignores` หรือ `constraints` สำหรับ false positives
3. ปรับ `pattern` หรือเพิ่ม `any` patterns สำหรับ false negatives
4. ทำ `/deep-validate` เพื่อ validate rules ละเอียด: correctness, type safety, cross-reference
5. ถ้ามี `testConfigs` รัน `bunx ast-grep test` เพื่อ verify test suite
6. รัน `bunx ast-grep scan --inspect summary` เพื่อตรวจสอบ rules ทั้งหมด effective

### 5. Integrate With Development

> Goal: เพิ่ม scan script และ CI/CD integration

1. เพิ่ม `scan` script ใน `package.json`: `"scan": "bunx ast-grep scan"`
2. ถ้าเป็น monorepo ให้เพิ่ม `scan` script ในแต่ละ workspace `package.json`
3. รวม `ast-grep scan` ใน CI/CD pipeline และตั้งค่า IDE integration ด้วย LSP ได้

### 6. Update AGENTS.md

> Goal: อัพเดท `AGENTS.md`

อัพเดท `AGENTS.md` ให้สอดคล้องกับ rules ที่อัพเดท

1. ทำ `/update-agents-md` เพื่อเขียน `AGENTS.md` ตาม project analysis และ dependencies ล่าสุด
2. ตรวจสอบว่า `AGENTS.md` ระบุ workflows และ skills ที่สอดคล้องกับ rules ใหม่
3. ตรวจสอบว่า root และ workspace `AGENTS.md` อัพเดทครบถ้วน

### 7. Validate And Finalize

> Goal: ยืนยัน rules ทั้งสองระบบถูกต้องและสอดคล้องกัน

1. ทำ `/review-rules` เพื่อปรับปรุง rule files ให้สมบูรณ์ สอดคล้องกับ project ไม่ซ้ำซ้อน และตรวจสอบความถูกต้องของ rules ทั้งหมดและ references
2. รัน `bun run scan` เพื่อตรวจสอบ ast-grep rules ทำงานได้
3. รัน `bun run typecheck` เพื่อตรวจสอบไม่มี type errors จากการเปลี่ยนแปลง
4. รัน `bun run lint` เพื่อตรวจสอบไม่มี lint errors
5. ตรวจสอบว่า rules ทั้งสองระบบ (devin และ ast-grep) สอดคล้องกัน

## Rules

### 1. Execution Order

- อัพเดท devin rules ก่อนเสมอ เพราะ ast-grep rules อ้างอิงจาก devin rules
- ลบ devin rules ที่ล้าสมัยหลังจากอัพเดทเสร็จ และอัพเดท references
- ทำ conversion หลังจาก devin rules อัพเดทเสร็จ ใช้ `/use-scripts` แทนเมื่อ ast-grep ไม่เหมาะสม
- ลบ ast-grep rules ที่ล้าสมัยหลังจากอัพเดทเสร็จ และอัพเดท `sgconfig.yml` และ references

### 2. Always-On Grouping

- `.devin/rules/always-on/` ต้องมี 3 subdirectories: `libs/`, `code-quality/`, `architecture/`
- `libs/` — rules สำหรับ libraries และ tools ที่ใช้ใน project
- `code-quality/` — rules สำหรับ code quality standards (เช่น `madge`, `knip`, duplication)
- `architecture/` — rules สำหรับ architecture และ project structure ของแต่ละ workspace
- ห้ามมี rule files โดยตรงใน `always-on/` root — ต้องอยู่ใน subdirectory ใด subdirectory หนึ่ง
- ถ้าเป็น monorepo ให้เขียน architecture rules สำหรับแต่ละ workspace แยกกัน (เช่น `architecture/website.md`, `architecture/docs.md`)

### 3. Devin Rules Frontmatter And Content

- ทุกไฟล์ต้องมี `title` และ `description` ใน frontmatter
- `always-on` rules ต้องมี `trigger: always_on`
- `model_decision` rules ต้องมี `trigger: model_decision`
- `glob` rules ต้องมี `trigger: glob` พร้อม `globs:` list
- เนื้อหาทั้งหมดใน `.devin/rules/` ต้องเป็นภาษาอังกฤษ
- ใช้ backticks สำหรับ `concepts`, `tools`, `terms`, และ `commands`
- ใช้ numbered list สำหรับ rules ในแต่ละไฟล์
- หัวข้อเป็น Title Case พร้อม `#` heading
- ตั้งชื่อไฟล์ด้วย `kebab-case.md`

### 4. Full Coverage

- ทุก devin rule ที่แปลงเป็น ast-grep ได้ ต้องมี ast-grep rule ที่เกี่ยวข้อง — ห้ามมี devin rule ที่ขาด ast-grep counterpart โดยไม่ระบุเหตุผล
- ถ้า devin rule เพิ่ม/เปลี่ยน/ลบ ให้ตรวจสอบและอัพเดท ast-grep rule ที่เกี่ยวข้องทันที
- ถ้า ast-grep rule เพิ่ม/ลบ ให้ตรวจสอบว่า `sgconfig.yml` และ scripts อัพเดทด้วย
- Devin rules และ ast-grep rules ต้องสอดคล้องกัน ไม่ขัดแย้งกัน

### 5. Pattern Syntax

- ใช้ `kind` ร่วม `pattern` เสมอเพื่อ match ให้แม่นยำ
- `regex` ต้องใช้กับ `kind` หรือ `pattern` เสมอ
- rule object เป็น unordered `all` โดยปริยาย — ถ้าไม่ได้ผลให้ใช้ `all` เพื่อระบุ order
- `$ARG` (single), `$$$ARGS` (multiple) — `constraints` ใช้กับ `$ARG` เท่านั้น
- ดูรายละเอียดที่ `/use-ast-grep` และ `/follow-tool-ast-grep`

### 6. Scope And Fix

- `files`/`ignores`: glob patterns relative ของ `sgconfig.yml` directory — ไม่ใช้ `./` นำหน้า
- `ignores` ตรวจสอบก่อน `files` เสมอ
- `fix`: pattern สำหรับ auto-rewrite ต้อง safe — ทดสอบกับ `--interactive` ก่อน apply
- `utils`: reusable utility rules สำหรับลดซ้ำซ้อน

### 7. Common Mistakes

- ใช้ `pattern` โดยไม่ใช้ `kind` ร่วม → match หลาย AST nodes
- ใช้ `$$$ARGS` ใน `constraints` ซึ่งไม่รองรับ
- จับ framework utilities เป็น violations เช่น `sql` template tag ของ Drizzle
- ลืม `languageAliases` ทำให้ `.tsx` ไม่ถูก scan
- ลืม `files` สำหรับ rules เฉพาะ workspace ใน monorepo

### 8. Monorepo

- สร้าง rules ที่ project root `rules/` เท่านั้น — อย่าสร้างแยกในแต่ละ workspace
- ใช้ `files` field เพื่อจำกัด rule เฉพาะ workspace
- ระบุ `devPaths` ใน `sgconfig.yml` สำหรับ source directories ของแต่ละ workspace
- ไม่สร้าง `.devin/` ใน sub-workspace — rules เขียนเฉพาะที่ root `.devin/rules/`

### 9. Selective Addition

- เพิ่มเฉพาะ patterns ที่ project ใช้จริง
- ตรวจสอบ `package.json` หรือ `Cargo.toml` ว่ามี dependencies ของ tools หรือไม่
- ถ้าไม่ใช้ tool → ไม่ต้องใส่ patterns ของ tool นั้น

### 10. Dependency Validation

- Library rules ต้องสอดคล้องกับ dependencies ใน `package.json` ทั้ง root และ workspace แต่เขียน rules เฉพาะที่ root `.devin/rules/`
- ถ้า dependency เปลี่ยน version ให้อัพเดท rule content ให้สอดคล้อง

## Expected Outcome

- `.devin/rules/always-on/libs/` ครอบคลุม libraries และ tools ทั้งหมดจาก `package.json`
- `.devin/rules/always-on/code-quality/` ครอบคลุม code quality standards
- `.devin/rules/always-on/architecture/` ครอบคลุม architecture ของแต่ละ workspace
- `.devin/rules/model_decision/` ครอบคลุม domain patterns ที่มีใน project
- `.devin/rules/glob/` ครอบคลุม file patterns ที่สำคัญ
- `rules/` (ast-grep) ครอบคลุม atomic, relational, และ composite rules ที่ครบทุก devin rules ที่แปลงได้ — ไม่มี devin rule ที่ขาด ast-grep counterpart โดยไม่ระบุเหตุผล
- `sgconfig.yml` ตั้งค่าครบ: `ruleDirs` (3 directories), `languageAliases`, `devPaths`, `testConfigs`
- `AGENTS.md` อัพเดทครบถ้วนทั้ง root และ workspace level ด้วย `/update-agents-md`
- `bun run scan` ทำงานได้ ไม่มี false positives/negatives
- `/deep-validate` ผ่าน: rules ถูกต้องตาม correctness, type safety, cross-reference
- `fix` templates ทำงานได้โดยไม่ทำให้ code เสีย
- แต่ละ rule มี comment อธิบายที่ด้านบนของไฟล์
- ไม่มี rules ที่ซ้ำซ้อนหรือล้าสมัย
- ทุกไฟล์มี frontmatter ถูกต้องและเนื้อหาเป็นภาษาอังกฤษ
- `bun run typecheck` และ `bun run lint` ผ่าน
- Rules ทั้งสองระบบสอดคล้องกันและไม่ขัดแย้ง
- Monorepo rules ใช้ `files` field จำกัด scope อย่างถูกต้อง
