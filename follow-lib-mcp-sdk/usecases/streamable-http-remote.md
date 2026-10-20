# Use Case — Streamable HTTP for Remote Servers

> Serve the same `McpServer` over HTTP so remote clients connect without spawning a process, choosing stateless or session-based operation deliberately. Source: https://github.com/modelcontextprotocol/typescript-sdk/blob/v1.x/docs/server.md (accessed 2026-10-20)

## 1. Stateless: one server per request

```ts
import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const app = express();
app.use(express.json());

app.post("/mcp", async (req, res) => {
  const server = buildServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);

  res.on("close", () => {
    transport.close();
    server.close();
  });
});

app.listen(3000);
```

`sessionIdGenerator: undefined` means no session: every request gets a fresh server and transport, so any instance can serve any request and horizontal scaling needs no shared state. The price is that everything session-scoped disappears — subscriptions, log levels set by the client, elicitation mid-call, resumability.

## 2. Stateful: one transport per session

```ts
import { randomUUID } from "node:crypto";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";

const sessions = new Map<string, StreamableHTTPServerTransport>();

app.post("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  let transport = sessionId ? sessions.get(sessionId) : undefined;

  if (!transport && !sessionId && isInitializeRequest(req.body)) {
    const created = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (id) => {
        sessions.set(id, created);
      },
    });

    created.onclose = () => {
      if (created.sessionId) sessions.delete(created.sessionId);
    };

    await buildServer().connect(created);
    transport = created;
  }

  if (!transport) {
    res.status(400).json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "No valid session id" },
      id: null,
    });
    return;
  }

  await transport.handleRequest(req, res, req.body);
});
```

Store the transport inside `onsessioninitialized`, not after `handleRequest` resolves: the client can send its next request before the first one returns, and a map that is still empty answers `400` to a perfectly valid session.

## 3. Answer GET and DELETE explicitly

```ts
app.get("/mcp", (_req, res) => {
  res.status(405).set("Allow", "POST").send("Method Not Allowed");
});
```

GET opens the server-to-client SSE stream; answer `405` unless you actually push notifications. DELETE ends a session, so implement it only when you remove the entry from the map — a `405` is honest, a silent `200` leaves sessions that never expire.

## 4. Prefer JSON responses behind a buffering proxy

```ts
const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: () => randomUUID(),
  enableJsonResponse: true,
});
```

Default Streamable HTTP answers with an SSE stream so the server can push progress and log notifications mid-call. `enableJsonResponse: true` returns one JSON body instead, which survives proxies and CDNs that buffer streams — at the cost of dropping every server-initiated message sent while the tool runs.

## 5. Protect the host header before anything else

```ts
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";

const app = createMcpExpressApp({ host: "localhost" });
```

A server on `127.0.0.1` is reachable from any web page through DNS rebinding. `createMcpExpressApp()` enables host header validation when bound to loopback; binding `0.0.0.0` turns that off, and then `hostHeaderValidation([...])` from `server/middleware/hostHeaderValidation.js` is your responsibility. Add bearer auth on top — host validation proves the request came to the right name, not that the caller may use it.

## 6. Point a client at it

```ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const client = new Client({ name: "worker", version: "1.0.0" });

await client.connect(
  new StreamableHTTPClientTransport(new URL("https://mcp.example.com/mcp"), {
    requestInit: { headers: { Authorization: `Bearer ${token}` } },
  }),
);
```

Keep one `Client` per session and reuse it. A new client per job re-initializes, re-lists every tool, and in stateful mode leaves an orphan transport behind.

## 7. Bound the session map

Track `lastActive` per session and close transports that are idle for a fixed window in a `setInterval`, plus a hard cap that answers `503` once reached — the SDK's stateful example does both. A stateful server keeps one transport per client in memory, so without a cap every IDE restart adds an entry that never leaves.

## 8. Verify

1. `curl -i -X POST localhost:3000/mcp -H 'content-type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"initialize",...}'` — the response carries `mcp-session-id`
2. Repeat with that header — the same session answers; without it in stateless mode, a new one starts
3. `curl -i localhost:3000/mcp` — `405` with `Allow: POST`
4. Kill a session's client, restart — the server still answers new initializations and the map does not grow
5. MCP Inspector with transport `Streamable HTTP` against the URL lists and calls every tool
6. `/run-verify` and `/run-test`

## Pitfalls

- Reusing one transport for every request, so responses cross between clients.
- Registering the session after `handleRequest` resolves, which loses the race with the next request.
- Running stateless and expecting elicitation or subscriptions to work.
- Setting `enableJsonResponse` and then wondering where progress notifications went.
- Leaving `cors()` wide open on a localhost server, so any page can drive it.
- Never closing idle transports, one per reconnect, until the process runs out of memory.
- Logging request bodies at `info` — tool arguments can contain user data.

## Related

- `references/apis.md`
- `best-practices/server.md`
- `usecases/tool-server.md`
- `usecases/resources-and-prompts.md`
- `usecases/elicitation-and-dynamic-tools.md`
