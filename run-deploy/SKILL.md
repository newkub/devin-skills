---
name: run-deploy
description: Deploy the app to a target platform with commit, push and watch until live
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - deep-review
  - resolve-errors
  - resolve-cicd
  - run-verify
  - run-build
  - follow-tool-vite
  - follow-create-plugins
  - deploy-to-vercel
  - deploy-to-cloudflare
  - deploy-to-railway

---

## Goal

Deploy the application to the target platform with post-deploy validation, commit/push, and browser watching until the deployment is live

## Scope
- For related skills: `open-web-for-config-secret`, `deep-review`

Covers verify, build, deploy, commit/push, post-deploy validation, watch until live, and rollback & recovery
- References: [Cloudflare Vite Plugin](references/cloudflare-vite-plugin.md)

## Execute

> Pre-Run: Always run `/deep-review` first — `run-*` requires review/assessment before the main action, never skip; if findings are blockers, fix or report them before running (deploy)

### 1. Verify

> Goal: Verify

Check code quality before deploy

1. Run `/run-verify` to check code quality
2. Confirm verify succeeds
3. Confirm there are no significant errors or warnings

### 2. Build Application

> Goal: Build Application

Build the application for deployment

1. Run `/run-build` to build the application
2. Confirm the build succeeds
3. Inspect the created artifacts

### 3. Deploy

> Goal: Deploy

Deploy the application per the platform in use

1. For Vercel: run `/deploy-to-vercel`
2. For Cloudflare:
   - If the Worker project has not been created yet → run `/create-cloudflare-worker` first
   - Then run `/deploy-to-cloudflare`
3. For Railway: run `/deploy-to-railway`
4. For other platforms: follow the relevant workflow
5. Confirm the deploy succeeds

### 4. Commit And Push

> Goal: Commit And Push

Commit and push changes to the repository

1. Run `/git-commit`
2. Run `/git-push`

### 5. Verify Deployment

> Goal: Verify Deployment

Confirm the deployment works

1. Open the deployment URL
2. Confirm the application works
3. Check the logs for errors
4. Run `/watch-browser fix` if there is a URL

### 6. Watch Until Live

> Goal: Watch Until Live

Watch the deployment with a browser until it is live

1. Run `/watch-browser fix` with the deployment URL
2. Confirm the page loads successfully
3. Check console errors and network errors
4. Run `/resolve-errors` if problems are found
5. Run `/loop-until-complete` until the deployment is successfully live

### 7. Post-Deploy Validation

> Goal: Post-Deploy Validation

Thoroughly inspect the deployment after deploy (see `references/post-deploy-validation.md`)

1. Run `/run-test` (e2e) to test critical paths after deploy
2. Check the health endpoint and readiness probes
3. Check error logs for 5-10 minutes after deploy
4. If critical errors are found → roll back immediately (see `references/rollback-recovery.md`)

### 8. Rollback And Recovery

> Goal: Rollback And Recovery

Prepare the rollback procedure and check the backup (see `references/rollback-recovery.md`)

1. Run `/deep-review` to check the backup strategy before deploy
2. Prepare a clear rollback procedure before deploy
3. If the deploy fails → roll back immediately and run `/resolve-errors`

## Rules

### 1. Verify — Rules

- Verify must succeed before build
- Use `/run-verify` for verify
- No significant errors or warnings

### 2. Build

- Build must succeed before deploy
- Artifacts must be correct
- Use `/run-build` for build

### 3. Deploy — Rules

- Use `/follow-secret-manager` to manage secrets and API tokens before deploy
- Use `/deploy-to-<platform>` per the chosen platform
- Deploy must succeed
- Check deployment status
- If deploying to Cloudflare and the deploy fails, run `/resolve-cicd` to watch and fix until it passes

### 4. Commit And Push — Rules

- Deploy before commit/push if needed
- Commit/push after the deploy succeeds
- Watch the browser once the deployment URL is available

### 5. Watch Until Live

- Use `/watch-browser fix` for monitoring
- Use `/resolve-errors` when problems are found
- Check console and network errors
- Run `/loop-until-complete` until the deployment is live

### 6. Post-Deploy Validation

- Critical paths must be tested after deploy
- The health endpoint must be checked
- Error logs must be checked for 5-10 minutes after deploy
- If critical errors are found, roll back immediately

### 7. Rollback And Recovery

- The rollback procedure must be prepared before deploy
- The backup strategy must be checked before deploy
- If the deploy fails, roll back immediately
- Zero-downtime deploy is required (when needed)

- Use /follow-tool-vite if needed
- Use /follow-create-plugins (vite) if needed (deploy)
- Use /deep-test smoke in Post-Deploy Validation — sanity check critical paths on the live URL

## Expected Outcome

- Application deployed successfully
- Changes committed and pushed
- URL is accessible
- Application works normally
- No console or network errors
- Post-deploy validation passes (smoke test, health check, logs)
- Rollback procedure is ready to use
- Backup strategy checked before deploy
