
# Wrangler Triggers And Cron

Cron Triggers run a Worker on a schedule

## Overview

- Cron Triggers run on UTC time
- They use underutilized machines for efficiency
- Changes can take up to 15 minutes to propagate
- When using Wrangler, manage triggers through config only

## `wrangler triggers deploy`

Apply trigger changes (for the versions workflow)

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
| `--dry-run` | - | Do not really deploy |

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

- After deploy, the new crons replace all existing ones
- `crons: []` = delete all triggers
- `crons` undefined = leave the current triggers unchanged
- Commenting out is not the same as disabling — use an empty array

## Cron Syntax

5 fields: minute, hour, day-of-month, month, weekday

| Field | Values | Special chars |
|---|---|---|
| Minute | 0-59 | `*` `,` `-` `/` |
| Hours | 0-23 | `*` `,` `-` `/` |
| Day of Month | 1-31 | `*` `,` `-` `/` `L` `W` |
| Month | 1-12 or JAN-DEC | `*` `,` `-` `/` |
| Weekday | 1-7 or SUN-SAT | `*` `,` `-` `/` `L` `#` |

Important: weekday 1=Sunday through 7=Saturday (unlike other crons where 0=Sunday)

| Special | Description |
|---|---|
| `L` | Last (e.g. last day of month) |
| `W` | Nearest weekday |
| `#` | Nth weekday (e.g. 3#2 = second Tuesday) |

## Common Expressions

| Expression | Description |
|---|---|
| `* * * * *` | Every minute |
| `*/5 * * * *` | Every 5 minutes |
| `*/30 * * * *` | Every 30 minutes |
| `0 * * * *` | Every hour on the hour |
| `0 2 * * *` | Daily at 02:00 UTC |
| `0 0 * * 1` | Every Monday at 00:00 UTC |
| `0 17 * * sun` | Every Sunday at 17:00 UTC |
| `10 7 * * mon-fri` | 07:10 UTC on weekdays |
| `0 15 1 * *` | First day of the month at 15:00 UTC |
| `0 18 * * 6L` | Last Friday of the month at 18:00 UTC |
| `59 23 LW * *` | Last weekday of the month at 23:59 UTC |

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
| `controller.cron` | The cron expression that triggered it |
| `controller.type` | Returns `"scheduled"` |
| `controller.scheduledTime` | The scheduled time (ms since epoch) |

## Testing Locally

```bash
npx wrangler dev --test-scheduled
```

Test endpoints:
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

- [wrangler triggers](https://developers.cloudflare.com/workers/wrangler/commands/)
- [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)

