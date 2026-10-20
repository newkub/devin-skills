| command | description | options |
|---|---|---|
| `archify.mjs doctor` | check the local runtime for the CLI | |
| `archify.mjs guide "<prompt>"` | recommend a diagram type and the content it needs | `"Show an API request with Redis cache miss"` |
| `archify.mjs validate <type> <file>.json` | run schema/layout/route/label gates on authored IR | `--quality showcase`, `--json` |
| `archify.mjs preview <type> <file>.json` | loopback-only desktop watch loop, keeps last-good output on failure | |
| `archify.mjs deliver <type> <in>.json <out>.html` | final validated render | `--quality showcase`, `--open`, `--json` |
| `archify.mjs compare architecture <base>.json <head>.json <out>.html` | render Before/Delta/After snapshots | `--json` |

| rule | detail |
|---|---|
| invocation | always `node archify/bin/archify.mjs <command>` from the installed skill dir |
| repair budget | apply only `diagnostics[].subject.supportedFixes`, max two correction rounds |
| output ownership | preview/deliver never replace last-good output with an unvalidated render |
