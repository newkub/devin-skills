---
name: check-circular-dependencies
description: ตรวจจับและรายงาน circular dependencies ใน codebase และ skills directory
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
related:
- use-scripts
- scan-codebase
- follow-import-export
- refactor-packages
- update-reference
- resolve-errors
- suggest-next-action
---

## Goal

ตรวจจับ circular dependencies ใน codebase และ skills directory พร้อมรายงาน findings และ recommendations

## Scope

ใช้สำหรับ:
- codebases ที่มี module imports (JavaScript/TypeScript, Rust, Python และภาษาอื่นๆ)
- skills directory เช่น `%APPDATA%\devin\skills\`, `.devin\skills\`, `.windsurf\skills\`
- `AGENTS.md` หรือ markdown files ที่มี references ซ้อนกัน

## Execute

### 1. Define Scope

กำหนด target และประเภท circular dependencies

> Goal: รู้ target และรูปแบบ circular dependencies ที่ต้องตรวจ

1. ระบุ target: workspace, directory, หรือทั้ง project
2. ระบุ target type: `code`, `skills`, หรือ `all`
3. ถ้า target เป็น skills directory ให้ระบุ path เช่น `%APPDATA%\devin\skills\`
4. ถ้าเป็น monorepo → ตรวจสอบทุก workspaces หรือระบุ workspace
5. ถ้า target ไม่มีอยู่ → stop และ report

### 2. Scan Code Dependencies

สแกน circular dependencies จาก module imports

> Goal: พบ cycles ใน source code

1. รัน tool ตามภาษา:
   - JavaScript/TypeScript: `bunx madge --circular --extensions ts,tsx`
   - Rust: `cargo depgraph` หรือ `cargo modules`
   - Python: `pydeps` หรือ `pylint --disable=all --enable=cyclic-imports`
2. จับผลลัพธ์เป็น list ของ cycles: module A → module B → A
3. ตรวจสอบทั้ง direct และ indirect (transitive) cycles
4. ถ้าไฟล์มากกว่า 10 ไฟล์ → ทำ `/use-scripts` สำหรับ batch scanning

### 3. Scan Skill Reference Cycles

สแกน circular references ใน skills directory

> Goal: พบ cycles ระหว่าง `related` references ใน `SKILL.md`

1. ระบุ skills directory: global `%APPDATA%\devin\skills\` หรือ project `.devin\skills\` / `.windsurf\skills\`
2. อ่าน `SKILL.md` ทุกไฟล์และ parse frontmatter `related`
3. สร้าง directed graph ของ references ระหว่าง skills
4. ตรวจหา cycles ใน graph (A → B → A)
5. ตรวจสอบ markdown links ในเนื้อหาที่อ้างถึง skill อื่น
6. ถ้า skills มากกว่า 10 → ทำ `/use-scripts` สำหรับ batch analysis หรือรัน `scripts/check-skill-cycles.ps1`

### 4. Scan Markdown Reference Cycles

ตรวจ circular references ใน markdown project docs

> Goal: พบ cycles ใน `AGENTS.md` และ markdown references

1. หา `AGENTS.md` และ markdown files ที่มี references ซ้อนกัน
2. ตรวจสอบ links/mentions ระหว่างไฟล์
3. รายงาน cycles ที่เกิดจาก project documentation references

### 5. Analyze Findings

วิเคราะห์ severity และ root cause

> Goal: เข้าใจ impact และสาเหตุของแต่ละ cycle

1. จัดประเภท findings:
   - Critical: cycles ที่ทำให้ build ล้มเหลวหรือ runtime error
   - Warning: cycles ที่ทำงานได้แต่กระทบ maintainability
   - Info: cycles เล็กๆ ที่เกิดจาก type-only imports หรือ documentation links
2. ระบุ root cause: barrel exports, shared state, related cycles, God module, หรือ missing abstraction
3. กรอง false positives: type-only imports ที่ไม่สร้าง runtime cycle, one-way docs references
4. จัดลำดับตาม impact: Critical ก่อน, Warning ตามด้วย, Info สุดท้าย

### 6. Report And Act

รายงานผลและแนะนำ next action

> Goal: ผู้ใช้รู้ issues และวิธีแก้

1. สร้าง report เป็นตาราง: cycle, modules/files, severity, root cause, recommendation
2. ถ้ามี critical issues → แนะนำ `/resolve-errors`, `/refactor-packages`, หรือ `/update-reference`
3. ถ้ามี skill reference cycles → แนะนำลบ/แก้ `related` หรือ `/update-reference`
4. ถ้าไม่พบ issues → report "no circular dependencies found"
5. ทำ `/suggest-next-action`

## Rules

### 1. Accuracy

- กรอง false positives ก่อน report — type-only imports อาจไม่สร้าง runtime cycle
- ระบุ cycle path ชัดเจน: A → B → C → A
- ตรวจสอบทั้ง direct และ transitive cycles

### 2. Completeness

- ตรวจครบทุก workspaces ใน monorepo
- รวม barrel exports (`index.ts`) ในการตรวจสอบ
- ตรวจสอบ cross-workspace dependencies ใน monorepo
- ตรวจสอบ skills directory และ `AGENTS.md` references

### 3. Actionable

- ทุก finding ต้องมี recommendation เช่น: แยก shared types, ใช้ dependency injection, restructure module boundaries
- ถ้า issue ซับซ้อน → แนะนำ `/refactor-packages`, `/follow-import-export`, หรือ `/update-reference`
- ถ้า cycle เกิดจาก barrel exports → แนะนำการแยก barrel file หรือใช้ type-only imports
- ถ้า cycle เกิดจาก skill references → แก้ไข `related` หรือ links ใน `SKILL.md`

## Expected Outcome

- รายการ circular dependencies ในทุก target type (code, skills, markdown) พร้อม severity และ recommendations
- ไม่มี false positives
- ผู้ใช้รู้ next action ที่ชัดเจน
