# Rolldown CLI

## Install

```sh
bun add -D rolldown
```

## Version

- Latest: see `rolldown` on npm
- Repository: https://github.com/rolldown/rolldown
- Docs: https://www.rolldown.rs/guide/getting-started

## Commands

| commands | description | default | options |
|---|---|---|---|
| `rolldown <input>` | Bundle entry file to `dist/` with default ESM format | — | `--file`, `--dir`, `--format`, `--name`, `--globals`, `--external`, `--plugin`, `--minify`, `--sourcemap`, `--watch`, `--silent`, `-c, --config` |
| `rolldown -c` / `rolldown --config <file>` | Use `rolldown.config.*` | — | (none) |
| `rolldown --help` | Show help | — | (none) |
| `rolldown --version` | Print version | — | (none) |

## Examples

```sh
bunx rolldown src/main.js --file bundle.js
bunx rolldown -c
bunx rolldown src/index.ts --format cjs --file dist/index.cjs
```
