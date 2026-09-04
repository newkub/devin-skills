---
name: update-devin-project-mcp
description: ตั้งค่าและอัปเดต MCP servers ใน .devin/mcp_config.json ตาม project requirements
argument-hint: "[server-or-config]"
related:
  - update-dot-devin
  - follow-create-mcp
  - update-devin-global-skills
  - report-table
  - resolve-errors
---

## Goal

ตั้งค่าและอัปเดต MCP servers สำหรับ project ใน `.devin/mcp_config.json` ตาม project requirements

## Scope

ใช้เมื่อ project ต้องการ integrate กับ MCP servers เช่น `agent-browser`, `ast-grep`, หรือ custom MCP โดยสร้าง/แก้ไข `.devin/mcp_config.json`

## Execute

### 1. Detect MCP Needs

> Goal: รู้ว่าต้องใช้ MCP อะไร

1. อ่าน `package.json`, `AGENTS.md`
2. ระบุ tools/services ทีต้องการ MCP เช่น browser, search, database, github
3. ตรวจ global `mcp_config.json` ที่ `%APPDATA%\devin\mcp_config.json`
4. ระบุ servers ทีต้อง register

### 2. Create Or Update .devin/mcp_config.json

> Goal: มี config ถูกต้อง

1. สร้าง `C:\...\project\.devin\mcp_config.json` ถ้ายังไม่มี
2. ใช้ schema: `{ "mcpServers": { "<name>": { "command": "...", "args": [...], "env": {...} } } }`
3. เพิ่ม/อัปเดต servers:
   - `agent-browser`: `agent-browser mcp --tools core`
   - `ast-grep`: `npx @ast-grep/cli` (ถ้ามี)
   - `github`: `npx -y @github/github-mcp-server`
4. ใช้ `npx -y` สำหรับ package-based servers
5. ใช้ `bun` ถ้า project ใช้ bun

### 3. Register Servers In Global Config

> Goal: register ใน global config ถ้าจำเป็น

1. ถ้าสร้าง custom MCP server → อัปเดต `%APPDATA%\devin\mcp_config.json`
2. ใช้ absolute path หรือ package name
3. อย่า commit secrets หรือ tokens

### 4. Validate

> Goal: ยื่นยันว่า MCP ทำงาน

1. ตรวจ JSON syntax
2. รัน `agent-browser mcp --tools core` ถ้ามี
3. ตรวจ logs ว่า server start ได้
4. ถ้า fail → `/resolve-errors`

### 5. Report

> Goal: สรุปผล

1. ทำ `/report-table` แสดง servers, command, status
2. ทำ `/suggest-next-action`

## Rules

### 1. No Secrets

- ไม่ใส่ tokens, keys ลงไฟล์ config
- ใช้ env vars หรือ secret manager
- ใช้ `.env` แล้วอ้างอิง

### 2. Local First

- ใช้ local packages หรือ `npx -y` ก่อน
- ถ้าต้อง install global → ระบุให้ชัดเจน

### 3. Validate JSON

- ต้องมี `mcpServers` object
- แต่ละ server มี `command`, `args`, `env`
- ตรวจ comma, quotes, brackets

### 4. Document

- บันทึกวิธี start server ใน `README.md` หรือ `AGENTS.md`
- ระบุ servers ทีต้อง manual setup

## Expected Outcome

- `.devin/mcp_config.json` ถูกต้อง
- MCP servers start ได้
- ไม่มี secrets ใน config
- Document ครบถ้วน
