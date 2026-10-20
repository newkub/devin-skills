# Runs

## CI/CD Runs

### Goal

Record the list of CI/CD runs for tracking and resolve

### Execute

1. List recent runs with their conclusion:

   ```bash
   gh run list --limit 20 --json databaseId,name,headBranch,conclusion,createdAt,url
   ```

2. Record one row per run: run ID (`databaseId`), workflow name, branch, commit, status (`success`/`failure`/`cancelled`/`in_progress`/`timeout`), URL
3. For failed runs → capture the failing job: `gh run view <id> --log-failed`
4. Keep the table as the run history for this session — reference a run ID when re-running or resolving:
   - re-run a failed run → `gh run rerun <id> --failed`
   - watch a run → `gh run watch <id> --interval 10`
   - resolve failures → `/resolve-github-actions-fails <id>` (CI) or `/resolve-cicd --run-id <id>`
5. For CD targets without a run ID (Cloudflare/Vercel), record the deployment ID + version from the deploy output instead (`bunx wrangler deployments list --name <worker>`)

## Rules

- Never invent a run ID — take it from `gh run list` output or the run URL
- Mark a run `timeout` only after the watch timeout in `SKILL.md` (`ciWatchTimeout` 900s) is exceeded
