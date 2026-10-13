---
name: set-secret-github
description: Set GitHub repository secrets safely with the gh CLI
argument-hint: "<owner>/<repo> <secret-name>"
related:
  - resolve-errors
  - ship-to-dev-branch
  - run-audit

---

## Goal

Help set GitHub repository secrets with the `gh` CLI without exposing token values in chat

## Scope

- Supports repos reachable by the `gh` CLI
- Set one secret at a time, or several repos as the user specifies
- Verify after setting with `gh secret list`

## Execute

### 1. Verify Access

> Goal: confirm the `gh` CLI is authenticated and can reach the target repo

```bash
gh auth status
gh secret list -R <owner>/<repo>
```

### 2. Set The Secret

> Goal: set the secret with the user running the command themselves, never exposing values in chat or files

Have the user run the command themselves for maximum safety:

```bash
gh secret set <SECRET_NAME> -R <owner>/<repo>
```

If the token is in a variable:

```bash
printf "%s" "$SECRET_VALUE" | gh secret set <SECRET_NAME> -R <owner>/<repo>
```

### 3. Verify The Result

> Goal: confirm the secrets are all set and nothing leaked

```bash
gh secret list -R <owner>/<repo>
```

### 4. Secrets Required For This Project

> Goal: identify the standard secrets that CI/CD and deploy need

- `CLOUDFLARE_API_TOKEN` — deploy Cloudflare Workers
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account ID
- `NPM_TOKEN` — publish to npm
- `GH_PAT` — access private repo / trigger dispatch

These secrets are used by workflows monitored with `/resolve-github-actions-fails` and the deploy pipeline of `/ship-to-dev-branch`

## Rules

- Never display secret values in output
- Do not save secrets to files unless necessary
- If the user has no token yet → stop and recommend how to create one
- Use /run-audit if needed
- Use /resolve-errors if needed


## Expected Outcome

- Secrets are set in the specified repo
- `gh secret list` shows the names of the secrets set
- No secret leaks into logs or chat
