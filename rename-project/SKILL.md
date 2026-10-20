---
name: rename-project
description: Rename a project everywhere — local, GitHub, Cloudflare, secrets, env, and code
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - deploy-to-cloudflare
  - git-commit
---

## Goal

Rename a project from an old name to a new name completely, covering the local directory, code references, git remote, GitHub repo, Cloudflare resources, secrets, environment variables, and docs

## Scope

- Local: directory name, file names, package metadata, config, source code strings
- Git: remote URL, branch tracking, recent commit messages (if necessary)
- GitHub: repository name, workflows, secrets, Pages/Workers settings
- Cloudflare: Worker name, D1 database name, Pages project name, KV namespaces, secrets, env vars
- Verification: search the old name, run typecheck/build/test, deploy, open the live URL

## Execute

### 1. Prepare

> Goal: Gather information before starting

1. Ask for or specify `old-name` and `new-name` clearly
2. Survey all references with search:
   ```bash
   rg -i "old-name" --hidden
   ```
3. Identify the related cloud resources:
   - Cloudflare Worker name
   - D1 database name and database_id
   - Pages project name
   - GitHub repo name
   - env variables / secrets whose names contain the project
4. Check auth:
   - `gh auth status` for GitHub
   - `wrangler whoami` for Cloudflare
5. If auth is not ready → use `/follow-secret-manager` or `/open-web-for-config-secret` first

### 2. Dry Run (Optional but Recommended)

> Goal: Reduce risk before the actual rename

1. Build a list of files that need to be changed without actually changing anything
2. For cloud resources use `--dry-run` such as `wrangler deploy --dry-run`
3. If there are very many references → do it in batches

### 3. Rename Local

> Goal: Change the name everywhere in the code

1. Close the IDE/terminal using the project then rename the directory:
   ```bash
   mv old-name new-name
   ```
2. If Windows cannot rename it because a process locks it → find the process and close it, or wait and try again
3. Update `package.json` fields:
   - `name`
   - `description`
   - `repository.url`
   - `homepage`
   - `bugs.url`
4. Update config files:
   - `wrangler.toml`: `name`, `database_name`, route, account_id (if the account changed)
   - `capacitor.config.ts`: app name, package, scheme
   - `index.html`: `<title>`
   - `public/manifest.webmanifest`: `name`, `short_name`
   - Android: `strings.xml`, `AndroidManifest.xml`, `build.gradle`
   - Play Store: `title.txt`, `full_description.txt`, `feature_graphic.svg`
5. Update docs:
   - `README.md`
   - `AGENTS.md`
   - `RELEASING.md`
   - `PRIVACY_POLICY.md`
   - `public/privacy-policy.html`
6. Update source code:
   - `src/lib/cloudflare.ts`
   - `src/lib/github.ts`
   - `worker/api/status.ts`
   - constants, titles, URLs
7. Search again to check that no old name remains

### 4. Update Git

> Goal: Sync local git with the new name

1. Change the remote URL:
   ```bash
   git remote set-url origin git@github.com:<owner>/<new-name>.git
   # or https
   ```
2. Check the remote:
   ```bash
   git remote -v
   ```
3. Commit the changes

### 5. Rename GitHub Repository

> Goal: Change the repo name on GitHub

1. Use the `gh` CLI:
   ```bash
   gh repo rename <new-name> --repo <owner>/<old-name>
   ```
   or go to the dashboard: `https://github.com/<owner>/<old-name>/settings`
2. Check the URL:
   ```bash
   gh repo view <owner>/<new-name>
   ```
3. Update workflows, README links, docs again

### 6. Rename Cloudflare Resources

> Goal: Change the Worker, D1, Pages names to match

1. Worker: change `name` in `wrangler.toml` then deploy again
   ```bash
   wrangler deploy
   ```
2. D1: if the database needs to be renamed use the Cloudflare dashboard or API
   ```bash
   # or update database_name in wrangler.toml without changing database_id
   ```
3. Old Pages project: delete it with
   ```bash
   wrangler pages project delete <old-name> --yes
   ```
4. Secrets / env vars:
   - Delete the old ones in `wrangler secret` or GitHub/GitLab secrets
   - Create new ones in the required system (use `/follow-secret-manager`)
5. Update `.github/workflows/deploy.yml` to point to the new secrets

### 7. Verify

> Goal: Check that the rename is complete

1. Search for the old name again:
   ```bash
   rg -i "old-name" --hidden
   ```
2. Except historical docs, plan files, changelog → these may be kept with a note
3. Run:
   ```bash
   bun typecheck
   bun run test
   bun run build
   ```
4. Deploy then open the live URL
5. Test endpoints, tabs, settings

### 8. Commit And Push

> Goal: Sync everything to the remote

1. `git add -A`
2. `git commit -m "chore: rename project to <new-name>"`
3. `git push -u origin main`

### 9. Report

> Goal: Summarize the results for the user

1. Report the local path, GitHub repo, Cloudflare Worker URL, D1 name
2. Specify what has been cleaned up
3. Specify the next steps (e.g. test on mobile, set up a custom domain)

## Rules

- `new-name` must be obtained clearly before starting
- Do a dry-run before renaming destructive cloud resources
- Do not delete a cloud resource without confirmation
- Use `/follow-secret-manager` for secrets before deploying
- build/test/typecheck must pass before pushing
- Check the old name again at least 2 times
- Do not commit before every point has been checked

- Use /deploy-to-cloudflare if necessary
- Use /git-commit if necessary

## Expected Outcome

- The project is renamed everywhere
- GitHub repo, Cloudflare Worker, D1, Pages use the new name
- No old name remains in user-facing code
- Deploy succeeds and the URL works
- Git is synced successfully
