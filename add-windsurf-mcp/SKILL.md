---
name: add-windsurf-mcp
description: เพิ่ม MCP server ให้ Cascade เพื่อเชื่อมต่อ custom tools และ services
---

## Goal

เพิ่ม MCP server ให้ Cascade เพื่อขยายความสามารถด้วย custom tools และ services

## Execute

### 1. Understand MCP Basics

1. ศึกษา MCP (Model Context Protocol) จาก official docs
2. ทำความเข้าใจ transport types: stdio, HTTP, SSE
3. เลือก MCP server ที่ต้องการใช้จาก [MCP servers repository](https://github.com/modelcontextprotocol/servers) หรือ [OpenTools](https://opentools.com/)

### 2. Configure Via UI

1. เปิด Settings > Tools > Windsurf Settings > Add Server
2. เลือก MCP server ที่ต้องการจาก list
3. คลิก `+ Add Server` เพื่อเปิดใช้งาน
4. กด refresh button หลังจากเพิ่ม server

### 3. Configure Via mcp_config.json

1. เปิด `~/.codeium/mcp_config.json` หรือคลิก `View Raw Config`
2. เพิ่ม server configuration ใน `mcpServers` object
3. ระบุ `command`, `args`, `env` สำหรับ stdio transport
4. ระบุ `url` สำหรับ HTTP transport (endpoint: `https://<server-url>/mcp`)
5. ตั้งค่า environment variables ที่จำเป็น (เช่น API keys)
6. บันทึกไฟล์และกด refresh

### 4. Verify Configuration

1. เปิด Cascade panel
2. ทดสอบใช้ MCP tools ที่เพิ่มเข้ามา
3. ตรวจสอบว่า tools ทำงานได้ถูกต้อง
4. แก้ไข configuration หากมี error

## Rules

### 1. Transport Types

รองรับ 3 transport types:

| Transport | Description | Use Case |
|-----------|-------------|----------|
| stdio | Standard input/output | Local processes, CLI tools |
| HTTP | RESTful HTTP endpoints | Remote servers, APIs |
| SSE | Server-Sent Events | Real-time streaming |

### 2. Configuration Format

ตัวอย่าง mcp_config.json สำหรับ GitHub server:

```json
{
  "mcpServers": {
    "github": {
      "command": "bunx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

### 3. HTTP Server Configuration

สำหรับ HTTP transport:
- URL ต้องชี้ไปที่ endpoint: `https://<server-url>/mcp`
- รองรับ OAuth สำหรับ authentication
- ตั้งค่า headers และ authentication ใน config

### 4. Environment Variables

- ต้องระบุ environment variables ที่ MCP server ต้องการ
- ใช้ env object ใน server configuration
- ห้าม hardcode secrets ใน mcp_config.json
- ใช้ environment variables หรือ secrets management

### 5. Enterprise Settings

สำหรับ Teams และ Enterprise:
- ต้องเปิดใช้งาน MCP ผ่าน settings ก่อน
- ใช้ admin controls สำหรับ MCP whitelist
- ตั้งค่า regex patterns สำหรับ server matching
- ดู admin controls ใน Windsurf Admin Portal

### 6. Refresh After Changes

- กด refresh button หลังจากแก้ไข mcp_config.json
- Cascade จะโหลด configuration ใหม่
- MCP tools จะปรากฏใน Cascade panel

### 7. Security Best Practices

- ไม่ commit mcp_config.json ไปยัง git
- ใช้ environment variables สำหรับ secrets
- ตรวจสอบ MCP server ที่เพิ่มเข้ามา
- ใช้ MCP whitelist ใน Enterprise environment

## Expected Outcome

- MCP server เชื่อมต่อกับ Cascade สำเร็จ
- MCP tools ปรากฏและใช้งานได้ใน Cascade
- Configuration ถูกต้องและปลอดภัย
