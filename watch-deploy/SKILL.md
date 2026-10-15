---
name: watch-deploy
description: Poll a deployed URL and report when it becomes healthy after deployment
argument-hint: "[url|report]"
related:
  - run-watch
  - ask-me
  - run-deploy
---

## Goal

Monitor a deployment URL after a deploy command and report when the service returns a healthy status, typically HTTP 200.

## Scope

Use with static sites and web apps deployed to Cloudflare Pages, Vercel, Netlify, Railway, Render, Fly.io, or any custom domain. Works for production and preview deployments.

## Execute

### 1. Identify Deployment URL

> Goal: know the exact URL to poll

1. Get the URL from the user, deploy output, or CI log
2. If the deploy hasn't finished, wait until a URL is available
3. See `## Merged Details → references/targets` for each platform's URL patterns
4. If the URL is unclear → run `/ask-me`

### 2. Configure Polling

> Goal: set the polling conditions

1. Set `interval` (seconds between polls), default `10`
2. Set `timeout` (total seconds), default `300`
3. Set `expectedStatus`, default `[200]`
4. See `## Merged Details → references/health-check` for redirect, 4xx, 5xx handling

### 3. Poll URL

> Goal: check the status repeatedly until it passes or time runs out

1. Use `curl -s -I -L` or `fetch` to check the URL
2. Record timestamp, status, response time, elapsed time
3. When the status matches `expectedStatus` → stop and report success
4. On a network error → count the retry and report it
5. If it hasn't passed yet → wait `interval` seconds, then poll again

### 4. Report Result

> Goal: summarize the outcome for the user

1. Follow `## Merged Details → report-status` — poll timeline, health transitions, time-to-live
2. On success, report URL, status, response time, elapsed time
3. On timeout, report last status, total polls, error summary
4. On redirect, report the final URL and status

### Workflows

| Argument | Workflow |
|----------|----------|
| `report`, `status` | `## Merged Details → report-status` — deploy watch report (poll timeline, verdict) |

1. If the argument is `report`/`status` → read `## Merged Details → report-status` and follow its flow — use the existing poll data, do not poll anew
2. If omitted → run Steps 1-4 as usual, with Step 4 reading the `report-status` workflow to execute

## Rules

### 1. Default Polling

- `interval` = `10` seconds
- `timeout` = `300` seconds
- `expectedStatus` = `[200]`
- `followRedirects` = `true`
- `maxInterval` = `60` seconds (cap for 429 backoff)
- `maxRedirects` = `5`

### 2. Status Handling

- 200: healthy, stop immediately
- 301/302: follow redirect unless `followRedirects` = `false`
- 401/403: stop immediately, report "authentication required" — URL may be protected
- 404: continue polling (DNS/path may still propagate)
- 429: increase interval by `5` seconds (up to `maxInterval`)
- 500–599: continue polling, report if repeated `3` times
- SSL error: stop immediately, report "SSL certificate error" — do not retry
- redirect loop (≥ 5 redirects): stop, report "redirect loop detected"
- network error: retry up to `maxRetries` = `5`
- after healthy: run `/deep-test smoke` to pass the real health gate, not just the status code

### 3. URL Sources

- Get the URL from `wrangler pages deploy` output
- Get the URL from `vercel --yes` or `netlify deploy`
- Get the URL from a CI environment variable such as `DEPLOY_URL`
- Never hardcode a production domain in this skill

### 4. Output

- Show every poll with timestamp, status, elapsed
- Use a table to summarize the result
- Never print the HTML body

### 5. Rollback Recommendation

- If the timeout elapses and the deployment is still unhealthy → report a rollback recommendation
- Give the platform-specific rollback command (see `## Merged Details → references/targets`)
- Never roll back automatically — let the user decide

### 6. Safety

- Do not poll URLs the user hasn't consented to
- Do not send secret headers such as API keys without permission
- Stop immediately when the user presses `Ctrl+C`

