---
name: use-lightpanda
description: Lightpanda headless browser — serve/fetch CLI, CDP via Puppeteer/Playwright, MCP server for agents
argument-hint: "[url]"
related:
  - use-agent-browser
  - use-chrome-devtools
  - use-midscenejs
  - update-devin-global-mcp

---

## Goal

Use Lightpanda — the headless browser designed for automation and AI agents ("the first browser for machines, not humans") — the right way: install (WSL/AUR), the `serve` CDP endpoint, `fetch`, the MCP server (`lightpanda mcp`), and connecting via Puppeteer/Playwright

## Scope

Use when you need a browser with real JS execution (V8) but no pixel rendering — DOM scraping, crawling, form interaction, and network-observable automation that must be far faster and lighter on memory than Chrome

- Boundary (per `/use-chrome-devtools` `## Tool Selection` — canonical): need real screenshots, visual/layout, CSS, fonts, extensions → use real Chrome (`agent-browser`/`chrome-devtools-mcp`/`/use-midscenejs` — Midscene needs rendered images, so it `cannot be paired with Lightpanda`)
- Lightpanda is a good fit for: content extraction, DOM-based E2E logic, headless crawling, agent tools via MCP

## Facts (verified 2026-10-20)

- v1.0.0 GA (2026-10-02, first stable); latest release v1.0.1 (2026-10-15) — production-ready; written in Zig, JS engine is V8 (the same one Chrome uses), AGPL-3.0, repo `lightpanda-io/browser` (~36k stars)
- Claims from lightpanda.io: "9x faster" (5s vs Chrome 46s) and "16x less memory" (123MB vs 2GB) on a chromedp run of 933 real pages (AWS EC2 m5.large)
- No native Windows binary — Windows must run it via `WSL2`; Linux binaries are glibc-linked (Alpine/musl won't work)
- Telemetry is on by default — disable with `LIGHTPANDA_DISABLE_TELEMETRY=true`

## Execute

### 1. Install

> Goal: a working `lightpanda` binary on WSL (Arch)

1. Arch WSL (the route the docs support — AUR user repository):
   ```sh
   yay -S lightpanda-bin          # stable (check the version first — the AUR stable build may lag)
   yay -S lightpanda-nightly-bin  # nightly (docs/README recommend this when stable lags)
   ```
   - the two packages conflict (`Conflicts: lightpanda`) — pick one
   - requires `base-devel` + `git` + a ready pacman keyring (`pacman-key --init && pacman-key --populate archlinux` on a fresh instance)
2. Other fallbacks (if AUR is unavailable — no root/pacman):
   ```sh
   # direct release binary (verified 2026-10-13 — use this route on real machines when AUR needs root ops)
   curl -fL https://github.com/lightpanda-io/browser/releases/download/1.0.1/lightpanda-x86_64-linux -o ~/.local/bin/lightpanda && chmod +x ~/.local/bin/lightpanda
   curl -fsSL https://pkg.lightpanda.io/install.sh -o /tmp/lightpanda-install.sh && bash /tmp/lightpanda-install.sh   # installs ~/.local/bin/lightpanda (pin version: bash /tmp/lightpanda-install.sh "1.0.1")
   brew install lightpanda-io/browser/lightpanda                  # macOS/Linux brew
   mise use -g github:lightpanda-io/browser                       # mise GitHub backend (verified 2026-10-20, arch WSL)
   docker run -d --name lightpanda -p 127.0.0.1:9222:9222 lightpanda/browser:nightly
   ```
   - the release binary is named `lightpanda-x86_64-linux` (~188MB raw ELF) — rename/chmod it yourself
   - mise resolves the latest tag + platform asset, installs a shim at `~/.local/share/mise/shims/lightpanda`; `eval "$(mise activate bash)"` in profile.d floods errors when appendWindowsPath puts space-containing Windows paths in PATH — use a plain `export PATH="$HOME/.local/share/mise/shims:$PATH"` instead
   - non-login shells on WSL may lack `~/.local/bin` in PATH — calling it by absolute path is the safest
   - calling from git-bash/MSYS requires blocking path rewriting: `MSYS_NO_PATHCONV=1 MSYS2_ARG_CONV_EXCL="*" wsl -d <distro> -- /root/.local/bin/lightpanda …`
3. Verify: `lightpanda version`; path from `command -v lightpanda`

### 2. Fetch (one-shot, no server)

> Goal: pull a URL's content as text/html

```sh
lightpanda fetch --dump html --obey-robots --log-format pretty https://example.com
lightpanda fetch --dump markdown https://example.com   # agent-readable text
# --dump values (v1.0.0): html, markdown, pdf, png, semantic_tree, semantic_tree_text — no `text`; png/pdf are text-only rendering, not real images
# multiple URLs require --json; always pass `--dump <value>` as a single token, otherwise a wrong value becomes the second positional URL
```

### 3. Serve — CDP Endpoint For Puppeteer/Playwright

> Goal: start a CDP server and connect with standard clients

1. start: `lightpanda serve --host 127.0.0.1 --port 9222` (default `127.0.0.1:9222`; add `--obey-robots` when crawling; `--protocol webdriver` for WebDriver BiDi)
2. Puppeteer (`puppeteer-core`):
   ```js
   import puppeteer from 'puppeteer-core'
   const browser = await puppeteer.connect({ browserWSEndpoint: 'ws://127.0.0.1:9222' })
   const context = await browser.createBrowserContext()
   const page = await context.newPage()
   await page.goto('https://quotes.toscrape.com/js/')
   const quote = await page.$eval('.quote .text', el => el.textContent)
   ```
3. Playwright (`playwright-core`):
   ```js
   import { chromium } from 'playwright-core'
   const browser = await chromium.connectOverCDP('ws://127.0.0.1:9222')
   const context = await browser.newContext({})
   const page = await context.newPage()
   await page.goto('https://quotes.toscrape.com/js/')
   ```
4. Windows host: the endpoint lives on the WSL side — map it via `wsl --running` + mirrored networking (`.wslconfig networkedDNS=... / mirrored` mode) or connect `ws://<wsl-ip>:9222`
5. Hosted production endpoint: `wss://<region>.cloud.lightpanda.io/ws?token=<TOKEN>` (works with the same clients by changing the endpoint)

### 4. MCP Server (For AI agents)

> Goal: let agents call browser tools via MCP — a native subcommand with no npm package needed

1. MCP speaks JSON-RPC 2.0 over `stdio` — the host spawns it directly; there is no need to run `serve` first (CDP `serve` is a separate route)
2. Register in the client config (`mcpServers` entry):
   ```json
   {
     "mcpServers": {
       "lightpanda": {
         "command": "/path/to/lightpanda",
         "args": ["mcp"]
       }
     }
   }
   ```
   - resolve the path with `command -v lightpanda` first; add `"--obey-robots"` to args when wanted
   - Windows + binary on WSL: `command: "wsl.exe"`, `args: ["-d", "<distro>", "--", "<absolute-linux-path>", "mcp"]` — use an absolute path (e.g. `/root/.local/bin/lightpanda`), not a bare `lightpanda`, because the host spawn is not a login shell and the WSL-side PATH may not cover `~/.local/bin` (verified 2026-10-13 — the JSON-RPC `initialize` handshake over stdio succeeded)
   - global: add an entry in `~/.agents/mcp/mcp_config.json` per `/update-devin-global-mcp create` (back up before editing)
3. variants: `lightpanda mcp --port 8000` (HTTP, POST /mcp), `--cdp-port <n>` (also opens a CDP server)
4. Cloud MCP via `mcp-remote`: `bunx mcp-remote https://euwest.cloud.lightpanda.io/mcp?token=<TOKEN>` (WIP — not all tools are available)
5. main tools: `goto`, `search`, `markdown`, `html`, `extract`, `evaluate`, `click`, `fill`, `scroll`, `hover`, `press`, `selectOption`, `waitForSelector`, `screenshot` (text-layout only), `getUrl`, `getCookies`, `consoleLogs`, `session_new/list/close`; resources `mcp://page/markdown`, `mcp://page/html`

### 5. Validate Usage

> Goal: confirm every path actually works

1. `lightpanda version` → numeric 1.x
2. `lightpanda fetch --dump markdown https://example.com` → contains the `example domain` content
3. `lightpanda serve` + the Puppeteer/Playwright snippet above → get a real `textContent`
4. MCP: list tools via a client (e.g. `mcp_list_servers`/`mcp_call_tool` in devin) → see `goto`/`markdown`

## Rules

### 1. No-Pixel Reality Check

- Lightpanda has no layout/rendering engine — `Page.captureScreenshot` returns a placeholder, `--dump png/pdf` is a text-only render
- Never use it for: visual regression, screenshot evidence, CSS/font work, Midscene.js (vision-based), anti-detection (it is not a stealth browser)

### 2. Endpoint Discipline

- the default binds `127.0.0.1` only — never expose CDP/MCP on a public interface without auth (CDP = full browser control)
- robots: pass `--obey-robots` on every crawl that isn't your own target

### 3. AUR Freshness

- AUR `lightpanda-bin` may lag the stable release — check `lightpanda version` after install; if older than the current stable, use the nightly package or the version-pinned one-liner

### 4. Composition

- real automation scripts (multi-session, record, CI) → `/use-agent-browser`; inspect/debug console+network → `/use-chrome-devtools`; vision-based NL tests → `/use-midscenejs`; this skill covers only Lightpanda's CDP/MCP

## Expected Outcome

- `lightpanda` binary ready to use on WSL/Arch (verified with `lightpanda version`)
- fetch/serve pass, Puppeteer+Playwright connect through CDP with real results
- MCP server registered in the client (including devin global `mcp_config.json`) and tools listable
- the user understands the boundary: no pixels — any task that needs images must use a real browser
