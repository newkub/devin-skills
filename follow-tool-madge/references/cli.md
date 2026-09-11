# Tool Madge CLI

## Install

```sh
bun add -D madge
```

## Commands

| Command | Description | Options |
|---|---|---|
| `bunx madge src/` | Print dependency tree | --exclude, --include-npm |
| `bunx madge --circular src/` | List circular dependencies | --warning |
| `bunx madge --depends <path> src/` | Find dependents | - |
| `bunx madge --orphans src/` | Unused files | - |
| `bunx madge --image graph.svg src/` | Render graph | --layout dot, --rankdir |
| `bunx madge --json src/` | Machine-readable | --dot (graphviz text) |

## Examples

```sh
bunx madge --circular --extensions ts,tsx src/
bunx madge --image deps.svg --layout circo src/
bunx madge --orphans src/ | wc -l
```
