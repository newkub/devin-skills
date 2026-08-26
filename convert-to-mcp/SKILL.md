---
name: convert-to-mcp
description: แปลง API, script, หรือ tool เป้น MCP server configuration
---

## Goal

แปลง API, script, CLI tool, หรือ service เป้น MCP server configuration พร้อม tools และ metadata

## Scope

ใช้สำหรับสร้างหรืออัปเดต `mcp_config.json` หรือ MCP server package จาก existing tool หรือ API

## Execute

### 1. Analyze Source

> Goal: ทำความเข้าใจ tool/API ทีจะแปลง

1. ระบุ source: API endpoints, CLI commands, script functions
2. อ่าน docs หรือ OpenAPI spec ถ้ามี
3. ระบุ inputs, outputs, errors
4. ระบุ authentication ถ้ามี

### 2. Map To MCP Tools

> Goal: แปลง operations เป้น MCP tools

1. แต่ละ operation เป้น `tool` ใน MCP
2. กำหนด `name`, `description`, `inputSchema`
3. `inputSchema` ใช้ JSON Schema สำหรับ parameters
4. ระบุ `output` format

### 3. Build MCP Config

> Goal: สร้าง mcp_config หรือ server package

1. ใช้ `edit-devin-global-mcp` ถ้าเป้น global MCP
2. สร้าง `mcp_config.json` หรือ `mcp-server/` ใน project
3. ระบุ `command`, `args`, `env` สำหรับ server
4. ระบุ `tools` array พร้อม schemas

### 4. Validate

> Goal: ตรวจสอบ MCP config

1. ตรวจ JSON Schema ของ tools
2. ตรวจสอบว่า command รันได้
3. ทดสอบ tool ด้วย sample inputs
4. ตรวจ security: ไม่ expose secrets

### 5. Output

> Goal: ส่งมอบ MCP configuration

1. ใช้ `convert-to-json` ถ้า config ไม่เป้น JSON
2. บันทึกลง `mcp_config.json` หรือ `mcp_config.json`
3. ใช้ `/report-table` แสดง tools, inputs, outputs

## Rules

### 1. Tool Design

- ชื่อ tool ชัดเจน ใช้ `lowercase_underscore` หรือ `kebab-case`
- description สื่อความหมาย
- inputSchema ครบถ้วน ระบุ required fields

### 2. Security

- ไม่ hardcode secrets ใน config
- ใช้ env variables สำหรับ keys
- ตรวจสอบ permissions ของ tool

### 3. Deterministic

- ทุก tool ต้องมี input/output ชัดเจน
- ไม่มี side effect ที่ไม่คาดคิด
- ระบุ errors และ edge cases

## Expected Outcome

- MCP server config ที่ valid
- tools พร้อม JSON Schema
- command/args/env ถูกต้อง
- ไม่มี secrets รั่วไหล
