---
name: update-astgrep-rules
description: Reset และ regenerate ast-grep rules เป็น `rules/{dependencies,architecture,glob}/` + `sgconfig.yml` จาก re-analysis ของ project
argument-hint: "[rule-or-pattern | --reset]"
related:
  - use-astgrep
  - use-astgrep-programmatic
  - new-skills
  - scan-codebase
  - run-scan
  - use-subagents
  - report
  - suggest-next-action
---

## Goal

สร้าง/อัปเดต ast-grep rules ของ project ตาม canonical layout 3 folders — `rules/dependencies/` (rule ต่อ dependency), `rules/architecture/` (rules ของ architecture ที่เลือกใน `AGENTS.md`), `rules/glob/` (rules ผูก file patterns) — พร้อม `sgconfig.yml` ที่ชี้ทั้ง 3 dirs

## Scope

- ใช้เมื่อต้องการ AST-based lint rules ที่ enforce conventions เฉพาะ project
- Canonical layout: `rules/dependencies/<dep>.yml`, `rules/architecture/<arch>.yml`, `rules/glob/<pattern>.yml`
- `--reset` = ลบ rules เดิมทั้งหมดแล้ว re-analyze + rewrite ใหม่ (canonical refresh)
- ไม่รวม `.devin/rules` (markdown rules — ลบออกจาก projects, knowledge rules ไป `.devin/rules` ไม่ใช่ที่นี่)
- ไม่รวมการสร้าง skills จาก manifest — ใช้ `/new-skills` แทน

## Execute

### 1. Reset And Analyze

> Goal: เริ่มจาก clean state เข้าใจ project จริง

1. `--reset` → ลบ `rules/` เดิมทั้ง folder + `.devin/rules/` (markdown rules — deprecated, ใช้ ast-grep แทน) ก่อนเสมอ
2. ทำ `/scan-codebase` — เก็บ manifest (`package.json`/`Cargo.toml`/etc.), `AGENTS.md` (architecture ที่เลือก), directory layout, file extensions ที่ใช้
3. สร้าง canonical structure:
   ```text
   rules/
   ├─ dependencies/     # <dep>.yml — 1 file ต่อ dependency ที่ต้อง enforce usage/ban
   ├─ architecture/     # <arch>.yml — layer boundaries, import direction, banned patterns
   └─ glob/             # <pattern>.yml — rules ผูก file glob (*.test.ts, routes/*, server/*)
   ```
4. สร้าง/แก้ `sgconfig.yml`:
   ```yaml
   ruleDirs:
     - rules/dependencies
     - rules/architecture
     - rules/glob
   ```

### 2. Write Dependencies Rules

> Goal: rule ต่อ dependency ที่ต้อง enforce

1. อ่าน dependencies จาก manifest — เลือกเฉพาะ deps ที่มี convention ชัดเจน (เช่น ต้องใช้ `drizzle` ไม่ใช่ raw SQL, ห้าม `moment` ใช้ `dayjs`, effect-atom patterns)
2. ต่อ dep เขียน `rules/dependencies/<dep>.yml`: enforce import source, ban deprecated APIs, required config — YAML: `id`, `language`, `rule.pattern`/`rule.any`, `message`, `severity`, `fix` (optional)
3. ใช้ meta-variables `$VAR`, `$$$ARGS`; `constraints`/`utils` ถ้าซับซ้อน
4. ห้ามเขียน rule ที่ไม่มี dep นั้นจริง — ทุก rule ต้องอ้าง package ที่อยู่ใน manifest

### 3. Write Architecture Rules

> Goal: enforce architecture ที่ `AGENTS.md` เลือก

1. อ่าน `AGENTS.md` → ระบุ architecture (clean / layered / modular / framework-specific)
2. เขียน `rules/architecture/<name>.yml` สำหรับ boundaries ที่ enforce ได้ด้วย AST/regex เช่น:
   - layer import direction (`domain/` ห้าม import `infra/`)
   - ห้าม deep imports ข้าม module barrel
   - banned patterns ใน layer เฉพาะ (IO calls ใน `domain/`)
3. Rules ที่ enforce ด้วย AST ไม่ได้ (เช่น naming conventions ที่ไม่มี pattern ชัด) → เขียนใน `AGENTS.md` rules section แทน ห้ามเดา YAML

### 4. Write Glob Rules

> Goal: rules ผูก file patterns

1. ระบุ file patterns ที่ต้อง rule เฉพาะ: `*.test.*`, `*.stories.*`, `routes/*`, `server/*`, `*.config.*`, migration files
2. เขียน `rules/glob/<pattern>.yml` — ast-grep rule + `files:` glob filter เช่น `files: ["**/*.test.ts"]` (no `expect` ที่ไม่มี assertion, `console.log` ใน server code, env access นอก config)
3. เลือก glob จาก layout จริงของ project — ห้ามเขียน rule สำหรับ pattern ที่ project ไม่มี

### 5. Test And Wire

> Goal: rules ทำงานจริง

1. ทดสอบ rule ด้วย `ast-grep scan --rule rules/<dir>/<name>.yml <path>` ก่อน commit
2. rules หลายไฟล์/ต้อง JSON findings ต่อ rule → ทำ `/use-astgrep-programmatic` เขียน batch script (`ast-grep scan --json` ผ่าน `Bun.$` หรือ `findInFiles` ต่อ rule set) — dry run ก่อนเสมอ
3. รัน `ast-grep scan` ทั้ง project — เก็บ findings, แก้ rules ที่ match ผิด/เกิน
4. เพิ่ม `"scan": "ast-grep scan"` ใน `package.json` + CI step ถ้ามี
5. ทำ `/run-scan` ยืนยันไม่มี false positives มากเกิน

### 6. Report

> Goal: สรุปผล

1. `/report` table: `No.`, `Dir`, `Rule`, `Pattern`, `Severity`, `Status`
2. ระบุ rules ที่เพิ่ม/แก้/ลบ + `.devin/rules` deletion status
3. ทำ `/suggest-next-action`

## Rules

- ทดสอบ rule ก่อน commit เสมอ — rule ที่ match ผิดทำให้ scan พัง
- ใช้ `severity: warning` สำหรับ rules ใหม่ก่อนเลื่อน `error`
- ห้ามแก้ `sgconfig.yml` โดยไม่ตรวจ `ruleDirs` ที่มีอยู่ — merge กับ canonical layout
- หลาย projects พร้อมกัน (เช่น ทุก project ใน drive) → ทำ `/use-subagents` spawn ทีละ project — agent ห้ามแตะ `AGENTS.md`/manifest นอกเหนือ rules
- `--reset` = delete-then-rewrite เท่านั้น — ห้าม merge rules เก่ากลับมาถ้า re-analysis ไม่พบเหตุผล

- ใช้ `/use-astgrep` สำหรับ rule syntax (pattern, constraints, transform/rewriters)
- ใช้ `/use-astgrep-programmatic` เมื่อทดสอบ rules แบบ batch หรือต้อง JSON findings ที่ merge/parse ได้
- ใช้ `/use-subagents` เมื่อทำหลาย projects
- ใช้ `/scan-codebase`, `/run-scan`, `/report`, `/suggest-next-action` ตาม steps

## Expected Outcome

- `rules/{dependencies,architecture,glob}/` + `sgconfig.yml` สะท้อน project จริง
- `.devin/rules` ถูกลบ; rules ทดสอบผ่าน `ast-grep scan`
- Report ครบทุก project ที่ทำ
