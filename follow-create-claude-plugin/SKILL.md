---
name: follow-create-claude-plugin
description: สร้าง Claude Code plugin ด้วย manifest, skills, agents, hooks, และ MCP servers
related:
  - follow-create-sdk
  - update-devin-global-skills
  - update-devin-global-subagents
  - ask-me
  - search-skills
  - follow-harness-engineering
  - follow-my-tech-stack
  - review-techstack
  - follow-clean-architecture
---

## Goal

สร้าง Claude Code plugin ทีสามารถติดตั้งและใช้งานกับ Claude Code ได้ โดยมี manifest, skills, agents, hooks, MCP servers และ slash commands ตามมาตรฐานของ Claude

## Scope

ใช้สำหรับสร้าง Claude Code plugin จาก scratch เพื่อขยายความสามารถของ Claude ด้วย custom skills, agents, hooks, MCP servers หรือ slash commands

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Gather Requirements

> Goal: เข้าใจ purpose และ components ของ plugin

1. ถาม user ถึงชื่อ plugin, เป้าหมาย, target users, และ use case
2. ระบุ components ทีต้องการ:
   - `skills/` สำหรับ knowledge หรือ user-initiated actions
   - `agents/` สำหรับ autonomous tasks
   - `hooks/` สำหรับ event-driven automation
   - `commands/` สำหรับ slash commands (legacy แต่ยังใช้ได้)
   - `mcpServers` ใน `.mcp.json` สำหรับ external service integration
3. ถ้ายังไม่ชัด → ใช้ `/ask-me` เพื่อเลือก components

### 3. Create Plugin Structure

> Goal: สร้าง directory structure ตาม Claude plugin convention

1. สร้าง root directory ชื่อ plugin
2. สร้าง `.claude-plugin/plugin.json` manifest ด้วย `name`, `description`, `version`, `author`
3. สร้าง directories ตาม components ทีเลือก: `skills/`, `agents/`, `commands/`, `hooks/`, `scripts/`
4. สร้าง `.mcp.json` ถ้ามี MCP servers
5. ใช้ `${CLAUDE_PLUGIN_ROOT}` สำหรับ portable paths ใน manifest

### 4. Implement Components

> Goal: สร้างแต่ละ component ตาม convention

1. สำหรับ `skills/`: สร้าง `SKILL.md` เป้นหน่วยงานย่อยตาม `/update-devin-global-skills`
2. สำหรับ `agents/`: สร้าง `AGENT.md` ตามมาตรฐาน `/update-devin-global-subagents`
3. สำหรับ `hooks/`: สร้าง `hooks.json` และ handler scripts ตาม hook types (pre/post tool use, stop, etc.)
4. สำหรับ `commands/`: สร้าง `.md` file ด้วย frontmatter และ instructions
5. สำหรับ `mcpServers`: ระบุ server name, transport, command, args, env ใน `.mcp.json`

### 5. Validate And Test

> Goal: ตรวจสอบ plugin ก่อนใช้

1. รัน `claude --plugin-dir <plugin-path>` เพื่อโหลด plugin ใน Claude Code
2. ทดสอบ `skills/commands` ใน Claude Code chat
3. ตรวจสอบ `plugin.json` ด้วย schema ตาม `references/claude-plugin.md`
4. ถ้ามี agents/hooks → ทำ `/deep-validate` สำหรับแต่ละ `AGENT.md`/`hooks.json`

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
