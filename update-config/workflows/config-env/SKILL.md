---
name: update-config-config-env
description: Update the project's env configuration — diff the vars that exist against the ones the code needs, apply only the required keys, verify the app still runs — without clobbering t...
related:
  - update-config
---

## Goal

Update the project's env configuration — diff the vars that exist against the ones the code needs, apply only the required keys, verify the app still runs — without clobbering the original values

## Scope

- Use when adding/changing/removing env vars or syncing `.env.example` with the code
- Covers: `.env`, `.env.local`, `.env.<mode>`, `.env.example`, env validation schemas

## Execute

### 1. Diff Current Vs Needed

> Goal: See which keys are missing, extra, or changed

1. Run `/check-secrets env-vars` — the vars the code reads (`process.env.*`, `import.meta.env.*` per stack) compared with those defined
2. Read the current env files and `.env.example` — list all keys
3. Build the diff: missing keys (used by code but absent), stale keys (present but unused by code), keys whose value/format must change
4. Run the `/deep-review` dimension `config` report-drift workflow if you need to see drift across environments/workspaces

### 2. Apply Changes

> Goal: Change only the keys that are required

1. Add the missing keys to `.env.example` with a placeholder plus a comment on what each is for
2. Update the validation schema (if any) to cover the new keys — required/optional, types, defaults
3. Ask the user before deleting stale keys — they may be used by another environment or an external runtime
4. Secrets/real values → `/follow-secret-manager` — never put them in committed files; a local `.env` may be edited but must never be committed

### 3. Verify

> Goal: The app runs with the new env

1. Run dev/build — startup validation passes with no missing-var crash
2. Exercise the paths that use the new vars — smoke test only what changed
3. Run `/check-secrets secrets-leak` — confirm no secrets in git-tracked files
4. `git status` confirms `.env` is not staged — commit only `.env.example`/schema

## Rules

- Merge only the keys that changed — never rewrite the whole env file unless required
- Never commit `.env`/`.env.local` or real values — commit only example/schema/code
- Never delete keys without confirming — stale in this repo may be required in another environment
- Prefix conventions must be right — framework public vars (`NEXT_PUBLIC_*`, `VITE_*`)
- If you find a secret that was already committed → tell the user it must be rotated, not just edited out of the file

## Expected Outcome

- Env files match the vars the code uses — no unintended missing/stale keys
- `.env.example` and the validation schema are in sync
- Verification passes — the app runs and no secrets leak
