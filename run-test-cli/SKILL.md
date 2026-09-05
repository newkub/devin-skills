---
name: run-test-cli
description: รัน tests สำหรับ CLI commands, output, exit codes, flags, และ error paths
argument-hint: "[cli-command]"
related:
  - resolve-errors
  - report-table
---

## Goal

ทดสอบ CLI commands ด้วยการรันผ่าน shell จริง ตรวจสอบ exit codes, stdout, stderr, help text, flags, subcommands, และ error paths

## Scope

ใช้กับ CLI tools ทีสร้างด้วย Bun/Node/Rust/Go/Python โดยรันจาก built binary หรือ package script

## Execute

### 1. Detect CLI

> Goal: รู้ว่า CLI อยู่ไหน

1. ตรวจ `package.json` `bin` fields, `scripts`, `bin` ใน `Cargo.toml`, `pyproject.toml`, `go.mod`
2. ตรวจ `tsup.config.*`, `bunup.config.*`, `Cargo.toml` สำหรับ build output
3. หา executable path หรือใช้ `bun run src/presentation/cli.ts`
4. ถ้าไม่พบ → `/ask-me`

### 2. Build CLI

> Goal: ให้ CLI พร้อมทดสอบ

1. รัน `bun run build` หรือ `cargo build` หรือ `go build` ตาม ecosystem
2. ตรวจว่า executable ถูกสร้างใน `dist/`, `target/`, หรือ `bin/`
3. ถ้า build ล้มเหลว → `/resolve-errors`

### 3. Test Help And Version

> Goal: ตรวจ basic commands

1. รัน `<cli> --help` ตรวจ exit code 0 และ stdout มี usage
2. รัน `<cli> -h` ทดสอบ short flag
3. รัน `<cli> --version` หรือ `<cli> -V` ตรวจ version output
4. บันทึก flags, subcommands, และ options ทีแสดง

### 4. List Commands And Subcommands

> Goal: รู้ว่า CLI ทำอะไรได้บ้าง

1. อ่าน help output สร้างรายการ subcommands
2. รัน `<cli> <subcommand> --help` เพื่อดู flags ของแต่ละ subcommand
3. บันทึก subcommands, flags, positional args, และ default values

### 5. Test Happy Path Commands

> Goal: ทดสอบ command ทีถูกต้อง

1. รัน subcommand ด้วย valid arguments
2. ตรวจ exit code 0
3. ตรวจ stdout มี output ตาม expected
4. ตรวจ side effects ถ้ามี เช่น ไฟล์ถูกสร้าง, DB ถูกเขียน
5. ใช้ fixtures หรือ test data สำหรับ input

### 6. Test Error Paths

> Goal: ทดสอบกรณีผิดพลาด

1. รัน command โดยไม่มี required arguments → ตรวจ error และ exit code ≠ 0
2. รัน command ด้วย invalid flag → ตรวจ error message
3. รัน command ด้วย invalid input file → ตรวจ error handling
4. รัน command โดยไม่มี permission → ตรวจ error ถ้าเกี่ยวข้อง
5. รัน command ด้วย missing env vars → ตรวจ error

### 7. Test Flags And Options

> Goal: ทดสอบทุก flag ทีมี

1. Test boolean flags: `--flag`, `--no-flag`, `-f`
2. Test value flags: `--output path`, `--format json`, `--limit 10`
3. Test default values เมื่อไม่ส่ง flag
4. Test mutually exclusive flags ถ้ามี
5. ใช้ parameterized tests สำหรับ flag matrix

### 8. Test Pipes And Stdin

> Goal: ทดสอบ CLI ทีรับ input จาก stdin

1. ส่งข้อมูลผ่าน pipe: `cat fixture.json | <cli> process`
2. ตรวจ stdout ของ command
3. ตรวจ error handling เมื่อ stdin ว่างหรือ malformed

### 9. Capture And Report

> Goal: สรุปผลการทดสอบ

1. บันทึก exit codes, stdout, stderr ของแต่ละ command
2. รวบรวม failures และ inconsistencies
3. ทำ `/resolve-errors` สำหรับ failures
4. ใช้ `/report-table` เพื่อแสดง test results

### 10. Re-run Until Pass

> Goal: วนรัน CLI tests จนผ่าน

1. แก้ไข CLI หรือ tests หลัง failures
2. รันใหม่ทีละ command
3. วนซ้ำสูงสุด 3 รอบ
4. ถ้ายัง fail → stop และ report

## Rules

### 1. Test Isolation

- แต่ละ test ต้องรัน independent
- Cleanup side effects หลังแต่ละ test (`afterEach`, `teardown`)
- ใช้ temporary directories สำหรับ output files

### 2. No Hardcoded Secrets

- ไม่ hardcode API keys, tokens, passwords ใน tests
- ใช้ environment variables หรือ mock สำหรับ external services

### 3. Assert Output, Not Implementation

- ตรวจ stdout, stderr, exit code เป็นหลัก
- ไม่ assert การเรียก function ภายใน CLI
- ใช้ `expect.stringContaining` สำหรับ output ทียืดหยุ่น

### 4. Use Parameterized Tests

- ใช้ `it.each` หรือ table-driven tests สำหรับ flag matrix
- ใช้สำหรับ invalid input หลายกรณี
- ใช้สำหรับ subcommands หลายตัว

### 5. Ecosystem Aware

- Bun/Node CLI: ใช้ `bunx` หรือ `bun run` สำหรับ execute
- Rust CLI: ใช้ `cargo run` หรือ `target/debug/<binary>`
- Go CLI: ใช้ `go run` หรือ built binary
- Python CLI: ใช้ `python -m` หรือ `pytest` สำหรับ test scripts

### 6. Timeout And Retry

- `perCommandTimeout` = 60 วินาที
- `maxRetries` = 3 สำหรับ flaky commands
- หยุดทันทีเมื่อเกิด infinite loop

### 7. Error Handling

- แก้ที่ root cause ไม่ใช่ suppress
- ถ้า error มาจับ build → `/resolve-errors`
- ถ้า error มาจับ environment → `/ask-me`

## Expected Outcome

- CLI commands ทั่งหมดถูกทดสอบด้วย valid และ invalid inputs
- Exit codes, stdout, stderr ถูก assert
- Help, version, flags, subcommands ถูกตรวจสอบ
- ไม่มี regression ใน command behavior
- มี report table สรุปผล
