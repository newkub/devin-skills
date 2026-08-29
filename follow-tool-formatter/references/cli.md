# Formatter Tools CLI

## Install

```sh
bun add -D @biomejs/biome # or dprint/prettier
```

## Version

- Latest
- Repository: https://github.com/biomejs/biome
- Docs: https://biomejs.dev/reference/cli/

## Commands

| commands | default | options |
|---|---|---||---|---|---||---|---|---||
| `biome format [paths]` | Format files; report only by default | --write, --stdin-file-path, --staged, --changed |
| `dprint fmt [files]` | Format in place; respect .gitignore | --check, --config, --no-gitignore, --incremental |
| `prettier [paths]` | Format and write | --check, --write, --config, --ignore-path |

## Notes

Choose one formatter; Biome is preferred in this skill repository.
