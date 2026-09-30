| key | value |
|---|---|
| install | `bun add -D @biomejs/biome # or oxlint/eslint` |
| repository | https://github.com/biomejs/biome |
| docs | https://biomejs.dev/reference/cli/ |

| commands | description | default | options |
|---|---|---|---|
| `biome lint [paths]` | Lint files; report only by default | — | --write, --unsafe, --only, --skip, --staged |
| `oxlint [paths]` | Lint current directory | — | --fix, --config, --deny, --warn, --allow, --max-warnings |
| `eslint [paths]` | Lint with flat config | — | --fix, --config, --quiet, --max-warnings, --format |
