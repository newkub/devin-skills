| key | value |
|---|---|
| version | 8.0.0 |
| repository | https://github.com/pahen/madge |
| docs | https://github.com/pahen/madge#readme |

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

| Flag | Description |
|---|---|
| `--ts-config <file>` | Resolve TS path aliases |
| `--extensions ts,tsx` | Limit parsed extensions |
| `--exclude <regex>` | Skip matching paths |
| `--exit-code <n>` | Exit with code on circular (required for CI gate; default 0) |
| `--warning` | Show skipped files |
| `--debug` | Verbose parse details |
| `--basedir`, `--ts-config`, `--webpack-config` | Resolver hints |
