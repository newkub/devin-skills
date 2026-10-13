---
name: deploy-to-vercel
description: Deploy an application to Vercel until it is live
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - follow-service-vercel
  - run-build
  - git-commit
  - watch-browser
  - run-deploy
---

## Goal

Deploy the application to Vercel via the CLI, covering build, deploy, commit/push, and post-deploy validation

## Scope
- For related skills: `open-web-for-config-secret`, `follow-service-vercel`

Covers the Vercel CLI, linking the project, build, deploy, watch, and fixing failures.

## Execute

### 1. Verify And Build

> Goal: Verify and build

1. Run `/run-verify`
2. Run `/run-build`
3. Inspect the build artifacts

### 2. Authenticate And Link

> Goal: Connect the Vercel project

1. Run `bunx vercel login` if not authenticated
2. Run `bunx vercel link` in the project directory
3. Confirm the project ID in `.vercel/project.json`

### 3. Deploy

> Goal: Push the deployment to Vercel

1. Run `bunx vercel --yes` or `bunx vercel deploy --yes`
2. Record the preview URL and deployment ID
3. For production → `bunx vercel --prod --yes`

### 4. Watch And Validate

> Goal: Confirm the deployment is live

1. Run `/watch-deploy` with the preview URL
2. Run `/watch-browser-and-fix` with the URL
3. Wait until the status is `READY`

### 5. Commit And Push

> Goal: Sync with git

1. Run `/git-commit`
2. Run `/git-push`

### 6. Report

> Goal: Summarize the results

1. Report the project, URL, and status
2. State the environment (preview/production)

## Rules

- The build must succeed before deploying
- Use `/follow-secret-manager` to manage `VERCEL_TOKEN` and secrets before deploying
- Use the `bunx vercel` or `vercel` CLI
- Do not commit before confirming the deployment is live
- If it fails → run `/resolve-errors`, then redeploy
- Use /run-deploy if needed

## Expected Outcome

- Deployed to Vercel successfully
- The URL works
- Git is synced
