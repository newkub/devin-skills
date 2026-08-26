---
name: use-scripts
description: สร้าง scripts สำหรับ automate งานด้วย Bun, nushell, pwsh, หรือ ast-grep
argument-hint: "[target]"
related:
  - use-bun-scripts
  - use-bun-shell
  - use-nu-shell
  - use-pwsh-shell
  - use-ast-grep
  - use-ast-grep-programatic
  - follow-lang-bun
  - follow-lib-esm-sh
---

## Goal

สร้าง scripts เพื่อ automate งานและประมวลผลไฟล์ ด้วย Bun native APIs, nushell, pwsh, หรือ ast-grep ตามความเหมาะสม

## Scope

ใช้สำหรับสร้าง scripts ใน workspace ด้วย Bun native APIs, nushell, pwsh, หรือ ast-grep

## Execute

### 1. Choose Shell And Type

> Goal: เลือก shell/script type ให้เหมาะสม

1. ค่าเริ่มต้น: ใช้ `/use-bun-scripts` / `/use-bun-shell` เมื่อ:
   - ต้องการ Bun native APIs สำหรับ automate งาน
   - ใช้ JS/TS scripts เป็นค่าเริ่มต้น
   - ต้องการ JavaScript/TypeScript runtime
   - ทำงานกับ JSON, HTTP, async/await, npm packages
   - ต้องการ Bun native APIs เช่น `Bun.file`, `Bun.write`, `Bun.$`
   - ต้องการ cross-platform scripts ด้วย JS/TS
2. ใช้ `/use-nu-shell` เมื่อ:
   - ต้องการ structured data pipelines
   - อ่าน/ประมวลผล JSON, CSV, TOML, YAML ด้วย built-in commands
   - ต้องการ cross-platform shell syntax ที่อ่านง่าย
   - ไม่ต้องการ .NET หรือ Windows-only features
3. ใช้ `/use-pwsh-shell` เมื่อ:
   - ทำงานบน Windows โดยเฉพาะ system administration
   - ต้องการ call .NET APIs, registry, WMI, COM
   - ต้องการ verbose try-catch error handling
4. ใช้ `ast-grep` เมื่อ:
   - ต้องการ AST-based code search
   - ต้องการ code transformation หรือ linting
5. ถ้าไม่แน่ใจ → ใช้ Bun native APIs เป็นค่าเริ่มต้น แล้วระบุเหตุผลถ้าเปลี่ยนไป shell อื่น

### 2. Choose Script Location

> Goal: เลือก location สำหรับ script

1. `$env:TEMP` — scripts ชั่วคราวใน OS temp directory (throwaway, ไม่สร้างใน project)
2. `.devin/scripts/` — scripts ถาวร (committed, เก็บไว้ใช้ซ้ำ)
3. ไม่สร้าง `temp/` หรือ `.devin/scripts/temp/` ใน project workspace
4. ใช้ `$env:TEMP` บน Windows, `$TMPDIR` บน Unix, `os.tmpdir()` ใน Bun

### 3. Create Script

> Goal: เขียน script ตาม standards

1. เขียนแบบ composable: `createScript()` return state + actions
2. ใช้ Bun native APIs สำหรับ `.ts` scripts (ดู `/use-bun-shell`, `/follow-lang-bun`)
3. ใช้ `nu` สำหรับ `.nu` scripts ถ้าประมวลผล structured data
4. ใช้ `pwsh` สำหรับ `.ps1` scripts ถ้า Windows-specific
5. ใช้ CDN imports สำหรับ external dependencies: `https://esm.sh/<name>`
6. ใช้ `eta` ผ่าน `https://esm.sh/eta@4.6.0` สำหรับ template/render ใน Bun scripts (ดู `/follow-lib-esm-sh` สำหรับ CDN convention)
7. เพิ่ม `dryRun` option สำหรับ testing

### 4. Test And Execute

> Goal: ทดสอบและรัน script อย่างปลอดภัย

1. รัน script ใน dry run mode เพื่อดูผลลัพธ์
2. แก้ไข errors ก่อนรันจริง
3. รัน:
   - `bun run <script>.ts` สำหรับ Bun scripts
   - `nu <script>.nu` สำหรับ Nushell scripts
   - `pwsh <script>.ps1` สำหรับ PowerShell scripts
   - `ast-grep scan` สำหรับ AST operations
4. ลบ scripts จาก `$env:TEMP` หลังใช้งานเสร็จ

## Rules

### 1. Script Type Selection

- `/use-bun-shell` — JS/TS, JSON, HTTP, async, cross-platform
- `/use-nu-shell` — structured data, pipelines, cross-platform shell
- `/use-pwsh-shell` — Windows system admin, .NET, COM, WMI
- `ast-grep` — AST-based code search/transformation

### 2. File Locations

- `$env:TEMP` — throwaway scripts (OS temp directory, ไม่สร้างใน project)
- `.devin/scripts/` — permanent scripts (committed)
- ใช้ `.ts` สำหรับ Bun, `.nu` สำหรับ Nushell, `.ps1` สำหรับ PowerShell

### 3. Bun Native API Preference

- ใช้ Bun native APIs สำหรับ `.ts` scripts เสมอเมื่อเป็นไปได้
- `Bun.Glob` แทน `fast-glob`, `Bun.$` แทน `execa`, `Bun.file()` + `Bun.write()` แทน `fs-extra`

### 4. CDN Libraries

```typescript
import { z } from "https://esm.sh/zod"
import { glob } from "https://esm.sh/glob"
import { render } from "https://esm.sh/eta@4.6.0"
```

- CLI: `zod`, `cac`, `consola`, `@clack/prompts`, `picocolors`
- Parsing: `yaml`, `gray-matter`, `jsonc-parser`
- File System: `pretty-bytes`, `env-paths`, `semver`
- Async: `p-limit`, `p-queue`, `p-map`
- Template: `eta` สำหรับ generate text/files จาก template

### 5. Decision Records

- ระบุเหตุผลทุกครั้งที่เลือก shell ใด shell หนึ่ง
- บันทึกเหตุผลใน comment หรือ docstring ของ script
- ถ้า fallback จาก shell หนึ่งไปอีก shell ต้องระบุเหตุผล

## Expected Outcome

- Scripts ทำงานได้ด้วย Bun, nushell, pwsh, หรือ ast-grep
- การเลือก shell มีเหตุผลชัดเจน
- Dependencies ผ่าน CDN (ไม่ต้อง install)
- สามารถใช้ `eta` สำหรับ template/render ใน Bun scripts
- Scripts อยู่ใน location ถูกต้องตาม Rules
- Temp scripts ใน `$env:TEMP` ถูกลบหลังใช้งาน, permanent scripts เก็บไว้ใช้ซ้ำ
- Dry run mode สำหรับทดสอบก่อน execute จิง
