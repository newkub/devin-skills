| key | value |
|---|---|
| install | `bun add -D dprint` |
| repository | https://github.com/dprint/dprint |
| docs | https://dprint.dev/cli/ |

| commands | description | default | options |
|---|---|---|---|
| `dprint fmt [files]` | Format files in place | respects `.gitignore` | `--check`, `--config`, `--no-gitignore`, `--incremental`, `--config-discovery`, `--plugins` |
| `dprint check [files]` | Check formatting without writing | — | `--config`, `--no-gitignore`, `--config-discovery` |
| `dprint init` | Create `dprint.json` config interactively | — | `--yes` |
| `dprint config update` | Update plugin versions in config | — | `--recursive`, `--dry-run` |
| `dprint config edit` | Edit config interactively | — | (none) |
| `dprint add <plugin>` | Add plugin to config | — | `--checksum` |
| `dprint --help` | Show help | — | (none) |

| Option | Description |
|---|---|---||---|---|---||
| `--config`, `-c` | Path to config file |
| `--no-gitignore` | Ignore `.gitignore` files |
| `--incremental=false` | Disable incremental formatting |
| `--config-discovery` | Control config discovery (`default`, `ignore-descendants`, `global`, `false`) |
| `--plugins <urls>` | Load plugins via CLI |
| `--allow-no-config` | Allow running without config |
