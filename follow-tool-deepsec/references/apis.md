| key | value |
|---|---|
| package | `deepsec` (npm CLI, binary `deepsec`) |
| install | `bunx deepsec <command>` (no install) · `npm i -g deepsec` |
| version | 2.3.10 (npm latest, verified 2026-10-20) |
| license | Apache-2.0 |
| docs | https://deepsec.sh |
| repo | https://github.com/vercel-labs/deepsec |
| repo footprint | `.deepsec/` workspace only — everything else stays untouched |

| api | description | signature/example |
|---|---|---|
| `deepsec init` | scaffold workspace, inventory, pattern scan, AI review | `--yes --model-profile value --output jsonl` |
| model profiles | cost/quality presets | `best` · `value` · `budget` |
| `--plan` | preview the pipeline without running it | `--plan --output json` |
| `--scaffold-only` | create the `.deepsec/` skeleton only | review before a real run |
| `deepsec status` | pipeline progress | run inside `.deepsec/` |
| `deepsec scan` | fast local pattern scan (free) | |
| `deepsec process` | AI review of flagged files (paid) | |
| `deepsec revalidate` | re-check findings, drop false positives | paid |
| `deepsec export` | write findings out | `--format md-dir --out ./findings` |
| `deepsec report` | quick overview of the workspace | |
| `deepsec init-project` / `setup` | multi-repo workspaces | `init-project ../svc --id svc`, then `--project-id svc` |
| `deepsec sandbox process` | isolated Vercel sandboxes; host keeps credentials | `--sandboxes 10 --concurrency 4` |
| `generated-matchers.ts` | scan patterns deepsec generates — review + commit | coverage gap fixes |
| `data/<project>/INFO.md` | codebase description injected into every investigation | keep accurate |
| `.deepsec/.env.local` | local credentials for later runs | never commit |
| `--max-cost-usd` / `--max-duration` | hard bounds (duration needs a unit) | `--max-cost-usd 100 --max-duration 2h` |
| exit codes | `2` = input needed in headless mode, `3` = cost/duration limit | JSON output explains resume |
