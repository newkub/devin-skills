---
name: follow-create-codex-plugin
description: สร้าง Codex plugin ด้วย manifest, skills, MCP servers, app wiring, และ marketplace publishing
argument-hint: "[scope]"
related:
  - ask-me
  - follow-clean-architecture
  - follow-create-claude-plugin
  - follow-create-sdk
  - follow-harness-engineering
  - search-skills
  - update-devin-global-skills
  - update-devin-global-subagents
  - review-dependencies
  - report
---
## Goal

สร้าง Codex (ChatGPT Work / OpenAI Codex) plugin ทีสามารถติดตั้งและใช้งานใน ChatGPT หรือ Codex ได้ โดยมี manifest, skills, MCP servers, app wiring, และ lifecycle hooks

## Scope

ใช้สำหรับสร้าง Codex plugin จาก scratch เพื่อขยายความสามารถของ ChatGPT Work และ Codex ด้วย custom skills, MCP tools, และ apps

- Latest: portable Agent Plugins format — root `plugin.json` + `mcp.json` + `skills/` + `extensions.com.openai`; `.codex-plugin/plugin.json` เป็น compatibility fallback (verified 2026-09-12)

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/review-dependencies` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-dependencies` เพื่อ review tech stack, dependencies, และ library design (create codex plugin)
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป (create codex plugin)

### 2. Gather Requirements

> Goal: เข้าใจ purpose และ components ของ plugin

1. ถาม user ถึงชื่อ plugin, เป้าหมาย, target users, และ use case
2. ระบุ components ทีต้องการ:
   - `skills/<name>/SKILL.md` สำหรับ reusable workflows (auto-discovered จาก root `skills/`)
   - `mcp.json` ที่ root สำหรับ bundled MCP servers (portable schema — ระบุ transport `type`)
   - `.app.json` สำหรับ registered app/MCP connection (`plugin_asdk_app...` ID)
   - `hooks/hooks.json` สำหรับ lifecycle events (default discovery — override ผ่าน `extensions.com.openai.hooks`)
   - `assets/` สำหรับ icons, logo, screenshots
3. ถ้ายังไม่ชัด → ใช้ `/ask-me` เพื่อเลือก components

### 3. Create Plugin Structure

> Goal: สร้าง directory structure ตาม portable Agent Plugins convention

1. สร้าง root directory ชื่อ plugin — หรือใช้ `@plugin-creator` (ChatGPT Work) / `$plugin-creator` (Codex CLI) เพื่อ scaffold `.codex-plugin/plugin.json` compat layout
2. สร้าง root `plugin.json` ด้วย `"$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json"`, `name` (kebab-case), `version`, `description`, `author`, `license`, `keywords`, `homepage`, `repository`
3. สร้าง `skills/` ถ้ามี skills (ไม่ต้อง declare `skills` field — auto-discovered)
4. สร้าง `mcp.json` ถ้ามี bundled MCP server (declare `"$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json"` และ transport `type` เช่น `streamable-http`)
5. สร้าง `.app.json` ถ้าเชื่อมต่อกับ registered MCP server/app
6. เพิ่ม `extensions.com.openai` ใน root manifest สำหรับ `apps`, `hooks`, `interface` — ถ้าใช้ `.codex-plugin/plugin.json` (compat) ให้ declare `apps`/`hooks`/`interface` ในนั้นแทน (อย่าใช้ทั้งสองอย่าง — inline extension จะ override overlay ทั้งหมด ไม่ merge)

### 4. Implement Components

> Goal: สร้างแต่ละ component ตาม convention

