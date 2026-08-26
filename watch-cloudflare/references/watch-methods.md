# Watch Methods For Cloudflare Workers

วิธี watch deploy status และ runtime errors ของ Cloudflare Workers

## Wrangler Tail

Stream live logs จาก deployed Workers เพื่อตรวจ runtime errors

```bash
wrangler tail <worker-name> --status error --format json
```

ถ้า run จาก project directory ที่มี `wrangler.jsonc` จะ infer worker name อัตโนมัติ

### Filter Flags

| Flag | Values | Description |
|---|---|---|
| `--status` | `ok` \| `error` \| `canceled` | ระบุได้หลายครั้ง |
| `--method` | HTTP method | GET, POST, etc. |
| `--search` | string | ค้น text ใน console.log |
| `--ip` | array | client IP (`"self"` สำหรับ IP ตัวเอง) |
| `--sampling-rate` | 0-1 | สำหรับ high-traffic Workers |
| `--version-id` | string | filter by Worker version |

### Log Event Fields

| Field | Description |
|---|---|
| `outcome` | `ok`, `exception`, `exceededCpu`, `canceled` |
| `scriptName` | ชื่อ Worker |
| `eventTimestamp` | Unix timestamp (ms) |
| `logs` | console entries (`message`, `level`, `timestamp`) |
| `exceptions` | exceptions (`name`, `message`, `stack`) |
| `event` | triggering event (request, scheduled, alarm) |

### Triage Query

```bash
wrangler tail <worker-name> --status error --format json | jq -c '{
  t: (.eventTimestamp / 1000 | todate),
  outcome,
  url: .event.request.url,
  err: (.exceptions[0].message // "none")
}'
```

## URL Poll

ใช้ `/watch-deploy` เพื่อ poll URL จนกว่าจะ healthy

- `interval` = `10` วินาที
- `timeout` = `300` วินาที
- `expectedStatus` = `[200]`
- `followRedirects` = `true`

### Status Handling

| Status | Action |
|---|---|
| 200 | healthy, หยุดทันที |
| 301/302 | follow redirect |
| 404 | รอ propagation, poll ต่อ |
| 429 | เพิ่ม interval 5 วินาที |
| 500-599 | runtime error, ไป fix |
| network error | retry สูงสุด 5 ครั้ง |

## Deployments List

ตรวจสถานะ deployment ล่าสุดเมื่อ `wrangler tail` ไม่ชัด

```bash
wrangler deployments list
```

แสดงประวัติ deployment พร้อม status และ version ID ของแต่ละ deployment

## Combine Watch

รัน `wrangler tail` และ URL poll พร้อมกันเพื่อตรวจทั้ง runtime errors และ HTTP health

1. เปิด terminal แรก: `wrangler tail <worker-name> --status error --format json`
2. เปิด terminal ที่สอง: `/watch-deploy` ด้วย URL
3. หยุดเมื่อ URL poll ผ่าน 200 และ tail ไม่มี error ใหม่

## Source

- [wrangler tail](https://developers.cloudflare.com/workers/wrangler/commands/tail/)
- [wrangler deployments](https://developers.cloudflare.com/workers/wrangler/commands/deployments/)
- [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
