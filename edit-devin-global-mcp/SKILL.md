---
name: edit-devin-global-mcp
description: Add, update, or remove global MCP servers in mcp_config.json
---

## Goal

แก้ไข `mcp_config.json` ใน `C:\Users\Veerapong\.codeium\windsurf\` เพื่อเพิ่ม อัปเดต หรือลบ MCP server

## Scope

- อ่าน `mcp_config.json` ก่อนแก้ไข
- เพิ่ม อัปเดต หรือลบ server ใน `mcpServers`
- Validate JSON syntax และ schema
- สำรอง config ก่อนแก้ไข

## Execute

### 1. Prepare

> Goal: เข้าใจ config ปัจจุบัน

1. อ่าน `C:\Users\Veerapong\.codeium\windsurf\mcp_config.json`
2. ถ้าไฟล์ไม่มี → สร้างใหม่ด้วย `{ "mcpServers": {} }`
3. ใช้ `mcp_list_servers` เพื่อดู live servers
4. สำรองไฟล์ไปยัง `mcp_config.json.bak`

### 2. Determine Operation

> Goal: ระบุสิ่งที่ต้องทำ

1. รับชื่อ server และ action จาก user: `add`, `update`, `remove`
2. ถ้า `add` → รับ command, args, env
3. ถ้า `update` → รับ field ที่จะเปลี่ยน
4. ถ้า `remove` → ยืนยันว่าไม่มี skill อื่น depend บน server นั้น

### 3. Edit Config

> Goal: แก้ไขไฟล์ JSON

1. ใช้ `write` หรือ `edit` สำหรับแก้ไข JSON
2. สำหรับ `add`: เพิ่ม key ใน `mcpServers` ด้วย `command`, `args`, `env`
3. สำหรับ `update`: เปลี่ยน field ที่ระบุ
4. สำหรับ `remove`: ลบ key ออกจาก `mcpServers`
5. เก็บ JSON สวยงามด้วย 2 spaces indent

### 4. Validate

> Goal: ตรวจสอบความถูกต้อง

1. ตรวจ JSON syntax ด้วย PowerShell `ConvertFrom-Json`
2. ตรวจว่ามี root key `mcpServers`
3. ตรวจแต่ละ server มี `command` เป็น string
4. ตรวจ `args` เป็น array ของ string
5. ตรวจ `env` เป็น object ถ้ามี
6. ไม่ expose secrets ใน JSON ถ้าไม่จำเป็น

### 5. Test And Report

> Goal: ยืนยันการทำงาน

1. รัน `mcp_list_servers` หลังแก้ไข
2. รัน `mcp_list_tools` สำหรับ server ที่แก้
3. ทำ `/report` พร้อมสรุปการเปลี่ยนแปลง
4. ทำ `/suggest-next-action` ถ้าต้อง test tool

## Rules

### 1. Backup

- สำรอง `mcp_config.json` ก่อนแก้ไขทุกครั้ง
- เก็บ backup ที่ `mcp_config.json.bak`

### 2. Schema

- รูปแบบ server ต้องเป็น:
  ```json
  {
    "mcpServers": {
      "server-name": {
        "command": "...",
        "args": ["..."],
        "env": { "KEY": "VALUE" }
      }
    }
  }
  ```
- ห้ามเพิ่ม field นอกเหนือจาก `command`, `args`, `env`

### 3. Security

- ไม่ commit secrets ลง `mcp_config.json`
- ใช้ env vars สำหรับ tokens/keys
- ถ้า config มี secret อยู่แล้ว → แจ้งเตือนและ redact

### 4. Safety

- ถ้าต้อง remove server → ตรวจ dependents ก่อน
- ถ้า server ไม่ทำงานหลังแก้ → revert จาก backup

## Expected Outcome

- `mcp_config.json` ถูกต้องตาม schema
- MCP servers ทำงานได้ตามคาด
- มี backup ก่อนการแก้ไข
- รายงานการเปลี่ยนแปลงพร้อม action ถัดไป
