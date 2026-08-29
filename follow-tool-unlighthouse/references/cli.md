# Unlighthouse CLI

## Install

```sh
bun add -D unlighthouse
```

## Version

- Latest on npm
- Repository: https://github.com/harlan-zw/unlighthouse
- Docs: https://unlighthouse.dev/api/cli

## Commands

| commands | default | options |
|---|---|---||---|---|---||---|---|---||
| `unlighthouse --site <url>` | Audit site | --output-path, --no-cache, --desktop, --mobile, --samples |
| `unlighthouse-puppeteer` | Run with puppeteer | --site, --urls, --exclude |
| `unlighthouse-ci` | CI mode | --site, --budget, --reporter |
| `unlighthouse --help` | Show help | (none) |
## Examples

```sh
bunx unlighthouse --site https://example.com
```
```sh
bunx unlighthouse-puppeteer --site https://example.com --desktop
```
