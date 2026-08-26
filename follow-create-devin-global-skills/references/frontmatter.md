# YAML Frontmatter Spec

`SKILL.md` ต้องมี YAML frontmatter ตาม Devin CLI spec

## Required Fields

- `name` (required): ตรง directory name, lowercase คั่นด้วย `-`
- `description` (required): กระชับ ≤100 ตัวอักษร

## Recommended Fields

- `argument-hint` (recommended): ระบุเสมอเมื่อ skill รับ arguments เพื่อให้ autocomplete แสดง placeholder ตอน invoke (เช่น `"[file] [options]"`, `"<ComponentName>"`, `"[session-id]"`). ถ้า skill ไม่รับ arguments → ละได้
- `allowed-tools` (recommended): จำกัดเฉพาะ tools ที่จำเป็น

## Optional Fields

- `model` (optional): `sonnet`, `swe`, `opus`, `codex`
- `subagent: true` (optional): รันเป็น subagent (experimental)
- `agent: <profile>` (optional): custom subagent profile. ถ้าตั้งทั้ง `agent` และ `subagent` → `agent` มี precedence
- `permissions` (optional): `allow`, `deny`, `ask` ตามความเสี่ยง
- `triggers` (optional): default `['user', 'model']`

## Prompt Body Order

`## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`

## Execute Steps

- `## Execute` แบ่งเป็น steps ไม่เกิน 10 โดยใช้ `### N. Step Name`, description, `> Goal:`, และ numbered list
- ใช้ `## Key Concepts`, `## Principles`, `## Guide`, หรือ `## Examples` เมื่อต้องการเน้นรูปแบบหรือตัวอย่าง

## Formatting

- ใช้ backticks สำหรับ `tools`, `commands`, `paths`, `skill-name`
- ห้ามใช้ `**` bold markers
- ถ้า skill ขึ้นต้นด้วย `check-` → กำหนด `allowed-tools` ให้รองรับ `exec`, `grep`, `glob`, `find_file_by_name` และวางแผนใช้ `/use-scripts` สำหรับ scan ซับซ้อน
