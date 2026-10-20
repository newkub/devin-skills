---
name: resolve-cloudflare-worker-fails
argument-hint: "[--worker <worker-name>] [--project <pages-project>]"
description: Inspect and fix the specified Cloudflare Worker or Pages project
related:
  - resolve-errors
  - list-cloudflare-projects
  - report
  - suggest-next-action
  - ask-me

---

## Goal

Inspect and fix the specified Cloudflare Worker or Pages project by finding the local project in `D:\` and redeploying

## Scope

Applies to a single worker or pages project; if not specified, it will be found from the current project or repo name

- For list fails see `## Merged Details → references/list-fails`

See also: /list-cloudflare-projects, /resolve-all-cloudflare-worker-fails, `## Merged Details → references/list-fails`

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
3. If neither → find the worker name from `wrangler.toml` or the repo name from `git remote -v`
4. If not found → run `/ask-me`

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
2. State: resolved or manual-fix-required

### 6. Suggest Next Action

> Goal: Suggest the next step
1. Run `/suggest-next-action` to suggest redeploy, check logs, or `/resolve-all-cloudflare-worker-fails`

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

## Merged Details

### references/list-fails

#### List Cloudflare Worker Fails

##### Goal

Summarize all Cloudflare Workers/Pages whose deployment failed or whose latest deployment is not in the success state in the Cloudflare account the user can access

##### Scope

Used when you want to inspect workers that failed to deploy or have a failed deployment status in the user's Cloudflare account, using `wrangler` or the Cloudflare API, without modifying the worker or redeploying

See also: /list-cloudflare-projects, /check-deployment-fails, /open-cloudflare-workers, /follow-service-cloudflare

##### Execute

###### 1. Verify wrangler Authentication

> Goal: Confirm that wrangler is ready and authenticated

1. Run `wrangler --version` to check the installation
2. Run `wrangler whoami` to check authentication and account
3. If not authenticated → run `/ask-me` to have the user run `wrangler login`
4. Record the account info

###### 2. Get Account ID And Token

> Goal: Obtain the account ID and token to query the API

1. Find the account ID from:
   - `wrangler whoami` output
   - `CLOUDFLARE_ACCOUNT_ID` env var
   - `~/.wrangler/config/` or `wrangler.toml` in any project
2. Find the token from the `wrangler` credentials stored by `wrangler login` or the `CLOUDFLARE_API_TOKEN` env var
3. If not found → run `/ask-me` to have the user specify it

###### 3. List All Workers And Pages Functions

> Goal: Fetch the list of all workers in the account

1. Run the API:
   `curl -s -H "Authorization: Bearer <token>" "https://api.cloudflare.com/client/v4/accounts/<account_id>/workers/scripts"`
2. Or use a Bun/Node script to call the same API
3. For Pages projects use:
   `curl -s -H "Authorization: Bearer <token>" "https://api.cloudflare.com/client/v4/accounts/<account_id>/pages/projects"`
4. Record the worker names and pages project names

###### 4. Detect Failing Deployments

> Goal: Find the workers with problems

1. For each worker run:
   `curl -s -H "Authorization: Bearer <token>" "https://api.cloudflare.com/client/v4/accounts/<account_id>/workers/scripts/<worker_name>/deployments"`
2. For Pages projects use:
   `curl -s -H "Authorization: Bearer <token>" "https://api.cloudflare.com/client/v4/accounts/<account_id>/pages/projects/<project_name>/deployments"`
3. Record the latest deployment: status, created at, version
4. Find statuses that are not `success` or `active`
5. Collect the list to report

###### 5. Build Report

> Goal: Summarize the result as a table

1. Use `/report` columns:
   - No.
   - Worker / Project
   - Type
   - Latest Deployment
   - Status
   - Errors / Notes
2. Sort by Worker / Project name
3. State a summary: total count, count of failed deployments

###### 6. Suggest Next Action

> Goal: Suggest the next step

1. Run `/suggest-next-action` to suggest check logs, `/resolve-cicd`, or `/resolve-cloudflare-worker-fails`

##### Rules

###### 1. Read Only

- Do not redeploy, delete a worker, or modify config
- Do not push code or deploy automatically

###### 2. Secret Safety

- Do not expose `CLOUDFLARE_API_TOKEN`, account ID, or credentials in the output
- Use env vars or `wrangler` credentials only
- Mask the token in logs

###### 3. Auth Required

- Must log in with `wrangler login` or have `CLOUDFLARE_API_TOKEN` first
- If lacking the `Workers Scripts:Read` or `Pages:Read` permission, report it

###### 4. Rate Limit

- Do not query too quickly; if there are many workers, batch
- If the API returns 429, wait and retry

##### Expected Outcome

- A list of Cloudflare Workers/Pages with their latest status
- Workers with failed deployments are clearly marked
- A table sorted by worker/project name
- A report of the failed deployments with notes
- No worker is modified or redeployed in any way

## Expected Outcome

- The specified Worker/Pages project is resolved or marked manual-fix-required
- A summary table of status, action, errors
- No auto-deploy without permission
