# Capture Web


Screenshot/PDF a single web page with the `agent-browser` CLI via `capture web` (merged from `capture-web`)

Boundary: screenshot only (no PDF/`--annotate`/env options) and `chrome-devtools-mcp` is already registered → you can use `take_screenshot` via MCP without installing the CLI (see `/use-chrome-devtools`); PDF and annotate flows use `agent-browser` only

#### Web — Execute

##### 1. Install And Verify

1. Check with `agent-browser --help` — if it's missing → `bun add -g agent-browser` then `agent-browser install` (see `/use-agent-browser`)
2. Verify the target URL responds before capturing

##### 2. Capture

```bash
bun D:/newkub/agents-capture/src/presentation/cli.ts web <url> --out <file.png>
bun D:/newkub/agents-capture/src/presentation/cli.ts web <url> --out <file.png> --full --annotate
bun D:/newkub/agents-capture/src/presentation/cli.ts web <url> --pdf <file.pdf>
```

- `--out` omitted → saves to `~/.agent-browser/tmp/screenshots/`
- `--full` = full-page, `--annotate` = numbered element labels (refs `@eN` for further interaction)
- `--pdf` = save the web page as a PDF
- `--wait <ms>` = settle time after networkidle (raise it for slow SPAs)

##### 3. Advanced Options

- Use `agent-browser screenshot` directly if you need more options: `--screenshot-dir`, `--screenshot-format jpeg`, `--screenshot-quality 0-100`
- Persistent env vars: `AGENT_BROWSER_SCREENSHOT_DIR`, `AGENT_BROWSER_SCREENSHOT_FORMAT`, `AGENT_BROWSER_SCREENSHOT_QUALITY`
- Use `agent-browser snapshot -i` alongside `--annotate` to view refs in text format

##### 4. Verify And Cleanup

1. The CLI closes the browser itself when done (`agent-browser close`)
2. Verify the file was created and is non-empty, then report the path + size

#### Web — Rules

- Store files in `docs/screenshots/` or `test/screenshots/` — name them after the page/test case
- Don't capture screens that contain secrets/credentials
- Always wait for `networkidle` before screenshotting (the CLI already does this)
- Use /use-agent-browser if needed — use /resolve-errors when an error occurs

#### Web — Expected Outcome

- Get the requested screenshot (viewport/full-page/annotated) or PDF, with a reportable path

