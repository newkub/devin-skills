# MCP Stack Comparison

เปรียบเทียบ stack สำหรับสร้าง MCP server

## Rust

- Official SDK: `rmcp` จาก `modelcontextprotocol/rust-sdk`
  - `cargo add rmcp --features server`
- Community SDK: `rust-mcp-sdk`
  - `cargo add rust-mcp-sdk`
- เหมาะกับ: binary ที่ต้องการ zero runtime dependency, performance สูง, deployment ง่าย
- Transport: stdio, Streamable HTTP, SSE
- Validation: `serde` + `serde_json`

## TypeScript

- Official SDK: `@modelcontextprotocol/server`
  - `bun add @modelcontextprotocol/server`
- Transport: stdio, Streamable HTTP, SSE
- Validation: `zod` หรือ native schema
- เหมาะกับ: team ที่คุ้นเคยกับ TS/Bun, rapid iteration, integration กับ JS ecosystem

## Decision Matrix

| Criteria | Rust | TypeScript |
|----------|------|------------|
| Runtime dependency | ไม่มี | ต้องการ Node/Bun/Deno |
| Performance | สูง | ดี |
| Distribution | single binary | source + runtime |
| Ecosystem | มากขึ้นเรื่องอื่น | มากใน web/JS |
| Default สำหรับ skill | ใช่ | fallback |
