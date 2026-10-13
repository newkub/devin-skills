---
name: setup-cicd
description: Detect the CI/CD platform and set up config files, secrets, and workflows
argument-hint: "[scope]"
related:
  - update-project
  - optimize-ci
  - follow-tool-github-actions
  - follow-secret-manager
  - follow-tasks
  - deep-review
  - run-verify
  - run-test
  - follow-tool-mr-boxington
  - ship-to-dev-branch
  - report
  - suggest-next-action
  - run-deploy
  - research-setup-integrations
---

## Goal

Detect the CI/CD platform the project uses, then set up workflow files, secrets, and package scripts so verify, test, build, deploy, and release can run on CI.

## Scope

Run once at setup or when the CI/CD config is not ready. Does not include running pipelines, committing, pushing, deploying, or releasing (it can set up the release workflow but never runs a release).

To run cloud verify or ship on cloud, use `/run-verify` or `/ship-to-dev-branch` instead.

## Execute

### 1. Detect Platform

> Goal: Know which CI/CD platform the project uses

1. Look for existing config files:
   - GitHub Actions: `.github/workflows/*.{yml,yaml}`
   - GitLab CI: `.gitlab-ci.yml`
   - Azure DevOps: `azure-pipelines.yml`
   - CircleCI: `.circleci/config.yml`
   - Jenkins: `Jenkinsfile`
   - Cloudflare Pages: `wrangler.toml`, `wrangler.jsonc`
   - Vercel: `vercel.json`
2. If multiple platforms are found → pick in order: GitHub Actions → GitLab CI → Azure DevOps → CircleCI → Jenkins → Cloudflare → Vercel
3. If none found → run `/ask-me` to ask the user, or default to GitHub Actions

### 2. Verify Package Scripts

> Goal: Make sure the package manifest has the scripts CI will call, according to project size

1. Read `package.json`, `Cargo.toml`, or the appropriate manifest file
2. If the package manifest lacks the basic publish fields (`name`, `version`, `description`, `license`, `repository`) → run `/update-project` `### setup-package` first
3. Check the project size:
   - Small project (not a monorepo, build/test not heavy) → `verify` must include `scan`, `lint`, `typecheck`, `test`, `build` directly in the package manifest
   - Large project (monorepo or heavy build/test) → the CI/CD pipeline runs the full suite instead; the package manifest needs at least `test:all`, `build`, and a `verify` of `check && test`
4. If the `verify`, `test:all`, `build` scripts are missing → use `/follow-tasks` to set them up
5. Confirm `verify` is complete for the project size
6. If the project has no package manifest (e.g. skill collection, docs repo) → find tool directories with their own package.json and run verify from each subdir in CI

### 3. Setup Secrets

> Goal: Configure the secrets CI/CD needs

1. Run `/follow-secret-manager` to manage secrets safely
2. If using GitHub Actions → open the GitHub Secrets page with `/open-github`
3. Check that required secrets exist, such as `NPM_TOKEN`, `CARGO_REGISTRY_TOKEN`, `CLOUDFLARE_API_TOKEN`, `VERCEL_TOKEN`
4. Never hardcode secrets in config files

### 4. Create Workflow Files

> Goal: Create CI/CD config files for the platform

#### GitHub Actions

1. Run `/follow-tool-github-actions` to set up complete workflows
2. To hand-roll one → create `.github/workflows/ci.yml` with this baseline content:

```yaml
name: ci
on:
  push:
    branches: [main, master]
  pull_request:

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v7

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - uses: actions/cache@v6
        with:
          path: ~/.bun/install/cache
          key: ${{ runner.os }}-bun-${{ hashFiles('bun.lockb') }}
          restore-keys: |
            ${{ runner.os }}-bun-

      - run: bun install
      - run: bun run verify
      - run: bun run test:all
      - run: bun run build
```

3. If the project has no root package.json (e.g. skill collection, docs repo) → run verify from the tool directories that have their own package.json, without `bun install` at the root
4. For deploy, create `.github/workflows/deploy.yml` triggered on `push` to `main`/`master`, calling `bun run deploy` or the platform's deploy tool

5. For release:
   - If no release tool exists yet → choose one via `/follow-tool-changesets`, `/follow-tool-changelogen`, `/follow-tool-semantic-release`, or `/follow-tool-release-it` first
   - Create `.github/workflows/release.yml` triggered on `push` of `v*` tags only:

