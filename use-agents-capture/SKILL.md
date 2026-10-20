---
name: use-agents-capture
description: Capture image/video evidence — web, component, terminal, app or all-routes via one CLI
argument-hint: "<web|component|terminal|app|all> [options]"
related:
  - use-agent-browser
  - use-chrome-devtools
  - run-dev
  - deep-review-codebase

---

## Goal

Capture evidence images or video per target via a single Bun CLI — a web page, a component, terminal output, an app window, or every route x device size — for documentation, debugging, and testing (merged from `capture-web`, `capture-component`, `capture-terminal`, `capture-app`, `capture-all-components-all-routes`)

## Scope

The CLI lives at `D:/newkub/agents-capture/src/` (Bun/TypeScript, entry `src/presentation/cli.ts` — merged into the `agents-capture` project) — usable from any project without installing project-side dependencies:

```bash
bun D:/newkub/agents-capture/src/presentation/cli.ts <mode> [options]
```

| Mode | What it does | Guide |
|------|--------|-------|
| `web` | Screenshot/PDF of one web page via `agent-browser` (for screenshot-only work, `chrome-devtools-mcp` `take_screenshot` also works if registered — see `/use-chrome-devtools`) | [Web](#capture-web) |
| `component` | Screenshot a single element (CSS selector) on a URL | [Component](#capture-component) |
| `terminal` | Render command output as PNG/SVG/HTML | [Terminal](#capture-terminal) |
| `app` | Screenshot OS-level windows/screens (Windows PowerShell) + app sweep workflow | [App](#capture-app) |
| `all` | Every route x every device size in one run + manifest | [All](#capture-all) |

## Execute

### 1. Select Mode

> Goal: Identify the capture mode and read that mode's guide

1. Read the mode from the argument — if not specified → ask the user
2. Read the `## Mode Guides` entry for that mode and follow its Execute + Rules — don't execute directly from this table
3. If a required tool isn't installed yet (`agent-browser`, `terminal-shot`, …) → install it per the mode guide or `/download-program`

### 2. Capture

> Goal: Get the image/video for the mode

1. Prepare the target: open the needed URL/app/terminal (`/run-dev` if a server must be started)
2. Run the CLI subcommand for the mode with meaningful file names
3. Save to the location given by the mode guide (`public/screenshots/`, `docs/screenshots/`, or `.devin/temp/report/<workspace>/captures-<ts>/`)

### 3. Verify And Report

> Goal: The image is genuinely usable and referenced

1. Check that the file was created and is non-empty (view it with `read` if it's an image)
2. `all` mode → always check `manifest.json` errors first
3. Report the path and file size — if used as bug evidence, save it under `.devin/bugs/` with git state and env context

## Rules

- Give files meaningful names; include the date when they are evidence
- Don't capture screens containing secrets/credentials unless necessary — if the target requires auth, ask the user first
- Always report the path of captured files
- Use /run-dev, /use-agent-browser, /resolve-errors, /deep-review-codebase if needed

## Mode Guides

| Mode | Reference |
|------|-----------|
| web | [references/mode-web.md](references/mode-web.md) |
| component | [references/mode-component.md](references/mode-component.md) |
| terminal | [references/mode-terminal.md](references/mode-terminal.md) |
| app | [references/mode-app.md](references/mode-app.md) |
| all | [references/mode-all.md](references/mode-all.md) |

## Subagents

> Goal: Independent jobs that can be spawned in parallel — the profile lives right in this section, no separate file needed

### route-capturer — capture one route across every device size and return artifact paths (use when many routes must be captured in parallel)

- `Inputs`: `route` (a single path to capture, e.g. `/request`, `/examples/form`), `base-url` (dev/prod URL, e.g. `http://localhost:3000`), `devices` (e.g. `desktop,mobile` or custom `wide=1920x1080`), `components` (optional — selector map, e.g. `nav=header,form=form`), `out-dir` (e.g. `.devin/temp/report/<workspace>/captures-<ts>/`), `browser-session` (optional — `agent-browser` session info if the parent already opened one)
- `Tools`: `exec` (run `bun <skill-dir>/src/all.ts` or the `agent-browser` CLI), `read` (read `manifest.json` and check for errors)
- `Execute`:
  1. Confirm `base-url` responds before capturing — if it's down, return `error` immediately
  2. Run `bun src/all.ts --base <base-url> --routes <route> --devices <devices> --out <out-dir>` for the single route across every device
  3. If `components` are given → add `--components "<name>=<selector>@<route>"`
  4. Read `manifest.json` and check this route's errors
  5. Collect all artifact paths that were produced
- `Output`: artifacts table `| No. | Artifact | Path | Device | Status |` — `status`: `ok`/`failed` with the error message on failure; close with a summary of total artifacts, failed count, and the `manifest.json` path
- `Constraints`: Handle one route only, never capture other routes — read-only against the target, don't modify the captured site's code (no write/edit); `--wait` must be long enough for hydration + fonts to load — increase it for slow SPAs; a per-device capture failure is recorded in the output as `failed` — never abort the whole run; artifacts must land only in the parent-assigned `out-dir`, never committed to the repo

## Expected Outcome

- Ready-to-use image/video/PDF evidence files for the specified mode
- `all` mode yields a `manifest.json` summarizing results + errors, ready for `/deep-review-codebase` or a report
