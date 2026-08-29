# Bunup CLI

## Install

```sh
bun add -D bunup
```

## Version

- Latest: see `bunup` on npm
- Repository: https://github.com/okikio/bunup
- Docs: https://bunup.dev/docs/guide/cli-options.html

## Commands

| commands | description | default | options |
|---|---|---|---|
| `bunup [entries]` | Bundle default entry points (`src/index.ts`) to `dist/` | — | `-o, --out-dir`, `-f, --format`, `--minify`, `--no-minify`, `--watch`, `--no-watch`, `--clean`, `--no-clean`, `-q, --silent`, `--splitting`, `--exports`, `--entry` |
| `bunup --help` | Show help | — | (none) |

## Examples

```sh
bunx bunup
bunx bunup --format esm
bunx bunup --entry src/index.ts --entry src/cli.ts
bunx bunup --watch
```
