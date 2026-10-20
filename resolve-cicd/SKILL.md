---
name: resolve-cicd
description: Watch CI (GitHub Actions) and CD (Cloudflare, deploy targets) then resolve until it passes
argument-hint: "[--repo <owner/repo> | --run-id <id> | --url <url> | verify]"
related:
  - resolve-errors
  - use-wrangler
  - run-check
  - loop-until-complete
  - report-progress
  - list-github
---

## Goal

Continuously watch the CI/CD of the current repo — check GitHub Actions runs and Cloudflare (Workers/Pages) deployments. When a failure is found, dispatch `/resolve-errors` to fix the root cause and then verify with a new run until it is green, or until hitting a blocker that requires asking the user

## Scope

Use when you need to monitor the pipeline after push/merge, or when you know CI/CD is failing — covers CI (GitHub Actions) and CD (Cloudflare Workers, Pages, deploy workflows, or any other target detected in the repo). Fixing errors is always done through `resolve-*` skills — this skill only watches + dispatches + verifies; it does not fix code directly

- repo-scoped mode (default if inside a git repo or with `--repo`): resolve every pipeline that matches the repo — see `references/repo-resolve.md`
- single-run mode (`--run-id` or `--url`): follow a single run until it passes — see `references/single-run.md`
- Does not trigger the first run itself

## Execute

Step dependencies: Step 1 → 2 → 3 repeats until clean or blocked

### Workflows

| Argument | Workflow |
|----------|----------|
| `verify`, `verify-resolved` | `workflows/verify-resolved/SKILL.md` — re-run/watch the workflow on the remote until green is confirmed |

1. If the argument is `verify` → read `workflows/verify-resolved/SKILL.md` and follow the flow — do not resolve again
2. If not specified → do Steps 1-4 as usual

### 1. Detect Targets

> Goal: Identify all the CI and CD that this repo actually uses

1. Check `.github/workflows/*.yml` — list workflow names and jobs (CI vs deploy)
2. Check `wrangler.toml` / `wrangler.jsonc` in every workspace — identify Workers/Pages projects
3. Check deploy scripts in `package.json` (`deploy`, `cf-typegen`, `wrangler deploy`) and CI steps that call deploy
4. If no CI/CD is found at all → stop and report that there is no target

### 2. Watch Status

> Goal: Gather the latest status of every pipeline

CI (GitHub Actions):
1. `gh run list --limit 10` — view the conclusion of the latest runs grouped by workflow
2. `gh run view <id> --log-failed` for runs that are `failure` — capture failed jobs and error output
3. If a run is in progress and needs monitoring → `gh run watch <id> --interval 10` or poll `gh run view <id>` every ~15 sec

CD (Cloudflare and others):
1. Check deploy workflow runs (names containing deploy/cloudflare/wrangler) — failures of these workflows count as CD failures
2. If the `wrangler` CLI + auth are available → `bunx wrangler deployments list --name <worker>` compare the latest deployment with the expected version
3. Check the health endpoint of deployed workers (from `wrangler.toml` route/URL or docs) — status ≠ 200 counts as deploy-unhealthy
4. Other detected deploy targets (Vercel, Docker registry, etc.) → use the CLI/URL health check per the ecosystem

### 3. Resolve Failures

> Goal: Fix every failure through resolve-errors — do not fix code yourself in this skill

1. Group failures by pipeline — separate CI failures and CD failures
2. Order: CI before CD always (CD failing from a broken CI artifact is normal) and upstream job before downstream
3. For each failure group → call the matching resolve skill:
   - GitHub Actions → `/resolve-github-actions-fails`
   - Specific Cloudflare Worker/Pages → `/resolve-cloudflare-worker-fails`
   - Cloudflare across the whole account → `/resolve-all-cloudflare-worker-fails`
   - General code/config errors → `/resolve-errors`
4. After a fix → commit + push then return to Step 2 to watch the new run — run `/loop-until-complete` until every pipeline is green or a blocker is hit
5. Blockers that cannot be fixed yourself (missing secrets, quota, permissions, billing) → stop and report the list of secrets/values the user must set — do not commit secrets or a workaround that lowers the security posture

### 4. Report

> Goal: Summarize the status of every pipeline after watch/resolve

1. Run `/report` — table: pipeline, status before, cause, fix, status after
2. Run `/report-progress` — work done/pending and next actions
3. If blockers remain → state the action required clearly (e.g. `wrangler secret put X --name auth`)

## Rules

### 1. Watch Discipline

- Always detect targets from the actual repo first — do not assume it is only GitHub/Cloudflare
- Poll interval ≥10 sec — do not busy-loop `gh run view`
- If there is no new run (not pushed yet) → watch the latest run of the current branch instead

### 2. Resolution Discipline

- Fix errors only through `resolve-*` skills — this skill does not fix code directly
- Always fix CI before CD — CD that depends on the CI artifact will fix itself once CI is green
- After a fix you must verify with a real run (`gh run watch`) — do not claim it passes from a local check alone
- If the fix + watch loop exceeds 3 rounds and still fails at the same point → run `/deep-debug` (single-run up to 5 rounds; repo-scoped up to 3 rounds per worker — if the same failure repeats 3 times, recommend a rollback)
- Record `LAST_GREEN_SHA` before fixing — ask the user before a rerun/deploy that affects production
- Timeout: `perRoundTimeout` 300 sec, `ciWatchTimeout` 900 sec, `cdWatchTimeout` 600 sec

### 3. Safety

- Do not commit secrets/tokens to fix a CD failure — report so the user sets them themselves
- Do not disable a workflow, skip jobs, or lower branch protection to make it green — that is a symptom fix
- `gh` must already be authenticated — if `gh auth status` fails → report so the user logs in themselves

### 4. Integration

- `/git-commit-and-push` — use after a fix to push then continue watching
- `gh` CLI — command reference for runs/workflows
- `/use-wrangler` — command reference for wrangler deployments
- `/run-check` — local gate before pushing a fix

- Use /list-github if necessary


## Expected Outcome

- Know the CI/CD status of every pipeline of the repo in a single table
- Failures are fixed at the root cause through `/resolve-errors` and verified with a real run until green
- Blockers that cannot be fixed yourself are reported with the action required — no silent failure
