---
name: follow-tool-linter
description: ใช้งาน linter ใน project
argument-hint: "[scope]"
related:
  - follow-tool-biome
  - follow-tool-eslint
  - resolve-errors
  - run-lint
  - run-format
---

## Goal

ใช้งาน linter ใน project ตาม tech stack

## Scope

ใช้งาน linter สำหรับ projects ตาม tech stack

- Latest: oxlint `1.82.0`, biome `2.5.13`, eslint `10.10.0`, ruff `0.16.7`, golangci-lint `2.13.2` (verified 2026-09-12)

## Execute

### 1. Select Linter

> Goal: เลือก linter ตาม tech stack ของ project

1. ตรวจสอบ tech stack ของ project
2. เลือก linter ตามความเหมาะสม:
   - TypeScript/JavaScript: oxlint หรือ biome
   - Rust: clippy
   - Go: golangci-lint
   - Python: ruff

### 2. Setup Linter

> Goal: ติดตั้งและตั้งค่า linter

1. รัน `/follow-tool-biome` สำหรับ TypeScript/JavaScript
2. รัน `/follow-tool-eslint` สำหรับ TypeScript/JavaScript
3. สำหรับ oxlint: `bun add -D oxlint` แล้ว `bunx oxlint` — ถ้าต้องการ type-aware rules ให้ติดตั้ง `oxlint-tsgolint` เพิ่ม
4. รัน `clippy` สำหรับ Rust (`rustup component add clippy` แล้ว `cargo clippy`)
5. สำหรับ Python: `pipx install ruff` แล้ว `ruff check` (+ `ruff format` สำหรับ formatter)
6. สำหรับ Go: `mise use -g golangci-lint` แล้ว `golangci-lint run`

### 3. Validate

> Goal: ทดสอบ linter และตรวจสอบ configuration

1. รัน linter เพื่อทดสอบ
2. ตรวจสอบ configuration

## Rules

### 1. Linter Selection

- เลือก linter ตาม tech stack

### 2. Error Handling

- ใช้ `/resolve-errors` เมื่อพบ error

## References

- [CLI reference](references/cli.md)

- ใช้ /run-lint ถ้าจำเป็น
- ใช้ /run-format ถ้าจำเป็น

## Expected Outcome

- Linter ตั้งค่าเรียบร้อย
- Linter ทำงานได้ถูกต้อง
