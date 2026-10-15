# Capture App


Two contexts for "app" (merged from `capture-app`):

1. **App sweep** — capture every route/component of the app into `public/screenshots/` (workflow)
2. **OS window** — screenshot desktop app windows/screens (CLI `capture app`)

#### App — Execute: App Sweep (web app / TUI)

##### 1. Detect App Type

1. Inspect `package.json` scripts, dependencies, and file structure
2. web → find routes from `src/app`, `src/pages`, `src/routes`, `apps/*/pages`, `examples`
3. TUI/CLI → identify the key commands/views
4. If unclear → ask the user

##### 2. Setup Output

1. Create `public/screenshots/` if missing — separate `routes/`, `components/`, `terminal/`
2. Naming: `<route-or-component-name>.png`

##### 3. Capture Web Routes

```bash
bun D:/newkub/agents-capture/src/presentation/cli.ts all --base http://localhost:3000 \
  --routes /,/request,/examples --devices desktop --full \
  --out public/screenshots
```

- Start the dev server first if needed (`bun dev`)
- If the project has `playwright.config.*` → use Playwright per `/follow-tool-playwright` instead
- For a specific component → `capture component <url> --selector <css>`

##### 4. Capture Terminal Views

```bash
bun D:/newkub/agents-capture/src/presentation/cli.ts terminal --cmd "<cli-command>" --out public/screenshots/terminal/<name>.png
```

##### 5. Verify And Report

1. Check `public/screenshots/` to confirm all files were created
2. Build a `/report` table: No., Type, Name, File, Size
3. A route fails → `/resolve-errors` then retry

#### App — Execute: OS Window (desktop app)

```bash
bun D:/newkub/agents-capture/src/presentation/cli.ts app --out window.png                  # primary screen
bun D:/newkub/agents-capture/src/presentation/cli.ts app --title "WezTerm" --out wez.png   # window by title
```

- Windows-only (PowerShell `CopyFromScreen`) — `--title` = substring of the visible window title

#### App — Rules

- Don't commit images unless the user wants them; don't capture screens with sensitive data
- Routes that require authentication → ask the user first
- Never auto deploy/push screenshots
- If you need a reproducible script in the project → create `tools/capture-screenshots.{ts,msj}` that calls this CLI (per `/convert-scripts`)

#### App — Expected Outcome

- `public/screenshots/` contains complete images of every key route/component/view, ready for `/deep-review-codebase`
- Or the OS window/screen image as specified by `--title`
