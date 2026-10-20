# Use Case — Drive Another Server from a Client

> Write a script or agent host that connects to an existing MCP server, discovers its surface, and calls tools programmatically. Source: https://github.com/modelcontextprotocol/typescript-sdk (accessed 2026-10-20)

## 1. Connect through a transport

```ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const client = new Client({ name: "agent-host", version: "1.0.0" });
const transport = new StdioClientTransport({
  command: "bun",
  args: ["run", "/absolute/path/to/server.ts"],
  env: { ...process.env as Record<string, string>, WEATHER_API_KEY: process.env.WEATHER_API_KEY! },
});

await client.connect(transport);
```

For a remote server use `StreamableHTTPClientTransport` with the endpoint URL — the HTTP+SSE client is deprecated.

## 2. Discover what the server offers

```ts
const { tools } = await client.listTools();
for (const tool of tools) {
  console.error(`${tool.name}: ${tool.description ?? "(no description)"}`);
}

const { resources } = await client.listResources();
const { prompts } = await client.listPrompts();
```

Feed the same `tools` array to the LLM as its available function list — MCP tool definitions are already in the shape a model expects.

## 3. Call a tool and read the content blocks

```ts
const result = await client.callTool({
  name: "get_forecast",
  arguments: { city: "Bangkok", days: 3 },
});

if (result.isError) {
  console.error("tool reported a failure:", result.content);
} else {
  for (const block of result.content) {
    if (block.type === "text") console.log(block.text);
    if (block.type === "image") console.log(`<image ${block.mimeType}, ${block.data.length}b64>`);
  }
}
```

`content` is an array of blocks — never assume `content[0].text`; iterate and switch on `type`.

## 4. Ask the user mid-call with elicitation

If the server requests extra input, answer the elicitation instead of failing the call:

```ts
import { ElicitRequestSchema } from "@modelcontextprotocol/sdk/types.js";

client.setRequestHandler(ElicitRequestSchema, async (request) => {
  const accepted = await confirmInTerminal(request.params.message);
  return {
    action: accepted ? "accept" : "decline",
    content: { apiKey: process.env.WEATHER_API_KEY },
  };
});
```

Answer `mode: 'form'` requests with user-visible values only; `mode: 'url'` requests point the user at a URL for secrets and OAuth.

## 5. Always shut down

```ts
try {
  // calls...
} finally {
  await client.close();
}
```

## Pitfalls

- `callTool` resolves for tool-level failures — check `result.isError` before parsing content.
- Some servers return structured output in `structuredContent` in addition to text blocks; prefer it when present and keep the text fallback.
- Reusing one `Client` for concurrent unrelated sessions mixes request IDs — one connection per server process.
- Skipping `client.close()` leaves the spawned child alive; a stdio transport is a process, not a socket.
- `listTools` is a snapshot — refresh after the server advertises a capability change instead of caching forever.
- Passing an incomplete env to a stdio transport drops `PATH` on Windows and the spawn fails immediately.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/server.md`
- `best-practices/tool-design.md`
- `usecases/tool-server.md`
