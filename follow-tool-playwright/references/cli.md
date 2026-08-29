# Playwright CLI

## Install

```sh
bun add -D @playwright/test
```

## Version

- Latest: see `@playwright/test` on npm
- Repository: https://github.com/microsoft/playwright
- Docs: https://playwright.dev/docs/test-cli

## Commands

| commands | default | options |
|---|---|---||---|---|---||---|---|---||
| `playwright test [filters]` | Run tests; default `playwright.config.ts`, headless, 50% workers | `-c, --config`, `--debug`, `--headed`, `-g, --grep`, `--project`, `--ui`, `-j, --workers`, `--fully-parallel`, `--forbid-only`, `--fail-on-flaky-tests`, `--global-timeout`, `--max-failures`, `--reporter`, `--output`, `--trace`, `--video` |
| `playwright show-report` | Show HTML report | `--host`, `--port` |
| `playwright show-trace [trace]` | Show trace viewer | `--host`, `--port` |
| `playwright codegen [url]` | Generate test code by recording | `--target`, `--output` |
| `playwright install` | Install browsers | `--with-deps`, `--force` |
| `playwright --help` | Show help | (none) |

## Examples

```sh
bunx playwright test
bunx playwright test --project=chromium --headed
bunx playwright test --grep "signin"
bunx playwright install --with-deps
```
