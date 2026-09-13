# Unlighthouse CLI

## Install

```sh
bun add -D unlighthouse
```

## Version

- Latest: `0.18.0` (verified 2026-09-13) — requires Node.js >= 22.18.0
- Repository: https://github.com/harlan-zw/unlighthouse
- Docs: https://unlighthouse.dev/api/cli

## Commands

| commands | description | default | options |
|---|---|---|---|
| `unlighthouse --site <url>` | Audit site (opens dashboard at `localhost:5678`) | — | `--root`, `--config-file`, `--output-path`, `--cache`/`--no-cache`, `--desktop`, `--mobile`, `--throttle`, `--samples`, `--debug` |
| `unlighthouse-puppeteer` | Run with puppeteer | — | `--site`, `--urls`, `--exclude` |
| `unlighthouse-ci` | CI mode (exit 1 on budget fail) | — | `--site`, `--budget`, `--build-static`, `--reporter` (`json`, `jsonExpanded`, `csv`, `csvExpanded`, `lighthouseServer`), `--lhci-host`, `--lhci-build-token` |
| `unlighthouse --help` | Show help | — | (none) |

## Examples

```sh
bunx unlighthouse --site https://example.com
```
```sh
bunx unlighthouse-puppeteer --site https://example.com --desktop
```
