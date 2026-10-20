
# Wrangler Tail And Logs

`wrangler tail` streams live logs from deployed Workers

## Basic Usage

```bash
bunx wrangler tail [WORKER]
```

When run from a project directory with `wrangler.jsonc`, the worker name is inferred automatically

## Options

### Output Format

| Flag | Values | Description |
|---|---|---|
| `--format` | `json` \| `pretty` | Default: `pretty` in a TTY, `json` outside a TTY |

### Filtering

| Flag | Type | Description |
|---|---|---|
| `--status` | array | `ok`, `error`, `canceled` (can be repeated) |
| `--method` | array | HTTP method (GET, POST, etc.) |
| `--header` | string | `Header-Key` or `Header-Key:value` |
| `--ip` | array | Client IP (use `"self"` for your own IP) |
| `--search` | string | Search text in console.log messages |
| `--sampling-rate` | number | 0-1 (e.g. 0.1 = 10%) |
| `--version-id` | string | Filter by Worker version ID |

## Output Structure

Each log event has these fields:

| Field | Description |
|---|---|
| `outcome` | `ok`, `exception`, `exceededCpu`, `canceled` |
| `scriptName` | Worker name |
| `eventTimestamp` | Unix timestamp (ms) |
| `logs` | Array of console entries (`message`, `level`, `timestamp`) |
| `exceptions` | Array of exceptions (`name`, `message`, `stack`) |
| `event` | Triggering event (request, scheduled, alarm, etc.) |

## Common Examples

```bash
# Stream production logs
bunx wrangler tail --env production

# Errors only
bunx wrangler tail --status error

# Filter by IP (debug user issues)
bunx wrangler tail --ip 203.0.113.42
bunx wrangler tail --ip self --status error

# Sample 10% (high-traffic Workers)
bunx wrangler tail --sampling-rate 0.1

# Filter by method + search
bunx wrangler tail --method POST --search "TypeError"

# Filter by header
bunx wrangler tail --header "X-Debug-Id:7f3a"

# JSON output + jq
bunx wrangler tail --format=json | jq .event.request.url

# Compact triage for failed requests
bunx wrangler tail --status error --format json | jq -c '{
  t: (.eventTimestamp / 1000 | todate),
  outcome,
  url: .event.request.url,
  err: (.exceptions[0].message // "none")
}'
```

## Observability (Persistent Logs)

Enable in `wrangler.jsonc` to retain logs persistently:

```jsonc
{
  "observability": {
    "enabled": true,
    "logs": {
      "enabled": true,
      "head_sampling_rate": 1
    }
  }
}
```

## Limitations

- High-traffic Workers enter sampling mode and may drop messages
- At most 10 clients can view logs concurrently
- Real-time logs are not persisted unless observability is enabled
- WebSocket handlers: logs appear only after the connection closes
- It can take up to 60 seconds after adding a filter to leave sampling mode

## Debug Environment Variables

| Variable | Description |
|---|---|
| `WRANGLER_LOG=debug` | Enable debug logging |
| `WRANGLER_LOG_PATH=./logs/` | Write logs to a file/directory |
| `WRANGLER_LOG_SANITIZE=false` | Show sanitized data |

## Source

- [wrangler tail](https://developers.cloudflare.com/workers/wrangler/commands/workers/)
- [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)

