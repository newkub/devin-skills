# React Scan CLI

## Install

```sh
bun add -D react-scan
```

## Version

- Latest on npm
- Repository: https://github.com/aidenybai/react-scan
- Docs: https://github.com/aidenybai/react-scan

## Commands

| commands | description | default | options |
|---|---|---|---|
| `react-scan` | Start React Scan overlay | — | --port, --no-open, --output |
| `react-scan <url>` | Scan URL | — | --headless, --port, --output |
| `react-scan init` | Detect framework and install react-scan automatically | — | (none) |
| `bunx react-scan` | Run without install | — | (none) |
| `react-scan --help` | Show help | — | (none) |
## Examples

```sh
bunx react-scan
```
```sh
bunx react-scan http://localhost:3000
```
```sh
bunx -y react-scan@latest init
```
