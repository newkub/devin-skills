---
name: follow-tool-usage
description: สร้าง CLI spec ด้วย usage เพื่อ generate completions/docs/SDK
related:
  - report-usage
  - report-usage-md
  - review-app-usage
  - follow-best-practice
  - setup-cicd
  - resolve-errors
  - follow-tool-mise
---

## Goal

ใช้ usage spec (KDL) กำหนด CLI แล้ว generate completions, docs, manpages, และ type-safe SDK

## Scope

ครอบคลุม installation, KDL spec, `usage generate` subcommands, integrations, และ validation

## Execute

### 1. Install

> Goal: มี usage CLI พร้อมใช้

1. แนะนำติดตั้งผ่าน mise: `mise use -g usage` หรือ `mise use usage`
2. ทางเลือก: `cargo install usage-cli`, `brew install usage`
3. ถ้า project ไม่มี mise ให้ทำ `/follow-tool-mise` ก่อน
4. ยืนยันด้วย `usage --version`

### 2. Define Spec

> Goal: กำหนด CLI ด้วย KDL

1. สร้าง `usage.kdl` หรือ `cli.usage.kdl` ใน project
2. กำหนด metadata: `name`, `bin`, `about`, `version`, `author`, `license`
3. กำหนด `flag`, `arg`, `cmd` พร้อม `help`
4. ใช้ `effect` เช่น `read`, `write`, `destructive` สำหรับ commands และ flags
5. ใช้ `config_file` และ `env` เพื่อ bind config/env/defaults
6. ใช้ `global=#true` สำหรับ global flags

### 3. Generate Outputs

> Goal: สร้าง artifacts จาก spec

1. `usage generate completion <shell> <bin> -f usage.kdl` สำหรับ bash/zsh/fish/pwsh/nushell
2. `usage generate completion-init <shell>` สำหรับ shell init script
3. `usage generate markdown` สำหรับ markdown docs
4. `usage generate manpage` สำหรับ manpages
5. `usage generate sdk <language>` สำหรับ type-safe SDK
6. `usage generate json` สำหรับ consume โดย framework
7. `usage generate fig` สำหรับ Fig completions

### 4. Validate and Scripts

> Goal: ตรวจสอบ spec และใช้ scripts

1. รัน `usage lint` เพื่อตรวจสอบ spec
2. ใช้ `usage exec` สำหรับ execute spec-based scripts
3. ใช้ `usage scripts` เพื่อ generate bash scripts with arg parsing

### 5. Framework Integrations

> Goal: integrate กับ CLI frameworks ทีมีอยู่

1. clap (Rust) — ดู `spec/integrations/clap`
2. cobra, kong, urfave/cli (Go)
3. commander.js, oclif, yargs (Node.js)
4. argparse, typer, click (Python)
5. picocli, JCommander (Java)
6. Clikt (Kotlin)

## Rules

### 1. Spec Conventions

- ใช้ KDL format
- ใช้ `flag "-f --force"` สำหรับ short/long flags
- ใช้ `arg "<required>"` สำหรับ required positional
- ใช้ `arg "[optional]"` สำหรับ optional positional
- กำหนด `effect` สำหรับ commands ที่เปลี่ยน state
- ใช้ `global=#true` สำหรับ global flags
- ใช้ `hide=#true` สำหรับ hide command/alias จาก docs

### 2. Example usage.kdl

```kdl
name "My CLI"
bin "mycli"
about "A sample CLI"
version "1.0.0"

flag "-v --verbose" help="Enable verbose logging" global=#true count=#true
flag "-f --force" help="Skip confirmation" effect="destructive"

arg "<dir>" help="Working directory"

cmd "build" help="Build the project" effect="write" {
  flag "-w --watch" help="Watch for changes"
}

cmd "deploy" help="Deploy to production" effect="destructive" {
  flag "-e --env <env>" help="Target environment"
}
```

### 3. Common Commands

- `usage lint`
- `usage generate completion bash mycli`
- `usage generate markdown`
- `usage generate manpage`
- `usage generate sdk typescript`
- `usage generate json`
- `usage generate completion-init bash`

### 4. Integration Pattern

- generate JSON spec ด้วย `usage generate json -f usage.kdl`
- consume JSON ใน CLI framework หรือ build pipeline
- keep `usage.kdl` เป็น single source of truth
- regenerate completions/docs ใน CI ถ้ามีการเปลี่ยน spec

- ใช้ /report-usage ถ้าจำเป็น
- ใช้ /report-usage-md ถ้าจำเป็น
- ใช้ /review-app-usage ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- มี `usage.kdl` ที่ครบถ้วน
- สามารถ generate completions สำหรับ bash/zsh/fish/pwsh/nushell
- สามารถ generate markdown docs/manpages
- สามารถ generate type-safe SDK สำหรับ multiple languages
- สามารถ integrate กับ CLI frameworks ทีมีอยู่
- `usage lint` ผ่าน