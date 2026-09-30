| key | value |
|---|---|
| install | `bun add -D @biomejs/biome # or dprint/prettier` |
| repository | https://github.com/biomejs/biome |
| docs | https://biomejs.dev/reference/cli/ |

| commands | description | default | options |
|---|---|---|---|
| `biome format [paths]` | Format files | report only by default | --write, --stdin-file-path, --staged, --changed |
| `dprint fmt [files]` | Format in place | respect .gitignore | --check, --config, --no-gitignore, --incremental |
| `prettier [paths]` | Format and write | — | --check, --write, --config, --ignore-path |
