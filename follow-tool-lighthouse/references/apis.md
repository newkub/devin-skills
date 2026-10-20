| key | value |
|---|---|
| package | `lighthouse` (npm CLI) |
| install | `bunx lighthouse@latest` · `bun add -g lighthouse` |
| version | 13.5.0 (npm latest, verified 2026-10-20) |
| license | Apache-2.0 |
| docs | https://developer.chrome.com/docs/lighthouse/overview |
| repo | https://github.com/GoogleChrome/lighthouse |
| browser | Chrome/Chromium ≥ 66 — auto-detected, or set `CHROME_PATH` |

| api | description | signature/example |
|---|---|---|
| categories | report sections | `performance`, `accessibility`, `best-practices`, `seo`, `agentic-browsing` (v13+) |
| presets | bundled run configuration | `perf`, `experimental`, `desktop` |
| `categories.*.score` | category score 0-1 (×100 for the familiar number) | JSON output |
| `audits` | individual checks with `score` | filter `score < 0.9` |
| `details.overallSavingsMs` / `overallSavingsBytes` | estimated impact of an opportunity | rank findings by savings |
| report outputs | html for humans, json for automation, csv | `--output html --output json` |
| artifacts modes | split gather from audit | `-G` gather, `-A` audit |
| config file | share run settings | `--config-path` |
