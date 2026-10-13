---
name: ship-release
description: Ship to main then release — /ship-to-main-branch → /run-release → watch until live
argument-hint: "[scope] [dont-ask-me]"
related:
  - ship-verify
  - ship-to-main-branch
  - ship-to-dev-branch
  - run-release
  - watch-deploy
  - deep-review
  - gen-changelog-md
  - resolve-errors
  - report
  - suggest-next-action

---

## Goal

Orchestrate ship + release as a single command — `/ship-to-main-branch` until the merge into `main` succeeds, then `/run-release` to publish artifacts and watch until live on the target platforms — ship itself never runs a release (canonical boundary)

## Scope

Use when you want to ship and immediately follow with a release — projects publishing to npm/crates/vscode/webstore/docker or deploy targets

- `/ship-to-main-branch` = dev → merge into `main` only; it does not run releases itself
- `/run-release` = release mechanics (platforms, prerelease, notes, changelog)
- `dont-ask-me` argument → every confirmation is replaced by `/follow-your-suggestion` + a safe default

## Execute

### 1. Ship To Main

> Goal: code merged into `main` before cutting a release

1. Run `/ship-to-main-branch` through the full chain — dev validated → PR review gate passed → merge into `main` succeeded
2. If ship fails → stop and report — never release on a main that did not pass
3. Record the merge commit hash + version before releasing (rollback target)

### 2. Prepare Release

> Goal: release config ready and tags correct

1. If the project has no release config yet (workflows, tokens, manifest fields) → set it up once first: pick a release tool (`/follow-tool-changesets`, `/follow-tool-changelogen`, `/follow-tool-semantic-release`, or `/follow-tool-release-it`) + create `.github/workflows/release.yml` triggered on `v*` tags via `/setup-cicd`
2. Create/verify `v*` tags per project conventions — `/run-release` must run on a `v*` tag or `main`
3. Run `/run-release --dry-run` to check platform detection + config + secrets — show the output to the user (except with `dont-ask-me` → use a safe default)

### 3. Release

> Goal: publish to the detected platforms

1. After user confirmation → run `/run-release` — covers prerelease build, artifact smoke test, publish, release notes, `CHANGELOG.md` (`/gen-changelog-md`)
2. If the release fails → fix per `/resolve-errors` and retry up to 3 rounds — still failing → stop and report

### 4. Watch Until Live

> Goal: confirm artifacts are actually live

1. Poll the registry/tag until the new version is live — `npm view <pkg>@<ver>`, `https://crates.io/api/v1/crates/<pkg>/<ver>`, `docker pull <image>:<tag>`, VS Code Marketplace API, `gh release view <tag>` — interval 30s, timeout 600s
2. If the release includes a deploy → run `/watch-deploy` against the deploy URL + health/smoke checks
3. Partial live → identify the missing artifact, distinguishing pending CI from a real failure

### 5. Report And Handoff

> Goal: summarize ship+release status

1. Run `/report` — table of `No.`, `Artifact`, `Expected`, `Actual`, `Status` + verdict `released`/`partial`/`not-released`
2. If the project uses a task queue (`QUEUE.md`) → suggest `/run-task-all` to monitor/run pending work after the release
3. Run `/suggest-next-action`

## Rules

- `/ship-to-main-branch` must fully pass before any release — never release on unshipped/broken main
- release/publish → always user-confirmed (except `dont-ask-me` mode → safe default + noted in the report)
- `CHANGELOG.md` is generated only via `/gen-changelog-md`; never hand-edit it
- Never re-release the same version — on failure, fix the root cause then bump
- Use /watch-deploy when needed

## Expected Outcome

- `/ship-to-main-branch` succeeded: merged into main, CI passed, rollback path ready
- Release artifacts live on every detected platform — verified via registry/tag polling + `/watch-deploy`
- `CHANGELOG.md` + release notes auto-generated
- A clear verdict with any missing artifacts (if partial)