- Use /run-watch if needed
- Use /run-watch if needed
- Use /run-watch if needed
- Use /run-deploy if needed

## Merged Details

### report-status

##### Goal

Convert the `/watch-deploy` poll session into a status report — timeline of health transitions and time-to-live

##### Scope

- Use when `/watch-deploy` dispatches to `report`/`status` or when called after a poll finishes
- Chat-only report — never create a permanent file

##### Execute

###### 1. Collect Poll Results

> Goal: gather the result of each poll

1. Collect the status code + latency per poll with timestamps
2. Identify transitions: `deploying` → `healthy` / `failed`
3. Compute time-to-live (first poll → first 200)

###### 2. Build Status Report

> Goal: answer whether the deploy succeeded and how long it took

1. Summary: URL, total polls, duration, final status
2. Table: `No.`, `Time`, `Status`, `Latency`, `Notes` — show transitions + sample polls (not every poll)
3. Flag anomalies: status flapping, slow-but-200

###### 3. Verdict

> Goal: conclude the deploy outcome

1. Verdict: `live` / `timeout` / `unhealthy` / `flapping`
2. If not live → recommend `follow-deploy/workflows/verify-deploy/SKILL.md` or a rollback path
3. Compare time-to-live against previous deploys when data exists

##### Rules

- do not list every poll — transitions + samples are enough
- state the poll interval and timeout used
- timeout ≠ failure always — note that the app may still be warming up

##### Expected Outcome

- Status report with time-to-live + verdict

### references/health-check

#### Health Check And Polling

Polling logic and status interpretation for `watch-deploy`.

##### HTTP Status Rules

| Status | Meaning | Action |
|---|---|---|
| 200 | Healthy | Stop watching, report success |
| 301/302 | Redirect | Follow if `followRedirects` is `true`, otherwise report redirect |
| 404 | Not found | Continue polling if expected (new DNS/path not ready) |
| 429 | Rate limit | Back off and increase interval |
| 500–599 | Server error | Continue polling, report if repeated |
| timeout | No response | Retry, count toward `maxRetries` |

##### Polling Parameters

- `url`: target URL to poll
- `interval`: seconds between polls, default `10`
- `timeout`: total seconds to watch, default `300`
- `expectedStatus`: status codes considered healthy, default `200`
- `followRedirects`: whether to follow 301/302, default `true`
- `headers`: extra headers such as `Authorization` or custom host

##### Stop Conditions

- URL returns status in `expectedStatus` within `timeout`
- `timeout` reached without success
- `maxRetries` consecutive network errors reached
- User interrupts (`Ctrl+C`)

##### Output Format

Report each poll with:
- timestamp
- status code or error
- response time
- elapsed total time
- retry count

### references/targets

#### Deployment Targets

Common deploy targets and how to obtain a preview/production URL.

##### Cloudflare Pages

- Production: `https://<project-name>.pages.dev`
- Preview: printed by `wrangler pages deploy` e.g. `https://<hash>.<project-name>.pages.dev`
- Branch preview: `https://<branch-name>.<project-name>.pages.dev`

##### Vercel

- Production: `https://<project-name>.vercel.app`
- Preview: `https://<git-commit-hash>-<project-name>.vercel.app`
- `vercel --yes` prints the deployment URL

##### Netlify

- Production: `https://<site-name>.netlify.app`
- Deploy preview: printed by `netlify deploy` or in GitHub PR checks

##### Railway / Render / Fly.io

- Service URL is shown in the dashboard or by the CLI after deploy
- Some platforms require a health endpoint such as `/health` or `/api/health`

##### Custom domain

- Use the custom domain only after DNS propagation
- Prefer checking the platform-provided URL first to avoid false negatives

## Expected Outcome

- The deployed URL is polled repeatedly until healthy or the timeout expires
- Complete result report: final status, response time, elapsed, retries
- No TODO/MOCK/placeholder left
- `SKILL.md` and references stay within 250 lines
