# CLI Commands

Command-line interface for Renovate

## Installation

```bash
# Global installation
bun install -g renovate

# Local usage with npx
npx renovate --version
```

## Commands

| Command | Description | Example |
|---------|-------------|---------|
| `--version` | แสดงเวอร์ชัน | `renovate --version` |
| `--help` | แสดง help | `renovate --help` |
| `--dry-run` | รันแบบ dry-run | `renovate --dry-run` |
| `--config` | ระบุ config file | `renovate --config=renovate.json` |
| `--platform` | ระบุ platform | `renovate --platform=github` |

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--repository` | repository เป้าหมาย | current repo |
| `--token` | access token | from env |
| `--pr-hourly-limit` | จำกัด PR ต่อชั่วโมง | 2 |
| `--pr-day-limit` | จำกัด PR ต่อวัน | null |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `RENOVATE_TOKEN` | platform token |
| `RENOVATE_PLATFORM` | github, gitlab, bitbucket |
| `RENOVATE_AUTODISCOVER` | discover all repos |
| `RENOVATE_GIT_AUTHOR` | git author |

## Examples

```bash
# Dry-run
npx renovate --dry-run

# Self-hosted
RENOVATE_TOKEN=xxx RENOVATE_PLATFORM=github npx renovate

# Validate config
npx renovate:config:validate
```

---

For more details, see [Renovate CLI Documentation](https://docs.renovatebot.com/cli).