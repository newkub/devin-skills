# Wrangler Tail And Logs

`wrangler tail` สำหรับ stream live logs จาก deployed Workers

## Basic Usage

```bash
npx wrangler tail [WORKER]
```

ถ้า run จาก project directory ที่มี `wrangler.jsonc` จะ infer worker name อัตโนมัติ

## Options

### Output Format

| Flag | Values | Description |
|---|---|---|
| `--format` | `json` \| `pretty` | Default: `pretty` ใน TTY, `json` นอก TTY |

### Filtering

| Flag | Type | Description |
|---|---|---|
| `--status` | array | `ok`, `error`, `canceled` (ระบุได้หลายครั้ง) |
| `--method` | array | HTTP method (GET, POST, etc.) |
| `--header` | string | `Header-Key` หรือ `Header-Key:value` |
| `--ip` | array | Client IP (ใช้ `"self"` สำหรับ IP ตัวเอง) |
| `--search` | string | ค้น text ใน console.log messages |
| `--sampling-rate` | number | 0-1 (เช่น 0.1 = 10%) |
| `--version-id` | string | Filter by Worker version ID |

## Output Structure

แต่ละ log event มี fields:

| Field | Description |
|---|---|
| `outcome` | `ok`, `exception`, `exceededCpu`, `canceled` |
| `scriptName` | ชื่อ Worker |
| `eventTimestamp` | Unix timestamp (ms) |
| `logs` | Array ของ console entries (`message`, `level`, `timestamp`) |
| `exceptions` | Array ของ exceptions (`name`, `message`, `stack`) |
| `event` | Triggering event (request, scheduled, alarm, etc.) |

## Common Examples

```bash
# Stream production logs
npx wrangler tail --env production

# Errors only
npx wrangler tail --status error

# Filter by IP (debug user issues)
npx wrangler tail --ip 203.0.113.42
npx wrangler tail --ip self --status error

# Sample 10% (high-traffic Workers)
npx wrangler tail --sampling-rate 0.1

# Filter by method + search
npx wrangler tail --method POST --search "TypeError"

# Filter by header
npx wrangler tail --header "X-Debug-Id:7f3a"

# JSON output + jq
npx wrangler tail --format=json | jq .event.request.url

# Compact triage for failed requests
npx wrangler tail --status error --format json | jq -c '{
  t: (.eventTimestamp / 1000 | todate),
  outcome,
  url: .event.request.url,
  err: (.exceptions[0].message // "none")
}'
```

## Observability (Persistent Logs)

เปิดใน `wrangler.jsonc` เพื่อเก็บ logs ถาวร:

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

- High-traffic Workers เข้าสู่ sampling mode อาจ drop messages
- สูงสุด 10 clients ดู logs พร้อมกัน
- Real-time logs ไม่ persist ถ้าไม่เปิด observability
- WebSocket handlers: logs แสดงหลัง connection close เท่านั้น
- ใช้เวลาถึง 60 วินาที หลังเพิ่ม filter เพื่อออกจาก sampling mode

## Debug Environment Variables

| Variable | Description |
|---|---|
| `WRANGLER_LOG=debug` | เปิด debug logging |
| `WRANGLER_LOG_PATH=./logs/` | เขียน logs ไปยัง file/directory |
| `WRANGLER_LOG_SANITIZE=false` | แสดง data ที่ถูก sanitize |

## Source

- [wrangler tail](https://developers.cloudflare.com/workers/wrangler/commands/tail/)
- [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
