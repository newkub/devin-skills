---
name: ship
description: Canonical ship — verify gate (review, validate, tests, dev, usage), push, PR gate, merge main
argument-hint: "[scope] [verify-only|run|@issue-number-or-title|dont-ask-me]"
triggers:
  - user
  - model
related:
  - follow-agents-md
  - use-subagents
  - deep-review
  - deep-validate
  - update-tests
  - run-test
  - run-dev
  - git-commit-and-push
  - create-github-pr
  - review-github-pr
  - merge-all-branch-by-me-to-main
  - report-review
  - follow-parallel
  - run-check
  - update-project
---

## Goal

Take any work from verified to merged: run every verification gate, commit and push, pass the PR review gate, and merge into `main` only when each gate genuinely passes

## Scope

- The final ship path for any work — verify, push, PR gate, and merge into `main` in one skill
- `verify-only` → run steps 1–6 and report readiness; step 2 may still fix findings — never push or merge
- `run` → after verification, run step 6, keep the dev server up for real use, then report and stop; never push or merge
- The one home of every verify step — other skills (e.g. `/update-agents-md`, `/new-skills`) reference `/ship`; they never duplicate this workflow
- Releasing a new version → `/release-new-version`
- `dont-ask-me` argument, or a session running `/dont-ask-me` → `/follow-your-suggestion` plus safe defaults replace every confirmation gate

## Execute

### 1. Follow AGENTS.md

> Goal: `AGENTS.md` is fresh and authoritative before any gate runs

1. Run `/follow-agents-md`. If `AGENTS.md` is missing or stale → run `/update-agents-md` first
2. Read every additional ship/validate rule the project's `AGENTS.md` defines

### 2. Review Changes

> Goal: the changes pass review and every finding is fixed before ship

1. Resolve the scope: `[scope]` limits it; the default is the files changed in this session / `git diff` plus untracked files; `--diff` forces diff-only
2. Single workspace/module → run `/deep-review [scope] --diff then-fix`. It is the canonical reviewer and fixer: one full scan sliced per dimension, one reviewer per dimension via `/use-subagents`, findings fixed per its `references/review.md` (`## Domain Map`), and a `--diff` re-review until clean. The `/ship` flow skips the step 7 per-finding confirm and follows the report as-is
3. Several workspaces/modules/layers → fan out per part instead:
   1. Split the scope into disjoint parts (one per workspace/module/layer; `∪Sᵢ = scope`, `Sᵢ ∩ Sⱼ = ∅`). Inter-part dependencies form a DAG → run in waves; a cycle → merge those parts. Track every part (path, file set, status) from spawn to done
   2. Budget ≤ 10 parts. Over budget → keep the highest-risk parts and record every dropped part as `skipped (budget)` with its reason in the report
   3. Spawn one `part-reviewer` per part in parallel via `/use-subagents` (see `## Subagents`), one wave at a time, with independent batches ≤ 10 via `/follow-parallel`. A part with ≤ 2 changed files → review it in the parent and mark it `covered-manually`. A failed subagent → `/resolve-errors`, retry once, then mark the part `failed`
   4. Aggregate the part findings: dedup by `file + normalized rule + dimension`, keep the highest severity with combined evidence, and present them with `/report-review`
   5. Fix per part: run `/deep-review <part> then-fix` for each part, with parallel `fix-worker` subagents while file sets stay disjoint. Persist mechanical/convention findings via `/update-dot-agents-project` / `/update-astgrep-rules`
   6. Re-verify the fixed parts only, with `/deep-review <part> --diff` — never a full rescan. The report marks every part `done` / `covered-manually` / `failed` / `skipped (budget)` with its reason
   7. No findings in any part → skip the fix pass and continue to step 3
4. When changing the devin skills repo → run `/review-dot-agents-global-and-fix`
5. If findings still survive after 3 fix/re-verify rounds → stop and report `blocked`; never push

### 3. Validate

> Goal: every correctness dimension passes

1. Run `/deep-validate` — cross-reference, type safety, conventions
2. Run the project's lint and typecheck via `/run-check` — both must pass

### 4. Tests

> Goal: test coverage is complete and every suite passes

1. Run `/update-tests` — specs must cover every layer of the changes
2. Run `/run-test all` — every suite must pass; on failure → fix the root cause and rerun

### 5. Runtime And Usage

> Goal: the app really runs and the docs match reality

