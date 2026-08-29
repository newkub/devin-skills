# cli

## index.md

# CLI Reference

## Session Commands

| Command | Description | Example |
|---|---|---|
| `new-session` | Create new session | `rmux new-session -s name` |
| `attach-session` | Attach to session | `rmux attach -t name` |
| `list-sessions` | List all sessions | `rmux ls` |
| `kill-session` | Kill session | `rmux kill-session -t name` |
| `detach-client` | Detach from session | `rmux detach` |

## Pane Commands

| Command | Description | Example |
|---|---|---|
| `send-keys` | Send text to pane | `rmux send-keys -t 0.0 "ls" Enter` |
| `capture-pane` | Capture pane content | `rmux capture-pane -p -t 0.0` |
| `split-window` | Split pane | `rmux split-window -h` |
| `select-pane` | Select pane | `rmux select-pane -t 0.1` |
| `list-panes` | List panes in session | `rmux list-panes -t session` |

## Window Commands

| Command | Description | Example |
|---|---|---|
| `new-window` | Create new window | `rmux new-window -n name` |
| `select-window` | Select window | `rmux select-window -t 1` |
| `rename-window` | Rename window | `rmux rename-window -t 1 newname` |
| `list-windows` | List windows | `rmux list-windows -t session` |

## Automation Commands

| Command | Description | Example |
|---|---|---|
| `wait-for` | Wait for signal | `rmux wait-for signal-name` |
| `wait-for -S` | Send signal | `rmux wait-for -S signal-name` |
| `run-shell` | Run shell command | `rmux run-shell "command"` |

## Options

| Option | Description |
|---|---|
| `-d` | Detached mode |
| `-s` | Session name |
| `-t` | Target (session/window/pane) |
| `-n` | Window name |
| `-p` | Print output |
| `-h` | Horizontal split |
| `-v` | Vertical split |

## Help

```bash
rmux --help
rmux <command> --help
```

---
