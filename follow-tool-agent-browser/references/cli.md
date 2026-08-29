# agent-browser CLI

## Install

```sh
bun add -D agent-browser
```

## Version

- Latest: see `agent-browser` on npm
- Repository: https://github.com/vercel-labs/agent-browser
- Docs: https://agent-browser.dev/commands

## Commands

| commands | default | options |
|---|---|---||---|---|---||---|---|---||
| `agent-browser open [url]` | Launch browser; if URL, navigate to it | `--headed`, `--session`, `--executable-path`, `--proxy`, `--user-agent`, `--device` |
| `agent-browser read [url]` | Fetch agent-readable text or DOM | `--json`, `--full` |
| `agent-browser click <sel>` | Click element | `--new-tab` |
| `agent-browser type <sel> <text>` | Type text into element | (none) |
| `agent-browser press <key>` | Press a key | (none) |
| `agent-browser scroll <dir> [px]` | Scroll page | `--selector` |
| `agent-browser screenshot [path]` | Capture screenshot | `--full`, `--annotate`, `--screenshot-dir`, `--screenshot-format`, `--screenshot-quality` |
| `agent-browser pdf <path>` | Save page as PDF | (none) |
| `agent-browser snapshot` | Output accessibility tree | `-i, --interactive`, `-c, --compact` |
| `agent-browser eval <js>` | Run JavaScript | (none) |
| `agent-browser --help` | Show help | (none) |

## Global Options

| Option | Description |
|---|---|---||---|---|---||
| `--json` | Output JSON |
| `--debug` | Debug output |
| `--headed` | Show browser window |
| `--session` | Session name |
| `--restore` / `--restore-save` / `--restore-check-url` | Session restore |
| `--namespace` | Namespace |
| `--executable-path` | Custom browser binary |
| `--proxy` | Proxy URL |
| `--provider`, `-p` | Browser provider |
| `--device` | Device to emulate |
| `--config` | Config file path |

## Examples

```sh
bunx agent-browser open https://example.com --headed
bunx agent-browser click "button#submit"
bunx agent-browser screenshot --full --annotate
bunx agent-browser read https://example.com --json
```