1. สำหรับ `skills/`: สร้าง `skills/<name>/SKILL.md` เป็นหน่วยงานย่อยตาม `/update-devin-global-skills`
2. สำหรับ `mcp.json`: ระบุ named entry ใน `mcpServers` พร้อม transport `type` (`streamable-http` + `url` สำหรับ remote)
3. สำหรับ `.app.json`: ระบุ `plugin_asdk_app...` ID ที register ไว้ใน ChatGPT developer mode
4. กำหนด `interface` ใน `extensions.com.openai` สำหรับ `displayName`, `shortDescription`, `longDescription`, `developerName`, `category`, `capabilities`, `defaultPrompt`, `brandColor`, `composerIcon`, `logo`, `screenshots`
5. สำหรับ hooks: สร้าง `hooks/hooks.json` (discovered โดย default) หรือชี้ path ผ่าน `extensions.com.openai.hooks` — hook commands รับ env `PLUGIN_ROOT` และ `PLUGIN_DATA`

### 5. Register And Test

> Goal: ตรวจสอบ plugin ใน ChatGPT/Codex

1. เปิด ChatGPT → Settings → Security and login → Developer mode; ถ้ามี MCP server → register ที่ chatgpt.com/plugins แล้ว copy `plugin_asdk_app...` ID
2. สร้าง local marketplace: repo → `$REPO_ROOT/.agents/plugins/marketplace.json`, personal → `~/.agents/plugins/marketplace.json` (entry ต้องมี `source.path` ขึ้นต้น `./`, `policy.installation`, `policy.authentication`, `category`)
3. หรือใช้ `codex plugin marketplace add <source>` (GitHub shorthand, git URL, หรือ local path; `list`/`upgrade`/`remove` เพื่อจัดการ)
4. Restart ChatGPT desktop app → ติดตั้ง plugin จาก Plugins Directory (เลือก marketplace source)
5. Enable/disable ต่อ repo ผ่าน `.codex/config.toml` `[plugins."name@marketplace"] enabled = true`
6. เปิด Work chat พิมพ์ `@` เพื่อเลือก plugin และทดสอบ tool/skill

### 6. Document And Distribute

> Goal: plugin พร้อมแชร

1. สร้าง `README.md` อธิบาย purpose, components, setup, usage
2. อัปเดต `AGENTS.md` ถ้า plugin เป็นส่วนหนึ่งของ project skills
3. สร้าง `.gitignore` สำหรับ sensitive files
4. ถ้าต้องการ publish → ทำตาม OpenAI plugin marketplace / workspace marketplace guidelines

## Rules

- ใช้ directory layout ตาม `references/codex-plugin.md` — portable `plugin.json`, `mcp.json`, `skills/` อยู่ที่ plugin root เท่านั้น
- manifest `plugin.json` ต้องมี `$schema` (agent-plugins 1.0.0), `name`, `description`; `version`/`author` แนะนำ
- paths ใน `extensions.com.openai` ต้องขึ้นต้น `./` relative จาก plugin root และอยู่ใน root เท่านั้น
- ไม่ hardcode secrets หรือ credentials ใน plugin files
- ใช้ environment variables สำหรับ API keys และ app IDs
- สร้างเฉพาะ components ทีใช้จริง
- ใช้ `SKILL.md` format ตาม `/update-devin-global-skills`
- plugin-bundled hooks เป็น non-managed — Codex จะ skip จนกว่า user trust hook definition

- ใช้ /follow-clean-architecture ถ้าจำเป็น
- ใช้ /follow-create-sdk ถ้าจำเป็น
- ใช้ /search-skills ถ้าจำเป็น
- ใช้ /report ถ้าจำเป็น

## Expected Outcome

- Codex plugin มี portable `plugin.json` (หรือ `.codex-plugin/plugin.json` compat) และ components ครบตามทีเลือก
- Plugin ติดตั้งได้ผ่าน local/personal marketplace ใน ChatGPT desktop หรือ Codex
- Skills/MCP tools ทำงานตามทีออกแบบ
- มี `README.md` และพร้อม distribute

## Guide

- `references/codex-plugin.md` — official docs, manifest schema, component details
- `/update-devin-global-skills` — SKILL.md format
- `/update-devin-global-subagents` — AGENT.md format
- `/follow-harness-engineering` — hooks, agents, lifecycle
- `/follow-create-claude-plugin` — ถ้าต้องการ port ไป Claude plugin ในอนาคต
