# hk CLI

## Install

```sh
bun add -D hk
```

## Version

- Latest on npm
- Repository: https://github.com/chshersh/hk
- Docs: https://github.com/chshersh/hk

## Commands

| commands | default | options |
|---|---|---||---|---|---||---|---|---||
| `hk install` | Install hooks | -f, --force |
| `hk run [hook]` | Run hook or all hooks | --all-files, --from-ref, --to-ref, --staged, --no-stash |
| `hk add <hook> <cmd>` | Add hook command | --stage |
| `hk uninstall` | Remove hooks | (none) |
| `hk --help` | Show help | (none) |
## Examples

```sh
bunx hk install
```
```sh
bunx hk run pre-commit
```
```sh
bunx hk --help
```
