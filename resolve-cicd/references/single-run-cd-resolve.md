# Single-Run CD Watch And Resolve

> Part 2 of [single-run.md](single-run.md) — detection, CI watch, and prerequisites are covered there.

## Execute (Continued)

### 5. CD: Detect CD Target



> Goal: Identify the deployment target and URL

1. Use `url-or-target` from the argument if present

2. If not → search from env, deploy output, CI/CD log, the `references/targets` section in `watch-deploy/SKILL.md`

3. If still unclear → run `/ask-me`



### 6. CD: Determine Platform



> Goal: Choose the skill that fits the CD target

1. Cloudflare Pages: URL has `.pages.dev` or `wrangler` in the output → proceed within this skill (`/resolve-cicd`); if it fails → run `/resolve-cloudflare-worker-fails` before re-deploy

2. Release/tag: version tag, release name, GitHub release → poll the registry/tag endpoint until live — `npm view <pkg>@<ver>`, `gh release view <tag>` (interval 30s, timeout 600s)

3. Generic URL: Railway, Render, Fly.io, Netlify, custom domain → `/watch-deploy`



### 7. CD: Watch Until Healthy



> Goal: Follow the deployment until live or the release succeeds

1. Call the skill per platform

2. If success → go to Report

3. If fail, timeout, unhealthy → go to Resolve



### 8. Resolve And Retry



> Goal: Fix the problem then trigger again

1. Record `LAST_GREEN_SHA` with `git rev-parse HEAD` if not yet present

2. Run `/resolve-errors` to analyze logs, errors, config

3. If it is a GitHub Actions failure → run `/resolve-github-actions-fails` before fixing

4. If it is a Cloudflare Worker failure → run `/resolve-cloudflare-worker-fails` before re-deploy

5. If the failure comes from code/config → make the minimal fix

6. If the failure comes from workflow/CI setup → run `/follow-tool-github-actions`, `/setup-cicd`, or `/deep-review-codebase` as appropriate

7. If the failure comes from infra/secret/platform → run `/deep-review-codebase`, `/follow-secret-manager`, `/setup-cicd` as appropriate

8. If it is CI: commit/push or re-trigger the pipeline per platform and return to Watch Pipeline

9. If it is CD: re-deploy per platform:

   - Cloudflare → `/deploy-to-cloudflare`

   - Vercel → `/deploy-to-vercel`

   - Railway → `/deploy-to-railway` or `/run-deploy`

   - Generic → `/run-deploy`

   - Release → `/run-release`

10. If re-run/re-deploy is not possible → stop and report

11. Return to Watch Pipeline or Watch Until Healthy

12. Loop up to 5 rounds; if exceeded → stop and report



### 9. Report Result



> Goal: Summarize the CI/CD result

1. If success/healthy/release succeeded → report platform, target, duration, status

2. If not passing → report the remaining failures, root cause, last green SHA, next step

3. Use `/report table` with columns: No., Mode, Platform, Target, Status, Duration, Root Cause, Action

4. Run `/check-deployment-fails` to see the failures still pending in the repo

5. If the user wants cleanup → run `/delete-cicd-fails` before the next step

6. Run `/suggest-next-action`



## Rules



### 1. Mode Detection

- If the argument is a run ID or there is CI config → it is CI

- If the argument is a URL, version, or deploy output → it is CD

- If unclear → use `/ask-me`



### 2. Platform Detection

- Detect the CI/CD config or URL pattern before guessing

- If unclear → use generic polling

- If it is a release only → poll the registry/tag endpoint until live instead of watching the deploy URL



### 3. No Initial Deploy

- `/resolve-cicd` does not trigger the first time itself

- Must be called after it has been triggered

- If there is no trigger yet, run `/run-deploy` or push first



### 4. Resolve And Retry

- Loop until it passes or the limit is reached

- Up to 5 rounds; if exceeded → stop and report

- If the same failure repeats 3 times or more → circuit breaker, recommend rollback



### 5. Safety

- Record `LAST_GREEN_SHA` before fixing every round

- If the fix creates a new failure after 3 rounds → recommend reverting to the last green SHA

- Do not force-push or rewrite history

- Do not re-run/re-deploy repeatedly without condition



### 6. Rollback Recommendation

- If timeout or not passing after 5 rounds → recommend the rollback command per platform

- Do not roll back automatically; wait for the user to decide

- Specify the platform-specific rollback from the `references/targets` section in `watch-deploy/SKILL.md`



### 7. Timeout

- `perRoundTimeout` = 300 seconds for resolve + re-run/re-deploy

- `ciWatchTimeout` = 900 seconds for long pipelines

- `cdWatchTimeout` = 600 seconds for slow deployments

- If the timeout is exceeded → stop and report



### 8. Partial Commit

- Before pushing a fix, stage only the files related to the root cause

- Do not commit/push other unrelated files



## Expected Outcome



- The CI pipeline passes, or CD is live/healthy, or the release succeeded

- A complete `/report table` report

- The next step specified through `/suggest-next-action`

- No auto-rollback without informing the user

- If not passing, there is a last green SHA and a clear rollback recommendation

