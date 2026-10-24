---
name: resolve-cloudflare-worker-fails
argument-hint: "[--worker <worker-name> | --project <pages-project> | --all]"
description: Inspect and fix one Cloudflare Worker/Pages project or every one in the account
related:
  - resolve-errors
  - list-cloudflare-projects
  - report
  - suggest-next-action
  - ask-me

---

## Goal

Inspect and fix the specified Cloudflare Worker or Pages project by finding the local project in `D:\` and redeploying; with `--all`, sweep every worker and Pages project in the account first

## Scope

Applies to one worker or Pages project, or — with `--all` — every worker and Pages project in the account. Without a target it is found from the current project or repo name

- `--all` also covers the read-only listing flow: it reports every target whose latest deployment is not in a success state

See also: /list-cloudflare-projects

## Execute

### 1. Verify wrangler Authentication

> Goal: Confirm that wrangler is ready and authenticated
1. Run `wrangler --version`
2. Run `wrangler whoami`
3. If not authenticated → run `/ask-me` to have the user run `wrangler login`

### 2. Identify Worker Or Project

> Goal: Identify the target
1. If `--worker` is present → use that worker name
2. If `--project` is present → use that Pages project
3. If `--all` is present → skip to Step 2A
4. If none → find the worker name from `wrangler.toml` or the repo name from `git remote -v`
5. If not found → run `/ask-me`

### 2A. Resolve Account Access (`--all`)

> Goal: Obtain the account ID and credentials to query the API
1. Get the account ID from `wrangler whoami`, else `CLOUDFLARE_ACCOUNT_ID`, else `~/.wrangler/config/` or a `wrangler.toml`
2. Get the token from the `wrangler login` credentials or `CLOUDFLARE_API_TOKEN` — never print it
3. If neither is available → run `/ask-me` to have the user run `wrangler login`

### 2B. List Every Target (`--all`)

> Goal: Fetch all workers and Pages projects, then find the failing ones
1. Workers: `curl -s -H "Authorization: Bearer <token>" "https://api.cloudflare.com/client/v4/accounts/<account_id>/workers/scripts"`
2. Pages: `curl -s -H "Authorization: Bearer <token>" "https://api.cloudflare.com/client/v4/accounts/<account_id>/pages/projects"`
3. Per worker: `.../workers/scripts/<worker_name>/deployments`; per Pages project: `.../pages/projects/<project_name>/deployments`
4. Keep every target whose latest deployment status is not `success` or `active`, with its status, created at, and version
5. If nothing fails → report that the account is clean and stop
6. On a 429 → wait and retry the same batch

### 2C. Fix Each Failing Target (`--all`)

> Goal: Resolve the failing targets one at a time
1. For each failing target run Steps 3-4 scoped to that worker or Pages project
2. Record the last successful deployment version before changing anything
3. Repeat at most 3 rounds per target
4. If it cannot be resolved, or has no local repo → mark `manual-fix-required` and move to the next target
5. Do not deploy a high-impact target without confirmation

### 3. Check Deployment And Logs

> Goal: Find the problems of the target
1. Run `wrangler deployments list --name <worker>` or inspect the Pages deployments
2. Run `wrangler tail <worker> --format json` briefly to find runtime errors
3. Record the errors and deployment status

### 4. Resolve

> Goal: Fix and redeploy
1. If a clear problem is found → run `/resolve-errors`
2. Find the local repo with `/search-project-in-drive-d <worker-or-project-name>`
3. If no local repo is found → mark `manual-fix-required`
4. If a local repo is found:
   - `git status`
   - `git pull`
   - fix the code/config
   - `wrangler deploy` or `wrangler pages deploy`
5. Wait for the result and recheck
6. Repeat at most 3 rounds

### 5. Build Report

> Goal: Summarize the result
1. Use `/report` columns: No., Worker/Project, Type, Latest Deployment, Status, Action Taken, Errors / Notes
2. With `--all` → one row per target sorted by name, plus totals: scanned, failing, resolved, manual-fix-required
3. State: resolved or manual-fix-required

### 6. Suggest Next Action

> Goal: Suggest the next step
1. Run `/suggest-next-action` to suggest redeploy, check logs, or `--all` on this skill to sweep the account

## Rules

### 1. Safety
- Ask the user before deploy/redeploy if the impact is high
- Do not delete a worker or config without permission
- Roll back if the new deploy fails

### 2. Secret Safety
- Do not expose `CLOUDFLARE_API_TOKEN`, account ID, or credentials
- Use env vars or `wrangler` credentials only

### 3. Local Project Matching
- Use `/search-project-in-drive-d` to find the project in `D:\`
- If not found → manual-fix-required

### 4. Rate Limit
- Avoid querying too quickly
- If the API returns 429, wait and retry

### 5. Account-wide
- `--all` scans every worker and Pages project; it never deploys without permission
- Record the last successful deployment version before changing any target
- Keep API payloads small and batch the calls; on a 429 wait and retry the same batch

## Expected Outcome

- The specified Worker/Pages project, or every failing target under `--all`, is resolved or marked manual-fix-required
- A summary table of status, action, errors
- No auto-deploy without permission
