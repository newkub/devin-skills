| command | description | options |
|---|---|---|
| `opencode [project]` | Start the TUI in a project | `-c`, `-s`, `--fork`, `--prompt`, `-m`, `--agent`, `--auto`, `--mini`, `--port`, `--hostname`, `--mdns`, `--cors` |
| `opencode run [message..]` | Non-interactive single run | `--command`, `-c`, `-s`, `--fork`, `--share`, `-m`, `--agent`, `-f/--file`, `--format default\|json`, `--title`, `--attach <url>`, `--dir`, `--port`, `--variant`, `--thinking`, `--auto`, `-u`, `-p` |
| `opencode serve` | Headless HTTP server (API, no TUI) | `--port`, `--hostname`, `--mdns`, `--mdns-domain`, `--cors` |
| `opencode web` | Headless server + web interface | same server flags; `OPENCODE_SERVER_PASSWORD` for basic auth |
| `opencode pair` | Print URL + credentials for web/mobile access (v2) | — |
| `opencode attach <url>` | Attach TUI to a running server | `--dir`, `-c`, `-s`, `--fork`, `-u`, `-p` |
| `opencode auth login` | Configure provider API keys (Models.dev list) | `-p/--provider`, `-m/--method` |
| `opencode auth list` (alias `ls`) | List authenticated providers | — |
| `opencode auth logout` | Clear a provider's credentials | — |
| `opencode models [provider]` | List available `provider/model` IDs | `--refresh`, `--verbose` |
| `opencode agent create` | Create an agent (non-interactive when all flags given) | `--path`, `--description`, `--mode all\|primary\|subagent`, `--permissions a,b,c`, `-m` |
| `opencode agent list` | List available agents | — |
| `opencode mcp add` | Add a local or remote MCP server (guided) | — |
| `opencode mcp list` (alias `ls`) | MCP servers + connection status | — |
| `opencode mcp auth [name]` / `auth list` | OAuth for MCP servers | — |
| `opencode mcp logout [name]` | Remove MCP OAuth credentials | — |
| `opencode mcp debug <name>` | Debug MCP OAuth connection issues | — |
| `opencode session list` | List sessions | `-n/--max-count`, `--format table\|json` |
| `opencode session delete <id>` | Delete a session | — |
| `opencode export [sessionID]` | Export session as JSON | `--sanitize` |
| `opencode import <file\|url>` | Import session JSON or share URL | — |
| `opencode stats` | Token usage and cost statistics | `--days`, `--tools`, `--models`, `--project` |
| `opencode github install` | Install GitHub agent workflow in the repo | — |
| `opencode github run` | Run the GitHub agent (CI) | `--event`, `--token` |
| `opencode pr <number>` | Fetch + checkout PR branch, then start OpenCode | — |
| `opencode plugin <module>` (alias `plug`) | Install plugin and update config | `-g/--global`, `-f/--force` |
| `opencode acp` | ACP server over stdio (nd-JSON) | `--cwd`, `--port`, `--hostname`, `--mdns`, `--cors` |
| `opencode completion` | Generate shell completion script | — |
| `opencode debug` | Debugging/troubleshooting tools | subcommands |
| `opencode db [query]` | Query the session database | `--format json\|tsv`; `opencode db path` prints DB location |
| `opencode upgrade [target]` | Upgrade to latest or a specific version | `-m/--method curl\|npm\|pnpm\|bun\|brew` |
| `opencode uninstall` | Uninstall and remove related files | `-c/--keep-config`, `-d/--keep-data`, `--dry-run`, `-f/--force` |

## Global flags

| flag | short | default | description |
|---|---|---|---|
| `--help` | `-h` | | Show help |
| `--version` | `-v` | | Print version |
| `--print-logs` | | off | Print logs to stderr |
| `--log-level` | | | `DEBUG` \| `INFO` \| `WARN` \| `ERROR` |
| `--pure` | | off | Run without external plugins |
| `--port` | | `0` (random) | Port to listen on |
| `--hostname` | | `127.0.0.1` | Hostname to listen on |
| `--mdns` | | false | Enable mDNS discovery (defaults hostname to `0.0.0.0`) |
| `--mdns-domain` | | `opencode.local` | Custom mDNS domain |
| `--cors` | | `[]` | Extra allowed browser origins |
| `--model` | `-m` | config default | `provider/model` to use |
| `--continue` | `-c` | | Continue last session |
| `--session` | `-s` | | Session id to continue |
| `--fork` | | | Fork when continuing (with `-c`/`-s`) |
| `--prompt` | | | Prompt to use |
| `--agent` | | | Agent to use |
| `--auto` | | false | Auto-approve non-denied permissions (dangerous) |
| `--mini` | | false | Minimal interactive interface |
| `--no-replay` | | | Disable mini history replay |
| `--replay-limit` | | | Cap mini replay to newest N messages |
