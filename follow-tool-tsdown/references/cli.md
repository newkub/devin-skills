# tsdown CLI

## Install

```sh
bun add -D tsdown
```

## Version

- Latest: see `tsdown` on npm
- Repository: https://github.com/rolldown/tsdown
- Docs: https://github.com/rolldown/tsdown

## Commands

| commands | default | options |
|---|---|---||---|---|---||---|---|---||
| `tsdown [files]` | Bundle with default `tsdown.config.ts`, output to `dist/` | `-c, --config`, `--no-config`, `--config-loader`, `--tsconfig`, `--root`, `-W, --workspace`, `-F, --filter`, `-f, --format`, `--clean`, `--external`, `--minify`, `--debug`, `--target`, `-d, --out-dir`, `--treeshake`, `--sourcemap`, `--shims`, `--platform`, `--dts`, `--publint`, `--attw`, `--unused`, `-w, --watch`, `--ignore-watch`, `--from-vite`, `--report`, `--env.*`, `--on-success`, `--copy`, `--fail-on-warn` |
| `tsdown --help` | Show help | (none) |

## Examples

```sh
bunx tsdown
bunx tsdown src/index.ts
bunx tsdown --format esm --format cjs
bunx tsdown --watch
```
