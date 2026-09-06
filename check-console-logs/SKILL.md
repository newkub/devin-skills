---
name: check-console-logs
description: หา console.log, debugger และ debug statements ที่ค้างใน code ก่อน commit หรือ deploy
argument-hint: "[path-or-staged]"
related:
  - run-lint
  - use-astgrep
  - check-dead-code
  - follow-tool-biome
  - follow-tool-eslint
  - report-table
---

## Goal

ตรวจหา debug statements ที่หลุดค้างใน source code — `console.*`, `debugger`, `print`, `fmt.Println`, `dbg!` ฯลฯ ตามภาษา — ก่อน merge หรือ deploy

## Scope

- ตรวจ staged changes (default) หรือทั้ง project ถ้าระบุ path
- JS/TS: `console.log/warn/error/debug/info/trace`, `debugger`, `alert()`
- Python: `print()`, `breakpoint()`, `pdb.set_trace()`
- Rust: `println!`, `dbg!`, `eprintln!` ใน non-test code
- Go: `fmt.Print*`, `log.Print*` นอก main/logging layer
- Read-only: รายงานตำแหน่ง — ไม่ลบอัตโนมัติ

## Execute

### 1. Determine Scope

> Goal: เลือกชุดไฟล์ที่จะตรวจ

1. ถ้า argument = `staged` หรือไม่ระบุ → ตรวจเฉพาะ `git diff --cached --name-only` และ unstaged changes
2. ถ้าระบุ path → ตรวจทั้ง directory นั้น
3. ข้าม `*.test.*`, `*.spec.*`, `scripts/`, `examples/`, `mock/` ตาม context

### 2. Detect Language And Patterns

> Goal: เลือก pattern ตามภาษาที่ตรวจพบ

1. ตรวจภาษาจาก file extensions และ manifest (`package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`)
2. ใช้ `use-astgrep` หรือ `search-files-patterns` ค้นหา debug patterns ของแต่ละภาษา
3. ข้าม matches ที่อยู่ใน comment หรือ string literal

### 3. Classify Severity

> Goal: แยก debug ที่ตั้งใจกับที่หลุดค้าง

1. `debugger`, `breakpoint()`, `pdb` = critical (ห้าม merge)
2. `console.log`/`print` ใน production path = warning
3. `console.error`/`console.warn` ที่เป็น intentional logging = info (ถามก่อน flag)
4. matches ใน logger wrapper หรือ debug utility = ข้าม

### 4. Report

> Goal: รายงานตำแหน่งพร้อมคำแนะนำ

1. ใช้ `/report-table` คอลัมน์: `No.`, `File:Line`, `Statement`, `Severity`, `Suggestion`
2. แนะนำ lint rule ที่ป้องกันระยะยาว เช่น `no-console` ใน eslint/biome
3. ถ้าเจอเยอะ → แนะนำเพิ่ม pre-commit hook ผ่าน `/follow-tool-githooks`

## Rules

### 1. Evidence-Based

- ทุก finding ต้องมี file:line และ statement จริง
- แยก intentional logging ออกจาก debug leftovers

### 2. Read-Only

- ไม่ลบหรือแก้ code — รายงานและให้ user ตัดสินใจ หรือทำ `/improve-logging` ถ้าควรเปลี่ยนเป็น logger

### 3. Context Aware

- CLI tools และ debug utilities อาจใช้ `console.log` ได้ถูกต้อง — ตรวจ context ก่อน flag
- ไฟล์ test/example ไม่นับ

## Expected Outcome

- รายการ debug statements ที่ค้างพร้อม severity และตำแหน่ง
- คำแนะนำ lint rule / pre-commit hook ป้องกันระยะยาว
