---
name: review-refactor
description: Review structure and refactor the confirmed findings, green before and after
argument-hint: "[scope] [--diff] [then-fix] [fix all|follow-your-suggestion]"
related:
  - deep-review
  - deep-review-codebase-everything
  - deep-thinking
  - refactor
  - check-long-files
  - follow-architecture
  - run-verify
  - deep-validate
  - report-before-after
  - report-review
  - use-subagents
  - suggest-next-action
  - ask-me
---

## Goal

Review a scope for structural problems — SRP, long files, duplication, wrong boundaries, dependency direction — and fix the confirmed ones through `/refactor` with the baseline green before and after

## Scope

Use when the question is "does this structure need to change" rather than "what is broken" — a file, folder, package, workspace, or diff in any stack

- Entered through `/deep-review` with the `refactor` or `structure` signal, or called by name; the caller's scope and flags arrive unchanged
- The scan is not reimplemented here: `/deep-review-codebase-everything` runs the single sliced scan with the `architecture` and `code-quality` matrix rows plus the always tier; this skill reads those findings and adds the structural evidence `/refactor` `### 1` needs
- Fixing is owned by `/refactor`: this skill confirms the targets, hands over the table, and enforces its baseline and verification contract
- A behavior change found along the way is not a refactor finding — route it to the owning fixer and keep it out of the refactor set (Two Hats)
- Performance tuning, formatting-only churn, and renamed symbols with no structural cause are out of scope (`/optimize`, `/follow-tool-formatter`, `/rename`)
- Without `then-fix` the run is report-only; the report names the refactor sequence and the next action

## Execute

### 1. Think

> Goal: know what kind of structure this scope is and which refactor rules bind

1. Run `/deep-thinking` on the scope — is it an app, package, library, skill, docs set, or monorepo; which structural risks exist (cycles, god modules, shotgun surgery, boundary leaks)
2. Read the project `AGENTS.md` conventions before judging structure: line cap, import alias, folder layout, naming, and any project-specific rule
3. Run `/check-long-files` on the scope and record the counts — they are part of the baseline and the after-comparison
4. Pick the scope mode: `[scope]` limits the review; `--diff` reviews only the changed files; `then-fix` enables the fix steps

### 2. Establish The Baseline

> Goal: never refactor on a broken or unmeasured baseline

1. Run `git status` — record pre-existing changes so every later diff shows only this work; do not stage or commit anything
2. Run `/run-verify` (lint, typecheck, test, build) — red → resolve to green or stop and report the failure; a refactor never starts on red
3. Record `git rev-parse HEAD`, the `/check-long-files` table, and the current finding count as the baseline
4. A target whose behavior has no test coverage → note it; `/refactor` `### 1` requires characterization tests before moving it (`/update-tests`)

### 3. Scan

> Goal: one deterministic evidence pass over the structural dimensions

1. Run `/deep-review-codebase-everything` on the same scope with the `architecture` and `code-quality` labels, passing `--diff` when the run is diff-scoped — read its report, do not rerun the analyzer
2. Run `/follow-architecture` when the finding is boundary-, layer-, or dependency-direction-related — it owns pattern selection, so the target shape is not invented here
3. Cross-reference the findings for one shared root cause: several long files in one folder, one god module behind many exports, or a cycle that explains most dependency findings → one refactor target, not N
4. Read each candidate's `file:line` before it enters the table; a finding the code does not prove is rejected with the reason

### 4. Confirm The Refactor Set

> Goal: only behavior-preserving targets enter the fix steps

1. Build the target table `file:line | smell | technique | scope | risk`, taking the technique from `refactor/SKILL.md` `## Guide` (smell → technique)
2. Classify each target: structure-only (belongs here) or behavior-changing (owned by `/review-implement-to-production` or the feature's own fixer) — behavior-changing items are removed with the reason
3. Drop anything that is pure naming, pure formatting, or a move with no structural gain — they have their own skills and would dilute the refactor
4. Empty table → report clean and stop; never invent a refactor to have something to do
5. A large or cross-workspace set → plan it with `/create-plan-in-dot-devin`; an irreversible or wide-reaching move → `/report-before-after` and confirm before editing

### 5. Fix

> Goal: one technique per step, checkpoint on every green batch

1. Without `then-fix` → stop here and report the table plus the suggested order; do not edit
2. With `then-fix` → confirm the set with `/ask-me` per finding (or `/follow-your-suggestion` / `fix all` when the user says so); `dont-ask-me`/`/ship` follow the report as-is
3. Hand the confirmed table to `/refactor` with the matching scope (`srp`, `concerns`, `structure`, `shared`, `orm`, `workspace`, `architecture`) — it runs its own `### 3` technique steps; do not reimplement them
4. Order the work foundation → dependents, smallest reversible unit first; after each step run `/run-verify` and checkpoint with `/git-commit` on green — a red step is reverted alone, never carried forward
5. Independent modules with disjoint file sets may run as parallel `fix-worker` subagents via `/use-subagents`; overlapping files are serialized

### 6. Verify

> Goal: prove behavior and the public surface did not move

1. Run `/run-verify` and `/deep-validate` against the baseline — red after 3 rounds → stop and report the remaining gap, never leave a broken state
2. Diff every barrel/index in the change set against the baseline sha — an added, removed, or re-signatured export is a behavior change, not a refactor
3. Run `/update-references` when a path or name moved, then prove no stale reference remains (`rg "<old-path>|<old-name>"` returns nothing)
4. Report the finding tables through `/report-review`, then before → after with `/report-before-after`: file counts, line counts, finding count, verify status
5. Persist a structural rule that should not recur via `/update-astgrep-rules` (batchable pattern) or `/update-devin-project-rules` (convention)
6. Close with `/suggest-next-action`

## Rules

- Evidence before structure — every target cites `file:line` from the scan or `/check-long-files`; a hunch is not a target and an empty table ends the run
- Preserve behavior — structure only; the public API stays identical and is proven at step 6; a bug found mid-refactor is its own fix, not part of the refactor
- Baseline green first — no refactor starts while `/run-verify` is red, and every step ends green
- One technique per step, minimal diff, no scope creep; no new dependency and no performance tuning in a refactor pass
- Uncovered behavior gets characterization tests before it moves, never after
- Scan once — reuse the `deep-review-codebase-everything` slice; never rerun the analyzer per target
- Without `then-fix` nothing is edited; with `then-fix` only the confirmed set is touched, at the confirm gate's scope
- Never commit or push unless the user asked; checkpoint commits are proposed, not pushed
- Use `/use-subagents` if needed — independent files or packages handed to parallel fix-workers with disjoint file sets, never overlapping edits

## Expected Outcome

- A structurally clean scope where every target traces to `file:line` evidence and was fixed or explicitly rejected
- Public surface identical, `/run-verify` and `/deep-validate` green against the baseline, no stale references
- A before → after report (files, lines, findings, verify) and rules persisted where the smell can recur
- Without `then-fix`: a prioritized, evidence-backed refactor table and no edits
