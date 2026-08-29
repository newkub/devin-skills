# dprint CLI

## Install

```sh
bun add -D dprint
```

## Version

- Latest: see `dprint` on npm
- Repository: https://github.com/dprint/dprint
- Docs: https://dprint.dev/cli/

## Commands

| commands | description | default | options |
|---|---|---|---|
| `dprint fmt [files]` | Format files in place | respects `.gitignore` | `--check`, `--config`, `--no-gitignore`, `--incremental`, `--config-discovery`, `--plugins` |
| `dprint check [files]` | Check formatting without writing | — | `--config`, `--no-gitignore`, `--config-discovery` |
| `dprint init` | Create `dprint.json` config interactively | — | `--yes` |
| `dprint config update` | Update plugin versions in config | — | `--recursive`, `--dry-run` |
| `dprint config edit` | Edit config interactively | — | (none) |
| `dprint add <plugin>` | Add plugin to config | — | `--checksum` |
| `dprint --help` | Show help | — | (none) |

## Options

| Option | Description |
|---|---|---||---|---|---||
| `--config`, `-c` | Path to config file |
| `--no-gitignore` | Ignore `.gitignore` files |
| `--incremental=false` | Disable incremental formatting |
| `--config-discovery` | Control config discovery (`default`, `ignore-descendants`, `global`, `false`) |
| `--plugins <urls>` | Load plugins via CLI |
| `--allow-no-config` | Allow running without config |

## Examples

```sh
bunx dprint fmt
bunx dprint fmt --check
bunx dprint init --yes
bunx dprint config update --dry-run
```
