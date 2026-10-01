# MCP SDK — Server Setup และ Transports

## Recommended Patterns

### Server Setup

- `new McpServer({name, version})` — `name`/`version` ใช้ใน handshake กับ client; ตั้งให้ตรง package.json
- register capabilities ผ่าน `server.registerTool()`, `registerResource()`, `registerPrompt()` — คืน handle สำหรับ `.update()`/`.remove()` runtime
- shorthand `server.tool()`, `server.resource()`, `server.prompt()` ยังใช้ได้ — แต่ `register*` ให้ handle กลับมา (ดีกว่าสำหรับ dynamic servers)
- declare `capabilities` ใน `McpServer` options เมื่อ server มี features เสริม (logging, completion)

### Transport Selection

- `StdioServerTransport` — local integration, spawn โดย client (Claude Desktop, Devin, IDE plugins); simplest, secure (process boundary)
- `StreamableHTTPServerTransport` — remote/multi-client servers; รองรับ sessions, resumability
- HTTP+SSE transport เดิม deprecated — backward compat เท่านั้น อย่าใช้สำหรับ server ใหม่
- stdio = single client per process; HTTP = multi-client, scale independently

### HTTP Sessions

- `sessionIdGenerator` สำหรับ stateful HTTP — ให้ session id ต่อ connection; `undefined` = stateless mode
- stateless mode เหมาะกับ serverless/edge — ไม่เก็บ session state, ทุก request independent
- stateful mode ต้อง cleanup expired sessions — SDK emit events สำหรับ session close
- DNS rebinding protection: bind `localhost` หรือ set `allowedHosts` เมื่อรัน HTTP transport บนเครื่อง user

### Error Handling

- tool/resource handlers return `{content: [{type: 'text', text: '...'}]}` — ไม่ throw raw errors
- errors ที่ต้องแจ้ง client: `{content: [{type: 'text', text: 'Error: ...'}], isError: true}` — LLM เห็น error เป็น tool output
- throw เฉพาะ protocol-level failures (auth, transport) — application errors เป็น `isError` response
- validation errors จาก zod schema → SDK convert เป็น protocol error อัตโนมัติ

## Do / Don't

| Do | Don't |
|---|---|
| `registerTool` เก็บ handle สำหรับ `.update()`/`.remove()` | assume `server.tool()` คืน handle |
| `StdioServerTransport` สำหรับ local-first servers | เปิด HTTP port เมื่อ stdio พอ |
| return `isError: true` สำหรับ app errors | throw exception ใน handler (client เห็น protocol error แทน) |
| stateless HTTP สำหรับ serverless | session state บน edge runtime ที่ไม่ persist |
| pin `allowedHosts` เมื่อ HTTP บน localhost | bind `0.0.0.0` โดยไม่ auth (DNS rebinding) |

## Common Pitfalls

- `McpServer` vs low-level `Server` — McpServer มี helpers; Server = raw protocol access — ใช้ McpServer เป็นหลัก
- ลืม `await server.connect(transport)` — server ไม่ serve requests
- HTTP transport โดยไม่ `sessionIdGenerator` → requests ไม่ track session — บาง clients expect session
- return ผิด format — client expect `{content: [...]}` ไม่ใช่ raw string/object
- state ใน module scope → shared ข้าม sessions/clients — bug บน multi-client HTTP servers

## Performance Notes

- stdio transport มี overhead ต่ำ — JSON-RPC ผ่าน stdin/stdout pipes
- HTTP transport: batch requests ผ่าน `StreamableHTTP` reduce round-trips vs SSE legacy
- tool handlers ควร fast — long-running ops ให้ progress notifications (`reportProgress`) หรือ split เป็น async pattern
- เก็บ responses compact — LLM context มี limit, verbose output กิน tokens

## Ecosystem / Integration

- test ด้วย MCP Inspector: `bunx @modelcontextprotocol/inspector bun run server.ts`
- scaffold ใหม่ → `/follow-create-mcp`; consume servers ฝั่ง Devin → `/use-mcp`
- zod schemas สำหรับ inputs → `/follow-lib-zod` (ดู `tool-design.md`)
- version server ตาม spec — client อาจ negotiate features ตาม server version
