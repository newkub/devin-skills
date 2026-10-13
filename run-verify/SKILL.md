---
name: run-verify
description: Run full-cycle verify on local or CI/CD based on project size
argument-hint: "[scope]"
related:
  - deep-review
  - run-scan
  - run-lint
  - run-typecheck
  - run-test
  - run-build
  - implement-to-production
  - check-monorepo
  - setup-cicd
  - follow-tasks
  - ship
  - resolve-errors
  - report

---

## Goal

Run full-cycle verify — scan, format, lint, typecheck, test, build — choosing local or CI/CD based on project size

## Scope

Use as the single consolidation point for all verify work
- Small project, not RAM/compute-heavy, not slow → run on local via the package script `verify`
- Large project, monorepo, or heavy build/test → push the branch to CI/CD, then watch and resolve errors
- Mode can be forced: `/run-verify --local` or `/run-verify --ci`
- If an end-to-end readiness gate is needed (before ship/deploy or after a big task) → also do the `Deep Verify` section below
- Never merge, release, or deploy automatically
- Use after `/implement-to-production` to verify before ship

## Execute

> Pre-Run: Always run `/deep-review` first — every `run-*` must be reviewed/assessed before the main action; never skip. If findings are blockers, fix or report them before running (verify).

### 1. Detect Mode

> Goal: Choose the mode from context

1. If the user specifies `--local` → use local mode
2. If the user specifies `--ci` or `--ci-cd` → use CI/CD mode
3. If unspecified → go to the Auto Detect step

### 2. Auto Detect Project Size

> Goal: Decide whether the project is small or large

1. Check signals of a large project:
   - Run `/check-monorepo` and it turns out to be a monorepo
   - `workspaces` present in `package.json`, `pnpm-workspace.yaml`, `moon.yml`, `turbo.json`
   - Multiple workspaces/packages or heavy build/test (e.g. >60 seconds, high RAM/CPU usage)
   - `AGENTS.md` or the user requires CI verify
2. If any signal is found → CI/CD mode
3. If none found → local mode

### 3. Local Mode (Small Project)

> Goal: Run verify on local via the package manifest

1. Read the package manifest (`package.json`, `Cargo.toml`, etc.)
2. If there is no `verify` script → run `/follow-tasks` to create `verify` = `scan + format + lint + typecheck + test + build` (format before lint)
3. If `verify` is missing any of the 6 parts → run `/follow-tasks` to fill them in
4. Run the `verify` script on local (e.g. `bun run verify`)
5. If it fails → run `/resolve-errors` then retry up to 3 times

### 4. CI/CD Mode (Large Project)

> Goal: Push the branch to CI/CD and watch it

1. Run `git branch --show-current`, `git status`, `git log origin/<branch>..HEAD`
2. If the working tree is not clean → stop and report
3. If there is no remote → stop and report
4. Look for CI/CD config (see the `setup-cicd` list); if none → run `/setup-cicd`
5. Run `/git-push` if there are unpushed commits
6. If the push is rejected → stop and report (never force push)
7. If it is GitHub Actions → `/resolve-github-actions-fails`, otherwise `/resolve-cicd`
8. If it fails → run `/resolve-errors`, then push again and re-run, up to 3 times
9. If it passes → report

### 5. Deep Verify (Readiness Gate)

> Goal: Confirm the project truly works end-to-end — use with `--deep` or before a major ship/deploy

1. Runtime gate: run `/run-test` (e2e) if there are UI flows, `/check-open-ports` + smoke test the real entry points, `/watch-browser-and-fix` to catch console/network errors if there is a web URL
2. Usage gate: run `/test-usage` to confirm the examples in README/docs actually work
3. Deep validation: run `/deep-validate` for a final cross-reference, compliance, and security pass; if issues are found → `/deep-review-then-fix`, then re-verify
4. Each gate that fails → fix and restart that gate; never skip; after 3 retries → stop + report
5. Run `/report table` with columns: No., Gate, Result, Evidence, Fix applied — summarize ready / not-ready

### 6. Ship (If Requested)

> Goal: Deliver the work after verify passes

- If the user wants to ship the work after verify passes → run `/ship` for the full ship flow, from verify, release, and deploy through the rollback plan
- Run `/suggest-next-action` after `/ship` finishes

## Rules

### 1. Verify Only
- Never merge, release, or deploy
- Never commit automatically

### 2. Error Handling
- Use `/resolve-errors` when an error is found
- Retry up to 3 times
- If it still fails → stop and report

### 3. Safety
- Never force push
- Never push with an unclean working tree
- Never hardcode secrets

### 4. Package Manifest
- A small project must have `verify` = `scan + format + lint + typecheck + test + build` (format before lint)
- A large project uses the CI/CD pipeline to run the full suite

- Use /run-scan if needed
- Use /run-lint if needed
- Use /run-typecheck if needed
- Use /run-test if needed
- Use /run-build if needed
- Use /deep-test coverage if needed
- Use /run-test all if needed
- Use /ship if needed
- Use /report if needed
- Use /suggest-next-action if needed

## Expected Outcome

- small project: code passes scan, format, lint, typecheck, test, build on local
- large project: branch pushed, CI/CD pipeline passes, or root cause + next action are clear
- no automatic merge/release/deploy
