# Knip CLI

## Install

```sh
bun add -D knip
```

## Version

- Latest: see `knip` on npm
- Repository: https://github.com/webpro/knip
- Docs: https://knip.dev/reference/cli

## Commands

| commands | description | default | options |
|---|---|---|---|
| `knip` | Lint project for unused dependencies, exports, files | — | `--config`, `--tsConfig`, `--include`, `--exclude`, `--reporter`, `--no-exit-code`, `--cache` |
| `knip --production` | Only report production-related issues | — | `--strict`, `--workspace`, `--directory` |
| `knip-bun` | Bun-specific runner | — | same as `knip` |
| `knip --help` | Show help | — | (none) |

## Options

| Option | Description |
|---|---|---||---|---|---||
| `--config [file]` | Path to config file |
| `--tsConfig [file]` | Path to tsconfig |
| `--workspace [filter]` | Filter workspace |
| `--directory [dir]` | Set cwd |
| `--include [types]` | Include issue types |
| `--exclude [types]` | Exclude issue types |
| `--reporter [reporter]` | Output reporter |
| `--no-exit-code` | Always exit 0 |
| `--cache` | Enable cache |
| `--cache-location` | Cache directory |
| `--production` | Production mode |
| `--strict` | Strict mode |
| `--watch` | Watch mode |
| `--performance` / `--duration` | Print timing |

## Examples

```sh
bunx knip
bunx knip --include files,dependencies
bunx knip --production --no-exit-code
```
