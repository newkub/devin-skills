# Wrangler Triggers And Cron

Cron Triggers สำหรับ run Worker ตาม schedule

## Overview

- Cron Triggers run ตาม UTC time
- ใช้ underutilized machines เพื่อ efficiency
- Changes ใช้เวลาถึง 15 นาที propagate
- ถ้าใช้ Wrangler ควรจัดการ triggers ผ่าน config เท่านั้น

## `wrangler triggers deploy`

Apply trigger changes (สำหรับ versions workflow)

```bash
npx wrangler triggers deploy --name my-worker --triggers "*/5 * * * *"
npx wrangler triggers deploy --name my-worker --triggers "*/5 * * * *" "0 0 * * *"
npx wrangler triggers deploy --name my-worker --triggers "0 * * * *" --dry-run
```

| Flag | Alias | Description |
|---|---|---|
| `--name` | - | Worker name (required) |
| `--triggers` | `--schedule`, `--schedules` | Cron schedules |
| `--routes` | `--route` | Routes to upload |
| `--dry-run` | - | ไม่ deploy จริง |

## Configuration

### wrangler.jsonc

```jsonc
{
  "triggers": {
    "crons": [
      "*/3 * * * *",
      "0 15 1 * *",
      "59 23 LW * *"
    ]
  }
}
```

### Per-Environment

```jsonc
{
  "env": {
    "dev": {
      "triggers": {
        "crons": ["0 * * * *"]
      }
    }
  }
}
```

### Behavior

- Deploy แล้ว crons ใหม่ replace ของเดิมทั้งหมด
- `crons: []` = ลบ triggers ทั้งหมด
- `crons` undefined = ไม่เปลี่ยน triggers ปัจจุบัน
- Comment out ไม่ได้หมายถึง disable ต้องใช้ empty array

## Cron Syntax

5 fields: minute, hour, day-of-month, month, weekday

| Field | Values | Special chars |
|---|---|---|
| Minute | 0-59 | `*` `,` `-` `/` |
| Hours | 0-23 | `*` `,` `-` `/` |
| Day of Month | 1-31 | `*` `,` `-` `/` `L` `W` |
| Month | 1-12 หรือ JAN-DEC | `*` `,` `-` `/` |
| Weekday | 1-7 หรือ SUN-SAT | `*` `,` `-` `/` `L` `#` |

สำคัญ: weekday 1=Sunday ถึง 7=Saturday (ต่างจาก cron อื่นที่ 0=Sunday)

| Special | Description |
|---|---|
| `L` | Last (เช่น last day of month) |
| `W` | Nearest weekday |
| `#` | Nth weekday (เช่น 3#2 = second Tuesday) |

## Common Expressions

| Expression | Description |
|---|---|
| `* * * * *` | ทุกนาที |
| `*/5 * * * *` | ทุก 5 นาที |
| `*/30 * * * *` | ทุก 30 นาที |
| `0 * * * *` | ทุกชั่วโมงตรง |
| `0 2 * * *` | ทุกวัน 02:00 UTC |
| `0 0 * * 1` | ทุกจันทร์ 00:00 UTC |
| `0 17 * * sun` | ทุกอาทิตย์ 17:00 UTC |
| `10 7 * * mon-fri` | 07:10 UTC วันธรรมดา |
| `0 15 1 * *` | วันแรกของเดือน 15:00 UTC |
| `0 18 * * 6L` | ศุกร์สุดท้ายของเดือน 18:00 UTC |
| `59 23 LW * *` | วันธรรมดาสุดท้ายของเดือน 23:59 UTC |

## Scheduled Handler

```typescript
export default {
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    console.log("cron processed");
  },
};
```

### Multiple Crons

```typescript
export default {
  async scheduled(controller, env, ctx) {
    switch (controller.cron) {
      case "*/5 * * * *":
        await refreshCache(env);
        break;
      case "0 0 * * *":
        await dailyReport(env);
        break;
    }
  },
};
```

### ScheduledController Properties

| Property | Description |
|---|---|
| `controller.cron` | Cron expression ที่ trigger |
| `controller.type` | คืนค่า `"scheduled"` |
| `controller.scheduledTime` | เวลาที่ schedule (ms since epoch) |

## Testing Locally

```bash
npx wrangler dev --test-scheduled
```

เปิด test endpoint:
- JS/TS: `http://localhost:8787/__scheduled`
- Python: `http://localhost:8787/cdn-cgi/handler/scheduled`

```bash
# Trigger with specific cron
curl "http://localhost:8787/__scheduled?cron=*/5+*+*+*+*"

# Override scheduled time
curl "http://localhost:8787/__scheduled?cron=*/5+*+*+*+*&time=1234567890000"
```

## Limits

| Plan | Crons per account |
|---|---|
| Free | 5 |
| Paid | 250 |

## Source

- [wrangler triggers](https://developers.cloudflare.com/workers/wrangler/commands/triggers/)
- [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)
