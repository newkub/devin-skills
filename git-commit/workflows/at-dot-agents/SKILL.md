---
name: git-commit-at-dot-agents
description: Commit every changed file in ~/.agents after lint and review pass
related:
  - git-commit
  - check-agents-lint
  - review-dot-agents-global-and-fix
  - deep-validate
---

## Goal

Commit every changed file in the `~/.agents` repo after `check-agents-lint`, `review-dot-agents-global-and-fix`, and `deep-validate` pass the criteria

## Scope

- Use for `~/.agents` (the harness root; `D:\dot-agents` on this machine)
- A wrapper around `/git-commit` that adds pre-commit validation for agent skills
- `skills/` is a git submodule: commit inside `skills/` first, then commit the updated pointer in the parent repo
- Not a tool for push, deploy, or merge — use `/git-commit-and-push` afterwards
- Does not fix findings itself — on Critical or High, stop and hand over to `/resolve-errors`

## Execute

### 1. Navigate And Check Status

> Goal: verify the repo root and that there are real changes

1. Change the working directory to `~/.agents`
2. Run `git status --porcelain`
3. Run `git -C skills status --porcelain`
4. If both are clean → stop and report `no changes to commit`

### 2. Review The Harness

> Goal: check conventions and cross-skill consistency

1. Run `/review-dot-agents-global-and-fix review`
2. Record findings with layer, file, severity, and evidence
3. If any Critical or High → stop, report, recommend `/resolve-errors`

### 3. Lint Every Skill

> Goal: prove the changed packages conform

1. Run `/check-agents-lint` from `~/.agents`
2. Gate with `--fail-on warning` for the changed scope
3. If findings remain → stop, route each finding to its fix owner, rerun

### 4. Deep Validate

> Goal: detailed correctness check of the changed scope

1. Run `/deep-validate` on the changed files
2. Record findings with severity
3. If any Critical or High → stop and recommend `/resolve-errors`

### 5. Stage Changes

> Goal: stage only what belongs in this commit

1. Run `git -C skills diff --name-only` and `git diff --name-only`
2. Stage inside `skills/`: `git -C skills add .`
3. Review with `git -C skills diff --cached --stat`
4. Separate out-of-scope files before committing
5. Never stage `node_modules`, `target`, or build output

### 6. Commit Submodule Then Parent

> Goal: keep the parent pointer consistent

1. Inside `~/.agents/skills` run `/git-commit`
2. Verify the submodule commit with `git -C skills log --oneline -3`
3. In `~/.agents` stage the updated `skills` pointer: `git add skills`
4. Run `/git-commit` in `~/.agents` for any root-level changes
5. If no root-level change exists → skip the parent commit

### 7. Verify

> Goal: confirm the commits and a clean tree

1. Run `git -C skills log --oneline -5` and `git log --oneline -5`
2. Run `git -C skills status --porcelain` and `git status --porcelain`
3. Clean → report success
4. Files remain → report and recommend the next action via `/suggest-next-action`

## Rules

- Use only in the `~/.agents` repo and its `skills/` submodule
- Validation gate: `check-agents-lint`, `review-dot-agents-global-and-fix`, and `deep-validate` must pass before committing
- Never use `--no-verify` to bypass validation
- Commit messages follow conventional commits, English only, subject ≤72 characters
- Pushing needs a separate confirmation and `/git-commit-and-push`

## Expected Outcome

- Changed skills are reviewed, linted, and validated before the commit
- The submodule commit and the parent pointer are both recorded
- The working directory is clean with no Critical or High findings left behind
