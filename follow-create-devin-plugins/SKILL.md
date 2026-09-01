---
name: follow-create-devin-plugins
description: สร้าง Devin CLI plugin ที่รวม skills, rules, agents, hooks และ MCP servers
argument-hint: "[plugin-name]"
related:
  - follow-create-sdk
  - update-devin-global-skills
  - update-devin-global-subagents
  - follow-my-tech-stack
  - review-techstack
  - ship
  - update-references
---
## Goal

สร้าง Devin CLI plugin ที่ bundling skills, rules, agents, hooks, และ MCP servers ตามมาตรฐาน Devin CLI plugins documentation

## Scope

ใช้สำหรับสร้าง plugin ใหม่หรือปรับปรุง plugin ที่มีอยู่ ให้ติดตั้งและแชร์ผ่าน GitHub repo, git URL, หรือ local folder

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Plan Plugin Scope

> Goal: วางแผนว่า plugin ทำอะไร

1. ระบุ problem ที่ plugin แก้หรือช่องว่างที่เติม
2. ตั้งชื่อ plugin ให้ unique และสื่อความหมาย
3. ตัดสินใจว่า plugin รวม skills ประเภทใด: review, setup, architecture, tools
4. ระบุ target consumers: project, team, หรือ public
5. ตรวจสอบว่าไม่ซ้ำชื่อกับ plugins ที่ติดตั้งแล้ว

### 3. Create Plugin Directory

> Goal: สร้างโครงสร้าง plugin

1. สร้าง root directory `<plugin-name>/`
2. สร้าง `.devin-plugin/plugin.json` สำหรับ manifest
3. สร้าง `skills/` และ skill ย่อยๆ ตาม `/update-devin-global-skills`
4. สร้าง `AGENTS.md` ถ้าต้องการ always-on rules
5. สร้าง `rules/` ถ้าต้องการ triggered rules
6. สร้าง `agents/` ถ้าต้องการ custom subagents
7. สร้าง `hooks.json` ถ้าต้องการ lifecycle hooks
8. สร้าง `mcp_config.json` ถ้าต้องการ MCP servers

### 4. Write Plugin Manifest

> Goal: เขียน `.devin-plugin/plugin.json`

1. ใส่ `name` ที่ unique (จำเป็น) เป็น namespace สำหรับ `/<name>:<skill>`
2. ใส่ `version` ตาม semantic versioning
3. ใส่ `description` กระชับ
4. ใส่ `author` ในรูปแบบ `{ name, email }`
5. ใส่ `homepage`, `repository`, `license`, `keywords` ถ้ามี
6. ระบุ `skills` path ถ้า skill directories ไม่อยู่ใน default `skills/`
7. ระบุ `mcpServers` ถ้ามี MCP servers
8. ระบุ `requiredPlugins`, `optionalPlugins`, `forbiddenPlugins` ตาม governance policy

### 5. Create Skills

> Goal: สร้าง skills ภายใน plugin

1. ทำตาม `/update-devin-global-skills` สำหรับแต่ละ skill
2. วาง `SKILL.md` ใน `skills/<skill-name>/SKILL.md`
3. ตรวจสอบว่า skill name ไม่ซ้ำภายใน plugin
4. ทดสอบ invoke ด้วย `/<plugin-name>:<skill-name>`

### 6. Add Rules And Agents

> Goal: เพิ่ม rules และ custom subagents ถ้าจำเป็น

1. เขียน `AGENTS.md` เป็น always-on rule ถ้าต้องการ
2. สร้าง `rules/<rule-name>.md` สำหรับ triggered rules พร้อม `trigger` frontmatter
3. สร้าง `agents/<agent-name>.md` หรือ `agents/<agent-name>/AGENT.md` สำหรับ custom subagents
4. ตรวจสอบว่า agents load ได้เฉพาะใน local Devin agents (CLI และ Devin Desktop)

### 7. Add Hooks And MCP

> Goal: เพิ่ม lifecycle hooks และ MCP servers

1. สร้าง `hooks.json` สำหรับ lifecycle hooks ถ้าจำเป็น
2. สร้าง `mcp_config.json` สำหรับ MCP servers ด้วย `mcpServers` map
3. ตรวจสอบว่า MCP servers ไม่ expose secrets ใน plugin repository

### 8. Test Plugin Locally

> Goal: ทดสอบ plugin ก่อน publish

1. รัน `devin plugins install ./<plugin-name>` จาก local path
2. รัน `devin plugins list` เพื่อตรวจสอบว่าติดตั้งสำเร็จ
3. รัน `devin plugins info <plugin-name>` เพื่อดู skills และ dependencies
4. ทดสอบ invoke skill ด้วย `/<plugin-name>:<skill-name>`
5. แก้ไข skill แล้วทดสอบใหม่ โดยไม่ต้อง `update` เพราะ local plugin linked

### 9. Publish And Manage

> Goal: publish plugin และจัดการ versions

1. push plugin repository ไปยัง GitHub หรือ git host
2. ติดตั้งจาก remote ด้วย `devin plugins install owner/repo`
3. รัน `devin plugins update <plugin-name>` เมื่อมีการเปลี่ยนแปลง
4. รัน `devin plugins remove <plugin-name>` ถ้าต้องการถอนการติดตั้ง
5. ทำ `/update-references` ถ้ามี project อ้างอิง plugin

### Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Plugin Structure

- `.devin-plugin/plugin.json` จำเป็น และต้องมี `name` ที่ unique
- `skills/` วาง skill files ตาม `/update-devin-global-skills`
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

- ใช้ /follow-create-sdk ถ้าจำเป็น
- ใช้ /update-devin-global-subagents ถ้าจำเป็น

## Expected Outcome

- Plugin directory สร้างถูกต้องตาม Devin CLI spec
- `plugin.json` valid และมี `name` ที่ unique
- Skills ทำงานได้และ invoke ด้วย `/<plugin>:<skill>`
- Rules, agents, hooks, MCP ประกาศถูกต้อง (ถ้ามี)
- Plugin ติดตั้งจาก local และ remote ได้
- Dependencies และ governance ชัดเจน

