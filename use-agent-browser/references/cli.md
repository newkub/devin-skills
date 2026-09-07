# agent-browser CLI

## Install

```sh
bun add -D agent-browser
# or global
bun add -g agent-browser

agent-browser install    # download managed Chrome
```

## Version And Help

- `agent-browser --version`
- `agent-browser --help`
- Docs: https://agent-browser.dev/commands
- Changelog: https://agent-browser.dev/changelog

## Core Commands

| Command | Description | Common options |
|---|---|---|
| `agent-browser open [url]` | Launch and optionally navigate | `--headed`, `--session`, `--profile`, `--cdp`, `--proxy`, `--user-agent`, `--device`, `--color-scheme`, `--no-webmcp` |
| `agent-browser read [url]` | Agent-readable text or DOM | `--json`, `--full` |
| `agent-browser click <sel>` | Click element | `--new-tab` |
| `agent-browser fill <sel> <text>` | Clear then type | — |
| `agent-browser type <sel> <text>` | Type without clear | — |
| `agent-browser press <key>` | Key press | — |
| `agent-browser scroll <dir> [px]` | Scroll page | `--selector` |
| `agent-browser screenshot [path]` | Capture screenshot | `--full`, `--annotate`, `--screenshot-dir`, `--screenshot-format`, `--screenshot-quality` |
| `agent-browser pdf <path>` | Save page as PDF | — |
| `agent-browser snapshot` | Accessibility tree | `-i, --interactive`, `-c, --compact`, `-d <depth>`, `-s <selector>` |
| `agent-browser eval <js>` | Run JavaScript | — |
| `agent-browser back/forward/reload` | Navigation history | — |
| `agent-browser pushstate <url>` | SPA client-side navigation | — |
| `agent-browser connect <port>` | Connect via CDP | — |

## Interaction Commands

| Command | Description |
|---|---|
| `agent-browser hover <sel>` | Hover element |
| `agent-browser select <sel> <value>` | Select dropdown |
| `agent-browser check <sel>` / `uncheck <sel>` | Toggle checkbox |
| `agent-browser scrollintoview <sel>` | Scroll element into view |
| `agent-browser drag <from> <to>` | Drag and drop |
| `agent-browser upload <sel> <files>` | Upload files |
| `agent-browser wait <sel>` | Wait for element |
| `agent-browser wait --load networkidle` | Wait for load state |
| `agent-browser is visible <sel>` | Check visibility |

## Semantic Locators

```sh
agent-browser find text "Sign In" click
agent-browser find role button click --name "Submit"
agent-browser find label "Email" fill "user@test.com"
agent-browser find placeholder "Search" type "query"
agent-browser find testid "submit-btn" click
```

## Information Commands

| Command | Description |
|---|---|
| `agent-browser get text <sel>` | Element text |
| `agent-browser get html <sel>` | innerHTML |
| `agent-browser get value <sel>` | Input value |
| `agent-browser get attr <sel> <name>` | Attribute value |
| `agent-browser get title` | Page title |
| `agent-browser get url` | Current URL |
| `agent-browser get count "<selector>"` | Count matches |
| `agent-browser get box <sel>` | Bounding box |
| `agent-browser get styles <sel>` | Computed styles |

## Tabs And Windows

| Command | Description |
|---|---|
| `agent-browser tab` | List tabs |
| `agent-browser tab new [url]` | New tab |
| `agent-browser tab new --label <name> [url]` | New tab with label |
| `agent-browser tab <id|label>` | Switch tab |
| `agent-browser tab close [id|label]` | Close tab |
| `agent-browser window new` | New window |

## Monitoring And Debugging

| Command | Description |
|---|---|
| `agent-browser console` | View console messages |
| `agent-browser console --clear` | Clear console |
| `agent-browser errors` | View page errors |
| `agent-browser errors --clear` | Clear errors |
| `agent-browser highlight <sel>` | Highlight element |
| `agent-browser inspect` | Open DevTools |
| `agent-browser trace start` / `trace stop <path>` | Trace recording |
| `agent-browser profiler start` / `profiler stop <path>` | CPU profiling |
| `agent-browser record start <path>` / `record stop` | Video recording |

## WebMCP And MCP

| Command | Description |
|---|---|
| `agent-browser webmcp list` | List page tools |
| `agent-browser webmcp invoke <tool> --params '{...}'` | Invoke a tool |
| `agent-browser webmcp invoke <tool> --params @input.json --detach` | Invoke detached |
| `agent-browser webmcp result <id>` | Get detached result |
| `agent-browser webmcp cancel <id>` | Cancel invocation |
| `agent-browser mcp` | Start MCP server (stdio) |
| `agent-browser mcp --tools all` | All tools profile |
| `agent-browser mcp --tools core,network,react` | Combined profiles |
| `agent-browser mcp --tools core,webmcp` | Core + WebMCP |
| `agent-browser skills get webmcp-gen` | Load WebMCP generation skill |
| `agent-browser a11y [url]` | axe-core accessibility audit |

## Global Options

| Option | Description |
|---|---|
| `--json` | JSON output |
| `--debug` | Debug output |
| `--headed` | Show browser window |
| `--session <name>` | Isolated session |
| `--profile <name|path>` | Persistent profile |
| `--cdp <port>` | Connect via CDP |
| `--auto-connect` | Auto-connect to existing Chrome |
| `--pin-tab` | Strict tab binding across restarts |
| `--proxy <url>` | Proxy URL |
| `--user-agent <ua>` | Custom User-Agent |
| `--device <name>` | Emulate device |
| `--color-scheme dark/light` | Color scheme |
| `--no-webmcp` | Disable WebMCP launch |
| `--ca-cert <path>` | Import private proxy CA (Linux) |
| `--no-ca-cert` | Clear retained CA trust |
| `--config <path>` | Config file path |

## Examples

```sh
bunx agent-browser open https://example.com --headed
bunx agent-browser click "button#submit"
bunx agent-browser screenshot --full --annotate
bunx agent-browser read https://example.com --json
bunx agent-browser webmcp list
bunx agent-browser mcp --tools core,webmcp
```
