---
name: learn-from-cli
description: เรียนรู้ command structure, subcommands, options, และ output ของ CLI
  tool ใดก็ได้
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---
## Goal

## Goal

สำรวจ CLI tool ให้รู้ว่ามี subcommands, options, flags, และ output อย่างไรก่อนใช้งาน

## Scope

Use `learn-from-cli` for the specific tasks and workflows it covers

## Execute

## Execute

### 1. Basic Discovery

1. รัน `<cli> --version` เพื่อดู version
2. รัน `<cli> --help` หรือ `<cli> -h`
3. รัน `<cli> help <subcommand>` ถ้ามี subcommands
4. รัน `<cli> <subcommand> --help` เพื่อดู options ของแต่ละ subcommand

### 2. Machine-Readable Context

ถ้า CLI รองรับ machine-readable metadata:
1. รัน `<cli> agent-context` ถ้ามี
2. รัน `<cli> completion` หรือ `<cli> --generate-bash-completion`
3. บันทึก command list, flags, และ argument types

### 3. Document

สรุปทีได้:
- command groups
- ตัวอย่างการใช้งานพื้นฐาน
- options/flags ที่ควรรู้
- exit codes และ output format

## Rules

- Follow the project conventions and global rules
- Use the allowed tools only when needed

## Expected Outcome

Completed `learn-from-cli` workflow with correct output
