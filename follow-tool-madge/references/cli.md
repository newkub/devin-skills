# Tool Madge CLI

## Install

```sh
bun add -D madge
```

## Version

- Latest: `8.0.0` (npm, verified 2026-09-13) — requires Node.js >=18
- Repository: https://github.com/pahen/madge
- Docs: https://github.com/pahen/madge#readme

## Commands

| Command | Description | Options |
|---|---|---|
| `bunx madge src/` | Print dependency tree | --exclude, --include-npm |
| `bunx madge --circular src/` | List circular dependencies | --warning, --exit-code |
| `bunx madge --depends <path> src/` | Find dependents | - |
| `bunx madge --orphans src/` | Files nobody imports | - |
| `bunx madge --leaves src/` | Files that import nothing | - |
| `bunx madge --image graph.svg src/` | Render graph (needs Graphviz) | --layout dot, --rankdir |
| `bunx madge --json src/` | Machine-readable output | --dot (graphviz text) |
| `bunx madge --summary src/` | Summary stats | - |

## Common Flags

| Flag | Description |
|---|---|
| `--ts-config <file>` | Resolve TS path aliases |
| `--extensions ts,tsx` | Limit parsed extensions |
| `--exclude <regex>` | Skip matching paths |
| `--exit-code <n>` | Exit with code on circular (required for CI gate; default 0) |
| `--warning` | Show skipped files |
| `--debug` | Verbose parse details |
| `--basedir`, `--ts-config`, `--webpack-config` | Resolver hints |

## Examples

```sh
bunx madge --circular --exit-code 1 --extensions ts,tsx src/
bunx madge --image deps.svg --layout circo src/
bunx madge --orphans src/ | wc -l
bunx madge --depends src/utils/date.ts src/
```
