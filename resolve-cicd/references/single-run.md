# Single run

## Single-Run CI/CD Resolve



Call the skill with `/resolve-cicd [run-id|url]` (e.g. `/resolve-cicd --run-id 12345678` or `/resolve-cicd --url https://github.com/<owner>/<repo>/actions/runs/12345678`)

- This flow watches and resolves with `gh`/platform CLIs and the `resolve-*` skills below — there is no helper script



## Goal



Follow the CI/CD pipeline after it is triggered, checking whether it passes, is live/healthy, or the release succeeded. If it does not pass, resolve and re-run/re-deploy until it passes



## Scope



Use after:

- push code

- `/run-deploy`, `/deploy-to-*`, `/ship`, `/run-release`

- Or when `run-id` or `url-or-target` is received from the argument



Covers:

- CI: GitHub Actions, GitLab CI, Azure DevOps, CircleCI, Jenkins

- CD: Cloudflare Pages, Vercel, Railway, Render, Fly.io, Netlify, custom domain, release/tag



For a specific CI platform it forwards to `/resolve-github-actions-fails`

For a specific CD platform it forwards to `/watch-deploy` (release/tag → poll the registry/tag endpoint until live)



Does not include the first trigger — it must be triggered by `/run-deploy`, `/deploy-to-*`, `/run-release`, or a push first



## Execute



### 1. Detect CICD Mode



> Goal: Determine whether it is CI or CD

1. If `run-id` is received from the argument → it is CI

2. If `url-or-target` is received from the argument → it is CD

3. If there is no argument → search from:

   - environment variable `DEPLOY_URL`, `PREVIEW_URL`, `VERCEL_URL`, `CF_PAGES_URL`

   - The latest CI/CD log that has a run ID or URL

   - the `references/targets` section in `watch-deploy/SKILL.md`

   - `references/runs.md` in `/resolve-cicd`

4. If still unclear → run `/ask-me`



### 2. CI: Detect CI Platform



> Goal: Identify the CI platform

1. Find CI config files (`.github/workflows/*`, `.gitlab-ci.yml`, `azure-pipelines.yml`, `.circleci/config.yml`, `Jenkinsfile`)

2. Order by sequence: GitHub Actions → GitLab CI → Azure DevOps → CircleCI → Jenkins

3. If no config is found → run `/deep-review-codebase` or `/ask-me`



### 3. CI: Verify CLI And Identify Run



> Goal: Prepare the CLI and run ID

1. Check the CLI: `gh`, `glab`, `az`, `circleci`, `jenkins-cli`

2. If `run-id` comes from the argument → use that value

3. If not → find the latest run:

   - GitHub Actions: `gh run list --limit 5`

   - GitLab CI: `glab pipeline list --limit 5`

   - Azure DevOps: `az pipelines runs list --top 5`

   - CircleCI: `circleci pipeline list`

   - Jenkins: latest build API

4. If there is no active run → report and stop



### 4. CI: Watch Pipeline



> Goal: Follow CI until it ends

1. If GitHub Actions → run `/resolve-github-actions-fails [run-id]` then return the result

2. GitLab CI: `glab pipeline trace <pipeline-id>`

3. Azure DevOps: `az pipelines runs show --id <run-id>` poll every 10 sec

4. CircleCI: poll API

5. Jenkins: poll build status

6. If pass → go to Report

7. If fail, cancel, timeout → go to Resolve




> Continues: CD watch, resolve/retry, rules and expected outcome in [single-run-cd-resolve.md](single-run-cd-resolve.md)