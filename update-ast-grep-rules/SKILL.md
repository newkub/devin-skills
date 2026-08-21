---
name: update-ast-grep-rules
description: อัปเดต ast-grep rules ตามไฟล์ที่มีใน .devin/rules ให้ครอบคลุมและถูกต้อง
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
  - run-scan
  - deep-validate
  - use-ast-grep
  - follow-ast-grep
---

## Goal

เขียน ast-grep rules ที่ครอบคลุมและถูกต้องตาม `.devin/rules` และ official documentation

## Scope

เขียน ast-grep rules สำหรับไฟล์ที่มีใน `.devin/rules` (`always-on/`, `model_decision/`, `glob/`) ครอบคลุม atomic, relational, และ composite rules โดยสร้าง ast-grep rules ใน `rules/` directory ที่ project root (แยกจาก `.devin/rules/`)

สำหรับ scan codebase ใช้ `/run-scan`, สำหรับ validation ละเอียดใช้ `/deep-validate`

## Execute

### 1. Analyze Devin Rules

> Goal: วิเคราะห์ devin rules ก่อนแปลง
> Goal: ระบุ rules ที่แปลงได้และจัดกลุ่มตาม priority

1. อ่านไฟล์ทั้งหมดจาก `.devin/rules/always-on/`, `.devin/rules/model_decision/`, `.devin/rules/glob/`
2. ระบุ rules ที่เป็น code patterns (แปลงได้) แยกจาก configuration หรือ process guidelines (แปลงไม่ได้)
3. จัดกลุ่มตาม priority: `error` > `warning` > `info`

### 2. Setup Ast-Grep Project

> Goal: ตั้งค่า project structure และ `sgconfig.yml`
> Goal: sgconfig.yml พร้อมใช้งาน ครอบคลุม 3 rule directories

1. ทำ `/follow-ast-grep` สำหรับการตั้งค่า `sgconfig.yml` และ project structure
2. สร้าง `rules/always-on/`, `rules/model_decision/`, `rules/glob/` ที่ project root
3. ตั้งค่า `sgconfig.yml`: `ruleDirs` ชี้ทั้ง 3 directories, `languageAliases` (`ts`/`tsx` → `TypeScript`, `js`/`jsx` → `JavaScript`), `devPaths` สำหรับ source directories, `testConfigs` สำหรับ `rule-tests/`

### 3. Convert Rules To Ast-Grep Format

> Goal: แปลง devin rules เป็น ast-grep YAML
> Goal: rules ครอบคลุม atomic, relational, composite พร้อม metadata ครบ

1. ทำ `/follow-ast-grep` สำหรับ rule structure และ pattern syntax
2. แปลง atomic rules: `pattern`, `kind`, `regex` (ใช้ `kind` ร่วม `pattern` เพื่อ match แม่นยำ)
3. แปลง relational rules: `inside`, `has`, `precedes`, `follows` (พร้อม `stopBy`, `field`)
4. แปลง composite rules: `all`, `any`, `not`, `matches`
5. ใช้ `$ARG` (single) และ `$$$ARGS` (multiple) — `constraints` ใช้กับ `$ARG` เท่านั้น
6. เพิ่ม `severity`, `message`, `note`, `files`, `ignores` สำหรับแต่ละ rule
7. เพิ่ม `fix` template สำหรับ auto-rewrite ถ้าปลอดภัย และ `utils` สำหรับ reuse
8. เขียน comment ในแต่ละ .yml อธิบาย rule, เหตุผล, และตัวอย่าง

### 4. Scan And Validate

> Goal: ตรวจสอบ rules กับ codebase จริง
> Goal: rules ทำงานได้จริง ไม่มี false positives/negatives

