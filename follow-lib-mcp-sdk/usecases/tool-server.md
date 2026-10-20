# Use Case — Tool Server over Stdio

> Ship a local MCP server that exposes tools to any MCP client with no hosting step. Source: https://modelcontextprotocol.io/docs/develop/build-server (accessed 2026-10-20)

## 1. Install and scaffold

```sh
bun add @modelcontextprotocol/sdk zod
```

One file is enough to start — `src/server.ts`:

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "weather", version: "1.0.0" });
```

## 2. Register a tool with a zod raw shape

`inputSchema` is the raw shape, not `z.object({...})` — the SDK wraps it into the advertised JSON Schema.

```ts
server.registerTool(
  "get_forecast",
  {
    title: "Get forecast",
    description: "Return the daily forecast for a city, in celsius",
    inputSchema: {
      city: z.string().describe("City name, e.g. Bangkok"),
      days: z.number().int().min(1).max(7).default(1),
    },
  },
  async ({ city, days }) => {
    try {
      const forecast = await fetchForecast(city, days);
      return { content: [{ type: "text", text: JSON.stringify(forecast) }] };
    } catch (err) {
      return {
        content: [{ type: "text", text: `forecast failed: ${(err as Error).message}` }],
        isError: true,
      };
    }
  },
);
```

`registerTool` returns a handle with `.update()` and `.remove()` — keep it when the tool set changes at runtime.

## 3. Connect the transport

```ts
const transport = new StdioServerTransport();
await server.connect(transport);
```

Register everything before `connect()`; the server advertises its capabilities at handshake time. For remote hosting the same code swaps in `StreamableHTTPServerTransport` — HTTP+SSE exists only for backward compatibility.

## 4. Point a client at it

```json
{
  "mcpServers": {
    "weather": {
      "command": "bun",
      "args": ["run", "/absolute/path/to/src/server.ts"]
    }
  }
}
```

Use an absolute path — stdio servers are spawned from the client's working directory, not the project's.

## 5. Exercise it before wiring a real client

```sh
bunx @modelcontextprotocol/inspector bun run src/server.ts
```

The inspector lists tools/resources/prompts and sends real calls, which is faster than debugging through the host app.

## Pitfalls

- `console.log` writes to stdout, which is the JSON-RPC channel — one stray log corrupts the stream. Log to `console.error` only.
- Wrapping `inputSchema` in `z.object()` makes the client see a schema with a single nested property — pass the raw shape.
- Throwing inside a handler reports a protocol-level error the model cannot reason about; return `{ content: [...], isError: true }` instead.
- A tool with a vague or missing description is rarely selected — describe what it returns, not how it is implemented.
- Leaving the child process unclosed keeps the host app alive after the client disconnects; handle transport close and exit.
- Stdio servers inherit the client's env only — read config from env vars passed in the server entry, never from cwd-relative files.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/server.md`
- `best-practices/tool-design.md`
- `usecases/client-call-tools.md`
