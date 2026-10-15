---
name: follow-tool-semantic-release-setup-semantic-release
description: Install semantic-release and set up CI auth tokens for automated releases
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - follow-tool-github-actions
  - follow-tool-git
  - run-release
---

## Goal

Install `semantic-release` and set up CI authentication (`GITHUB_TOKEN`, `NPM_TOKEN`, OIDC) so automated versioning and publishing work

## Scope

For projects using conventional commits that want automated releases — install, auth, CI integration. Branch/plugin config details are in `workflows/config-semantic-release/SKILL.md`

- If `semantic-release` is installed and a release config already exists → verify only

## Execute

### 1. Check Prerequisites

> Goal: Check readiness before setup

1. Check `package.json` — `name`, `version`, and the `repository` URL must be correct (semantic-release uses the repository to find the GitHub repo)
2. Check that the project uses conventional commits — `feat`, `fix`, `BREAKING CHANGE` are the core of version bumps
3. Check the Node.js version matches the requirement (see the parent skill or official docs)
4. If `semantic-release` is already in devDependencies → skip to verify

### 2. Install

> Goal: Install semantic-release and the core plugins

1. Run `bun add -D semantic-release` (or the project's package manager)
2. Install plugins as needed, e.g. `bun add -D @semantic-release/changelog @semantic-release/git` — for the plugin list see [references/semantic-release.md](../../references/semantic-release.md)
3. Confirm with `bunx semantic-release --version`

### 3. Setup Auth Tokens

> Goal: Set up authentication for CI

1. `GITHUB_TOKEN` — use the built-in `${{ secrets.GITHUB_TOKEN }}` in GitHub Actions with permissions `contents: write`, `pull-requests: write`, `issues: write`
2. `NPM_TOKEN` — create an npm automation token and set it as a repository secret — use `/follow-secret-manager` or `/open-web-for-config-secret`
3. Prefer trusted publishing (OIDC) for npm when possible — no long-lived token needed
4. Check secrets with `gh secret list`

### 4. CI Workflow

> Goal: Create the release workflow

1. Create/edit the workflow — the release job runs after tests pass (`needs: test`)
2. Use `fetch-depth: 0` in the checkout — semantic-release needs the full git history
3. Run `bunx semantic-release` in the release job — trigger only on push to a release branch, never run it on PRs
4. Set the `permissions` per step 3.1

### 5. Verify

> Goal: Confirm with a dry run

1. Run `bunx semantic-release --dry-run` locally — check the resulting version and release notes
2. Use `--debug` when you need verbose output
3. If the version is not as expected → check the conventional commits in history, then fix the config (see `workflows/config-semantic-release/SKILL.md`)
4. If verification fails → run `/resolve-errors` max 3 rounds, then stop and report

## Rules

### 1. Commits

- Conventional commits on every commit — not conventional → no release
- Check the commit history before expecting a version bump

### 2. Auth

- Tokens through secrets only, never hard-code them
- Prefer OIDC/trusted publishing over long-lived tokens

### 3. CI Discipline

- Run the release in CI only, except a local `--dry-run`
- `fetch-depth: 0` is mandatory — a shallow clone = broken version detection

- Use /follow-secret-manager if needed
- Use /follow-tool-github-actions if needed

## Expected Outcome

- `semantic-release` installed with the needed plugins
- A CI workflow that runs the release automatically after tests pass
- `--dry-run` shows the correct version/release notes