1. Run `/run-dev` — the dev server must be healthy with no errors
2. Run `/deep-test usage` — every usage example in README/docs/`AGENTS.md` must actually work
3. `run` argument → keep the `/run-dev` server up after the health check: for a web project, open the browser at the dev URL and continue `/watch-browser fix` per the `/run-dev` workflow, resolving errors immediately via `/resolve-errors`. Then run steps 6 and 10, and stop — steps 7–9 never run

### 6. Update Project

> Goal: docs, config, rules, and tooling match the verified changes before push

1. Run `/update-project` — it reads git log, restores changed information into root `AGENTS.md` and `README.md`, and syncs config, `.devin/`, rules, GitHub metadata, and all project files to the current codebase
2. The sync must reflect reality: no stale docs, no missing config entries, no orphan references

### 7. Commit And Push

> Goal: verified, synced work is on the remote with green CI

1. If any gate failed → fix the blockers and verify again; never skip ahead to push
2. Run `/git-commit-and-push` — commit, push the working branch, and resolve CI/CD until green. `verify-only` and `run` → stop after step 6 with the report; steps 7–9 never run

### 8. PR Review Gate

> Goal: the PR into `main` passes review and every check before merge

1. Create or find the PR into `main` with `/create-github-pr`
2. Run `/review-github-pr` — the full gate: all CI checks pass, `/deep-validate` and `/deep-review` pass, and the PR metadata and diff are clean
3. If the gate fails → fix the findings on the branch and re-run `/git-commit-and-push`; never merge

### 9. Merge To Main

> Goal: the branches are merged into `main` and cleaned up

1. Get user confirmation before merging into `main` (except `dont-ask-me` → safe default)
2. Run `/merge-all-branch-by-me-to-main` — it merges the user's branches into `main` and cleans up
3. On conflicts → `/resolve-merge-conflicts`; if the conflict is complex → `/ask-me`
4. Run `git switch main` + `git pull` and verify the merge succeeded and remote `main` has the new commits

### 10. Report

> Goal: one verdict — merged or blocked

1. Run `/report` — a `No. | Gate | Result | Evidence` table plus the verdict `merged` or `blocked`; when the `run` argument was used, include the dev server status (URL, port, watch state); when parts were reviewed, add the per-part coverage table (`Part | Files | Findings | Fixed | Status`)
2. If a release is needed → suggest `/release-new-version`
3. Run `/suggest-next-action`

## Subagents

### part-reviewer

- `Inputs`: `part-path`, `files-in-scope` (disjoint list), `conventions` (workspace `AGENTS.md` paths), `scope-mode` (`--diff` default)
- `Tools`: read, grep, glob, exec (read-only commands), skill
- `Execute`: run `/deep-review` limited to `files-in-scope` — read the slice and every evidence file named; never rerun the CLI outside the part, never sweep the codebase, never edit anything
- `Output`: findings table (`No. | Finding | Severity | Evidence file:line | Action | Owner skill`) + one-paragraph part summary + `part-status` (`clean` / `findings` / `failed (reason)`)
- `Constraints`: report-only; read only its own file set + evidence-named files; one part per subagent, no shared mutable state

## Rules

- Every gate must genuinely pass — never skip a failing gate; fix loop up to 3 rounds, then stop and report
- `part-reviewer` is report-only — every fix runs through `/deep-review <part> then-fix`, never inside the review pass
- Never drop a part silently — `skipped`, `failed`, and `covered-manually` each appear in the report with a reason
- Skip a gate only when the project truly lacks that artifact (e.g. no dev server → skip `/run-dev`), and state the reason in the report
- Never duplicate a verify step in another skill — reference `/ship` only
- Run `/deep-test smoke` in step 5 after `/run-dev` — the sanity gate on critical paths
- Never push work that failed verification; never merge while CI is failing or pending, or while the PR review has blockers
- Merging into `main` always needs user confirmation (except in `dont-ask-me` mode)
- Never force-push `main` — roll back with `git revert` only
- `dont-ask-me` mode: no `ask_user_question`, no `/ask-me`; an irreversible action → take the safe default or stop and report

## Expected Outcome

- `AGENTS.md` is fresh; review, validate, and check passed; tests are green; the dev run works; usage matches reality
- Review coverage is proven — every part is `done`, `covered-manually`, `failed`, or `skipped (budget)` with a reason, and no part was dropped silently
- Code is pushed with green CI/CD and the PR review gate passed (checks + `/deep-validate` + `/deep-review`)
- Branches are merged into `main` and cleaned up, with a rollback path
- The report states the verdict and the next action (`/release-new-version` when a release is needed)
