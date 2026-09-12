---
name: follow-create-claude-plugin
description: สร้าง Claude Code plugin ด้วย manifest, skills, agents, hooks, และ MCP servers
argument-hint: "[scope]"
related:
  - follow-create-sdk
  - update-devin-global-skills
  - update-devin-global-subagents
  - ask-me
  - search-skills
  - follow-harness-engineering
  - review-dependencies
  - follow-clean-architecture
---

## Goal

สร้าง Claude Code plugin ทีสามารถติดตั้งและใช้งานกับ Claude Code ได้ โดยมี manifest, skills, agents, hooks, MCP servers และ slash commands ตามมาตรฐานของ Claude

## Scope

ใช้สำหรับสร้าง Claude Code plugin จาก scratch เพื่อขยายความสามารถของ Claude ด้วย custom skills, agents, hooks, MCP servers หรือ slash commands

- Latest: Claude Code plugin format — รองรับ skills, agents, hooks, commands, MCP (`.mcp.json`), LSP (`.lsp.json`), monitors (`monitors/monitors.json`), `bin/`, `settings.json` — docs: code.claude.com/docs/en/plugins (verified 2026-09-12)

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/review-dependencies` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-dependencies` เพื่อ review tech stack, dependencies, และ library design (create claude plugin)
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป (create claude plugin)

### 2. Gather Requirements

> Goal: เข้าใจ purpose และ components ของ plugin

1. ถาม user ถึงชื่อ plugin, เป้าหมาย, target users, และ use case
2. ระบุ components ทีต้องการ:
   - `skills/` สำหรับ knowledge หรือ user-initiated actions (preferred — invoke เป็น `/plugin-name:skill-name`)
   - `agents/` สำหรับ autonomous tasks
   - `hooks/` สำหรับ event-driven automation (`hooks/hooks.json` + handler scripts)
   - `commands/` สำหรับ slash commands (legacy — ใช้ `skills/` สำหรับ plugin ใหม่)
   - `mcpServers` ใน `.mcp.json` สำหรับ external service integration
   - `.lsp.json` สำหรับ LSP servers (code intelligence)
   - `monitors/monitors.json` สำหรับ background monitors (watch logs/files แล้ว notify Claude)
   - `bin/` สำหรับ executables ทีเข้า PATH ของ Bash tool
   - `settings.json` สำหรับ default settings (`agent`, `subagentStatusLine`)
3. ถ้ายังไม่ชัด → ใช้ `/ask-me` เพื่อเลือก components

### 3. Create Plugin Structure

> Goal: สร้าง directory structure ตาม Claude plugin convention

1. สร้าง root directory ชื่อ plugin — หรือรัน `claude plugin init <name>` เพื่อ scaffold ลง `~/.claude/skills/<name>` (auto-load เป็น `<name>@skills-dir`)
2. สร้าง `.claude-plugin/plugin.json` manifest ด้วย `name` (kebab-case, เป็น namespace), `description`; `version`/`author` เป็น optional แต่แนะนำ
3. สร้าง directories ตาม components ทีเลือก: `skills/`, `agents/`, `commands/`, `hooks/`, `monitors/`, `bin/`, `scripts/` — ทุก component อยู่ที่ plugin root ห้ามอยู่ใน `.claude-plugin/` (มีแค่ `plugin.json`)
4. สร้าง `.mcp.json`, `.lsp.json`, หรือ `settings.json` ที่ root ถ้ามี components เหล่านั้น
5. ใช้ `${CLAUDE_PLUGIN_ROOT}` สำหรับ portable paths ใน manifest
6. ถ้า plugin มี skill เดียว → วาง `SKILL.md` ที่ root ได้เลย (ใช้ frontmatter `name` เป็น invocation name)

### 4. Implement Components

> Goal: สร้างแต่ละ component ตาม convention

1. สำหรับ `skills/`: สร้าง `skills/<name>/SKILL.md` เป็นหน่วยงานย่อยตาม `/update-devin-global-skills` (ใช้ `$ARGUMENTS` สำหรับรับ input)
2. สำหรับ `agents/`: สร้าง `.md` agent definitions ตามมาตรฐาน `/update-devin-global-subagents`
3. สำหรับ `hooks/`: สร้าง `hooks.json` และ handler scripts ตาม hook types (pre/post tool use, stop, etc.)
4. สำหรับ `commands/`: สร้าง `.md` file ด้วย frontmatter และ instructions
5. สำหรับ `mcpServers`: ระบุ server name, transport, command, args, env ใน `.mcp.json`
6. สำหรับ `.lsp.json`: ระบุ `command`, `args`, `extensionToLanguage` ต่อ language key
7. สำหรับ `monitors/`: สร้าง `monitors.json` array ด้วย `name`, `command`, `description` — แต่ละ stdout line ถูกส่งเป็น notification

### 5. Validate And Test

> Goal: ตรวจสอบ plugin ก่อนใช้

1. รัน `claude --plugin-dir <plugin-path>` เพื่อโหลด plugin ใน Claude Code (รองรับ directory, `.zip` archive, หรือ folder-of-plugins; ใช้ `--plugin-url` สำหรับ hosted zip)
2. รัน `/reload-plugins` ใน session เพื่อรับ changes โดยไม่ต้อง restart
3. ทดสอบ skills ผ่าน `/plugin-name:skill-name` และตรวจ `/plugin` manager Errors tab
4. รัน `claude plugin validate <plugin-path>` ก่อน submit/distribute (`--strict` ถ้าต้องการ fail เมื่อมี warnings)
5. ตรวจสอบ `plugin.json` ด้วย schema ตาม `references/claude-plugin.md`
6. ถ้ามี agents/hooks → ทำ `/deep-validate` สำหรับแต่ละ agent `.md`/`hooks.json`

### 6. Document And Distribute

> Goal: plugin พร้อมแชร์

1. สร้าง `README.md` อธิบาย purpose, components, setup, usage
2. อัปเดต `AGENTS.md` ถ้า plugin เป็นส่วนหนึ่งของ project skills
3. สร้าง `.gitignore` สำหรับ sensitive files
4. ถ้าต้องการ publish → ทำตามคำแนะนำในของ Claude plugin marketplace/team sharing

## Rules

- ใช้ directory layout ตาม `references/claude-plugin.md`
- manifest `plugin.json` ต้องมี `name`, `description`, `version`
- ไม่ hardcode secrets หรือ credentials ใน plugin files
- ใช้ environment variables สำหรับ API keys และ sensitive paths
- สร้างเฉพาะ directories ทีใช้จริง
- ใช้ `SKILL.md` format ตาม `/update-devin-global-skills`

- ใช้ /follow-create-sdk ถ้าจำเป็น
- ใช้ /search-skills ถ้าจำเป็น
- ใช้ /follow-clean-architecture ถ้าจำเป็น

## Expected Outcome

- Claude Code plugin มี `plugin.json` และ components ครบตามทีเลือก
- Plugin โหลดได้ใน Claude Code ด้วย `--plugin-dir`
- Skills/agents/hooks/commands ทำงานตามทีออกแบบ
- มี `README.md` และพร้อม distribute

## Guide

- `references/claude-plugin.md` — official docs, manifest schema, component details
- `/update-devin-global-skills` — SKILL.md format
- `/update-devin-global-subagents` — AGENT.md format
- `/follow-harness-engineering` — hooks, agents, lifecycle
