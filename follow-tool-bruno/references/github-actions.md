# Bruno CLI GitHub Action

> Source: https://docs.usebruno.com/bru-cli/github-actions/overview (verified 2026-09-13)

## Official Action

| Property | Value |
|----------|-------|
| Reference | `usebruno/bruno-cli-action@v1` |
| Repository | https://github.com/usebruno/bruno-cli-action |
| Marketplace | https://github.com/marketplace/actions/bruno-cli |

Composite action: prepend `bru` ให้ `command` อัตโนมัติ, auto-inject `--reporter-junit` เมื่อไม่ระบุ, parse JUnit summary เป็น step outputs, step fail เมื่อ `bru` exit non-zero

**Tip:** เขียน `run --env prod` ไม่ใช่ `bru run --env prod` — action prepend `bru` ให้เอง

## Quick Start

```yaml
name: API Tests
on: [pull_request, push]

jobs:
  bruno:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: usebruno/bruno-cli-action@v1
        with:
          working-directory: tests/api
          command: 'run --env prod'
```

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `command` | yes | — | `bru` subcommand + flags (`bru` prefix ไม่ต้องใส่) |
| `bru-version` | no | `latest` | version ของ `@usebruno/cli` |
| `working-directory` | no | `.` | collection root (folder ที่มี `opencollection.yml`/`bruno.json`) |

CLI flags (`--env`, `--env-var`, `--tags`, `--bail`, `--sandbox`, `--reporter-*`) ใส่ใน `command` ไม่ใช่ action inputs

## Outputs

| Output | Description |
|--------|-------------|
| `exit-code` | exit code จาก `bru` process |
| `passed` / `failed` / `total` | request counts |
| `duration-ms` | run duration |

## Behavior

- **JUnit auto-injection:** ถ้า `command` ไม่มี `--reporter-junit` action จะ append `--reporter-junit "$RUNNER_TEMP/bruno-junit.xml"` — outputs มีค่าเสมอ
- **Exit code:** non-zero = step fail; ใช้ `continue-on-error: true` ถ้าต้องการ soft-fail
- **Versioning:** `@v1` floating major tag; `@v1.2.3` pin เฉพาะ release

## Downstream Actions

Pair กับ `dorny/test-reporter`, `EnricoMi/publish-unit-test-result-action` (PR comments/annotations), `actions/upload-artifact` (HTML/JUnit reports), Slack notify — ดู https://docs.usebruno.com/bru-cli/github-actions/downstream-actions
