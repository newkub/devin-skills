---
name: create-devin-global-mcp
description: สร้าง MCP server ใหม่แล้ว register ลง devin global mcp_config.json
argument-hint: "[scope]"
allowed-tools:
  - exec
  - read
  - write
  - edit
  - skill
  - ask_user_question
  - todo_write
  - mcp_list_servers
  - mcp_call_tool
related:
  - follow-create-mcp
  - update-devin-global-mcp
  - follow-my-tech-stack
  - review-techstack
  - deep-validate
  - ship
---

## Goal

สร้าง MCP server ใหม่ด้วย Rust หรือ TypeScript แล้ว register ลง `%APPDATA%\devin\mcp_config.json` เพื่อให้ Devin ใช้งานได้

## Scope

ใช้เมื่อต้องการสร้าง MCP server ใหม่และให้ Devin มองเห็นใน global config ทันที

- รัน `/follow-create-mcp` เพื่อสร้าง server
- รัน `/update-devin-global-mcp` เพื่อ register ลง global config
- ทดสอบ server ด้วย `mcp_list_servers` และ `mcp_call_tool`
- ไม่ modify project `mcp_config.json` — ใช้ `/update-devin-project-mcp` สำหรับ project scope

## Execute

### 1. Review And Decide

> Goal: ตรวจ tech stack และสรุป scope

1. ทำ `/follow-my-tech-stack` เพื่อดู tech stack ปัจจุบัน
2. ทำ `/review-techstack` เพื่อ review dependencies
3. บันทึกชื่อ server, transport, tools/resources ทีต้องการ

### 2. Create MCP Server

> Goal: สร้าง server ตาม stack ทีเลือก

1. ทำ `/follow-create-mcp` ด้วย scope ทีกำหนด
2. บันทึก path, command, args ของ server หลังสร้าง
3. ทำ `/deep-validate` เบื้องต้นกับ server project

### 3. Register In Devin Global Config

> Goal: register ลง `%APPDATA%\devin\mcp_config.json`

1. ทำ `/update-devin-global-mcp` ด้วย action `add`
2. ระบุ `command`, `args`, และ `env` ให้ครบถ้วน
3. ตรวจสอบว่าไฟล์มี root key `mcpServers` และ server entry ถูกต้อง
4. สำรอง config ก่อนแก้ไข

### 4. Test And Verify

> Goal: ยืนยันว่า server ทำงานกับ Devin

1. รัน `mcp_list_servers` เพื่อตรวจว่า server ปรากฏ
2. ใช้ `mcp_call_tool` กับ server เพื่อ list tools หรือ health check
3. ถ้า tools ไม่โหลด → `/resolve-errors` แล้วแก้ไข

### 5. Ship

> Goal: ส่งมอบ

1. ทำ `/deep-validate` กับทั้ง project และ skill repo
2. ทำ `/ship` สำหรับ server project
3. รายงานชื่อ server, command, และสถานะ register

## Rules

### 1. Scope

- ใช้สำหรับ Devin global MCP config เท่านั้น
- ไม่แก้ไข project `mcp_config.json` โดยตรง
- ถ้าต้องการ project-level ให้ส่งต่อ `/update-devin-project-mcp`

### 2. Safety

- สำรอง `%APPDATA%\devin\mcp_config.json` ก่อนแก้ไข
- ไม่ expose secrets ลง JSON
- ใช้ `/follow-secret-manager` สำหรับ credentials

### 3. Verification

- ทดสอบ server ด้วย `mcp_list_servers` และ `mcp_call_tool` หลัง register
- ถ้า test ไม่ผ่าน ห้าม report ว่าเสร็จสมบูรณ์

## Expected Outcome

- MCP server ถูกสร้างด้วย Rust หรือ TypeScript
- Server ถูก register ใน `%APPDATA%\devin\mcp_config.json`
- `mcp_list_servers` แสดง server และ `mcp_call_tool` สามารถ list tools ได้
- มี backup ของ global mcp config
- ผ่าน `/deep-validate` และ `/ship`
