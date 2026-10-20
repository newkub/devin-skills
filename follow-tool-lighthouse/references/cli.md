| command | description | options |
|---|---|---|
| `lighthouse <url>` | run an audit | default engine is Chrome against the URL |
| `lighthouse --version` | print the CLI version | |

| flag | default | meaning |
|---|---|---|
| `--output <fmt>` | html | `html`, `json`, `csv` — repeatable |
| `--output-path <path>` | — | file or `stdout` |
| `--view` | false | open the HTML report after the run |
| `--only-categories <list>` | all | restrict report sections |
| `--preset <name>` | — | `perf`, `experimental`, `desktop` |
| `--form-factor <f>` | mobile | `mobile`, `desktop` (preset desktop tunes more than this) |
| `--screenEmulation.width` / `.height` | mobile emulation | device metrics |
| `--throttling-method <m>` | simulate | `simulate` (repeatable) · `devtools` (real network) |
| `--throttling.rttMs` / `--throttling.throughputKbps` | simulated profile | model a specific network |
| `--max-wait-for-load <ms>` | — | slow-loading SPAs |
| `--blocked-url-patterns <pattern>` | — | exclude analytics/ads from the trace |
| `--disable-storage-reset` | false | audit a cached/logged-in state |
| `-G`, `--gather-mode` | false | collect artifacts into `./latest-run/` |
| `-A`, `--audit-mode` | false | audit stored artifacts (no new trace) |
| `--list-all-audits` | — | print every audit id |
| `--only-audits` / `--skip-audits` | — | run or skip specific audit ids |
| `--chrome-flags <flags>` | — | extra Chrome launch flags |
| `--port <port>` | — | connect to an existing Chrome debug port |
| `--config-path <file>` | — | custom config |
