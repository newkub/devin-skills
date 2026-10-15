---
name: follow-service-vercel-verify-connection
description: Confirm after setup/config that Vercel really connects — CLI authenticated, project linked, env vars fully synced
related:
  - follow-service-vercel
---

## Goal

Confirm after setup/config that Vercel really connects — CLI authenticated, project linked, env vars fully synced

## Scope

- Used when `/follow-service-vercel` dispatches to `verify`/`verify-connection`
- Read-only: check only — do not deploy or change env

## Execute

### 1. Check CLI Auth

> Goal: vercel login and the correct scope

1. `vercel whoami` — must return the user/team
2. Check the scope matches the project owner (personal vs team) — `vercel teams ls` if needed
3. Auth fail → recommend `workflows/setup-vercel/SKILL.md` — do not log in yourself

### 2. Check Project Link

> Goal: The local project is linked to the correct Vercel project

1. Check `.vercel/project.json` — `projectId`/`orgId` exist and match the expected project
2. `vercel project ls` to find the project — flag if the link points to the wrong project
3. `vercel env ls` — the env vars the code needs exist on Vercel (compare with `.env.example`)

### 3. Report

> Goal: Summarize connection status

1. Use `/report` columns: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `not-linked` / `env-missing`

## Rules

- Use ls/inspect commands only — never deploy or env add
- Do not print env var values — show only the missing names
- not-linked → report to run `vercel link` via the setup workflow

## Expected Outcome

- Verdict with project/org + env coverage evidence
