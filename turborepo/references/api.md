# API Reference

## Remote Cache API

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable/disable remote cache |
| `signature` | `boolean` | `false` | Enable HMAC signing |
| `timeout` | `number` | `30` | Request timeout (seconds) |
| `uploadTimeout` | `number` | `60` | Upload timeout (seconds) |
| `apiUrl` | `string` | Vercel | Remote cache API URL |
| `loginUrl` | `string` | Vercel | Login URL |
| `teamId` | `string` | - | Team ID (starts with `team_`) |
| `teamSlug` | `string` | - | Team slug |
| `preflight` | `boolean` | `false` | Preflight requests |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `TURBO_TOKEN` | Authentication token |
| `TURBO_TEAM` | Team slug |
| `TURBO_TEAMID` | Team ID |
| `TURBO_API` | API URL |
| `TURBO_LOGIN` | Login URL |
| `TURBO_REMOTE_CACHE_SIGNATURE_KEY` | HMAC signing key |
| `TURBO_PREFLIGHT` | Enable preflight |

### Signing

Enable artifact signature verification:

```json
{
  "remoteCache": {
    "signature": true
  }
}
```

Set signing key via environment:

```bash
export TURBO_REMOTE_CACHE_SIGNATURE_KEY="your-secret-key-at-least-32-bytes"
```

## Package Manager Configuration

### packageManager Field

Specify package manager in `package.json`:

```json
{
  "packageManager": "bun@9.0.0"
}
```

### Disabling Check

```bash
turbo run build --dangerously-disable-package-manager-check
```

## System Environment Variables

| Variable | Description |
|----------|-------------|
| `TURBO_BINARY_PATH` | Custom turbo binary path |
| `TURBO_CACHE` | Cache location |
| `TURBO_CACHE_DIR` | Cache directory |
| `TURBO_CACHE_MAX_AGE` | Max cache age |
| `TURBO_CACHE_MAX_SIZE` | Max cache size |
| `TURBO_FORCE` | Force run |
| `TURBO_SCM_BASE` | Base commit for affected mode |
| `TURBO_SCM_HEAD` | Head commit for affected mode |
| `TURBO_DOWNLOAD_LOCAL_ENABLED` | Download local turbo |
| `TURBO_UI` | UI mode |

## Observability

### OpenTelemetry Configuration

```json
{
  "futureFlags": {
    "experimentalObservability": true
  },
  "experimentalObservability": {
    "otel": {
      "enabled": true,
      "protocol": "grpc",
      "endpoint": "https://api.datadoghq.com/api/v2/otlp",
      "headers": {
        "X-Custom-Header": "value"
      },
      "timeoutMs": 10000,
      "intervalMs": 15000,
      "metrics": {
        "runSummary": true,
        "taskDetails": false
      }
    }
  }
}
```

### Observability Environment Variables

| Variable | Description |
|----------|-------------|
| `TURBO_EXPERIMENTAL_OTEL_ENABLED` | Enable OTEL |
| `TURBO_EXPERIMENTAL_OTEL_ENDPOINT` | OTEL endpoint |
| `TURBO_EXPERIMENTAL_OTEL_PROTOCOL` | Protocol (grpc/http-protobuf) |
| `TURBO_EXPERIMENTAL_OTEL_TIMEOUT_MS` | Timeout |
| `TURBO_EXPERIMENTAL_OTEL_INTERVAL_MS` | Export interval |
| `TURBO_EXPERIMENTAL_OTEL_HEADERS` | HTTP headers |
| `TURBO_EXPERIMENTAL_OTEL_METRICS_RUN_SUMMARY` | Run summary |
| `TURBO_EXPERIMENTAL_OTEL_METRICS_TASK_DETAILS` | Task details |