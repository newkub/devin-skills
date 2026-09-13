# pitchfork Reference

## Overview

Pitchfork is a daemon/process supervisor for development workflows. CLI/TUI/Web UI/MCP clients talk to a persistent supervisor that tracks processes, logs (SQLite), schedules, and watchers across invocations. Daemons outlive the terminal that started them.

- Crate: `pitchfork-cli` → binary `pitchfork` | Latest: `2.25.0` (verified 2026-09-13) | MIT
- Repo: https://github.com/jdx/pitchfork | Docs: https://pitchfork.jdx.dev

## Install

```sh
mise use -g pitchfork                    # recommended (global)
mise use pitchfork@2.25.0                # pin per project
cargo install pitchfork-cli --locked     # via cargo
# binaries: https://github.com/jdx/pitchfork/releases (macOS, Linux, Windows)
```

Shell completion (separate from shell hook):

```sh
pitchfork completion bash > ~/.local/share/bash-completion/completions/pitchfork
pitchfork completion zsh > ~/.zfunc/_pitchfork   # needs fpath + compinit
pitchfork completion fish > ~/.config/fish/completions/pitchfork.fish
```

Windows notes: daemon shell defaults to `cmd /C`. For POSIX behavior put Git's `sh.exe` on PATH and set `[settings.general] shell = "sh -c"`. Unix-only features: `user`, signals, boot integration, automatic crashed-session cleanup.

## Configuration Hierarchy

Loaded in order; later files override earlier ones:

1. `/etc/pitchfork/config.toml` — system (namespace `global`)
2. `~/.config/pitchfork/config.toml` — user (namespace `global`); also hosts `[slugs]`, `[namespaces]`, `[settings]`
3. Project files discovered from filesystem root → cwd; per directory:
   `.config/pitchfork.toml` → `.config/pitchfork.local.toml` → `pitchfork.toml` → `pitchfork.local.toml` (highest; gitignore it)

Top-level `namespace = "..."` overrides the directory-derived namespace; `[env]` provides shared env defaults; `[settings.<group>]` sets pitchfork-wide behavior. External files can be attached via `pitchfork config add <file> --dir <project>` (stored under `[namespaces.<ns>] config = [...]`); `PITCHFORK_CONFIG` adds invocation-scoped files.

## Daemon Options

| Option | Type | Description |
|--------|------|-------------|
| `run` | String (required) | Foreground command; prefix final cmd with `exec` so PID matches binary |
| `dir` | String | Working dir (relative to project dir; `~` expands) |
| `env` | Map | Env vars; values support templates |
| `user` | String | Unix user/UID to run as (needs root supervisor) |
| `depends` | List | Daemon IDs started first (`short` or `ns/name`); parallel per level |
| `retry` | Int/Bool | Restart attempts on failure; `true` = infinite; startup retries use 1s/2s/4s backoff |
| `auto` | List | `"start"`, `"stop"` for shell hook sessions |
| `ready_delay` | Float | Seconds before ready (fallback only; default 3) |
| `ready_output` | String/{pattern,timeout} | Regex in stdout/stderr |
| `ready_http` | String/{url,status?,timeout} | Poll HTTP; 2xx = ready; `status = [200,401]` to accept codes |
| `ready_port` | Int/String/{port,timeout} | TCP connect on 127.0.0.1; templates allowed |
| `ready_cmd` | String/{run,timeout} | Exit 0 = ready; gets `$PORT`, `$PORT0..N`, daemon env |
| `health_cmd` | String/{run,interval,timeout,retries} | Periodic probe; defaults 10s/10s/3 |
| `health_http` | String/{url,status,interval,timeout,retries} | Periodic HTTP probe (timeout default 5s) |
| `health_port` | Int/{port,interval,timeout,retries} | Periodic TCP probe |
| `watch` | List<Glob> | Restart running daemon on change; relative to project dir; debounced 1s |
| `watch_mode` | String | `native` (default), `poll`, `auto` |
| `port` | Int/List/{expect,bump} | Expected ports; injects `$PORT`,`$PORT0..N`; `bump` = true/N max attempts |
| `boot_start` | Bool | Start when supervisor runs in boot mode |
| `cron` | String/{schedule,retrigger,immediate} | 6-field cron (sec min hour dom mon dow [year]), local time; retrigger: finish/always/success/fail |
| `mise` | Bool | Wrap command with `mise x --` for mise tools/env |
| `memory_limit` | String | RSS cap e.g. `"512MB"`, `"2GiB"`; exceeded → kill + Errored (retry applies) |
| `cpu_limit` | Number | % of one core (`200` = 2 cores); kills after 3 consecutive violations |
| `stop_signal` | String/{signal,timeout} | SIGTERM (default), SIGINT, SIGQUIT, SIGHUP, SIGUSR1/2; then SIGKILL |
| `pty` | Bool | Allocate pseudo-terminal (affects buffering/color) |
| `logs` | Table | `[daemons.x.logs]`: `log_format` (text/json/logfmt), `time_retention`, `line_retention`, `archive_hook` |