1. ทำ `/run-scan` เพื่อรัน `ast-grep scan` กับ codebase และตรวจสอบผลลัพธ์
2. ปรับ `ignores` หรือ `constraints` สำหรับ false positives
3. ปรับ `pattern` หรือเพิ่ม `any` patterns สำหรับ false negatives
4. ทำ `/deep-validate` เพื่อ validate rules ละเอียด: correctness, type safety, cross-reference
5. ถ้ามี `testConfigs` รัน `bunx ast-grep test` เพื่อ verify test suite

### 5. Integrate With Development

> Goal: เพิ่ม scan script และ CI/CD integration
> Goal: scan รันได้จาก CLI และ CI/CD

1. เพิ่ม `scan` script ใน `package.json`: `"scan": "bunx ast-grep scan"`
2. ถ้าเป็น monorepo ให้เพิ่ม `scan` script ในแต่ละ workspace `package.json`
3. รวม `ast-grep scan` ใน CI/CD pipeline และตั้งค่า IDE integration ด้วย LSP ได้

## Rules

### 1. Rule Analysis

- วิเคราะห์ devin rules ก่อนแปลง — ไม่ใช่ทุกข้อแปลงเป็น ast-grep ได้
- จัดกลุ่มตาม priority: `error` > `warning` > `info`
- `rules/` สำหรับ ast-grep YAML ที่ project root แยกจาก `.devin/rules/` (Markdown)
- rule files ใช้ `kebab-case` filename

### 2. Pattern Syntax

- ใช้ `kind` ร่วม `pattern` เสมอเพื่อ match ให้แม่นยำ
- `regex` ต้องใช้กับ `kind` หรือ `pattern` เสมอ
- rule object เป็น unordered `all` โดยปริยาย — ถ้าไม่ได้ผลให้ใช้ `all` เพื่อระบุ order
- `$ARG` (single), `$$$ARGS` (multiple) — `constraints` ใช้กับ `$ARG` เท่านั้น
- ดูรายละเอียดที่ `/use-ast-grep` และ `/follow-ast-grep`

### 3. Scope And Fix

- `files`/`ignores`: glob patterns relative ของ `sgconfig.yml` directory — ไม่ใช้ `./` นำหน้า
- `ignores` ตรวจสอบก่อน `files` เสมอ
- `fix`: pattern สำหรับ auto-rewrite ต้อง safe — ทดสอบกับ `--interactive` ก่อน apply
- `utils`: reusable utility rules สำหรับลดซ้ำซ้อน

### 4. Common Mistakes

- ใช้ `pattern` โดยไม่ใช้ `kind` ร่วม → match หลาย AST nodes
- ใช้ `$$$ARGS` ใน `constraints` ซึ่งไม่รองรับ
- จับ framework utilities เป็น violations เช่น `sql` template tag ของ Drizzle
- ลืม `languageAliases` ทำให้ `.tsx` ไม่ถูก scan
- ลืม `files` สำหรับ rules เฉพาะ workspace ใน monorepo

### 5. Monorepo

- สร้าง rules ที่ project root `rules/` เท่านั้น — อย่าสร้างแยกในแต่ละ workspace
- ใช้ `files` field เพื่อจำกัด rule เฉพาะ workspace
- ระบุ `devPaths` ใน `sgconfig.yml` สำหรับ source directories ของแต่ละ workspace

## Expected Outcome

- `sgconfig.yml` ตั้งค่าครบ: `ruleDirs` (3 directories), `languageAliases`, `devPaths`, `testConfigs`
- Devin rules แปลงเป็น ast-grep YAML ครอบคลุม atomic, relational, composite
- `/run-scan` ผ่าน: `bun run scan` ทำงานได้ ไม่มี false positives/negatives
- `/deep-validate` ผ่าน: rules ถูกต้องตาม correctness, type safety, cross-reference
- `fix` templates ทำงานได้โดยไม่ทำให้ code เสีย
- แต่ละ rule มี comment อธิบายที่ด้านบนของไฟล์
- Monorepo rules ใช้ `files` field จำกัด scope อย่างถูกต้อง
