---
name: read-devin-context
description: อ่านและสรุป devin context ทั้งหมดก่อนเริ่มงาน
---

## Goal

สรุป devin context (global rules, skills, mcp, hooks, plugins, etc.) เพื่อเตรียม task และลดการตัดสินใจผิด

## Scope

อ่าน context ทั้ง global และ project ที่มีผลต่อการทำงานของ devin รวมถึง `global_rules.md`, skills, mcp config, hooks, plugins

## Execute

### 1. Discover Context Paths

> Goal: หา context directories ใน environment
> Goal: รู้ตำแหน่ง context ทั้งหมด

1. ตรวจหา global context:
   - Windows: `%APPDATA%\devin` เช่น `C:\Users\<user>\AppData\Roaming\devin`
   - Linux/macOS: `~/.config/devin` และ `~/.devin`
2. ตรวจหา windsurf context:
   - `C:\Users\<user>\.codeium\windsurf\memories\global_rules.md`
   - `C:\Users\<user>\.codeium\windsurf\skills`
3. ตรวจหา project context:
   - `.devin/`, `.windsurf/`, `.devin/skills/`, `.devin/rules/`, `.devin/mcp.json`, `.devin/hooks/`
4. ถ้าหาไม่เจอ path สำคัญ → รายงานและ skip

### 2. Read Global Rules

> Goal: อ่าน global rules
> Goal: เข้าใจกฎ global ที่ใช้กับทุก task

1. อ่าน `global_rules.md` จาก windsurf memories หรือ project `.devin/rules/`
2. สรุปลำดับ steps, restrictions, และ required references
3. ถ้าไฟล์ไม่มี → รายงานว่าไม่พบ global rules

### 3. Read Skills

> Goal: อ่าน skills context
> Goal: รู้ว่ามี skills อะไรบ้างและตัวไหนเกี่ยวข้อง

1. list skills ใน `%APPDATA%\devin\skills` (global skills)
2. list skills ใน `C:\Users\<user>\.codeium\windsurf\skills` (windsurf skills)
3. list project skills ใน `.devin/skills/` หรือ `.windsurf/skills/` ถ้ามี
4. ถ้ามี skill ที่ตรงกับ task ให้ชี้เป้า และอ่าน `SKILL.md` หลักเฉพาะทีจำเป็น

### 4. Read MCP Config

> Goal: อ่าน mcp configuration
> Goal: รู้ MCP servers ที่มี และสถานะ disabled/enabled

1. อ่าน `%APPDATA%\devin\mcp_config.json`
2. ตรวจหา `.mcp.json` หรือ `mcp/` ใน project
3. list ชื่อ mcp servers, commands, urls, และ disabled status
4. ไม่ expose secrets หรือ credentials

### 5. Read Hooks

> Goal: อ่าน hooks ที่อาจมีผลต่อการทำงาน
> Goal: รู้ hooks ที่ active หรือ custom

1. list ไฟล์ใน `%APPDATA%\devin\hooks`
2. list ไฟล์ใน `cli/plugins/*/hooks/` หรือ `cli/plugins/cache/*/hooks/`
3. list hooks ใน project `.devin/hooks/`
4. อ่านไฟล์ hook ที่สำคัญ (`*.ps1`, `*.mjs`, `*.json`) แต่ไม่อ่าน binary

### 6. Read Plugins

> Goal: อ่าน plugins/ extensions
> Goal: รู้ plugins ที่ติดตั้งหรือ cache ไว้

1. list ไฟล์/โฟลเดอร์ใน `%APPDATA%\devin\cli\plugins\cache`
2. list `.devin/extensions` หรือ `plugins/` ใน project
3. สรุป plugin names และ versions ถ้าหาได้

### 7. Summarize Context

> Goal: สรุป context เพื่อใช้งาน
> Goal: ได้ภาพรวม context ทั้งหมด

1. สร้างตารางสรุป: context type | location | status | key points
2. ระบุ context ที่ขาดหายหรืออาจล้าสมัย
3. ทำ `ask-me` ถ้าพบ conflict หรือต้องตัดสินใจเรื่อง context

## Rules

### Path Discovery

- ใช้ `glob` หรือ `exec` เพื่อหา directories ก่อนอ่าน
- ตรวจสอบว่า path มีอยู่จริงก่อน `read`
- รองรับ Windows, Linux, macOS paths

### Safety

- ไม่อ่าน binary, cache, logs, หรือไฟล์ sensitive
- ไม่ expose secrets หรือ credentials จาก `mcp_config.json`
- ถ้าไฟล์ใหญ่เกิน 250 บรรทัด ให้อ่านส่วนหัวและสรุป

### Output

- สรุปเป็นตารางหรือ bullet points กระชับ
- ระบุ context ที่หาไม่เจอหรือขาดหาย
- ไม่แก้ไข context ใน step นี้

## Expected Outcome

- รายการ context ทั้งหมดพร้อม location และ status
- สรุป key points จาก global rules, skills, mcp, hooks, plugins
- ไม่มี context สำคัญขาดหายโดยไม่รายงาน