Deprecated → use `port` object: `expected_port`, `auto_bump_port`, `port_bump_attempts`.

## Ready vs Health vs Retry

- Ready checks gate startup (and `depends` ordering); multiple checks = first success wins; all expiring → exit `124`. Poll interval 500ms.
- Health checks run for the daemon's whole life (even while starting); consecutive failures kill it → marked Errored → `retry` may restart.
- `retry` covers startup failures, crashes, health-check kills, and resource-limit kills. Successful completion is not retried — use `cron` to repeat tasks.

## Lifecycle Hooks

`[daemons.<name>.hooks]` — fire-and-forget, never block:

- `on_ready`, `on_fail` (retries exhausted), `on_retry` (before each attempt), `on_stop` (explicit stop), `on_exit` (any termination incl. supervisor shutdown; after retries exhausted), `on_output = { run, filter?|regex?, debounce? }` (default debounce 1000ms)
- Env: `PITCHFORK_DAEMON_ID`, `PITCHFORK_DAEMON_NAMESPACE`, `PITCHFORK_RETRY_COUNT`, `PITCHFORK_EXIT_CODE` (-1 if signal-killed), `PITCHFORK_EXIT_REASON` (stop/exit/fail), `PITCHFORK_MATCHED_LINE`, `PITCHFORK_PORT0..N`, plus daemon `env`

## Templates (Tera)

Supported in `run`, `env` values, `hooks.*`, `ready_*`, `health_*`:

- Self: `{{ name }}`, `{{ namespace }}`, `{{ id }}`, `{{ slug }}`, `{{ dir }}`, `{{ proxy_url }}`
- Deps (earlier levels only): `{{ daemons.redis.port }}`, `.ports`, `.ports[0]`, `.id`, `.name`, `.namespace`, `.slug`, `.dir`; cross-ns: `{{ daemons["infra.redis"].port }}` + `depends = ["infra/redis"]`
- `{{ env.X }}` for top-level `[env]`; `{{ settings.proxy.* }}` (enable/tld/port/https)
- Own port is NOT available in templates — use `$PORT`/`$PORT0..N`; same-level daemons can't reference each other

## Namespaces & IDs

- Short `api` resolves: current dir namespace → unique merged match → `global/<id>` → error/ambiguity
- Qualified `frontend/api` works anywhere the daemon is known
- Worktrees get directory-derived namespaces automatically (`general.worktree = false` disables)
- `list`/`tui` support `--namespace` (repeatable) and `--project`

## Shell Hook & Sessions

```sh
eval "$(pitchfork activate bash)"   # .bashrc; zsh analog; fish: pitchfork activate fish | source
```

`auto = ["start","stop"]` starts on enter / stops after last session leaves + `general.autostop_delay` (1m). Programmatic: `pitchfork project enter --pid $$ [--directory d]`, `leave`, `list --json`. Host PID liveness cleanup is Unix-only.

## Ports & Reverse Proxy

- `port` checks availability, injects resolved `$PORT*` env; bump keeps relative spacing of multi-port lists; active bound port is tracked for the proxy
- Proxy (supervisor-owned, restart to apply): `[settings.proxy] enable`, `https` (default true), `port` (443), `tld` (`localhost`), `wildcard`, `sync_hosts`, `lan`, `lan_ip`, `auto_trust`, `tls_cert`/`tls_key`, `auto_start_timeout` (30s — shows "Starting…" page instead of 502)
- URLs: `https://<slug>.<tld>`; slugs only in global config `[slugs] api = { dir = "...", daemon = "server" }` or `pitchfork proxy add`
- `.localhost` auto-resolves in Chrome/Firefox; custom TLDs use `sync_hosts` (/etc/hosts) or dnsmasq; LAN mode → `.local` via mDNS, binds 0.0.0.0
- Privileged ports need `sudo pitchfork supervisor start`; `proxy trust [--cert]`/`untrust` manage the generated CA ($PITCHFORK_STATE_DIR/proxy/cert.pem)

