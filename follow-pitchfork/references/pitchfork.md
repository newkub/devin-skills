# pitchfork Reference

## Overview

Pitchfork is a CLI for managing daemons with a focus on developer experience. It supports auto start/stop via shell hooks, ready checks, dependency ordering, file watching, cron scheduling, lifecycle hooks, resource limits, TUI, and MCP server for AI assistants.

## Install

```sh
# mise (recommended)
mise use -g pitchfork      # global
mise use pitchfork          # project-level

# cargo
cargo install pitchfork-cli

# GitHub releases (pre-built binaries)
# https://github.com/jdx/pitchfork/releases
```

## Version

- Crate: `pitchfork-cli`
- Latest: `2.18.0`
- License: MIT
- Repository: https://github.com/jdx/pitchfork
- Docs: https://pitchfork.jdx.dev

## CLI Commands

```sh
pitchfork --version              # show version
pitchfork start --all            # start all daemons
pitchfork start <name>           # start specific daemon
pitchfork start <name> --force   # force restart
pitchfork run <name> -- <cmd>    # one-off daemon
pitchfork stop <name>            # stop specific daemon
pitchfork stop --all             # stop all daemons
pitchfork list                   # list all daemons
pitchfork status <name>          # show daemon status
pitchfork logs <name>            # view logs
pitchfork logs <name> --tail     # follow logs
pitchfork tui                    # interactive terminal dashboard
pitchfork project enter --pid $$ # manual project enter
pitchfork project leave --pid $$ # manual project leave
```

## Shell Hook

```sh
# bash
echo 'eval "$(pitchfork activate bash)"' >> ~/.bashrc

# zsh
echo 'eval "$(pitchfork activate zsh)"' >> ~/.zshrc

# fish
echo 'pitchfork activate fish | source' >> ~/.config/fish/config.fish
```

## Configuration

Config files (TOML format), loaded in order:

1. `/etc/pitchfork/config.toml` — system-level (namespace: `global`)
2. `~/.config/pitchfork/config.toml` — user-level (namespace: `global`)
3. `.config/pitchfork.toml` — project-level
4. `.config/pitchfork.local.toml` — local overrides (not committed)
5. `pitchfork.toml` — project-level (overrides `.config/`)
6. `pitchfork.local.toml` — local overrides (highest precedence, not committed)

### Example pitchfork.toml

```toml
namespace = "my-project"

[daemons.api]
run = "exec bun run dev"
ready_http = "http://localhost:3000/health"
auto = ["start", "stop"]

[daemons.database]
run = "exec docker compose up postgres"
ready_port = 5432

[daemons.worker]
run = "exec bun run worker"
depends = ["database"]

[daemons.worker.hooks]
on_fail = "echo 'worker failed with code $PITCHFORK_EXIT_CODE'"
on_output = { filter = "connected", run = "echo 'worker ready'" }
```

### Daemon Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `run` | `String` | Yes | Command to execute |
| `dir` | `String` | No | Working directory |
| `env` | `Map<String,String>` | No | Environment variables |
| `depends` | `List<String>` | No | Daemon IDs to start first |
| `auto` | `List<String>` | No | `"start"`, `"stop"` for shell hook |
| `retry` | `Int` or `Bool` | No | Retry attempts (default: `0`, `true` = infinite) |
| `ready_delay` | `Float` | No | Seconds to wait before ready |
| `ready_output` | `String` | No | Regex to match in output for readiness |
| `ready_http` | `String` or `Map` | No | HTTP endpoint URL for readiness |
| `ready_port` | `Int` or `String` | No | TCP port to check for readiness |
| `ready_cmd` | `String` | No | Shell command for readiness (exit 0 = ready) |
| `user` | `String` | No | Unix user to run daemon as |

### Ready Checks

- `ready_delay` — wait N seconds
- `ready_output` — regex pattern in stdout/stderr
- `ready_http` — poll HTTP endpoint (2xx = ready)
- `ready_port` — check TCP port is listening
- `ready_cmd` — custom shell command (exit 0 = ready)

### Lifecycle Hooks

```toml
[daemons.api.hooks]
on_ready = "echo 'api is ready'"
on_fail = "echo 'api failed: $PITCHFORK_EXIT_CODE'"
on_retry = "echo 'retrying api'"
on_stop = "echo 'api stopped'"
on_exit = "echo 'api exited'"
on_output = { filter = "pattern", run = "echo 'matched'" }
```

### Hook Environment Variables

- `PITCHFORK_DAEMON_ID`
- `PITCHFORK_EXIT_CODE`
- `PITCHFORK_EXIT_REASON`
- `PITCHFORK_MATCHED_LINE`

### Daemon Naming Rules

- ASCII alphanumeric, `_`, `-`, `.` only
- No double dashes (`--`)
- No slashes, spaces, or parent references
- No leading/trailing dashes

### Using `exec` Prefix

Prefix commands with `exec` so the tracked PID matches the daemon binary:

```toml
[daemons.api]
run = "exec node server.js"

# compound commands
[daemons.api2]
run = "cd /app && exec node server.js"
```

## JSON Schema

```toml
#:schema https://pitchfork.jdx.dev/schema.json

[daemons.api]
run = "npm run server"
```

## Source

- Docs: https://pitchfork.jdx.dev
- Configuration reference: https://pitchfork.jdx.dev/reference/configuration.html
- Quick start: https://pitchfork.jdx.dev/quickstart.html
- CLI reference: https://pitchfork.jdx.dev/cli.html
- GitHub: https://github.com/jdx/pitchfork
- Crates.io: https://crates.io/crates/pitchfork-cli
