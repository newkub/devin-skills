---
name: ship-to-main-branch
description: Ship into main — /ship-to-dev-branch → review-github-pr gate → merge-all-branch-by-me-to-main
argument-hint: "[--dry-run] [dont-ask-me]"
related:
  - ship-verify
  - ship-to-dev-branch
  - merge-all-branch-by-me-to-main
  - review-github-pr
  - ship-release
  - resolve-cicd
  - resolve-merge-conflicts
  - deep-review
  - deep-validate
  - report
  - suggest-next-action

---

## Goal

Promote work from `dev` into `main` safely — ship dev first, PR review + checks gate, then merge branches into `main` per `/merge-all-branch-by-me-to-main`

## Scope

- Use when you want to ship all the way to `main` — orchestrates `/ship-to-dev-branch` → `/review-github-pr` → `/merge-all-branch-by-me-to-main`
- No duplicated workflow — the canonical steps live in each skill being called
- `dont-ask-me` argument → confirmation gates are replaced by `/follow-your-suggestion` + safe defaults
- Does not run a release — release → `/ship-release`

## Execute

### 1. Ship Dev

> Goal: all work on `origin/dev` and passing validation

1. Run `/ship-to-dev-branch` through the full workflow — push into `dev` succeeded, CI on dev passed
2. If ship-to-dev fails → stop and report — never promote work that has not passed

### 2. PR Review Gate

> Goal: the dev → main PR passes review + all checks before merge

1. Create/find the `dev` → `main` PR with `/create-github-pr` (if none exists)
2. Run `/review-github-pr` — full gate: all CI checks pass + `/deep-validate` + `/deep-review` + PR metadata/diff clean
3. If the gate fails → fix the findings on `dev` and re-run `/ship-to-dev-branch` — never merge

### 3. Merge To Main

> Goal: merge into main + cleanup branches

1. User confirmation before merging into `main` (except `dont-ask-me` → safe default)
2. Run `/merge-all-branch-by-me-to-main` — merge user branches into `main` + cleanup
3. If conflicts → `/resolve-merge-conflicts`; if complex → `/ask-me`
4. `git switch main` + `git pull` — verify the merge succeeded and remote main has the new commits

### 4. Report

> Goal: summarize ship-to-main status

1. Run `/report` — table of `No.`, `Step`, `Expected`, `Actual`, `Status` + verdict `merged`/`blocked`
2. If a release is needed → suggest `/ship-release`
3. Run `/suggest-next-action`

## Rules

- `/ship-to-dev-branch` must always pass first — never merge into main skipping dev validation
- Merging into `main` → always user-confirmed (except `dont-ask-me` mode)
- Never merge while CI is failing/pending or the PR review has blockers
- Never force-push `main` — roll back with `git revert` only
- `dont-ask-me` mode: no `ask_user_question`, no `/ask-me`; irreversible actions → safe default or stop+report

## Expected Outcome

- `dev` fully validated and pushed to remote
- PR review gate passed (checks + deep-validate + deep-review)
- Branches merged into `main` successfully + cleanup done, with a rollback path
- A clear verdict with the next action (`/ship-release` if a release is needed)
