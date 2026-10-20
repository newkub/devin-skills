# Repo resolve

## Repo-Scoped CI/CD Resolve



Steps for `/resolve-cicd` when it receives a repo or detects the current repo, resolving both GitHub Actions and Cloudflare Workers/Pages that match that repo



## Goal



Inspect and fix CI/CD failures for the specified project/repo, covering GitHub Actions and Cloudflare



## Scope



Use with the current repo or a repo the user specifies, finding the worker/project that matches the repo name then resolving it



## Execute



### 1. Identify Repo



> Goal: Identify the current repo

1. If there is a `--repo` argument → use that value

2. If not → run `gh repo view --json nameWithOwner` or `git remote -v` from the current directory

3. If not found → run `/ask-me`



### 2. Resolve GitHub Actions



> Goal: Fix GitHub Actions for the repo

1. Run `/resolve-github-actions-fails --repo <owner/repo>`

2. If there is no local repo and a code fix is needed → use `/search-project-in-drive-d <repo-name>`

3. Record the runs that were resolved and those still pending



### 3. Resolve Cloudflare



> Goal: Fix the Cloudflare Workers/Pages that match the repo

1. Find the worker name that matches the repo name or the project name from `wrangler.toml`

2. Run `/resolve-cloudflare-worker-fails --worker <worker-name>` or `/resolve-all-cloudflare-worker-fails --project <project-name>`

3. If no worker matching the repo is found → skip and record that there is no Cloudflare resource

4. If a matching local project is found → use `/search-project-in-drive-d <worker-name>` then `wrangler deploy`

5. Repeat up to 3 rounds



### 4. Cross-Check



> Goal: Confirm that the repo's CI/CD passes

1. Run `gh run list --repo <owner/repo> --status failure --limit 10` again

2. If there are still failures → return to step 2 or 3

3. If it passes → go to Report



### 5. Report



> Goal: Summarize the results

1. Use `/report table` with columns: No., Repo, CI Status, CD Status, Action Taken, Notes

2. Summary: resolved, pending, manual-fix-required

3. Run `/suggest-next-action`



## Rules



### 1. Scope

- Resolve only the project/repo that matches the specified repo

- Do not move to another repo automatically



### 2. Worker Matching

- The worker name can match the repo name or the project slug

- If unclear → use the Cloudflare API to list workers/pages then filter by repo name



### 3. Local Project

- Use `/search-project-in-drive-d` to find the local project

- If not found → mark as `manual-fix-required`



### 4. Safety

- Ask the user before deploy/redeploy of a worker if the impact is high

- Do not commit/push automatically



## Expected Outcome



- The repo's GitHub Actions has no remaining failures

- Cloudflare Workers/Pages matching the repo are resolved or marked manual-fix-required

- A summary table of repo-scoped CI/CD status
