---
name: list-cloudflare-projects
description: List all Cloudflare projects on the machine with local path, remote match and status
argument-hint: "[path]"
related:
  - list-projects-git-in-drive-d
  - list-chezmoi-files
  - resolve-errors
  - open-cloudflare-workers

---
## Goal

Scan the machine for projects using Cloudflare (Workers, Pages, Wrangler) with local path, remote repo match, deployment status, and summarize into a table

## Scope

- For related skills: `list-chezmoi-files`, `open-cloudflare-workers`, `list-cloudflare-projects`, `list-cloudflare-projects`

Use to find all Cloudflare projects on the machine, detecting from `wrangler.toml`, `wrangler.jsonc`, `wrangler.json`, or `wrangler.config.ts`

## Execute

### 1. Scan Local Drives

> Goal: find Wrangler config files

1. Use `/list-projects-git-in-drive-d` to find all git projects
2. In each project check for:
   - `wrangler.toml`
   - `wrangler.jsonc`
   - `wrangler.json`
   - `wrangler.config.ts`
3. If the scan is slow → run only on `D:\`, `E:\`, or the path the user specifies
4. Record: project name, local path, config file name

### 2. Match Remote Repos

> Goal: link each local project to its remote repo

1. Run `git remote -v` in each project
2. Extract `owner/name` from the remote URL
3. Record `RemoteUrl`, `Owner`, `RepoName`
4. If there is no remote → mark `local-only`

### 3. Read Wrangler Config

> Goal: find the worker/service name and status

1. Read each config file found
2. Extract the worker/service `name`
3. Check `compatibility_date`, `main`, `routes`
4. For a Pages project → record `pages_build_output_dir`

### 4. Check Deployment Status

> Goal: view the worker status when possible

1. Run `wrangler deployments list --name <worker>` when authenticated
2. Record the latest deployment: status, created at
3. If not authenticated → skip and mark `auth-required`

### 5. Build Report

> Goal: summarize into a table

1. Build a table with columns: Project, LocalPath, RemoteRepo, WorkerName, ConfigFile, Status, Notes
2. Sort by project name
3. Report a summary of the project count

## Rules

- Use absolute paths
- Do not delete or modify any file
- If `wrangler` is not authenticated → skip the status check
- Mark `local-only` when there is no remote
- Support Workers, Pages, and every Wrangler config format

- Use /resolve-cloudflare-worker-fails if needed
- Use /resolve-errors if needed

## Expected Outcome

- The list of all Cloudflare projects on the machine
- Complete table: local path, remote match, worker name, status
- No project left with any modification
