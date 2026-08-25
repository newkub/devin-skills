# Wrangler CLI References Index

ไฟล์อ้างอิง Wrangler CLI แยกตาม single responsibility

## Files

| File | Responsibility |
|---|---|
| [overview.md](overview.md) | ข้อมูลทั่วไป + version + migration + source |
| [install-and-auth.md](install-and-auth.md) | ติดตั้ง + authentication |
| [init-and-config.md](init-and-config.md) | สร้างโปรเจกต์ + config file (jsonc/toml/env) |
| [commands.md](commands.md) | คำสั่งหลัก + advanced platform (queues/workflows/hyperdrive/vectorize) |
| [bindings.md](bindings.md) | Secrets + D1 + KV + R2 bindings |
| [d1-migrations.md](d1-migrations.md) | D1 migrations workflow |
| [tail-and-logs.md](tail-and-logs.md) | `wrangler tail` + log filtering + observability |
| [versions-and-rollback.md](versions-and-rollback.md) | Version management + gradual deployments + rollback |
| [pages.md](pages.md) | Cloudflare Pages commands + configuration |
| [triggers-and-cron.md](triggers-and-cron.md) | Cron triggers + scheduled handler |
| [ci-cd.md](ci-cd.md) | CI/CD integration |
| [troubleshooting.md](troubleshooting.md) | ปัญหาที่พบบ่อย + error codes + debug |

## Source

แยกมาจาก `wrangler-cli.md` (รวม 211 บรรทัด) ตามหลัก single responsibility และขยายด้วย official Cloudflare docs
