# configuration

## index.md

# Configuration Reference

## Config File Location

| Platform | Path |
|----------|------|
| Linux/macOS | `~/.rmux.conf` |
| Windows | `%USERPROFILE%\.rmux.conf` |

## Session Options

| Option | Description | Default |
|--------|-------------|---------|
| `base-index` | Starting index for sessions | 0 |
| `default-shell` | Default shell path | System default |
| `default-command` | Default command | None |
| `history-limit` | Max lines per pane | 2000 |

## Window Options

| Option | Description | Default |
|--------|-------------|---------|
| `automatic-rename` | Auto-rename windows | on |
| `automatic-rename-format` | Rename format | `#I:#W` |
| `pane-base-index` | Starting pane index | 0 |

## Pane Options

| Option | Description | Default |
|--------|-------------|---------|
| `base-index` | Starting window index | 0 |
| `mouse` | Mouse support | off |

## Key Bindings

| Binding | Description |
|---------|-------------|
| `prefix` | Prefix key (default: Ctrl-b) |
| `bind-key` | Custom key binding |
| `unbind-key` | Remove key binding |

## Status Line

| Option | Description | Default |
|--------|-------------|---------|
| `status` | Enable status line | on |
| `status-left` | Left status format | `[#S] ` |
| `status-right` | Right status format | `"%H:%M %d-%b-%y"` |
| `status-left-length` | Max left length | 10 |
| `status-right-length` | Max right length | 40 |

## Example Config

```conf
# Prefix key
set-option -g prefix C-a

# Mouse support
set-option -g mouse on

# Status line
set-option -g status on
set-option -g status-left "#[fg=green]#S#[default] "
set-option -g status-right "%H:%M %d-%b-%y"

# Window/pane indexing
set-option -g base-index 1
set-window-option -g pane-base-index 1

# History
set-option -g history-limit 10000
```

---
