| key | value |
|---|---|
| install | `pitchfork daemons add worker --run './worker' --retry 3 --watch 'src/**/*.ts'` |
| docs | https://pitchfork.jdx.dev/cli/ |

| Command | Aliases | Description | Key flags |
|---|---|---|---|
| `pitchfork start [ID]…` | `s` | Start daemon(s) from pitchfork.toml; waits for readiness | `-a --all`, `-l --local`, `-g --global`, `--group`, `-f --force`, `--delay`, `--output`, `--http`, `--port`, `--cmd`, `--health-*`, `--expected-port`, `--bump`, `-q` |
| `pitchfork stop [ID]…` | `kill` | Graceful stop (signal → SIGKILL), reverse dep order | `-a --all`, `-l --local`, `-g --global`, `--group` |
| `pitchfork restart [ID]…` | — | = `start --force`; reloads config | `-a -l -g`, `--group`, ready/health overrides, `-q` |
| `pitchfork run <ID> [-- CMD]…` | `r` | Ad-hoc daemon without config file | `-f`, `--retry`, `-d/--delay`, `-o/--output`, `--http`, `--port`, `--cmd`, `--health-*`, `--expected-port`, `--bump`, `-q` |
| `pitchfork wait [ID]…` | `w` | Block until daemons stop; tails logs; propagates exit code | `--group`, `--kill` (signal stops waited daemons; exit 128+sig) |
| `pitchfork enable <ID>` | — | Allow daemon to start | — |
| `pitchfork disable <ID>` | — | Prevent starts (incl. cron/auto) | — |

| Command | Aliases | Description | Key flags |
|---|---|---|---|
| `pitchfork list` | `ls` | Table of tracked + available daemons | `--json`, `--status` (repeatable: running/stopped/waiting/stopping/failed/errored/available/disabled), `--namespace` (repeatable), `--project`, `--hide-header` |
| `pitchfork status <ID>` | `stat` | Single daemon detail (PID, status, ports, proxy URL) | `--json` |
| `pitchfork logs [ID]…` | `l` | Logs from SQLite store; multi-daemon interleaved | `-t/--tail` (`-f`,`--follow`), `-n`, `-s/--since`, `-u/--until`, `--grep` (OR, `--case-sensitive`), `--regex`, `--level`, `--field K=V` (AND), `--jq <expr>`, `--json`, `--raw`, `--no-timestamp`, `--no-pager`, `-c/--clear` |
| `pitchfork daemons [--json]` | — | List configured daemons | subcommands below |
| `pitchfork daemons add <ID> [ARGS]…` | `a` | Append daemon to nearest pitchfork.toml | `--run`, `--retry`, `--watch`, `--dir`, `--env`, `--ready-*`, `--health-*`, `--expected-port`, `--bump`, `--depends`, `--boot-start`, `--autostart`, `--autostop`, `--on-*`, `--cron-schedule`, `--cron-retrigger`, `--cron-immediate`, `--local`, `--project`, `--global` |
| `pitchfork daemons remove <ID>` | — | Remove daemon from config | — |
| `pitchfork clean [NAMESPACE]…` | `c` | Remove stopped/failed entries from list | `--daemon <ID>` (repeatable), `--prune` (missing dirs only) |

| Command | Description | Key flags |
|---|---|---|
| `pitchfork supervisor run` | Foreground supervisor | `-f`, `--boot`, `--container` (PID1), `--web-port`, `--web-path` |
| `pitchfork supervisor start` | Background supervisor | `-f --force` (restart to apply settings) |
| `pitchfork supervisor status` | Supervisor state | `--json` |
| `pitchfork supervisor stop` | Stop supervisor (affects managed daemons) | — |
| `pitchfork boot enable` | Register at login (`sudo` = system-level) | — |
| `pitchfork boot disable` / `status` | Remove / inspect registration | — |
| `pitchfork activate <SHELL>` | Print shell hook (bash/zsh/fish) | — |
| `pitchfork completion <SHELL>` | Print shell completions | — |
| `pitchfork mcp` | stdio MCP server (tools: status/start/stop/restart/logs) | — |
| `pitchfork tui` | Terminal dashboard | `--namespace` (repeatable), `--project` |
| `pitchfork sponsors` | Show sponsors | — |

| Command | Description | Key flags |
|---|---|---|
| `pitchfork project enter` | Mark session active, run auto-start | `--pid` (req), `--directory` |
| `pitchfork project leave` | Mark session inactive → auto-stop eval | `--pid` (req), `--directory` |
| `pitchfork project list` | List active sessions (alive/dead) | `--json` |
| `pitchfork config list` | List attached external config files | `--json` |
| `pitchfork config add <FILE>` | Attach external config to a project | `--dir`, `--namespace` |
| `pitchfork config remove <FILE>` | Detach (keeps file + registration) | — |
| `pitchfork settings list` | All settings + effective values | `--group`, `--json` |
| `pitchfork settings get <KEY>` | Effective value | `--json` |
| `pitchfork settings set <KEY> <VAL>` | Write to config file | `--project` (default), `--local`, `--global` |
| `pitchfork settings explain <KEY>` | Show which file/env won | — |
| `pitchfork proxy add <SLUG>` | Register slug → project daemon | `--dir`, `--daemon` |
| `pitchfork proxy remove <SLUG>` | Remove slug | — |
| `pitchfork proxy status` | Slugs + state | `--json` |
| `pitchfork proxy trust` / `untrust` | Install/remove proxy CA in system trust store | `--cert` |
