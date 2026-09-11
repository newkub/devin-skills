# agent-browser CLI

## Install

```sh
bun add -D agent-browser
# or global
bun add -g agent-browser

agent-browser install    # download managed Chrome
```

## Version And Help

- Latest: 0.37.1 (verified 2026-09-12), requires Node >= 24
- `agent-browser --version`
- `agent-browser --help`
- `agent-browser doctor [--fix] [--offline --quick]` — diagnose install and stale daemon files
- Docs: https://agent-browser.dev/commands
- Changelog: https://agent-browser.dev/changelog

## Core Commands

| Command | Description | Common options |
|---|---|---|
| `agent-browser open [url]` | Launch and optionally navigate | `--headed`, `--session`, `--profile`, `--cdp`, `--proxy`, `--user-agent`, `--device`, `--color-scheme`, `--no-webmcp`, `--restore`, `--namespace`, `--state`, `--engine chrome|lightpanda`, `--idle-timeout` |
| `agent-browser read [url]` | Agent-readable text or DOM (no browser needed for URL) | `--json`, `--filter`, `--outline`, `--llms index|full`, `--require-md`, `--raw`, `--timeout` |
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
| `agent-browser download <sel> <path>` | Click to trigger download | `wait --download [path]` |
| `agent-browser mouse move/down/up/wheel` | Low-level mouse input | — |
| `agent-browser clipboard read/write/copy/paste` | Clipboard access | — |

## Interaction Commands

| Command | Description |
|---|---|
| `agent-browser hover <sel>` | Hover element |
| `agent-browser select <sel> <value>` | Select dropdown |
| `agent-browser check <sel>` / `uncheck <sel>` | Toggle checkbox |
| `agent-browser scrollintoview <sel>` | Scroll element into view |
| `agent-browser drag <from> <to>` | Drag and drop |
| `agent-browser upload <sel> <files>` | Upload files |
| `agent-browser wait <sel>` | Wait for element (`--state hidden` to wait for disappearance) |
| `agent-browser wait <ms>` | Wait fixed time |
| `agent-browser wait --load networkidle` | Wait for load state (also `domcontentloaded`, `load`) |
| `agent-browser wait --text/--url/--fn/--download` | Wait for text, URL glob, JS condition, or download |
| `agent-browser is visible <sel>` | Check visibility |
| `agent-browser is enabled <sel>` / `is checked <sel>` | Check enabled/checked state |

## Semantic Locators

```sh
agent-browser find text "Sign In" click
agent-browser find role button click --name "Submit"
agent-browser find role heading text --name "Skills" --exact
agent-browser find label "Email" fill "user@test.com"
agent-browser find placeholder "Search" type "query"
agent-browser find alt "Logo" click
agent-browser find title "Close" click
agent-browser find testid "submit-btn" click
agent-browser find nth 2 ".card" hover
```

Actions: `click`, `fill`, `check`, `hover`, `text`. Options: `--name <name>` (accessible name for role), `--exact` (case-sensitive).

## Information Commands

| Command | Description |
|---|---|
| `agent-browser get text <sel>` | Element text |
| `agent-browser get html <sel>` | innerHTML |
| `agent-browser get value <sel>` | Input value |
| `agent-browser get attr <sel> <name>` | Attribute value |
| `agent-browser get title` | Page title |
| `agent-browser get url` | Current URL |
| `agent-browser get cdp-url` | CDP WebSocket URL |
| `agent-browser get count "<selector>"` | Count matches |
| `agent-browser get box <sel>` | Bounding box |
| `agent-browser get styles <sel>` | Computed styles |
| `agent-browser cookies [set <n> <v>|clear]` | Cookie access |
| `agent-browser storage local|session [<key>|set <k> <v>|clear]` | localStorage/sessionStorage |

## Tabs And Windows

| Command | Description |
|---|---|
| `agent-browser tab` | List tabs |
| `agent-browser tab new [url]` | New tab |
| `agent-browser tab new --label <name> [url]` | New tab with label |
| `agent-browser tab <id|label>` | Switch tab |
| `agent-browser tab close [id|label]` | Close tab |
| `agent-browser window new` | New window |
| `agent-browser frame <sel|@e3|main>` | Switch iframe context (refs inside iframes work directly) |
| `agent-browser dialog accept [text]` / `dismiss` / `status` | Handle JS dialogs |

Tab ids are stable `t<N>` strings or user labels (`tab new --label docs`); CDP target ids also accepted and survive daemon restarts. New tabs inherit session headers, credentials, UA, emulation, routes, and init scripts.

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
| `agent-browser record start <path> [--fps 1-60]` / `record restart` / `record stop` | Video recording (WebM/MP4, needs ffmpeg; default 30 fps) |
| `agent-browser network route <url> [--abort|--body <json>]` / `unroute` | Intercept/mock requests |
| `agent-browser network requests [--clear|--filter|--type|--status]` | Inspect tracked requests |
| `agent-browser network har start [--content all|none]` / `har stop [out.har]` | HAR recording |
| `agent-browser react tree/inspect/renders/suspense` | React DevTools (`open --enable react-devtools`) |
| `agent-browser vitals [url]` | LCP/CLS/TTFB/FCP/INP web vitals |
| `agent-browser diff` | Snapshot diffing between states |
| `agent-browser dashboard` | Local dashboard UI |
| `agent-browser chat` | AI chat mode (`--model`, `-q`, `-v`) |
| `agent-browser batch <cmds...>` | Multi-command run (`--bail` stop on error, `--json` stdin mode) |

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
| `--restore [name]` / `--restore-save <policy>` | Auto-save/restore session state (policies: auto, always, never) |
| `--namespace <name>` | Isolate daemon sockets and restore-state dirs |
| `--engine <name>` | Browser engine: `chrome` (default), `lightpanda` |
| `--idle-timeout <time>` | Daemon auto-shutdown (default 1h; `0` disables) |
| `--download-path <dir>` | Default download directory |
| `--content-boundaries` / `--max-output <chars>` | LLM-safe output wrapping / truncation |
| `--allowed-domains <list>` | Restrict reachable domains |
| `--action-policy <path>` / `--confirm-actions <list>` / `--confirm-interactive` | Action confirmation policies |
| `--no-auto-dialog` | Disable auto-accept of alert/beforeunload dialogs |
| `--allow-file-access` | Allow `file://` access (Chromium) |
| `--enable <feature>` | Built-in init scripts, e.g. `react-devtools` |
| `--init-script <path>` | Register page init script before first nav |

## Examples

```sh
bunx agent-browser open https://example.com --headed
bunx agent-browser click "button#submit"
bunx agent-browser screenshot --full --annotate
bunx agent-browser read https://example.com --json
bunx agent-browser webmcp list
bunx agent-browser mcp --tools core,webmcp
```
