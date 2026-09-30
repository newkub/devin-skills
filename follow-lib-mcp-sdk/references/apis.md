| key | value |
|---|---|
| version | 1.30.0 |
| package registry | https://www.npmjs.com/package/@modelcontextprotocol/sdk |
| repository | https://github.com/modelcontextprotocol/typescript-sdk |
| docs | https://modelcontextprotocol.io |

| api | description | default | options |
|---|---|---|---|
| `new McpServer({name, version})` | High-level server | - | `capabilities` |
| `server.registerTool(name, cfg, fn)` | Register tool | - | `title`, `description`, `inputSchema` (Zod shape) |
| `server.registerResource(name, uri, cfg, fn)` | Register resource | - | template |
| `server.registerPrompt(name, cfg, fn)` | Register prompt | - | `argsSchema` |
| `new StdioServerTransport()` | stdio transport | - | - |
| `new StreamableHTTPServerTransport(cfg)` | HTTP transport | - | `sessionIdGenerator` |
| `Client` + `StdioClientTransport` | MCP client | - | - |
