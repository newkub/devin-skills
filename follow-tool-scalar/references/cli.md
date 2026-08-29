# Scalar CLI

## Install

```sh
bun add -D @scalar/cli
```

## Version

- Latest on npm
- Repository: https://github.com/scalar/scalar
- Docs: https://github.com/scalar/scalar

## Commands

| commands | description | default | options |
|---|---|---|---|
| `scalar` | Start Scalar server | — | --config, --file, --port, --output |
| `scalar serve` | Serve API docs | — | --config, --file, --port |
| `scalar validate` | Validate OpenAPI spec | — | --file |
| `scalar init` | Initialize project | — | --yes |
| `scalar --help` | Show help | — | (none) |
## Examples

```sh
bunx scalar serve openapi.json
```
```sh
bunx scalar validate api.json
```
