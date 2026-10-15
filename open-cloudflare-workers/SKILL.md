---
name: open-cloudflare-workers
description: Open the Cloudflare Workers dashboard page in a browser
argument-hint: "[account-id]"
related:
  - list-cloudflare-projects
  - resolve-errors
  - follow-service-cloudflare
  - ask-me

---

## Goal

Open the Cloudflare Workers dashboard page in a browser with a native OS command

## Scope
- For related skills: `list-cloudflare-projects`, `/resolve-cloudflare-worker-fails`, `/resolve-cicd`, `follow-service-cloudflare`

Use to open the dashboard for managing Cloudflare Workers and Pages without modifying any config

## Execute

### 1. Resolve Account ID

> Goal: Get the correct Cloudflare account ID

1. Take `account-id` from the argument
2. If absent, look it up from the `CLOUDFLARE_ACCOUNT_ID` env var
3. Still absent, run `wrangler whoami` to see the account info of the logged-in session
4. If not found → do `/ask-me`

### 2. Build URL

> Goal: Build the correct URL

1. With an account ID → `https://dash.cloudflare.com/<account-id>/workers-and-pages`
2. Without one → `https://dash.cloudflare.com/?to=/:account/workers-and-pages`
3. Check the URL before opening

### 3. Open Dashboard

> Goal: Open the dashboard in a browser

1. Open with the native OS command:
   - Windows: `start <url>`
   - macOS: `open <url>`
   - Linux: `xdg-open <url>`
2. Or do `/open-web` to open it

## Rules

### 1. Account ID

- Never expose the account ID or token in output
- Without an account ID, open the generic dashboard page
- Support the `CLOUDFLARE_ACCOUNT_ID` env var

### 2. URL

- Use dash.cloudflare.com only
- Do not construct unclear URLs

### 3. Open Method

- Use the native OS commands `start` / `open` / `xdg-open`
- Use `/open-web` as a fallback
- Use the `browser_preview` tool when an integrated browser is wanted

### 4. Output

- Report the URL that was opened
- If opening fails, report it
- Use /resolve-errors if needed


## Expected Outcome

- The Cloudflare Workers dashboard page opens in a browser
- The URL is correct
