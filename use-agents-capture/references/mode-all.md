# Capture All


Capture screenshots of every route x every device size in one run — framework-agnostic via `capture all` (engine: `agents-capture/src/all.ts`, merged from `capture-all-components-all-routes`)

#### All — Execute

##### 1. Confirm Server

1. Check that the base URL responds (`agent-browser open <base>` or `Invoke-WebRequest`)
2. If the server is down → run `/run-dev` or `/resolve-errors` first

##### 2. Discover Routes — pick a method (ordered by accuracy)

| Method | When |
|------|-----------|
| `crw_map` (MCP) | prod/public site or a site with a sitemap — get the site-wide URL list, filter to same-origin, save as a routes file |
| `--discover` | the script crawls same-origin `<a href>` from the base itself (up to 50 routes) — no sitemap needed |
| `--routes` | specify them yourself when the routes are known, e.g. `/,/request,/examples` |
| `--routes-file` | one route per line or a JSON array — suits output from `crw_map` |

##### 3. Run Capture

```bash
bun D:/newkub/agents-capture/src/presentation/cli.ts all --base http://localhost:3000 --discover

# routes already known + desktop/mobile only
bun D:/newkub/agents-capture/src/presentation/cli.ts all --base http://localhost:3000 \
  --routes /,/request,/examples --devices desktop,mobile

# routes + components (selector per route)
bun D:/newkub/agents-capture/src/presentation/cli.ts all --base http://localhost:3000 \
  --routes /,/request --components "nav=header@/,form=form@/request,card=.rounded-3xl@/request"

# routes from crw_map → routes.txt
bun D:/newkub/agents-capture/src/presentation/cli.ts all --base https://example.com --routes-file routes.txt --full

# custom viewport
bun D:/newkub/agents-capture/src/presentation/cli.ts all --base http://localhost:3000 \
  --discover --devices "wide=1920x1080,mobile"
```

Options: `--wait <ms>` (default 1200), `--full`, `--session <name>`, `--out <dir>`

Output layout:

```text
<out>/routes/<route-slug>-<device>.png
<out>/components/<name>-<device>.png
<out>/manifest.json   # captures + errors
```

##### 4. Parallel Routes (subagent)

If there are many routes → spawn the `route-capturer` profile (`use-agents-capture/SKILL.md ## Subagents`) one route at a time in parallel (read the inputs/tools/output contract in that section)

##### 5. Review Output

1. Always check `manifest.json` errors first
2. Hand the images on to `/deep-review` (dimension `uxui` for UX/UI)

#### All — Rules

- Never hardcode any framework's routes — discovery must come from `crw_map`, `--discover`, or input
- Use the `agent-browser` CLI only — no dependency installation in the project
- Don't modify the code of the site being captured
- `--wait` must be long enough for hydration + fonts to load — increase it for slow SPAs
- A per-target capture failure is stored in `manifest.errors` — never abort the whole run
- default output: `.devin/temp/report/<workspace>/captures-<timestamp>/` (`.devin/` should be gitignored — local evidence)
- Use /watch-browser if needed

#### All — Expected Outcome

- Complete screenshots of every route x every device plus a `manifest.json` summarizing results/errors, ready for next steps
