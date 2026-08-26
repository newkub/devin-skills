---
name: list-devin-global-mcp
description: List configured global MCP servers and their tools
---

## Goal

แสดงรายการ MCP servers ที่ตั้งค่าไว้ทั่ว global พร้อม tools ที่มี

## Scope

- อ่าน `C:\Users\Veerapong\.codeium\windsurf\mcp_config.json`
- List MCP servers จาก config
- List tools ของแต่ละ MCP server ด้วย `mcp_list_tools`
- รายงานสถานะและแหล่งที่มา

## Execute

### 1. Load MCP Config

> Goal: อ่าน config ไฟล์

1. อ่าน `C:\Users\Veerapong\.codeium\windsurf\mcp_config.json`
2. ถ้าไฟล์ไม่มี → report ว่าไม่มี global MCP config
3. ตรวจ JSON syntax
4. แยก `mcpServers` object

### 2. List Servers

> Goal: แสดงรายชื่อ servers

1. ใช้ `mcp_list_servers` เพื่อดู live servers
2. เปรียบเทียบกับ servers ใน `mcp_config.json`
3. ระบุชื่อ server, command, args, env
4. บันทึก enabled/disabled ถ้ามี

### 3. List Tools

> Goal: แสดง tools ของแต่ละ server

1. ใช้ `mcp_list_tools` สำหรับแต่ละ server
2. ระบุ tool name และ description
3. เรียงลำดับตาม server

### 4. Report

> Goal: สรุปผล

1. ทำ `/report-markdown-table` แสดง server, command, tools count, status
2. ถ้าไม่มี server → report ว่า global MCP ยังไม่ถูกตั้งค่า
3. ทำ `/suggest-next-action` ถ้าต้องแก้ไข

## Rules

### 1. Read-Only

- ไม่แก้ไข `mcp_config.json`
- ถ้าต้องแก้ → ใช้ `/edit-devin-global-mcp`

### 2. Privacy

- ไม่ expose secrets, keys, tokens ในรายงาน
- ถ้า `env` มี sensitive values → แสดงเป็น `<redacted>`

### 3. Validation

- ตรวจ JSON syntax ก่อน report
- ถ้า config ไม่มี `mcpServers` → report ว่า format ผิดหรือไม่มี

### 4. Formatting

- ห้ามใช้ `**` (bold markers)
- ใช้ backticks สำหรับ file paths, server names, tool names
- รายงานเป็นตารางด้วย `/report-markdown-table`

## Expected Outcome

- รายการ MCP servers ทั้งหมดที่ตั้งค่าไว้
- tools ของแต่ละ server
- สถานะและแหล่ง config
- รายงานในรูปแบบตารางพร้อม action ถัดไป
