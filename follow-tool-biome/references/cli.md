| key | value |
|---|---|
| install | `bun add -D @biomejs/biome` |
| repository | https://github.com/biomejs/biome |

| commands | description | default | options |
|---|---|---|---|
| `biome check [PATH...]` | Format, lint, and run assist on files in cwd | report only | `--write`, `--formatter-enabled`, `--linter-enabled`, `--assist-enabled`, `--enforce-assist`, `--stdin-file-path`, `--staged`, `--only`, `--skip` |
| `biome lint [PATH...]` | Lint files in cwd | report only | `--write`, `--unsafe`, `--suppress`, `--reason`, `--only`, `--skip`, `--stdin-file-path`, `--staged`, `--changed`, `--since` |
| `biome format [PATH...]` | Format files in cwd | report only | `--write`, `--stdin-file-path`, `--staged`, `--changed` |
| `biome ci [PATH...]` | Run check optimized for CI | fails on diagnostics | `--formatter-enabled`, `--linter-enabled`, `--assist-enabled`, `--staged`, `--changed` |
| `biome init` | Create `biome.json` with default settings | — | (none) |
| `biome migrate [prettier\|eslint]` | Migrate from Prettier or ESLint config | — | `--write` |
| `biome version` | Print version | — | `--help` |
