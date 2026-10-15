# MCP SDK — Server Setup and Transports

## Recommended Patterns

### Server Setup

- `new McpServer({name, version})` — `name`/`version` are used in the handshake with the client; set them to match package.json
- register capabilities via `server.registerTool()`, `registerResource()`, `registerPrompt()` — they return a handle for runtime `.update()`/`.remove()`
- the shorthand `server.tool()`, `server.resource()`, `server.prompt()` still works — but `register*` returns a handle (better for dynamic servers)
- declare `capabilities` in the `McpServer` options when the server has extra features (logging, completion)

### Transport Selection

- `StdioServerTransport` — local integration, spawned by the client (Claude Desktop, Devin, IDE plugins); simplest, secure (process boundary)
- `StreamableHTTPServerTransport` — remote/multi-client servers; supports sessions, resumability
- the old HTTP+SSE transport is deprecated — backward compat only; don't use it for new servers
- stdio = single client per process; HTTP = multi-client, scales independently

### HTTP Sessions

- `sessionIdGenerator` for stateful HTTP — gives a session id per connection; `undefined` = stateless mode
- stateless mode suits serverless/edge — no session state stored, every request is independent
- stateful mode needs cleanup of expired sessions — the SDK emits events for session close
- DNS rebinding protection: bind `localhost` or set `allowedHosts` when running the HTTP transport on the user's machine

### Error Handling

- tool/resource handlers return `{content: [{type: 'text', text: '...'}]}` — don't throw raw errors
- errors that must reach the client: `{content: [{type: 'text', text: 'Error: ...'}], isError: true}` — the LLM sees the error as tool output
- throw only for protocol-level failures (auth, transport) — application errors become `isError` responses
- validation errors from zod schemas → the SDK converts them to protocol errors automatically

## Do / Don't

| Do | Don't |
|---|---|
| `registerTool` keeps the handle for `.update()`/`.remove()` | assume `server.tool()` returns a handle |
| `StdioServerTransport` for local-first servers | open an HTTP port when stdio suffices |
| return `isError: true` for app errors | throw an exception in a handler (the client sees a protocol error instead) |
| stateless HTTP for serverless | session state on an edge runtime that doesn't persist |
| pin `allowedHosts` when serving HTTP on localhost | bind `0.0.0.0` without auth (DNS rebinding) |

## Common Pitfalls

- `McpServer` vs the low-level `Server` — McpServer has helpers; Server = raw protocol access — use McpServer as the default
- forgetting `await server.connect(transport)` — the server serves no requests
- HTTP transport without `sessionIdGenerator` → requests aren't tracked to a session — some clients expect a session
- returning the wrong format — the client expects `{content: [...]}`, not a raw string/object
- state in module scope → shared across sessions/clients — a bug on multi-client HTTP servers

## Performance Notes

- the stdio transport has low overhead — JSON-RPC over stdin/stdout pipes
- HTTP transport: batching requests via `StreamableHTTP` reduces round-trips vs the legacy SSE
- tool handlers should be fast — for long-running ops use progress notifications (`reportProgress`) or split into async pattern
- keep responses compact — LLM context has limits, verbose output burns tokens

## Ecosystem / Integration

- test with the MCP Inspector: `bunx @modelcontextprotocol/inspector bun run server.ts`
- scaffolding a new server → `/follow-create-mcp`; consuming servers on the Devin side → `/use-mcp`
- zod schemas for inputs → `/follow-lib-zod` (see `tool-design.md`)
- version the server per the spec — clients may negotiate features based on the server version
