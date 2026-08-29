# Git Hooks CLI

## Install

```sh
bun add -D lefthook # or hk / husky
```

## Version

- Latest
- Repository: https://github.com/evilmartians/lefthook
- Docs: https://github.com/evilmartians/lefthook

## Commands

| commands | description | default | options |
|---|---|---|---|
| `lefthook install` | Install git hooks | — | -f, --force |
| `lefthook run <hook>` | Run hook manually | — | -a, --all-files, -f, --force |
| `lefthook uninstall` | Remove hooks | — | (none) |
| `lefthook dump` | Dump config | — | (none) |
## Examples

```sh
bunx lefthook install
```
```sh
bunx lefthook run pre-commit
```
