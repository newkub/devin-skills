# Scalar CLI

## Install

```sh
bun add -D @scalar/cli
```

## Version

- Latest: `@scalar/cli@2.1.0` (verified 2026-09-13)
- Repository: https://github.com/scalar/scalar
- Docs: https://guides.scalar.com

## Commands

| commands | description | default | options |
|---|---|---|---|
| `scalar init` | Create starter `scalar.config.json` | — | (none) |
| `scalar document validate <file>` | Validate OpenAPI spec (Swagger 2.0 / OAS 3.0 / 3.1) | — | (none) |
| `scalar document mock <file>` | Run mock server from OpenAPI (validates requests, `422` on violation) | — | `--watch`, `--port` |
| `scalar document serve <file>` | Preview API reference locally | — | (none) |
| `scalar document lint <file>` | Lint with Spectral rules | — | (none) |
| `scalar document bundle <file>` | Resolve `$refs` and external deps | — | (none) |
| `scalar document markdown <file>` | Generate Markdown docs | — | (none) |
| `scalar registry` | Manage Scalar registry | — | (none) |
| `scalar project` | Manage Scalar docs project | — | (none) |
| `scalar --help` | Show help | — | (none) |

## Examples

```sh
bunx @scalar/cli document validate openapi.yaml
```
```sh
bunx @scalar/cli document mock openapi.yaml --watch --port 8080
```
```sh
bunx @scalar/cli document serve openapi.yaml
```
