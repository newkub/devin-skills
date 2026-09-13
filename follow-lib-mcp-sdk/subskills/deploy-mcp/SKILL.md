---
name: follow-lib-mcp-sdk-deploy-mcp
description: Deploy MCP server — transport options, remote hosting, client config
argument-hint: "[platform]"
related:
  - follow-lib-mcp-sdk
  - follow-secret-manager
  - check-secrets
  - resolve-errors
---

## Goal

Deploy MCP server — เลือก transport, host remote server และ configure clients ให้เชื่อมได้

## Scope

ใช้เมื่อต้อง deploy MCP server ที่สร้างแล้ว — ครอบคลุม stdio vs Streamable HTTP transport, remote hosting options, client registration (Claude Desktop, Devin, IDEs) และ auth notes

## Execute

### 1. Choose Transport

> Goal: เลือก transport ตาม deployment model

1. `StdioServerTransport` — local servers ที่ client spawn เอง (Claude Desktop, IDE extensions); ไม่ต้อง host, แค่ distribute command
2. `StreamableHTTPServerTransport` — remote servers ที่หลาย client เชื่อมผ่าน HTTP; ต้อง host + auth
3. HTTP+SSE transport deprecated — ใช้ backward compat เท่านั้น ห้ามใช้สำหรับ server ใหม่
4. ถ้าเลือกไม่ได้ → stop และ report trade-offs

### 2. Prepare Server For Hosting

> Goal: config server สำหรับ remote deployment

1. ตรวจ env vars/secrets — ทำ `/check-secrets env-vars`; secrets ผ่าน `/follow-secret-manager` ห้าม commit
2. ใช้ `process.env.PORT` — platforms กำหนด port เอง
3. สำหรับ Streamable HTTP: ตัดสินใจ session management (stateful `sessionIdGenerator` vs stateless) ตาม use case — ดู official docs
4. เพิ่ม auth สำหรับ remote server (OAuth/bearer token) — MCP spec กำหนด auth requirements; ห้ามเปิด remote server โดยไม่มี auth

### 3. Deploy

> Goal: host server บน platform ที่เลือก

1. Node/Bun-compatible platforms (VPS, Docker, serverless ที่รองรับ HTTP) — build/run ตาม runtime ที่ใช้
2. สำหรับ stdio distribution: publish npm package หรือ distribute script — client รัน `npx`/`bunx <pkg>` เอง
3. ดู official docs ที่ `https://modelcontextprotocol.io` สำหรับ hosting patterns ล่าสุด

### 4. Register With Clients

> Goal: เพิ่ม server ใน client configs

1. Stdio client config (เช่น Claude Desktop `claude_desktop_config.json`):

   ```json
   {
     "mcpServers": {
       "my-server": { "command": "bunx", "args": ["my-mcp-server"] }
     }
   }
   ```

2. Remote: client ชี้ URL ของ Streamable HTTP endpoint + auth credentials
3. ทำ `/update-devin-global-mcp` ถ้าเป็น Devin global MCP config

### 5. Verify

> Goal: ทดสอบ client เชื่อมต่อ server จริง

1. Restart/reload client แล้วเช็ค server ขึ้นใน tools list
2. เรียก tool หนึ่งตัวผ่าน client — response ถูกต้อง
3. ตรวจ logs ไม่มี error; auth ทำงานสำหรับ remote
4. ถ้าพัง → ทำ `/resolve-errors` แล้ว report

## Rules

- Remote server ต้องมี auth เสมอ — ห้ามเปิด MCP endpoint โดยไม่ป้องกัน
- ห้าม commit credentials/client configs ที่มี secrets
- stdio สำหรับ local single-user, Streamable HTTP สำหรับ remote multi-client — ห้ามใช้ SSE transport ใหม่
- ใช้ `/follow-lib-mcp-sdk` สำหรับ full reference

## Expected Outcome

- Transport เลือกถูกตาม deployment model
- Server host/distribute สำเร็จพร้อม auth (ถ้า remote)
- Clients เชื่อมต่อและเรียก tools ได้จริง
- Secrets จัดการถูกต้อง
