# Pitchfork CLI

Daemon/process manager for project background services (jdx/pitchfork).

## Install

```sh
mise use -g pitchfork                    # recommended
cargo install pitchfork-cli --locked    # via cargo
# or binary: https://github.com/jdx/pitchfork/releases
```

## Version

- Latest: `2.25.0` (verified 2026-09-12)
- Crate: https://crates.io/crates/pitchfork-cli
- Repository: https://github.com/jdx/pitchfork
- Docs: https://pitchfork.jdx.dev/cli/

## Commands

| commands | description | options |
|---|---|---|
| `pitchfork start <name>` / `--all` / `--local` | Start daemon(s), respecting `depends` order | `--force` |
| `pitchfork stop <name>` / `--all` / `--local` | Stop daemon(s) in reverse dependency order | — |
| `pitchfork restart <name>` | Apply config changes and restart | — |
| `pitchfork run <name> --port <port> -- <cmd>` | Run ad-hoc daemon without config file | — |
| `pitchfork list` | List daemons | `--project` |
| `pitchfork status <name>` | Show daemon status | — |
| `pitchfork logs <name>` | View logs | `--tail` to follow |
| `pitchfork tui` | Interactive terminal dashboard | — |
| `pitchfork activate <shell>` | Print shell hook (bash/zsh/fish) | — |
| `pitchfork project enter --pid $$` / `leave --pid $$` | Manual project enter/leave | — |

## Examples

```sh
pitchfork start api        # starts deps first, waits for ready check
pitchfork restart api
pitchfork logs api --tail
pitchfork stop --local
```
