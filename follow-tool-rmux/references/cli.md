| key | value |
|---|---|
| install | `mise use -g rmux` |
| repository | https://github.com/Helvesec/rmux |
| docs | https://rmux.io/docs/cli/ |

| commands | description | default | options |
|---|---|---|---|
| `rmux new-session -d -s <name>` | Create a new detached session | — | `-d, --detached`, `-s, --session`, `-t, --target` |
| `rmux send-keys -t <target> "<cmd>" Enter` | Send keys to a pane | — | `-t, --target` |
| `rmux wait-for <signal>` | Wait for a signal | — | (none) |
| `rmux capture-pane -p -t <target>` | Capture pane output | — | `-p, --print`, `-t, --target` |
| `rmux web-share` | Create encrypted browser session | — | (none) |
| `rmux-cli system ping` | Check rmux daemon | — | `--socket`, `--json` |
| `rmux-cli workspace list` | List workspaces | — | `--socket`, `--json` |
| `rmux-cli surface split <right\|down>` | Split pane | — | `--socket`, `--json` |
| `rmux-cli --help` | Show help | — | (none) |

| Option | Description |
|---|---|
| `--socket <path>` | Override `$RMUX_SOCKET_PATH` |
| `--json` | Machine-readable JSON output |
| `-V, --version` | Print version |
