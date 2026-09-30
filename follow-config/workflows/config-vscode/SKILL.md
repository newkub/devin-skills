---
name: follow-config-config-vscode
description: จัดการ .vscode config — settings, extensions, tasks, launch ให้ตรง project stack
argument-hint: "[path]"
related:
  - follow-config
  - update-dot-vscode
  - update-config
---

## Goal

ตรวจและจัดการ `.vscode/` config ให้สอดคล้องกับ project stack — settings, recommended extensions, tasks, launch configs — merge กับของเดิมไม่ clobber

## Scope

- ใช้กับ `.vscode/settings.json`, `.vscode/extensions.json`, `.vscode/tasks.json`, `.vscode/launch.json`
- ครอบคลุม: formatter/linter settings, extension recommendations, shared tasks, debug configs
- ไม่ครอบคลุม user-level VS Code settings — เฉพาะ workspace config ที่ commit ได้

## Execute

### 1. Detect Stack And Current Config

> Goal: รู้ว่า project ต้องการ vscode config แบบไหน

1. อ่าน `package.json` / manifests — formatter, linter, test runner, framework ที่ใช้
2. อ่าน `.vscode/*` ปัจจุบัน — settings, extensions, tasks, launch ที่มีอยู่
3. ระบุ gaps — เช่น ใช้ biome แต่ไม่มี default formatter หรือ extension recommendation

### 2. Sync Settings And Extensions

> Goal: editor ทำงานตรง project tools

1. `settings.json`: ตั้ง `editor.defaultFormatter` ตาม formatter ของ project, `editor.formatOnSave`, linter integration, file associations — merge กับ settings เดิม ห้าม overwrite keys ที่ไม่เกี่ยว
2. `extensions.json`: `recommendations` สำหรับ extensions ของ tools ที่ project ใช้จริง — เช่น biome, eslint, tailwind, playwright ตาม stack
3. ห้ามใส่ user-specific settings (theme, font) ลง workspace settings

### 3. Sync Tasks And Launch

> Goal: tasks/debug configs ตรง scripts จริง

1. `tasks.json`: map จาก `package.json` scripts หรือ monorepo tasks — build, test, lint, dev
2. `launch.json`: debug configs สำหรับ app/tests ตาม runtime ที่ใช้ — ดู official docs ของ framework ถ้าไม่แน่ใจ
3. ใช้ variables ของ VS Code (`${workspaceFolder}`, `${file}`) แทน hardcode paths

### 4. Verify

> Goal: config valid และใช้งานได้

1. validate JSON ทุกไฟล์ — ไม่มี syntax errors, comments ใช้ได้ใน jsonc
2. ทดสอบ task หลักรันได้ — `Terminal → Run Task` equivalents
3. ทำ `/update-dot-vscode` ถ้าต้อง sync กับ templates/standards ของ repo

## Rules

- merge กับ config เดิมเสมอ — ห้าม overwrite ทั้งไฟล์ถ้าไม่จำเป็น
- ตั้งเฉพาะ settings ที่จำเป็นต่อ project tools — ห้ามใส่ personal preferences
- extension recommendations เฉพาะ tools ที่ project ใช้จริง — ไม่ใช่ nice-to-have
- ห้าม commit secrets, tokens หรือ machine-specific paths ใน `.vscode/`
- paths ต้อง relative หรือใช้ VS Code variables — ห้าม absolute paths

## Expected Outcome

- `.vscode/` สอดคล้องกับ project stack — formatter, linter, tasks ตรง
- extensions recommendations ครบสำหรับ tools ที่ใช้
- config valid, tasks/launch ใช้งานได้จริง
