---
name: follow-deploy-verify-deploy
description: Verify a deployment is really live after deploy — URL, version, health, logs, rollback readiness
argument-hint: "[url-or-platform]"
related:
  - run-verify
  - resolve-errors
  - follow-secret-manager
  - report
---

## Goal

Verify after deploy that the application is really live and on the right version — shared verification for every `/follow-deploy` platform workflow

## Scope

- Use when `/follow-deploy` dispatches to `verify`, or invoke it after a deploy finishes
- Covers: URL reachability, expected version/commit, health endpoint, error logs, rollback readiness
- Read-only: inspection only — no automatic redeploy or rollback

## Execute

### 1. Confirm Deployment Exists

> Goal: the latest deployment really exists and is the expected version

1. Pull the latest deployment from the platform:
   - Cloudflare: `wrangler deployments list`
   - Vercel: `vercel ls --prod` or `vercel inspect`
   - Railway: `railway status` / `railway deployment list`
2. Compare the deployed commit/version with `git rev-parse HEAD` — flag if a stale version was deployed

### 2. Check URL And Health

> Goal: the app actually responds

1. `curl -sI <url>` → the expected 200/3xx status, not 5xx
2. If a health endpoint exists (`/health`, `/api/health`) → verify the response is correct
3. Check the critical routes touched by the deploy (e.g. a route that just changed)

### 3. Check Logs And Errors

> Goal: no runtime errors after deploy

1. Review logs for the 5-10 minutes after deploy:
   - Cloudflare: `wrangler tail`
   - Vercel: `vercel logs`
   - Railway: `railway logs`
2. flag: uncaught exceptions, 5xx spikes, missing env var errors

### 4. Confirm Rollback Path

> Goal: rollback is ready if needed

1. Identify the previous deployment/version that can be rolled back to
2. Identify the platform's rollback command — but don't run it

### 5. Report

> Goal: summarize deployment health

1. Use `/report` with columns: `No.`, `Check`, `Result`, `Evidence`, `Notes`
2. Verdict: `healthy` / `degraded` / `failed` + the ready-to-use rollback command

## Rules

- if any check fails → report immediately with the rollback command — don't fix it yourself
- use the staging URL if the parent deployed to staging — always state the environment in the report
- secrets/credentials only via `/follow-secret-manager`

## Expected Outcome

- deployment confirmed live + on the right version, or failure reported with a rollback path
- checks table with evidence
