---
name: use-lightpanda
description: ใช้ Lightpanda headless browser — serve/fetch CLI, CDP ผ่าน Puppeteer/Playwright, MCP server สำหรับ AI agent
argument-hint: "[url]"
related:
  - use-agent-browser
  - use-chrome-devtools
  - use-midscenejs
  - follow-tool-playwright
  - create-devin-global-mcp
  - deep-research
  - resolve-errors

---

## Goal

ใช้งาน Lightpanda — headless browser ที่ออกแบบสำหรับ automation และ AI agent ("the first browser for machines, not humans") — อย่างถูกวิธี: install (WSL/AUR), `serve` CDP endpoint, `fetch`, MCP server (`lightpanda mcp`), และ connect ผ่าน Puppeteer/Playwright

## Scope

ใช้เมื่อต้องการ browser ที่มี JS execution จริง (V8) แต่ไม่ต้องการ pixel rendering — DOM scrape, crawl, form interaction, network-observable automation ที่ต้องการความเร็ว/หน่วยความจำต่ำกว่า Chrome มาก

- Boundary (ตาม `/use-chrome-devtools` `## Tool Selection` — canonical): ต้องการ screenshot จริง, visual/layout, CSS, font, extension → ใช้ Chrome ตัวจริง (`agent-browser`/`chrome-devtools-mcp`/`/use-midscenejs` — Midscene ต้องการภาพ rendering จึง **ใช้ Lightpanda ด้วยไม่ได้**)
- Lightpanda เหมาะกับ: content extraction, DOM-based E2E logic, headless crawling, agent tools ผ่าน MCP

## Facts (verified 2026-10-13)

- v1.0.0 GA (2026-10-02) — out of beta, production-ready; เขียนด้วย Zig, JS engine เป็น V8 (ตัวเดียวกับ Chrome), AGPL-3.0, repo `lightpanda-io/browser` (~36k stars)
- Claims จาก lightpanda.io: "9x faster" (5s vs Chrome 46s) และ "16x less memory" (123MB vs 2GB) บน chromedp request 933 หน้าจริง (AWS EC2 m5.large)
- ไม่มี native Windows binary — Windows ต้องรันผ่าน **WSL2**; Linux binaries เป็น glibc-linked (Alpine/musl ใช้ไม่ได้)
- Telemetry เปิด default — ปิดด้วย `LIGHTPANDA_DISABLE_TELEMETRY=true`

## Execute

### 1. Install

> Goal: ได้ binary `lightpanda` พร้อมใช้บน WSL (Arch)

1. Arch WSL (route ที่ docs รองรับ — AUR user repository):
   ```sh
   yay -S lightpanda-bin          # stable (ตรวจ version ก่อน — AUR stable อาจค้าง)
   yay -S lightpanda-nightly-bin  # nightly (docs/README แนะนำตัวนี้เมื่อ stable ค้าง)
   ```
   - package สองตัว conflict กัน (`Conflicts: lightpanda`) — เลือกอันเดียว
   - ต้องมี `base-devel` + `git` + pacman keyring พร้อม (`pacman-key --init && pacman-key --populate archlinux` บน fresh instance)
2. Fallback อื่น (ถ้า AUR unavailable — ไม่มี root/pacman):
   ```sh
   # direct release binary (verified 2026-10-13 — ใช้ route นี้บนเครื่องจริงเมื่อ AUR ติด root ops)
   curl -fL https://github.com/lightpanda-io/browser/releases/download/1.0.0/lightpanda-x86_64-linux -o ~/.local/bin/lightpanda && chmod +x ~/.local/bin/lightpanda
   curl -fsSL https://pkg.lightpanda.io/install.sh | bash        # installs ~/.local/bin/lightpanda (pin version: bash -s "1.0.0")
   brew install lightpanda-io/browser/lightpanda                  # macOS/Linux brew
   docker run -d --name lightpanda -p 127.0.0.1:9222:9222 lightpanda/browser:nightly
   ```
   - binary name ใน release คือ `lightpanda-x86_64-linux` (~188MB raw ELF) — ต้อง rename/chmod เอง
   - non-login shell บน WSL อาจไม่มี `~/.local/bin` ใน PATH — ใช้ absolute path เรียกจะชัวร์สุด
   - เรียกจาก git-bash/MSYS ต้องกัน path rewriting: `MSYS_NO_PATHCONV=1 MSYS2_ARG_CONV_EXCL="*" wsl -d <distro> -- /root/.local/bin/lightpanda …`
3. ตรวจ: `lightpanda version`; path จาก `command -v lightpanda`

### 2. Fetch (one-shot, ไม่มี server)

> Goal: ดึงเนื้อหา URL มาเป็น text/html

```sh
lightpanda fetch --dump html --obey-robots --log-format pretty https://example.com
lightpanda fetch --dump markdown https://example.com   # agent-readable text
# --dump values (v1.0.0): html, markdown, pdf, png, semantic_tree, semantic_tree_text — ไม่มี `text`; png/pdf เป็น text-only rendering ไม่ใช่ภาพจริง
# multiple URLs ต้องมี --json; ใส่ `--dump <value>` เป็น single token เสมอ ไม่งั้นค่าที่ผิดจะกลายเป็น URL ตำแหน่งที่สอง
```

