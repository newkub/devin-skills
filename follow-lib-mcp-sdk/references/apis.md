# Lib Mcp Sdk API & Dependencies

## Install

```sh
bun add @modelcontextprotocol/sdk
# server runtime helpers ถ้าต้องการ stdio express
bun add zod    # สำหรับ tool schemas
```

## Version

- Latest: `1.30.0` (verified 2026-09-11) — package เดิม `@modelcontextprotocol/server` deprecated ให้ใช้ `/sdk`
- [Package Registry](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
- [Repository](https://github.com/modelcontextprotocol/typescript-sdk)

## Dependencies

- Runtime: `zod`, `@modelcontextprotocol/core` internals, transport libs (`express` สำหรับ Streamable HTTP)
- Bun/Node 18+

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `new McpServer({name, version})` | High-level server | - | `capabilities` |
| `server.registerTool(name, cfg, fn)` | Register tool | - | `title`, `description`, `inputSchema` (Zod shape) |
| `server.registerResource(name, uri, cfg, fn)` | Register resource | - | template |
| `server.registerPrompt(name, cfg, fn)` | Register prompt | - | `argsSchema` |
| `new StdioServerTransport()` | stdio transport | - | - |
| `new StreamableHTTPServerTransport(cfg)` | HTTP transport | - | `sessionIdGenerator` |
| `Client` + `StdioClientTransport` | MCP client | - | - |

## Source

- Official docs: https://modelcontextprotocol.io
- Description: Official TypeScript SDK for Model Context Protocol servers/clients.
