---
name: follow-create-mcp
description: สร้าง MCP server ด้วย Rust หรือ TypeScript พร้อม register ลง mcp_config.json
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - follow-create-cli
  - follow-lang-rust
  - follow-lang-typescript
  - follow-my-tech-stack
  - review-techstack
  - update-devin-global-mcp
---

## Goal

สร้าง MCP server ใหม่ โดยเริ่มจาก Rust ก่อน ถ้าไม่เหมาะจึง fallback ไป TypeScript พร้อม register ลง `%APPDATA%\devin\mcp_config.json`

## Scope

ใช้เมื่อ skill หรือ project ต้อง expose tools, resources, หรือ prompts ผ่าน Model Context Protocol (MCP) รองรับทั้ง stdio, Streamable HTTP และ SSE transport

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Decide Stack

> Goal: เลือก stack ที่เหมาะสมกับ use case

1. วิเคราะห์ requirements: performance, runtime dependency, team skill, deployment target
2. เลือก Rust ถ้า: ต้องการ binary เดียว, performance สูง, zero runtime dependency, หรือ deploy เป็น native binary
3. เลือก TypeScript ถ้า: ทีมใช้ TS/Bun หลัก, ต้องการ rapid iteration, หรือต้อง integration กับ JS ecosystem
4. ถ้าไม่ชัด → ใช้ Rust เป็น default
5. ดูรายละเอียด stack ใน [references/mcp-stacks.md](references/mcp-stacks.md)

### 3. Create MCP Server Project

> Goal: สร้าง scaffold ตาม stack ที่เลือก

1. ถ้าเลือก Rust → สร้าง Rust project ด้วย `cargo new` แล้วเพิ่ม `rmcp` หรือ `rust-mcp-sdk` เป็น dependency ตามตัวอย่างใน [references/mcp-stacks.md](references/mcp-stacks.md)
2. ถ้าเลือก TypeScript → สร้าง project ด้วย `bun init` แล้ว `bun add @modelcontextprotocol/server`
3. สร้าง entry point: `src/main.rs` สำหรับ Rust หรือ `src/index.ts` สำหรับ TypeScript
4. กำหนด server name, version, และ capabilities (tools, resources, prompts)
5. ทำ `/follow-architecture` เพื่อเลือก architecture ที่เหมาะสม (ไม่บังคับ Clean) แล้วแยก handlers, transport, และ domain logic ชัดเจน

### 4. Implement Tools And Resources

> Goal: expose functionality ผ่าน MCP protocol

1. ระบุ tools ที่ MCP server จะ expose พร้อม input schema
2. ใช้ native type validation เช่น `zod` สำหรับ TypeScript หรือ `serde` สำหรับ Rust
3. ระบุ resources และ prompts ถ้าจำเป็น
4. ใช้ `/follow-single-responsibility` แยกแต่ละ tool handler ออกเป็น module

### 5. Choose Transport

> Goal: เลือก transport ที่เหมาะสม

1. stdio: สำหรับ local spawn โดย client (default สำหรับ Devin/Cursor/Claude Code)
2. Streamable HTTP: สำหรับ remote server หรือ multi-client
3. SSE: สำหรับ backward compatibility
4. ถ้าไม่ชัด → ใช้ stdio เป็น default สำหรับ CLI tool, Streamable HTTP สำหรับ service

### 6. Test Server

> Goal: ยืนยันว่า server ทำงานถูกต้อง

1. รัน server ด้วยคำสั่งของ stack เช่น `cargo run` หรือ `bun run dev`
2. ทดสอบด้วย MCP inspector หรือ client ที่รองรับ
3. ตรวจสอบว่า tools สามารถ list และ invoke ได้
4. ถ้า transport เป็น stdio → ทดสอบ spawn ผ่าน client เช่น Claude Code หรือ `npx @anthropic/mcp-inspector`

### 7. Register In mcp_config.json

> Goal: ให้ Devin หรือ client อื่นใช้งาน server ได้

1. อ่านไฟล์ `%APPDATA%\devin\mcp_config.json`
2. เพิ่ม server ภายใต้ `mcpServers` ด้วย `command`, `args`, และ `env` ที่จำเป็น
3. ถ้าไฟล์ยังไม่มี → สร้างใหม่ด้วยโครงสร้าง `{ "mcpServers": {} }`
4. ใช้ `/update-devin-global-mcp` ถ้าต้องการควบคุม MCP config อย่างปลอดภัย

### 8. Ship

> Goal: ส่งมอบ MCP server

1. ทำ `/deep-validate` เพื่อตรวจ conventions, references, และ security
2. ทำ `/ship`
3. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Stack Selection

- Default คือ Rust (`rmcp` หรือ `rust-mcp-sdk`) เพราะ performance และ zero runtime dependency
- TypeScript เป็น fallback เมื่อทีมหรือ ecosystem เอื้ออำนวย
- บันทึกเหตุผลที่เลือก stack ใน README หรือ plan

### 2. Security

- ไม่ hardcode secrets ลง server code
- ใช้ `/follow-secret-manager` สำหรับจัดการ API keys และ credentials แล้ว inject เป็น environment variables
- ถ้า server รับ input จาก client → validate schema ก่อนประมวลผล

### 3. Transport

- stdio เป็น default สำหรับ tools ที่ client spawn โดยตรง
- Streamable HTTP เมื่อต้องการรองรับหลาย clients ผ่าน network
- ไม่ใช้ SSE สำหรับ implementation ใหม่ ยกเว้น backward compatibility

### 4. Integration

- server ต้อง register ใน `%APPDATA%\devin\mcp_config.json` หรือ `mcp_config.json` ของ project ก่อนถือว่าเสร็จ
- ถ้า skill นี้ถูกสร้างใน global skills repo → อัปเดต `related` และ `AGENTS.md`

- ใช้ /open-web-for-config-secret ถ้าจำเป็น
- ใช้ /follow-create-cli ถ้าจำเป็น
- ใช้ /follow-lang-rust ถ้าจำเป็น
- ใช้ /follow-lang-typescript ถ้าจำเป็น

## Expected Outcome

- MCP server ทำงานได้ทั้ง Rust หรือ TypeScript
- Tools/resources/prompts ถูก expose ผ่าน MCP protocol
- Transport ทีเลือกทดสอบผ่าน
- `%APPDATA%\devin\mcp_config.json` ถูกอัปเดตพร้อม server entry
- ผ่าน `/deep-validate` และ `/ship`

