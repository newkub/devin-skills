---
name: follow-tool-formatter
description: ใช้งาน code formatter ใน project เพื่อรักษา style สม่ำเสมอ
related:
  - follow-tool-linter
  - follow-tool-validator
  - follow-tool-biome
  - follow-tool-dprint
---

## Goal

ใช้งาน code formatter ใน project เพื่อ format code สม่ำเสมอตาม style guide

## Scope

ใช้สำหรับ projects ที่ต้องการ formatter รองรับ TypeScript, JavaScript, Rust, Python, Go ตาม tech stack

## Execute

### 1. Select Formatter

> Goal: เลือก formatter ตาม tech stack

1. ตรวจสอบ tech stack ของ project
2. เลือก formatter ตามความเหมาะสม:
   - TypeScript/JavaScript: biome, prettier, dprint
   - Rust: rustfmt
   - Python: ruff format, black
   - Go: gofmt
3. ถ้า project มี formatter อยู่แล้ว → ใช้ตัวเดิม

### 2. Configure Formatter

> Goal: ตั้งค่า formatter ให้ตรง style guide

1. สร้าง config file ตาม formatter เช่น `biome.json`, `.prettierrc`, `rustfmt.toml`
2. กำหนด quote, semicolon, tab width, line width ตาม project convention
3. ใช้ `ignore`/`exclude` สำหรับ generated files, vendored files, lock files
4. เก็บ config ใน root หรือ `.config/` ตาม project structure
5. ถ้ามี `package.json` scripts ให้เพิ่ม `format` script

### 3. Run Formatter

> Goal: format code ทั้งหมด

1. รัน formatter กับทุกไฟล์ทีเกี่ยวข้อง
2. ตรวจสอบ diff ว่าไม่มี unintended changes
3. ถ้ามี unintended changes → ปรับ config แล้ว format ใหม่
4. รัน `format:check` หรือ equivalent เพื่อ verify ใน CI

### 4. Integrate With Lint And CI

> Goal: formatter ทำงานร่วมกับ lint และ CI

1. แยก `format` ออกจาก `lint` (format แก้ไฟล์ ได้, lint ตรวจ)
2. ใช้ `format --check` หรือ `fmt --check` ใน CI
3. ถ้าใช้ hk/lefthook → เพิ่ม `pre-commit` step สำหรับ format (fix)
4. ทำ `/run-verify-fast` เพื่อ verify format + lint + typecheck

### 5. Editor And Onboarding

> Goal: ให้ทีมใช้ formatter สม่ำเสมอ

1. เพิ่ม editor integration (VS Code settings, .editorconfig)
2. เอกสารวิธี format ก่อน commit
3. ถ้าใช้ `formatOnSave` → ระบุใน editor config
4. ตรวจสอบว่า CI จับ code ที่ยังไม่ format

## Rules

### 1. Format Separate From Lint

- formatter จัดการ style (spacing, quote, semicolon)
- linter จัดการ code quality (unused, errors, patterns)
- ไม่ให้ linter ทำหน้าที format หลัก

### 2. Config In Version Control

- config file ต้องอยู่ใน repo
- ไม่ commit personal/IDE-specific format settings
- ใช้ root-level config เพื่อ consistency

### 3. Fast And Deterministic

- formatter ต้องเร็วพอสำหรับ pre-commit
- ผลลัพธ์ deterministic (รันซ้ำได้ output เดิม)
- ไม่ format generated files หรือ vendored files

### 4. No Manual Formatting Battles

- ห้าม commit โดยไม่ format
- ห้ามสลับ formatter บ่อย
- ถ้าเปลี่ยน formatter → ทำ `/update-references` และระบุใน CHANGELOG

## Expected Outcome

- Formatter ถูกเลือกและตั้งค่าถูกต้อง
- `format` และ `format:check` scripts ทำงานได้
- CI ตรวจ code ที่ยังไม่ format
- Editor settings สนับสนุน format on save
- Code style สม่ำเสมอทั้ง project
