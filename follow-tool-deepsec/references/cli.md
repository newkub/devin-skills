| Command | Use when |
|---|---|
| `bunx deepsec init` | setup + first scan (interactive: model + payment) |
| `bunx deepsec init --plan --output json` | preview the setup without changing anything |
| `bunx deepsec init --yes --model-profile value --output jsonl` | unattended run — profile: `best`/`value`/`budget` |
| `bunx deepsec init --scaffold-only` | create the `.deepsec/` skeleton only |
| `bunx deepsec init --max-cost-usd 100 --max-duration 2h` | bound the run (units: `ms`/`s`/`m`/`h`) |
| `bunx deepsec status` | pipeline status (inside `.deepsec/`) |
| `bunx deepsec scan` | fast local pattern scan — free |
| `bunx deepsec process` | AI review of new/changed candidates — paid |
| `bunx deepsec revalidate` | re-check findings, drop false positives |
| `bunx deepsec triage` | triage findings |
| `bunx deepsec export --format md-dir --out ./findings` | one markdown file per finding |
| `bunx deepsec report` | quick overview |
| `bunx deepsec setup` | continue setup after a scaffold |
| `bunx deepsec init-project ../svc --id svc` | add a repo to the existing workspace |
| `bunx deepsec sandbox process --sandboxes 10 --concurrency 4` | isolated Vercel sandbox run |

| Flag | Meaning |
|---|---|
| `--agent codex\|claude` | harness that runs the AI review |
| `--model-auth direct\|local` | own API key / machine login |
| `--ai-provider openai\|anthropic` + `--ai-api-key-env NAME` | direct provider + env var *name* (the key is not stored) |
| `--headless` | no prompts/no browser (automatic when no TTY) |
| `--project-id` | select the project when the workspace holds several repos |

| Exit code | Meaning |
|---|---|
| `2` | needs input headless cannot provide — JSON output explains the resume steps |
| `3` | cost/duration limit reached — re-run the same command to continue |

| File | Role |
|---|---|
| `.deepsec/deepsec.config.ts` | project/model route/env config |
| `.deepsec/data/<project>/INFO.md` | codebase description injected into AI investigations — hand-editable |
| `.deepsec/generated-matchers.ts` | generated scan patterns — review + commit |
| `.deepsec/.env.local` | env vars for subsequent commands |
| `.deepsec/node_modules/deepsec/SKILL.md` | docs matching the installed version — the agent reads this first |

> Docs: https://deepsec.sh/docs/getting-started (+ configuration, writing-matchers, vercel-setup, architecture)