## Scheduling, Boot, Container

- `cron = "0 0 2 * * *"` — supervisor must be running; checks every `supervisor.cron_check_interval` (10s); `immediate = true` catches a just-missed slot (10s lookback); `pitchfork disable` pauses without removing the schedule
- `pitchfork boot enable|disable|status` — user: launchd `~/Library/LaunchAgents` / systemd user; `sudo` → system-level. Daemons need `boot_start = true`. Use `mise = true` or absolute paths (no interactive PATH)
- Container mode (experimental): `pitchfork supervisor run --container --boot` as PID 1 — reaps orphans, handles SIGTERM/SIGINT. Or `PITCHFORK_CONTAINER=true` / `[settings.supervisor] container = true`

## Dashboards & Integrations

- `pitchfork tui` — dashboard, config editor, log viewer; vim keys; `?` for help
- Web UI off by default: `[settings.web] auto_start = true, bind_port = 3120, bind_address`, `base_path`; or `PITCHFORK_WEB_PORT=3120 pitchfork supervisor start --force`; standalone API-only via `[settings.api]`
- Non-loopback bind → token auth (`X-Pitchfork-Token`, auto-generated 64-char if unset); plain HTTP — keep on loopback or behind HTTPS proxy
- MCP: `{ "command": "pitchfork", "args": ["mcp"] }` → tools `pitchfork_status|start|stop|restart|logs`

## Settings & Env Vars

- Inspect: `pitchfork settings list [--group]`, `get <key>`, `explain <key>`; set: `pitchfork settings set <key> <val> [--project|--local|--global]`; full list: https://pitchfork.jdx.dev/cli/configuration.html
- Precedence: defaults → /etc → user → project files → env vars. Supervisor-owned settings (web, api, proxy, supervisor.*) need `pitchfork supervisor start --force`
- Key settings: `general.autostop_delay` (1m), `general.ready_delay`, `general.mise`, `general.mise_bin`, `general.shell`/`windows_shell`, `general.interval` (10s), `general.worktree`, `supervisor.auto_start`, `supervisor.user`, `supervisor.stop_timeout` (5s), `supervisor.file_watch_debounce`, `supervisor.health_check_*`, `logs.log_format/time_retention/line_retention`, `logs.archive_hook`
- Env: `PITCHFORK_CONFIG_DIR`, `PITCHFORK_STATE_DIR`, `PITCHFORK_LOGS_DIR`, `PITCHFORK_LOG`, `PITCHFORK_LOG_FILE_LEVEL`, `PITCHFORK_SUPERVISOR_AUTO_START`, `PITCHFORK_READY_DELAY`, `PITCHFORK_AUTOSTOP_DELAY`, `PITCHFORK_WEB_*`, `PITCHFORK_CONFIG`, `PITCHFORK_CONTAINER`
- State: `~/.local/state/pitchfork/` (`state.toml`, `logs/logs.db` SQLite, `sock/main.sock`, `proxy/cert.pem`); supervisor text log at `logs/pitchfork/pitchfork.log`

## Troubleshooting Quick Hits

- Won't start: run the command manually in `dir`; check `pitchfork daemons --json`, `logs <id>`; disabled → `pitchfork enable`
- Ready timeout: test the probe directly; use `$PORT` in `ready_cmd` with bumping; all checks expired → exit 124
- Autostop: check `pitchfork project list` for other sessions; default delay 1m + watcher interval
- Stale entries: `pitchfork clean [--daemon <id>] [--prune]` — never delete `state.toml` first
- Debug: `PITCHFORK_LOG=debug pitchfork supervisor start --force`, then `pitchfork logs pitchfork`

## Source

- Docs: https://pitchfork.jdx.dev | Config: /reference/configuration.html | Settings: /cli/configuration.html | CLI: /cli/
