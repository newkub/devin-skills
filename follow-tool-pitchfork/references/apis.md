# Pitchfork HTTP API & MCP

## HTTP API

REST endpoints served by the supervisor — bundled with the Web UI port (default `http://127.0.0.1:3120`) or a standalone `[settings.api]` listener. All JSON. Response schema: https://pitchfork.jdx.dev/api-schema.json

- URL-encode qualified IDs as one segment: `myproject/api` → `myproject%2Fapi` (use `encodeURIComponent(id)`); keep `namespace/name` inside JSON bodies
- Non-loopback binds require `X-Pitchfork-Token` (auto-generated 64-char hex if unset); loopback needs none unless a token is configured. Plain HTTP only — keep on loopback or behind a same-host HTTPS proxy
- Control calls can return HTTP 200 with `"ok": false` + `"error"` — check the body

| Endpoint | Description |
|---|---|
| `GET /api/stats` | System stats: process_count, cpu_count, total_memory |
| `GET /api/daemons` | All daemons with runtime state (pid, status, cpu, memory, uptime, proxy_url, slug, active_port, resolved_port) |
| `GET /api/daemons/{id}` | Single daemon (same entry shape) |
| `POST /api/daemons/{id}/start` | Start daemon |
| `POST /api/daemons/{id}/stop` | Stop daemon |
| `POST /api/daemons/{id}/restart` | Restart daemon |
| `POST /api/daemons/{id}/enable` | Enable daemon |
| `POST /api/daemons/{id}/disable` | Disable daemon |
| `GET /api/logs/{id}/tail` | Stream logs as NDJSON (`curl -N`); emits `{"_clear":true,"_gen":N}` control object on log clear |
| `GET /api/namespaces` | List registered namespaces |
| `POST /api/namespaces` | Register namespace: `{"dir": "/path/to/project"}` |
| `DELETE /api/namespaces/{ns}` | Remove namespace |
| `GET /api/proxies` | List proxy slugs |
| `GET /api/processes/{id}/tree` | Process tree incl. children (pid, exe, cpu, memory, threads, status) |

```sh
curl http://127.0.0.1:3120/api/daemons
curl -X POST http://127.0.0.1:3120/api/daemons/myproject%2Fapi/restart
curl -N http://127.0.0.1:3120/api/logs/myproject%2Fapi/tail
```

## MCP Server

stdio server: `pitchfork mcp`. Client config:

```json
{ "mcpServers": { "pitchfork": { "command": "pitchfork", "args": ["mcp"] } } }
```

Tools: `pitchfork_status`, `pitchfork_start` (supports force restart), `pitchfork_stop`, `pitchfork_restart`, `pitchfork_logs` (default 50 lines). Launch in the project dir for short IDs, or use qualified `ns/name` IDs.

## Source

- HTTP API: https://pitchfork.jdx.dev/reference/http-api.html
- MCP: https://pitchfork.jdx.dev/guides/mcp.html
- Web UI/auth: https://pitchfork.jdx.dev/guides/web-ui.html
