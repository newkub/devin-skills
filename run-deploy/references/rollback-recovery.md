# Rollback And Recovery

Prepare the rollback procedure and check the backup strategy before deploy so recovery is fast when a deploy fails

## When To Use

- Before every deploy (prepare the rollback procedure)
- When the deploy fails or critical errors are found after deploy
- When the application is unresponsive after deploy

## Pre-Deploy Preparation

### 1. Backup Strategy Review

Run `/deep-review` to check the backup strategy before deploy:

- Check the latest database backup
- Check config backups (env vars, secrets)
- Check the previous stable deployment version
- Record the current commit SHA before deploy

### 2. Rollback Procedure

Prepare a clear rollback procedure before deploy per platform:

| Platform | Rollback Method |
|----------|----------------|
| Cloudflare Workers | `wrangler deployments rollback` or redeploy an old commit |
| Vercel | `vercel rollback <deployment-url>` or promote via the dashboard |
| Railway | `railway redeploy` from an old commit, or rollback via the dashboard |
| Docker/K8s | `kubectl rollout undo` or redeploy an old image tag |

### 3. Zero-Downtime Check

Confirm the deploy is zero-downtime (when required):

- Use rolling deployment (K8s, Docker Swarm)
- Use platform atomic deploy (Cloudflare, Vercel)
- Check health before routing traffic to the new version
- If zero-downtime is not supported → notify users before deploy

## Rollback Execution

If the deploy fails or critical errors are found:

1. Roll back immediately per the prepared procedure
2. Run `/resolve-errors` to find the root cause
3. Fix the root cause, not just the symptoms
4. Test the fix in staging or locally before redeploying
5. Redeploy and repeat post-deploy validation (return to Step 7 of `SKILL.md`)

## Recovery Checklist

| Step | Action | Verify |
|------|--------|--------|
| 1 | Roll back to the old version | Application responds normally |
| 2 | Notify users or the team (if impacted) | Communication sent |
| 3 | Find the root cause with `/resolve-errors` | Root cause identified |
| 4 | Fix the root cause | Fix passes verify |
| 5 | Redeploy | Deploy succeeds |
| 6 | Post-deploy validation | Validation passes |
