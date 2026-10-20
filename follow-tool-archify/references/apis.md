| key | value |
|---|---|
| package | agent skill `tt-a1i/archify` (no npm library) |
| install | `bunx skills add tt-a1i/archify -g` |
| version | v3.x |
| license | MIT |
| repo | https://github.com/tt-a1i/archify |
| entry point | `node archify/bin/archify.mjs` |
| env | `ARCHIFY_UPDATE_CHECK_DISABLED=1` disables the release-reminder network call |

| api | description | example |
|---|---|---|
| diagram types | architecture, workflow, sequence, data flow, lifecycle, ERD, class, tree, timeline, waterfall | `validate architecture plan.json` |
| architecture-delta | before/delta/after comparison from two validated IR files | `compare architecture base.json head.json out.html` |
| typed JSON IR | the only input — the agent authors it, Archify validates it | per-type schema |
| `--quality <profile>` | validation strictness | `--quality showcase` |
| `--json` | machine-readable diagnostics | apply `diagnostics[].subject.supportedFixes` |
| stable links | state restore in the HTML artifact | `#focus=`, `#route=`, `#reach=` |
| output | one self-contained HTML file, no install for viewers | `deliver <type> <in>.json <out>.html` |
| exports | PNG to clipboard, static/motion downloads, 1200×630 share cards | from the rendered artifact |
