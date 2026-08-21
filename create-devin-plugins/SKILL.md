---
name: create-devin-plugins
description: สร้าง Devin CLI plugin ที่รวม skills, rules, agents, hooks และ MCP servers
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

สร้าง Devin CLI plugin ที่ bundling skills, rules, agents, hooks, และ MCP servers ตามมาตรฐาน Devin CLI plugins documentation

## Scope

ใช้สำหรับสร้าง plugin ใหม่หรือปรับปรุง plugin ที่มีอยู่ ให้ติดตั้งและแชร์ผ่าน GitHub repo, git URL, หรือ local folder

## Execute

### 1. Plan Plugin Scope

วางแผนว่า plugin ทำอะไร

> Goal: plugin มี purpose ชัดเจน และไม่ซ้ำซ้อนกับ existing plugins

1. ระบุ problem ที่ plugin แก้หรือช่องว่างที่เติม
2. ตั้งชื่อ plugin ให้ unique และสื่อความหมาย
3. ตัดสินใจว่า plugin รวม skills ประเภทใด: review, setup, architecture, tools
4. ระบุ target consumers: project, team, หรือ public
5. ตรวจสอบว่าไม่ซ้ำชื่อกับ plugins ที่ติดตั้งแล้ว

### 2. Create Plugin Directory

สร้างโครงสร้าง plugin

> Goal: plugin structure ถูกต้องตาม Devin CLI spec

1. สร้าง root directory `<plugin-name>/`
2. สร้าง `.devin-plugin/plugin.json` สำหรับ manifest
3. สร้าง `skills/` และ skill ย่อยๆ ตาม `/follow-devin-skills-md`
4. สร้าง `AGENTS.md` ถ้าต้องการ always-on rules
5. สร้าง `rules/` ถ้าต้องการ triggered rules
6. สร้าง `agents/` ถ้าต้องการ custom subagents
7. สร้าง `hooks.json` ถ้าต้องการ lifecycle hooks
8. สร้าง `mcp_config.json` ถ้าต้องการ MCP servers

### 3. Write Plugin Manifest

เขียน `.devin-plugin/plugin.json`

> Goal: manifest valid และครบถ้วน

1. ใส่ `name` ที่ unique (จำเป็น) เป็น namespace สำหรับ `/<name>:<skill>`
2. ใส่ `version` ตาม semantic versioning
3. ใส่ `description` กระชับ
4. ใส่ `author` ในรูปแบบ `{ name, email }`
5. ใส่ `homepage`, `repository`, `license`, `keywords` ถ้ามี
6. ระบุ `skills` path ถ้า skill directories ไม่อยู่ใน default `skills/`
7. ระบุ `mcpServers` ถ้ามี MCP servers
8. ระบุ `requiredPlugins`, `optionalPlugins`, `forbiddenPlugins` ตาม governance policy

### 4. Create Skills

สร้าง skills ภายใน plugin

> Goal: skills ทำงานได้จริงและติดตั้งผ่าน plugin ได้

1. ทำตาม `/follow-devin-skills-md` สำหรับแต่ละ skill
2. วาง `SKILL.md` ใน `skills/<skill-name>/SKILL.md`
3. ตรวจสอบว่า skill name ไม่ซ้ำภายใน plugin
4. ทดสอบ invoke ด้วย `/<plugin-name>:<skill-name>`

### 5. Add Rules And Agents

เพิ่ม rules และ custom subagents ถ้าจำเป็น

> Goal: rules และ agents ถูกต้องตาม spec

1. เขียน `AGENTS.md` เป็น always-on rule ถ้าต้องการ
2. สร้าง `rules/<rule-name>.md` สำหรับ triggered rules พร้อม `trigger` frontmatter
3. สร้าง `agents/<agent-name>.md` หรือ `agents/<agent-name>/AGENT.md` สำหรับ custom subagents
4. ตรวจสอบว่า agents load ได้เฉพาะใน local Devin agents (CLI และ Devin Desktop)

### 6. Add Hooks And MCP

เพิ่ม lifecycle hooks และ MCP servers

> Goal: hooks และ MCP ประกาศถูกต้อง

