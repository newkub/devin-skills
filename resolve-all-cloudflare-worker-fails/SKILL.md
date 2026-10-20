---
name: resolve-all-cloudflare-worker-fails
argument-hint: "[--worker <worker-name>] [--project <pages-project>]"
description: Inspect and fix every Cloudflare Workers/Pages deployment that failed in the account
related:
  - resolve-errors
  - search
  - report
  - suggest-next-action
  - ask-me
  - run-check
  - run-test
  - run-until-pass
---

## Goal

List every Cloudflare Workers/Pages function that has problems, then resolve them all in a single account

## Scope

Use when you need to inspect and fix workers that fail to deploy or have runtime errors in the user's Cloudflare account, using `wrangler` or the Cloudflare API

## Execute

### 1. Verify wrangler Authentication

> Goal: Confirm that wrangler is ready and authenticated
1. Run `wrangler --version`
2. Run `wrangler whoami`
3. If not authenticated → run `/ask-me` so the user runs `wrangler login`
4. Record the account ID without exposing it in output

### 2. Get Account ID And Token

> Goal: Obtain the account ID and token to query the API
1. Find the account ID from `wrangler whoami`, the `CLOUDFLARE_ACCOUNT_ID` env var, or `wrangler.toml`
2. Use the token from `wrangler` credentials or the `CLOUDFLARE_API_TOKEN` env var
3. If not found → run `/ask-me` so the user specifies it

### 3. List Failing Deployments

> Goal: Find the workers/pages that have problems
1. Call the API `GET /client/v4/accounts/{account_id}/workers/scripts` and `GET /client/v4/accounts/{account_id}/pages/projects`
2. Or use the `wrangler` command `deployments list --name <worker>` if there is a worker name
3. Receive the list: worker/project, type, latest deployment, status, errors/notes
4. If there are no failures → report that the work is done and stop

### 4. Resolve Each Failure

> Goal: Fix the failing workers/pages one at a time
1. For each worker that has a problem:
   - Briefly run `wrangler tail <worker_name> --format json` to find runtime errors
   - Run `wrangler deployments list --name <worker_name>` to see the history
   - If the problem is clear → run `/resolve-errors` then retry the deploy
2. Find the local repo with `/search-project-in-drive-d <worker_name>`
3. If the project has a local repo:
   - `git status` / `git pull`
   - `wrangler deploy` or `wrangler pages deploy`
   - Wait for the result then recheck the deployment
4. If there is no local repo or it cannot be deployed → record as `manual-fix-required`
5. Repeat up to 3 rounds per worker
6. If the new deploy fails → move on to the next one and report it

### 5. Build Report

> Goal: Report the results as a table
1. Use `/report` with columns: No., Worker, Type, Latest Deployment, Status, Action Taken, Errors / Notes
2. Sort by Worker name
3. State the summary: total count, those resolved, those left as manual-fix-required

### 6. Suggest Next Action

> Goal: Suggest the next step
1. Run `/suggest-next-action` to suggest additional redeploys, checking logs, or `/resolve-github-actions-fails`

## Rules

### 1. Safety
- Ask the user before deploying/redeploying each worker if the impact is high
- Do not delete a worker or config without permission
- Rollback is possible if the new deploy fails

### 2. Secret Safety
- Do not expose `CLOUDFLARE_API_TOKEN`, account ID, or credentials in output
- Use env vars or `wrangler` credentials only
- Mask the token in logs

### 3. Auth Required
- Must log in with `wrangler login` or have `CLOUDFLARE_API_TOKEN` first
- If lacking `Workers Scripts:Read/Edit` permission, report it

### 4. Rate Limit
- Do not query too fast; if there are many workers, batch them
- If the API returns 429, wait and retry

### 5. Local Project Matching
- Use `/search-project-in-drive-d` to find a project in `D:\` that matches the worker name
- If not found → mark as `manual-fix-required`
- Use /run-check if necessary
- Use /run-test all if necessary
- Use /run-until-pass if necessary

## Expected Outcome

- List of Cloudflare Workers/Pages with their latest status
- Failed workers are resolved or marked `manual-fix-required`
- A table sorted by worker name
- A report of deployment results and any remaining errors

