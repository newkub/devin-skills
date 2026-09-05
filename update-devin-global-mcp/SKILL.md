---
name: update-devin-global-mcp
description: Add, update, remove, or sync global MCP servers in devin mcp_config.json with dotfiles check
argument-hint: "[scope]"
related:
  - list-devin-global-mcp
  - follow-create-mcp
  - update-chezmoi
  - report
  - suggest-next-action
---

## Goal

อัปเดต global MCP servers ใน `%APPDATA%\devin\mcp_config.json` โดยเช็ค dotfiles remote repo เพื่อ sync หรือ reference

## Scope

- อ่าน `%APPDATA%\devin\mcp_config.json`
- เช็ค remote dotfiles repo หา `mcp_config.json` ที่เกี่ยวข้อง
- เพิ่ม อัปเดต หรือลบ server ใน `mcpServers`
- สำรอง config ก่อนแก้ไข
- Validate JSON syntax และ schema

## Execute

### 1. Prepare

> Goal: เข้าใจ config ปัจจุบัน

1. อ่าน `%APPDATA%\devin\mcp_config.json`
2. ถ้าไฟล์ไม่มี → สร้างใหม่ด้วย `{ "mcpServers": {} }`
3. สำรองไฟล์ไปยัง `mcp_config.json.bak`
4. ใช้ `/list-devin-global-mcp` เพื่อดู live servers

### 2. Check Dotfiles Remote

> Goal: เช็คว่า dotfiles repo มี mcp config ที่เกี่ยวข้องหรือไม่

1. ระบุ dotfiles owner/repo จาก argument หรือ `gh api user -q '.login'`
2. รัน `gh repo view <owner>/dotfiles` เพื่อยื่นยันว่า repo มีอยู่
3. ค้นหา `mcp_config.json` ใน dotfiles ด้วย `gh api repos/<owner>/dotfiles/contents` หรือ tree API
4. ถ้าพบไฟล์ที่เกี่ยวข้องกับ devin (เช่น `dot_devin/mcp_config.json` หรือ `AppData/Roaming/devin/mcp_config.json`) → fetch content แล้ว decode base64
5. ถ้าพบเฉพาะ `dot_codeium/windsurf/mcp_config.json` → report ว่าเป็น config ของ Codeium/Windsurf แยกจาก devin ไม่ sync โดยอัตโนมัติ
6. เปรียบเทียบ dotfiles config (ถ้ามี) กับ local config
7. ถ้า dotfiles ไม่มี devin mcp config → local เป็น source of truth

### 3. Determine Operation

> Goal: ระบุสิ่งทีต้องทำ

1. รับชื่อ server และ action จาก user: `add`, `update`, `remove`, `sync`
2. ถ้า `add` → รับ command, args, env
3. ถ้า `update` → รับ field ทีจะเปลี่ยน
4. ถ้า `remove` → ยืนยันว่าไม่มี skill อื่น depend บน server นั้น
5. ถ้า `sync` → ถามทิศทาง: dotfiles → local หรือ local → dotfiles

### 4. Edit Config

> Goal: แก้ไขไฟล์ JSON

1. ใช้ `write` หรือ `edit` สำหรับแก้ไข JSON
2. สำหรับ `add`: เพิ่ม key ใน `mcpServers` ด้วย `command`, `args`, `env`
3. สำหรับ `update`: เปลี่ยน field ทีระบุ
4. สำหรับ `remove`: ลบ key ออกจาก `mcpServers`
5. สำหรับ `sync`: merge ตามทิศทางทีเลือก โดยไม่ overwrite โดยไม่ยืนยัน
6. เก็บ JSON สวยงามด้วย 2 spaces indent

### 5. Validate

> Goal: ตรวจสอบความถูกต้อง

1. ตรวจ JSON syntax ด้วย PowerShell `ConvertFrom-Json`
2. ตรวจว่ามี root key `mcpServers`
3. ตรวจแต่ละ server มี `command` เป็น string
4. ตรวจ `args` เป็น array ของ string
5. ตรวจ `env` เป็น object ถ้ามี
6. ไม่ expose secrets ใน JSON ถ้าไม่จำเป็น

### 6. Test And Report

> Goal: ยืนยันการทำงาน

1. รัน `/list-devin-global-mcp` หลังแก้ไข
2. รัน `mcp_list_tools` สำหรับ server ทีแก้
3. ทำ `/report` พร้อมสรุปการเปลี่ยนแปลง
4. ถ้ามี dotfiles → ทำ `/update-chezmoi` หรือ report ว่าต้อง sync ต่อ
5. ทำ `/suggest-next-action` ถ้าต้อง test tool

## Rules

### 1. Backup

- สำรอง `%APPDATA%\devin\mcp_config.json` ก่อนแก้ไขทุกครั้ง
- เก็บ backup ที `mcp_config.json.bak`

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

### 4. Dotfiles

- เช็ค remote dotfiles ก่อนแก้ไขเพื่อ reference
- ถ้า dotfiles มี devin mcp config ทีต่างจาก local → ถาม user ก่อน merge
- ถ้าไม่มี dotfiles หรือไม่มี devin mcp config → local เป็น source of truth

### 5. Safety

- ถ้าต้อง remove server → ตรวจ dependents ก่อน
- ถ้า server ไม่ทำงานหลังแก้ → revert จาก backup

- ใช้ /follow-create-mcp ถ้าจำเป็น

## Expected Outcome

- `%APPDATA%\devin\mcp_config.json` ถูกต้องตาม schema
- MCP servers ทำงานได้ตามคาด
- มี backup ก่อนการแก้ไข
- dotfiles remote ถูก check และ report
- รายงานการเปลี่ยนแปลงพร้อม action ถัดไป
