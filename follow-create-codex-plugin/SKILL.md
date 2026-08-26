---
name: follow-create-codex-plugin
description: สร้าง Codex plugin ด้วย manifest, skills, MCP servers, app wiring, และ marketplace publishing
related:
  - follow-create-sdk
  - follow-create-claude-plugin
  - follow-create-devin-skills
  - follow-create-devin-subagents
  - ask-me
  - search-skills
  - follow-harness-engineering
  - follow-clean-architecture
  - report-table
---

## Goal

สร้าง Codex (ChatGPT Work / OpenAI Codex) plugin ทีสามารถติดตั้งและใช้งานใน ChatGPT หรือ Codex ได้ โดยมี manifest, skills, MCP servers, app wiring, และ lifecycle hooks

## Scope

ใช้สำหรับสร้าง Codex plugin จาก scratch เพื่อขยายความสามารถของ ChatGPT Work และ Codex ด้วย custom skills, MCP tools, และ apps

## Execute

### 1. Gather Requirements

> Goal: เข้าใจ purpose และ components ของ plugin

1. ถาม user ถึงชื่อ plugin, เป้าหมาย, target users, และ use case
2. ระบุ components ทีต้องการ:
   - `skills/` สำหรับ reusable workflows
   - `mcpServers` สำหรับ external tools/APIs
   - `.app.json` สำหรับ registered app/MCP connection
   - `hooks` สำหรับ lifecycle events
3. ถ้ายังไม่ชัด → ใช้ `/ask-me` เพื่อเลือก components

### 2. Create Plugin Structure

> Goal: สร้าง directory structure ตาม Codex plugin convention

1. สร้าง root directory ชื่อ plugin
2. สร้าง `.codex-plugin/plugin.json` manifest ด้วย `name`, `version`, `description`, `author`, `license`, `keywords`
3. สร้าง `skills/` ถ้ามี skills
4. สร้าง `.mcp.json` ถ้ามี MCP server
5. สร้าง `.app.json` ถ้าเชื่อมต่อกับ ChatGPT app
6. สร้าง `hooks` field ใน manifest ถ้าจำเป็น

### 3. Implement Components

> Goal: สร้างแต่ละ component ตาม convention

1. สำหรับ `skills/`: สร้าง `SKILL.md` เป้นหน่วยงานย่อยตาม `/follow-create-devin-skills`
2. สำหรับ `mcpServers`: ระบุ `name`, `command`, `args`, `env` ใน `.mcp.json`
3. สำหรับ `.app.json`: ระบุ `plugin_asdk_app...` ID ที register ไว้
4. กำหนด `interface` ใน manifest สำหรับ display name, descriptions, icons, brand color, default prompts
5. เพิ่ม `homepage`, `repository`, `license` ใน manifest

### 4. Register And Test

> Goal: ตรวจสอบ plugin ใน ChatGPT/Codex

1. เปิด ChatGPT → Settings → Developer mode
2. เพิ่ม MCP server หรือ app connection ตาม `.mcp.json`/`.app.json`
3. ใช้ `@plugin-creator` หรือสร้าง personal marketplace entry
4. ติดตั้ง plugin จาก Plugins Directory
5. เปิด Work chat พิมพ์ `@` เพื่อเลือก plugin และทดสอบ tool

### 5. Document And Distribute

> Goal: plugin พร้อมแชร

1. สร้าง `README.md` อธิบาย purpose, components, setup, usage
2. อัปเดต `AGENTS.md` ถ้า plugin เป็นส่วนหนึ่งของ project skills
3. สร้าง `.gitignore` สำหรับ sensitive files
4. ถ้าต้องการ publish → ทำตาม OpenAI plugin marketplace / workspace marketplace guidelines

## Rules

- ใช้ directory layout ตาม `references/codex-plugin.md`
- manifest `plugin.json` ต้องมี `name`, `version`, `description`, `author`
- ไม่ hardcode secrets หรือ credentials ใน plugin files
- ใช้ environment variables สำหรับ API keys และ app IDs
- สร้างเฉพาะ components ทีใช้จริง
- ใช้ `SKILL.md` format ตาม `/follow-create-devin-skills`

## Expected Outcome

- Codex plugin มี `plugin.json` และ components ครบตามทีเลือก
- Plugin ติดตั้งได้ใน ChatGPT Work หรือ Codex
- Skills/MCP tools ทำงานตามทีออกแบบ
- มี `README.md` และพร้อม distribute

## Guide

- `references/codex-plugin.md` — official docs, manifest schema, component details
- `/follow-create-devin-skills` — SKILL.md format
- `/follow-create-devin-subagents` — AGENT.md format
- `/follow-harness-engineering` — hooks, agents, lifecycle
- `/follow-create-claude-plugin` — ถ้าต้องการ port ไป Claude plugin ในอนาคต
