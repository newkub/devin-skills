---
name: create-cloudflare-worker
description: Create a Cloudflare Workers project with Git connect and Cloudflare Access setup
argument-hint: "[project-name]"
related:
  - deploy-to-cloudflare
  - follow-secret-manager
  - open-web-for-config-secret
  - deep-review-codebase

---
## Goal

Create a new Cloudflare Workers project and connect the Git repository automatically, so the user never has to fill in Cloudflare dashboard forms by hand, and always ask first whether Cloudflare Access should be enabled.

## Scope

- Create the Workers project with the Wrangler CLI or the Cloudflare API v4
- Connect the Git repository through the Cloudflare Workers Builds API or the dashboard
- Support frontend frameworks such as Vite, Solid, React, Svelte
- Ask the user first whether they want Cloudflare Access
- Keep `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in a secret manager or a gitignored `.env`

## Execute

### 1. Verify Tech Stack And Prerequisites

> Goal: Check which kind of Workers project this is and that it is ready to create and deploy

1. Run `/deep-review-codebase` to summarize the stack
2. Check for `wrangler.toml`, `wrangler.jsonc`, `wrangler.json`
3. Check the `package.json` scripts and the build output
4. If there is no `wrangler.toml` → create one with `name`, `main`, `compatibility_date`, and `[assets]` or `[site]`
5. Check `wrangler --version` or `bunx wrangler --version`
6. If Wrangler isn't authenticated → run `bunx wrangler login`, or use `/create-cloudflare-token` then `wrangler config`
7. Read `CLOUDFLARE_ACCOUNT_ID` from `wrangler whoami`, or have the user supply it
8. Check the current repo's Git remote:
   ```bash
   git remote -v
   ```

### 2. Ask For Cloudflare Access

> Goal: Ask the user before enabling Cloudflare Access

Ask the user with these options:

| No. | Option |
|-----|----------|
| 1 | No Cloudflare Access (default) |
| 2 | Use Cloudflare Access to restrict who can reach the Worker |

If 2 is chosen → after deploy, enable Cloudflare Access and add a policy in Zero Trust

### 3. Create Workers Project

> Goal: Create the Worker on Cloudflare

Method A — use Wrangler (recommended):
```bash
bunx wrangler deploy
```
Wrangler creates a new project automatically if one doesn't exist yet.

Method B — use the Cloudflare API when you want to create it ahead of time:
```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/services" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":"<project-name>","script":null,"class":"worker"}'
```

### 4. Connect Git Repository

> Goal: Attach the GitHub repo to Workers Builds

Method A — use the Cloudflare API v4 (recommended for automation):
```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/projects" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "<project-name>",
    "production_branch": "main",
    "source": {
      "type": "github",
      "config": {
        "owner": "<github-owner>",
        "repo_name": "<repo-name>",
        "production_branch": "main",
        "pr_comments_enabled": true,
        "deployments_enabled": true
      }
    },
    "build_config": {
      "build_command": "cd <subdirectory> && bun install && bun run build",
      "destination_dir": "<dist-or-build-output>",
      "root_dir": "<subdirectory-or-root>",
      "cwd": "<subdirectory-or-root>"
    }
  }'
```

### 5. Configure wrangler.toml

> Goal: Configure the Worker so it is ready to deploy

1. Create or check `wrangler.toml`:
   ```toml
   name = "<project-name>"
   main = "src/worker.js"
   compatibility_date = "2026-08-30"

   [assets]
   directory = "./dist"
   ```
2. If there is a frontend, use the newer `[assets]` form, not `[site]` or Workers Sites
3. `worker.js` for static assets:
   ```javascript
   export default {
     async fetch(request, env) {
       try {
         return await env.ASSETS.fetch(request);
       } catch (e) {
         return new Response(`Not found: ${e.message}`, { status: 404 });
       }
     },
   };
   ```
4. If no special logic is needed, `worker.js` can be deleted when `[assets]` alone is used

### 6. Configure Build Settings

> Goal: Set the build configuration correctly

Set these through the API or the dashboard:

| Field | Value to use |
|--------|------------|
| Project name | `<project-name>` |
| Production branch | `main` |
| Build command | `bun install && bun run build` |
| Build output | `dist` or `build` |
| Root directory | Usually `.` or `<subdirectory>` |
| Framework | Vite / Other |

Or open the dashboard:
```
https://dash.cloudflare.com/?to=/:account/workers-and-pages/create
```

### 7. Enable Cloudflare Access (Optional)

> Goal: Enable Cloudflare Access if the user chose it

1. Open the Cloudflare Zero Trust dashboard:
   ```
   https://one.dash.cloudflare.com/
   ```
2. Go to Access → Applications → Add an application
3. Choose the Self-hosted type
4. Enter the Application name and Domain = `<project-name>.<account>.workers.dev`
5. Create a policy, e.g. Allow users with email domain `@example.com`
6. Save

Or use the API:
```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/access/apps" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "<project-name>",
    "domain": "<project-name>.<account>.workers.dev",
    "type": "self_hosted",
    "session_duration": "24h",
    "policies": [
      {
        "name": "allow-emails",
        "decision": "allow",
        "include": [{"email_domain": {"domain": "<user-domain>"}}]
      }
    ]
  }'
```

### 8. Deploy And Verify

> Goal: Get the first deploy working and verify the Worker is live and usable

1. If using Workers Builds → push to `main` or wait for Cloudflare to sync
2. If using Wrangler → run:
   ```bash
   bunx wrangler deploy
   ```
3. Save the deployment URL
4. Open the deployed URL
5. Run `bunx wrangler tail` to view logs
6. Report:
   - Worker name
   - Deployment URL
   - Git repo connected
   - Cloudflare Access enabled/disabled
   - Follow-up steps required (if any)

## Rules

- Always ask the user first whether to enable Cloudflare Access
- Never accept tokens in chat; have the user enter them via `wrangler login` or a secret manager
- Use Cloudflare Workers as the primary product, not Pages, for this kind of Worker
- If the API call fails, open the dashboard and walk the user through the steps
- Never commit `.env` or tokens into the repo
- Support Bun, npm, and pnpm according to the project's context

- Use /deploy-to-cloudflare if needed
- Use /follow-secret-manager if needed
- Use /open-web-for-config-secret if needed (cloudflare worker)

## Expected Outcome

- The Workers project is created on Cloudflare
- The Git repo is connected to Workers Builds or ready to deploy with Wrangler
- The Worker URL works
- Cloudflare Access status is set as the user chose
- No secrets leaked into the source code