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
