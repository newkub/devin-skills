| command | description | notes |
|---|---|---|
| `fnox exec -- <cmd>` | run a child command with resolved secrets injected | fnox options go before `--` |
| `fnox get <KEY>` | resolve and print one secret | `--refresh`, `--base64-decode` |
| `fnox list` | list the secrets in the active profile | |
| `fnox env` / `fnox export` | print resolved values in shell-consumable form | |
| `fnox check [-a]` | validate config and provider access | `--all` covers every profile |
| `fnox set <KEY> [VALUE]` | store a secret through its provider | prompts for the value when omitted |
| `fnox remove <KEY>` | delete a secret binding | `-g/--global`, `-n/--dry-run` |
| `fnox import <FORMAT>` | migrate secrets from another store | |
| `fnox sync [KEYS]` | push/pull provider values | age: local cache |
| `fnox reencrypt [KEYS]` | re-encrypt with the current recipients | after rotating keys |
| `fnox edit` | open the resolved config in `$EDITOR` | |
| `fnox init` | scaffold `fnox.toml` | |
| `fnox provider add <NAME> <TYPE>` | add a provider | `list`, `remove -g`, `test -a` |
| `fnox plugin install <NAME> <SOURCE>` | add a provider plugin | `link`, `ls`, `uninstall`, `update` |
| `fnox profiles` / `fnox config-files` | show active profiles / resolved config files | |
| `fnox activate [SHELL]` / `fnox deactivate` | enable/disable shell integration | |
| `fnox daemon start\|stop\|status\|clear` | control the in-memory cache daemon | `--no-daemon` bypasses it |
| `fnox lease create\|list\|revoke\|cleanup` | temporary credentials | `--active`, `--expired` |
| `fnox proxy rules` / `fnox proxy run` | inject real values into matching HTTPS requests | placeholders reach the agent |
| `fnox doctor` / `fnox scan [DIR]` | diagnose setup / scan for hardcoded secrets | |
| `fnox tui` / `fnox mcp` | interactive manager / MCP server | |
| `fnox completion <SHELL>` / `fnox version` | shell completion / version | |

| flag | default | meaning |
|---|---|---|
| `-c, --config <path>` | `fnox.toml` | bare filenames search cwd upward; any other path loads only that file |
| `-P, --profile <name>` | `FNOX_PROFILE`, then `default` | repeat or comma-separate to layer; later overrides earlier |
| `--if-missing <mode>` | config value | `error`, `warn`, `ignore` — beats `FNOX_IF_MISSING` and per-secret values |
| `--write-profile <name>` | active profile | profile that write commands modify |
| `--no-daemon` | false | resolve directly instead of through the daemon |
| `--no-defaults` | false | only the selected profile's secrets, skip top-level `[secrets]` |
| `--non-interactive` | false | never prompt or open a browser (`FNOX_NON_INTERACTIVE`) |
| `-v, --verbose` | false | debug logs to stderr |
| `--no-color` | false | disable colored output |