### 3. Serve — CDP Endpoint สำหรับ Puppeteer/Playwright

> Goal: เปิด CDP server แล้ว connect ด้วย client มาตรฐาน

1. start: `lightpanda serve --host 127.0.0.1 --port 9222` (default `127.0.0.1:9222`; เพิ่ม `--obey-robots` เมื่อ crawl; `--protocol webdriver` สำหรับ WebDriver BiDi)
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
4. Windows host: endpoint อยู่ฝั่ง WSL — map ผ่าน `wsl --running` + mirrored networking (`.wslconfig networkedDNS=... / mirrored` mode) หรือ connect `ws://<wsl-ip>:9222`
5. production endpoint แบบ hosted: `wss://<region>.cloud.lightpanda.io/ws?token=<TOKEN>` (ใช้กับ client เดิมโดยเปลี่ยน endpoint)

### 4. MCP Server (สำหรับ AI agent)

> Goal: ให้ agent เรียก browser tools ผ่าน MCP — เป็น native subcommand ไม่ต้องมี npm package

1. MCP พูด JSON-RPC 2.0 over **stdio** — host เป็นคน spawn เอง ไม่ต้องรัน `serve` ก่อน (CDP `serve` เป็นคนละ route)
2. Register ใน client config (`mcpServers` entry):
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
   - resolve path ด้วย `command -v lightpanda` ก่อน; เพิ่ม `"--obey-robots"` ใน args เมื่อต้องการ
   - Windows + binary อยู่ WSL: `command: "wsl.exe"`, `args: ["-d", "<distro>", "--", "<absolute-linux-path>", "mcp"]` — ใช้ absolute path (เช่น `/root/.local/bin/lightpanda`) ไม่ใช่ bare `lightpanda` เพราะ host spawn ไม่ใช่ login shell และ PATH ฝั่ง WSL อาจไม่ครอบคลุม `~/.local/bin` (verified 2026-10-13 — JSON-RPC `initialize` handshake ผ่าน stdio สำเร็จ)
   - devin global: ลง `%APPDATA%\devin\mcp_config.json` ตาม `/create-devin-global-mcp` (backup ก่อนแก้)
3. variants: `lightpanda mcp --port 8000` (HTTP, POST /mcp), `--cdp-port <n>` (เปิด CDP ร่วมด้วย)
4. Cloud MCP ผ่าน `mcp-remote`: `npx -y mcp-remote https://euwest.cloud.lightpanda.io/mcp?token=<TOKEN>` (WIP — tools ไม่ครบทุกตัว)
5. tools หลัก: `goto`, `search`, `markdown`, `html`, `extract`, `evaluate`, `click`, `fill`, `scroll`, `hover`, `press`, `selectOption`, `waitForSelector`, `screenshot` (text-layout เท่านั้น), `getUrl`, `getCookies`, `consoleLogs`, `session_new/list/close`; resources `mcp://page/markdown`, `mcp://page/html`

### 5. Validate Usage

> Goal: ยืนยันว่าทุก path ทำงานจริง

1. `lightpanda version` → numeric 1.x
2. `lightpanda fetch --dump markdown https://example.com` → มีเนื้อหา `example domain`
3. `lightpanda serve` + snippet Puppeteer/Playwright ด้านบน → ได้ `textContent` จริง
4. MCP: list tools ผ่าน client (เช่น `mcp_list_servers`/`mcp_call_tool` ใน devin) → เห็น `goto`/`markdown`

## Rules

### 1. No-Pixel Reality Check

- Lightpanda ไม่มี layout/rendering engine — `Page.captureScreenshot` คืน placeholder, `--dump png/pdf` เป็น text-only render
- ห้ามใช้กับ: visual regression, screenshot evidence, CSS/font work, Midscene.js (vision-based), anti-detection (ไม่ใช่ stealth browser)

### 2. Endpoint Discipline

- default bind `127.0.0.1` เท่านั้น — ห้าม expose CDP/MCP ไป public interface โดยไม่ auth (CDP = full browser control)
- robots: ใส่ `--obey-robots` ทุก crawl ที่ไม่ใช่ target ของตัวเอง

### 3. AUR Freshness

- AUR `lightpanda-bin` อาจ lag stable release — เช็ค `lightpanda version` หลัง install; ถ้าเก่ากว่า stable ปัจจุบัน ใช้ nightly package หรือ one-liner ที่ pin version

### 4. Composition

- automation script จริง (multi-session, record, CI) → `/use-agent-browser`; inspect/debug console+network → `/use-chrome-devtools`; vision-based NL test → `/use-midscenejs`; skill นี้ covers CDP/MCP ของ Lightpanda เท่านั้น

## Expected Outcome

- `lightpanda` binary พร้อมใช้บน WSL/Arch (ตรวจด้วย `lightpanda version`)
- fetch/serve ผ่าน, Puppeteer+Playwright connect ผ่าน CDP ได้ผลจริง
- MCP server register ใน client (รวม devin global `mcp_config.json`) และ list tools ได้
- user เข้าใจ boundary: ไม่มี pixel — ทุกงานที่ต้องการภาพต้องไป browser จริง
