# Lib Mcp Sdk Routes / Topics

| Route / Topic | URL |
|---|---|
| MCP spec | https://modelcontextprotocol.io/specification/2026-07-28 |
| TS SDK docs | https://github.com/modelcontextprotocol/typescript-sdk |
| Server quickstart | https://modelcontextprotocol.io/docs/2026-07-28/develop/build-server |
| Client quickstart | https://modelcontextprotocol.io/docs/2026-07-28/develop/build-client |
| Transports | https://modelcontextprotocol.io/specification/2026-07-28/basic/transports |
| Inspector tool | `bunx @modelcontextprotocol/inspector` |

## Key Concepts

- High-level `McpServer` แนะนำกว่า low-level `Server` — auto protocol handling
- `registerTool` ใช้ Zod raw shape (`{ x: z.string() }`) — SDK validate + แปลง JSON Schema ให้
- Transports: `StdioServerTransport` (local CLI) vs `StreamableHTTPServerTransport` (remote, session)
- Debug: ใช้ MCP Inspector `bunx @modelcontextprotocol/inspector bun run server.ts`