```yaml
name: release
on:
  push:
    tags: ['v*']
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      - run: bun install
      - run: bun run verify
      - run: bun run build
      - name: release
        run: |
          # Add the release command matching the detected platform
          # npm: npm publish
          # crates: cargo publish
          # vscode: npx vsce publish
          # webstore: npx chrome-webstore-upload
          # docker: docker build . -t <image>:<tag> && docker push <image>:<tag>
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          VSCE_PAT: ${{ secrets.VSCE_PAT }}
          CARGO_REGISTRY_TOKEN: ${{ secrets.CARGO_REGISTRY_TOKEN }}
          CLIENT_ID: ${{ secrets.CLIENT_ID }}
          CLIENT_SECRET: ${{ secrets.CLIENT_SECRET }}
          REFRESH_TOKEN: ${{ secrets.REFRESH_TOKEN }}
          DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
          DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
```

#### GitLab CI

Create `.gitlab-ci.yml` with stages: `verify`, `test`, `build`, `deploy`, `release`

#### Azure DevOps

Create `azure-pipelines.yml` with jobs: `verify`, `test`, `build`, `deploy`

#### CircleCI

Create `.circleci/config.yml` with workflows: `verify`, `test`, `build`, `deploy`

#### Cloudflare Pages

Check `wrangler.toml` and add a GitHub Actions deploy workflow if missing

#### Vercel

Check `vercel.json` and add a GitHub Actions workflow, or use Vercel Git Integration

### 5. Validate Config

> Goal: Confirm the CI/CD config is correct

1. Run `/deep-review` to check for drift and duplication
2. Run `/deep-review` to check that the config covers security, testing, deployment
3. Run a dry run if the platform supports it (e.g. `act` for GitHub Actions) — optional
4. To validate the test suite locally → run `/run-test all` before going to CI
5. If there are syntax errors → fix them before finishing

### 6. Report

> Goal: Summarize the setup status

1. Use `/report` to summarize: platform, workflow files, missing scripts, missing secrets, next action
2. Run `/suggest-next-action`

### 7. Optional Release Setup

> Goal: Set up the release workflow if needed

1. If the project needs releases on tag → follow the Step 5 release workflow and pick a release tool via `/follow-tool-*`
2. If releases are not needed → skip

## Rules

### 1. Setup Only

- `setup-cicd` only configures; it never runs pipelines
- No commit, push, deploy, or release
- To run pipelines, use `/run-verify` or `/ship-to-dev-branch`

### 2. Platform First

- Detect existing platforms before creating new files
- If config already exists → audit it and fill the gaps; do not overwrite
- If none found → default to GitHub Actions or ask the user

### 3. Secrets Safety

- Use `/follow-secret-manager` or GitHub Secrets / GitLab CI Variables
- Never hardcode secrets in workflow files
- Never log secrets

### 4. Package Scripts

- Package scripts must exist before creating a CI workflow
- Small project: `verify` must include `scan`, `lint`, `typecheck`, `test`, `build` directly in the package manifest
- Large project: the CI/CD pipeline runs the full suite; the package manifest has `test:all`, `build`, and a `verify` of at least `check && test`
- `test:all` should cover unit, integration, e2e, and coverage as appropriate for the project
- Never put `release` in the package manifest — releases happen through the CI/CD workflow on tag or via `/run-release`

### 5. No Auto Commit

- Never commit or push config files automatically
- If the user wants to commit → run `/git-commit` or `/ship-to-dev-branch` after setup

### 6. Overlap And Cost

- `run-verify`, `check-quality`, `review-*`, `check-*` can overlap; consolidate them into a single `verify` job
- Use `concurrency`, `timeout-minutes`, `cache`, a single runner, and avoid matrix to save cost
- If there is no root package.json, run verify from tool directories instead of creating a fake root package
- Use /research-setup-integrations when needed (pick CI actions/plugins from official sources before writing workflows)
- Use /run-deploy when needed
- If the pipeline is slow after setup → `/optimize-ci`

## Expected Outcome

- The CI/CD platform is detected or the user is asked
- Workflow files are created correctly for the platform
- Package scripts are complete for verify, test, build, deploy — `release` is not in the package manifest
- Secrets are set up securely
- No automatic commit/push/deploy/release happens
- A setup status report and a clear next action are produced
