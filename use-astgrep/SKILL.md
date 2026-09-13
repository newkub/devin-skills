---
name: use-astgrep
description: ตั้งค่าและใช้งาน ast-grep สำหรับ code search, lint และ refactoring ด้วย AST-based patterns
argument-hint: "[scope]"
related:
  - update-project-rules
  - check-code-structure
  - replace

---
## Goal

ตั้งค่าและใช้งาน ast-grep สำหรับ code search, lint และ refactoring ด้วย AST-based patterns ที่แม่นยำกว่า regex

## Scope

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: follow-tool-astgrep)

ครอบคลุมการตั้งค่า `sgconfig.yml`, การ scan, การ search แบบ ad-hoc, และใช้งาน CLI commands ของ ast-grep — การเขียน rules อยู่ใน `/update-project-rules` (merged from: `follow-tool-astgrep`, `search-by-astgrep`)

## Execute

### 1. Install Or Use ast-grep

> Goal: ติดตั้งหรือเรียกใช้ ast-grep ได้ถูกต้อง

1. ถ้า project มี `@ast-grep/cli` ใน `devDependencies` ให้ใช้ `bunx ast-grep` (bin `ast-grep` หรือ `sg` จาก local install)
2. ถ้าไม่มี local install ให้ใช้ `bunx -p @ast-grep/cli ast-grep` — ห้าม `bunx ast-grep` ลอยๆ เพราะจะดึง package `ast-grep` (คนละ package ที่ถูก abandon)
3. ถ้าต้องการใช้งานประจำ แนะนำให้เพิ่ม `@ast-grep/cli` ใน `devDependencies` — latest `0.45.3 (verified 2026-09-12)`

### 2. Configure sgconfig.yml

> Goal: สร้าง `sgconfig.yml` พร้อม fields ที่จำเป็น

1. สร้างไฟล์ `sgconfig.yml` ที root directory ด้วยเนื้อหาตาม ## Rules ข้อ 2
2. ถ้า project มีหลาย workspace ให้เพิ่ม rule dir ของแต่ละ workspace ใน `ruleDirs` (ไม่มี `devPaths` field — fields ที่มีจริง: `ruleDirs`, `testConfigs`, `utilDirs`, `languageGlobs`, `customLanguages`, `languageInjections`)
3. ถ้า project มี custom file extensions ให้เพิ่ม `languageGlobs`
4. ถ้าต้องการ test rules ให้เพิ่ม `testConfigs`
5. ถ้าต้องการ reusable patterns ให้เพิ่ม `utilDirs`
6. ตรวจสอบว่า config ถูกต้องด้วย `ast-grep scan --inspect summary`

### 3. Setup Project Structure

> Goal: สร้างโครงสร้าง directories สำหรับ rules และ tests

1. สร้าง ast-grep rules ใน `rules/` directory ที project root (แยกจาก `.devin/rules/` ทีเก็บ devin rules แบบ markdown)
2. ถ้ามี `testConfigs` ให้สร้าง directory `rule-tests/` ที project root
3. ถ้ามี `utilDirs` ให้สร้าง directory `utils/` ที project root
4. ใช้ `ast-grep new` สำหรับ scaffold project ใหม่ได้ (หรือ `bunx -p @ast-grep/cli ast-grep new` ถ้ายังไม่ได้ติดตั้ง)

### 4. Add Scan Script

> Goal: เพิ่ม scan script ใน `package.json`

1. เพิ่ม script ใน `package.json`:

```json
{
  "scripts": {
    "scan": "ast-grep scan"
  }
}
```

2. ใช้ `ast-grep scan` หรือ `sg scan` เมื่อ `@ast-grep/cli` ติดตั้งเป็น devDependency แล้ว — ถ้ายังไม่ได้ติดตั้งใช้ `bunx -p @ast-grep/cli ast-grep scan`

### 5. Scan And Run

> Goal: รัน scan และค้นหาด้วย ast-grep ได้ถูกต้อง