1. สร้าง `hooks.json` สำหรับ lifecycle hooks ถ้าจำเป็น
2. สร้าง `mcp_config.json` สำหรับ MCP servers ด้วย `mcpServers` map
3. ตรวจสอบว่า MCP servers ไม่ expose secrets ใน plugin repository

### 7. Test Plugin Locally

ทดสอบ plugin ก่อน publish

> Goal: plugin ติดตั้งและทำงานได้

1. รัน `devin plugins install ./<plugin-name>` จาก local path
2. รัน `devin plugins list` เพื่อตรวจสอบว่าติดตั้งสำเร็จ
3. รัน `devin plugins info <plugin-name>` เพื่อดู skills และ dependencies
4. ทดสอบ invoke skill ด้วย `/<plugin-name>:<skill-name>`
5. แก้ไข skill แล้วทดสอบใหม่ โดยไม่ต้อง `update` เพราะ local plugin linked

### 8. Publish And Manage

publish plugin และจัดการ versions

> Goal: plugin พร้อมใช้งานและ maintain ได้

1. push plugin repository ไปยัง GitHub หรือ git host
2. ติดตั้งจาก remote ด้วย `devin plugins install owner/repo`
3. รัน `devin plugins update <plugin-name>` เมื่อมีการเปลี่ยนแปลง
4. รัน `devin plugins remove <plugin-name>` ถ้าต้องการถอนการติดตั้ง
5. ทำ `/update-reference` ถ้ามี project อ้างอิง plugin

## Rules

### 1. Plugin Structure

- `.devin-plugin/plugin.json` จำเป็น และต้องมี `name` ที่ unique
- `skills/` วาง skill files ตาม `/follow-devin-skills-md`
- `AGENTS.md` optional สำหรับ always-on rules
- `rules/` optional สำหรับ triggered rules
- `agents/` optional สำหรับ custom subagents (local only)
- `hooks.json` optional สำหรับ lifecycle hooks
- `mcp_config.json` optional สำหรับ MCP servers

### 2. Manifest Fields

- `name` ต้อง unique ระหว่าง installed plugins
- `version` ใช้ semantic versioning
- `description` กระชับ
- `author` ใช้ `{ name, email }`
- `requiredPlugins` สำหรับ dependencies ที่ต้องติดตั้ง auto
- `optionalPlugins` สำหรับ allow-list endorsements
- `forbiddenPlugins` สำหรับ deny-list และ glob patterns
- `skills` ระบุ path ถ้าไม่อยู่ใน `skills/`
- `mcpServers` ระบุ path หรือ inline map

### 3. Dependency Governance

- deny wins: plugin ถูก block ถ้ามีใคร forbid
- self-override: plugin ของตัวเอง exempt จาก forbidden ของตัวเอง
- no cross-scope re-permitting: ไม่อนุญาติให้ plugin หนึ่ง override forbidden ของ plugin อื่น
- required plugins ถูก block ทั้ง plugin install จะล้มเหลว

### 4. Safety And Security

- ไม่ใส่ secrets หรือ credentials ใน `mcp_config.json` หรือ skill files
- `forbiddenPlugins` อย่าใช้ `*` โดยไม่ระบุ `optionalPlugins` หรือ `requiredPlugins` ที่จำเป็น
- ตรวจสอบ permissions ของ skills ก่อน bundle เข้า plugin
- local path dependencies ต้องเป็น paths ที่ trusted

### 5. Versioning And Release

- ใช้ semantic versioning ใน `plugin.json`
- update `version` เมื่อมี breaking changes
- ระบุ `license` ถ้า publish สาธารณะ
- รักษา backward compatibility เมื่อได้ยกเว้น major version bump

## Expected Outcome

- Plugin directory สร้างถูกต้องตาม Devin CLI spec
- `plugin.json` valid และมี `name` ที่ unique
- Skills ทำงานได้และ invoke ด้วย `/<plugin>:<skill>`
- Rules, agents, hooks, MCP ประกาศถูกต้อง (ถ้ามี)
- Plugin ติดตั้งจาก local และ remote ได้
- Dependencies และ governance ชัดเจน
