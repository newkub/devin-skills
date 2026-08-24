---
name: use-nu-shell
description: ใช้ Nushell สำหรับ shell commands, structured data pipelines, และ scripting
---

## Goal

ใช้ `nushell` (`nu`) สำหรับ shell commands, structured data pipelines, และ cross-platform scripting

## Scope

ใช้สำหรับ task ที่ต้องการอ่าน/ประมวลผล structured data, file operations, หรือ cross-platform shell commands ด้วย `nu`

## Execute

### 1. Check Nushell Installation

> Goal: ตรวจสอบและติดตั้ง `nu`
> Goal: ยื่นยันว่ามี `nu` พร้อมใช้

1. รัน `nu --version`
2. ถ้าไม่มา ให้ติดตั้ง:
   - Windows: `winget install nushell` หรือ `winget install --id Nushell.Nushell`
   - macOS/Linux: `brew install nushell`
   - Rust: `cargo install nu`
3. ถ้าติดตั้งไม่ได้ → fallback ไป `pwsh` หรือ `powershell` แล้วรายงาน
4. ไม่ fallback ไป `cmd` โดยอัตโนมัติ

### 2. Run Commands With Nushell

> Goal: รันคำสั่งด้วย `nu`
> Goal: execute commands อย่างถูกต้อง

1. คำสั่งเดี่ยว: `nu -c '<command>'`
2. สคริปต์: `nu script.nu`
3. ใช้ built-in file operations: `ls`, `cp`, `mv`, `rm`, `mkdir`, `touch`
4. อ่าน/เขียน structured data: `open <file>`, `save <file>`
5. ใช้ `^<command>` สำหรับ external binary เช่น `^git status`
6. ดู help: `help <command>` หรือ `<command> --help`

### 3. Use Pipelines And Filters

> Goal: ใช้ pipeline และ filters ของ `nu`
> Goal: ประมวลผล data อย่างมีประสิทธิภาพ

1. pipeline: `<input> | <filter> | <output>` เช่น `ls | where size > 10kb | sort-by size`
2. `$in` สำหรับ pipeline input
3. `get`, `select`, `where`, `sort-by`, `reverse` สำหรับ table/record
4. `each`, `par-each`, `for` สำหรับ iteration
5. `describe` เพื่อดู type ของ output

### 4. Write Nushell Scripts

> Goal: เขียนสคริปต์สำหรับ automation
> Goal: scripts reusable และ maintainable

1. ใช้ `def` สำหรับ custom commands
2. ใช้ `let` สำหรับ immutable variables และ `mut` สำหรับ mutable
3. ใช้ `print` สำหรับ side-effect logging
4. จัดการ data types: int, float, string, bool, list, record, table, filesize, duration
5. ใช้ `into <type>` เพื่อ convert data
6. เก็บ script ไว้ใน `.devin/scripts/` ถ้าใช้ซ้ำ หรือ `temp/` ถ้าชั่วคราวตาม `/use-scripts`

### 5. Integrate With Use Scripts

> Goal: เชื่อมต่อกับ `/use-scripts`
> Goal: scripts ทำงานร่วมกับ automation pipeline ได้

1. ใช้ `nu` สำหรับ structured data pipelines
2. ตั้ง `dryRun` option ในทุก script
3. ระบุเหตุผลถ้าเลือก `nu` แทน shell อื่น
4. อ้างอิง `/use-scripts` สำหรับการตัดสินใจเลือก shell

## Rules

### 1. When To Use Nushell

- ประมวลผล structured data (JSON, CSV, TOML, YAML)
- Cross-platform shell commands ที่อ่านง่าย
- File operations ด้วย built-ins
- ไม่ต้องการ .NET หรือ Windows-only features

### 2. Data Types And Pipelines

- รู้จัก types: int, float, string, bool, date, duration, filesize, list, record, table
- ใช้ `open`/`save` สำหรับ structured files
- ใช้ `get`, `select`, `where`, `sort-by` สำหรับ table operations
- ใช้ `describe` เพื่อดู type

### 3. External Commands

- ใช้ `^<command>` เมื่อชนกับ `nu` internal
- ใช้ `lines` เพื่อ split external output เป็น lines
- ใช้ `spread operator` `...$list` สำหรับ external arguments

### 4. Fallback

- fallback เป็น `pwsh` เมื่อ `nu` ไม่รองรับหรือไม่ติดตั้ง
- ไม่ใช้ `cmd` เป็นค่าเริ่มต้น
- ระบุเหตุผลทุกครั้งที่ fallback

### 5. Avoid File Creation

พยายามรันคำสั่งโดยไม่สร้างไฟล์ชั่วคราว:

- ใช้ `nu -c` สำหรับคำสั่งทันที
- ไม่สร้างไฟล์ `.nu` เพื่อรัน command ชั่วคราว
- ถ้า command มี side effects ให้ dry run ด้วย `print` หรือ `describe` ก่อน
- ถ้าจำเป็นต้องเขียนไฟล์ ให้ตรวจสอบ path ด้วย `path expand` ก่อน

### 6. Script Location

- ใช้ `.devin/scripts/` สำหรับ permanent scripts
- ใช้ `temp/` หรือ `.devin/scripts/temp/` สำหรับ throwaway scripts
- ใช้ `.nu` สำหรับ Nushell scripts

## Expected Outcome

- `nu` ติดตั้งและใช้งานได้
- คำสั่งรันด้วย `nu` ถูกต้อง
- Scripts อยู่ใน location ถูกต้อง
- ใช้ประโยชน์จาก structured data pipelines ของ `nu`
- Fallback มีเหตุผลชัดเจน
