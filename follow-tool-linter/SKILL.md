---
name: follow-tool-linter
description: ใช้งาน linter ใน project
argument-hint: "[scope]"
related:
  - follow-tool-biome
  - follow-tool-oxlint
  - resolve-errors
---

## Goal

ใช้งาน linter ใน project ตาม tech stack

## Scope

ใช้งาน linter สำหรับ projects ตาม tech stack

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
2. รัน `/follow-tool-oxlint` สำหรับ TypeScript/JavaScript
3. รัน `clippy` สำหรับ Rust

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
- [References index](references/index.md)

## Expected Outcome

- Linter ตั้งค่าเรียบร้อย
- Linter ทำงานได้ถูกต้อง