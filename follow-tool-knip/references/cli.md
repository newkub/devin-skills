# Knip CLI

## Install

```sh
bun add -D knip
```

## Version

- Latest: `6.35.1` (verified 2026-09-13)
- Repository: https://github.com/webpro-nl/knip
- Docs: https://knip.dev/reference/cli

## Commands

| commands | description | default | options |
|---|---|---|---|
| `knip` | Lint project for unused dependencies, exports, files | — | `--config`, `--tsConfig`, `--include`, `--exclude`, `--reporter`, `--no-exit-code`, `--cache` |
| `knip --production` | Only report production-related issues | — | `--strict`, `--workspace`, `--directory` |
| `knip --fix` | Auto-fix issues (only when config settled) | — | `--fix-type`, `--allow-remove-files` |
| `knip-bun` | Bun-specific runner (= `bunx --bun knip`) | — | same as `knip` |
| `knip --help` | Show help | — | (none) |

## Options

| Option | Description |
|---|---|
| `--config [file]` | Path to config file (`knip.json`, `knip.ts`, `package.json#knip`, ...) |
| `--tsConfig [file]` | Path to tsconfig |
| `--workspace [filter]` | Filter workspace (`-W`) |
| `--directory [dir]` | Set cwd (`-D`) |
| `--include [types]` | Include issue types (`files`, `dependencies`, `exports`, `types`, ...) |
| `--exclude [types]` | Exclude issue types |
| `--dependencies` / `--exports` / `--files` / `--cycles` | Shortcut filters for issue-type groups |
| `--reporter [reporter]` | Output reporter (`symbol`, `json`, `compact`, `markdown`, `codeowners`, ...) |
| `--no-exit-code` | Always exit 0 |
| `--cache` / `--cache-location` | Enable cache / set cache dir (`./node_modules/.cache/knip`) |
| `--production` | Production mode (exclude tests, devDependencies) |
| `--strict` | Strict mode (implies `--production`, workspace isolation, peerDeps, type-only imports) |
| `--include-entry-exports` | Report unused exports in entry files |
| `--watch` | Watch mode (`-w`) |
| `--debug` | Verbose output (workspaces, plugins, resolved files) |
| `--treat-config-hints-as-errors` | Exit 1 on config hints |
| `--no-gitignore` | Ignore `.gitignore` files |
| `--performance` / `--duration` | Print timing |

## Examples

```sh
bunx knip
bunx knip --include files,dependencies
bunx knip --production --no-exit-code
bunx knip -W apps/website
bunx knip --debug
```