1. รัน `bun run scan` สำหรับ scan ทั้ง project
2. รัน `ast-grep run --pattern 'PATTERN' [paths]` สำหรับ ad-hoc search (`run` เป็น default subcommand — `ast-grep -p 'PATTERN'` เทียบเท่า)
3. รัน `ast-grep scan --inline-rules 'YAML_RULE' [paths]` สำหรับ temporary rule
4. รัน `ast-grep scan --json pretty` สำหรับ structured output (ค่า: `pretty`, `stream`, `compact`)
5. รัน `ast-grep scan --filter 'RULE_ID'` สำหรับ filter rules
6. ใช้ `--interactive` สำหรับ interactive edit session
7. ทดสอบ pattern บนไฟล์ตัวอย่าง 1-2 ไฟล์ก่อนรันทั้ง project
8. ถ้า matches เยอะเกิน → ปรับ pattern ให้จำเพาะขึ้น
9. ถ้าต้องการแก้ไข → ส่งต่อ `/replace`
10. ถ้าต้องการ batch/integrate ast-grep ใน scripts หรือ review CLI → ทำ programmatic subskill (`subskills/programmatic/SKILL.md`)
11. ถ้าต้องการเขียน rules ให้ทำ `/update-project-rules`

## Rules

### 1. CLI Reference

- `ast-grep new` สำหรับ scaffold project ใหม่
- `ast-grep new rule` สำหรับสร้าง rule ใหม่
- `ast-grep scan` สำหรับ scan ทั้ง project ด้วย rules ที่กำหนด
- `ast-grep run --pattern 'PATTERN'` สำหรับ ad-hoc search
- `ast-grep test` สำหรับ test rules
- `ast-grep outline` สำหรับดู code structure, `ast-grep lsp` สำหรับ language server, `ast-grep completions <shell>` สำหรับ shell completions
- `--config <path>` สำหรับระบุ `sgconfig.yml` path (default: `sgconfig.yml`)
- `--json pretty` สำหรับ structured JSON output
- `--filter 'REGEX'` สำหรับ filter rules by id
- `--interactive` สำหรับ interactive edit session
- `-U, --update-all` สำหรับ apply all rewrites
- `--format github` หรือ `--format sarif` สำหรับ CI output
- `--inspect summary` สำหรับสรุปผล scan
- `--min-severity <level>` สำหรับ filter findings ตาม severity (เพิ่มใน 0.45.3)
- `--error/--warning/--info/--hint/--off [RULE_ID]` สำหรับ override rule severity

### 2. Separation From Devin Rules

- `rules/` เก็บ `.yml` ast-grep rules ที project root
- `.devin/rules/` เก็บ `.md` devin rules สำหรับ AI agent
- ไม่ปนกันเพราะต่าง purpose ต่าง format
- rule files ใช้ `kebab-case` filename
- ไฟล์ที่ไม่ใช่ rule ใน `rules/` จะถูก ignore

### 3. Integration With Biome

- ใช้ `ast-grep` สำหรับ structural patterns ที่ `Biome` ไม่สามารถ express ได้
- `ast-grep` complements `Biome` ไม่ใช่ replace
- ใช้ `ast-grep` สำหรับ custom lint rules เฉพาะ project
- ใช้ `Biome` สำหรับ standard lint และ format

### 4. Rule Writing

- การเขียน rules อยู่ใน `/update-project-rules` ไม่ใช่ workflow นี้

### 5. Ad-Hoc Search

- ใช้ AST-based patterns สำหรับ structural match ก่อน regex
- ตรวจสอบ syntax ด้วย `ast-grep run --pattern 'PATTERN' --debug`
- ทดสอบ pattern บนไฟล์ตัวอย่างก่อนรันทั้ง project
- ปล่อยให้ ast-grep auto-detect ภาษา หรือระบุ `--lang` ถ้า extension ไม่มาตรฐาน
- ถ้า matches เยอะเกิน → เพิ่ม constraints หรือ filters
- ถ้า pattern ซับซ้อน → ทำ programmatic subskill (`subskills/programmatic/SKILL.md`)
- ถ้าต้องการ scan ซ้ำบ่อย → ทำ `/update-project-rules`

- ใช้ /check-code-structure ถ้าจำเป็น

### Subskills

| Subskill | เมื่อไร |
|----------|--------|
| `subskills/programmatic/SKILL.md` (`use-astgrep-programmatic`) | batch/programmatic ast-grep ผ่าน Bun scripts, napi bindings, integrate กับ review CLI |

## Expected Outcome

- `sgconfig.yml` ตั้งค่าเรียบร้อยครบทุก fields ที่จำเป็น
- Project structure สร้างเรียบร้อย (`rules/`, `rule-tests/`, `utils/`)
- Scan script เพิ่มใน `package.json` และทำงานได้
- `ast-grep scan` ทำงานได้ถูกต้องและ report ผลลัพธ์
- ใช้ร่วมกับ `Biome` ได้โดยไม่ขัดแย้ง
