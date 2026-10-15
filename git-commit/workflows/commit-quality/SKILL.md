---
name: git-commit-commit-quality
description: Check that commit messages in the repo follow conventional commits and are high quality — find malformed, vague, over-long, or intent-less messages
related:
  - git-commit
---

## Goal

Check that commit messages in the repo follow conventional commits and are high quality — find malformed, vague, over-long, or intent-less messages

## Scope

- applies to the current repo's git history or a given range (`HEAD~10`, `main..feature`)
- covers format checks (type, scope, subject) and quality heuristics (imperative, specificity)
- Read-only: report only, no history rewrite

## Execute

### 1. Select Commit Range

> Goal: know which commits to check

1. take `range` from the argument — default: `HEAD~20..HEAD` or commits not yet pushed
2. run `git log --format='%h|%s|%an|%ad' <range>` to pull the messages
3. skip merge commits and bot commits per the repo's convention

### 2. Check Format Compliance

> Goal: matches the conventional commits spec

1. Pattern: `<type>(<scope>)?: <subject>` — types: `feat`, `fix`, `docs`, `refactor`, `chore`, `test`, `perf`, `build`, `ci`, `style`
2. Flag `bad-format` if the pattern does not match
3. Flag `bad-type` if the type is not in the list the repo uses
4. Flag `long-subject` if the subject exceeds 72 characters
5. Flag `capitalized`/`trailing-dot` per convention

### 3. Check Message Quality

> Goal: the message conveys the real intent

1. Flag `vague` for subjects like `update`, `fix bug`, `changes`, `wip`, `misc`
2. Flag `non-imperative` when past tense is used (`added`, `fixed`)
3. Flag `no-context` when the commit is large (diff spans many files) but the subject is too short and has no body
4. Flag `mismatch` when the type does not match the diff (e.g. `docs:` but source code was edited)

### 4. Suggest Rewrites

> Goal: propose better messages

1. for flagged commits → draft a conventional message from the diff summary
2. use `git show --stat <sha>` to understand the real change
3. suggest `<type>(<scope>): <imperative subject>` per commit

### 5. Report

> Goal: summarize quality and the fix approach

1. build a `/report` with columns: `No.`, `SHA`, `Message`, `Issues`, `Suggested`
2. summarize the compliance rate and issue breakdown
3. recommend `/refactor-commit` if a rewrite is needed (only commits not yet pushed)
4. recommend `commitlint` + git hooks if continuous enforcement is wanted — repos with `.moon/workspace.yml` → moon's `vcs.hooks` (`/follow-tool-moonrepo` Step 7); other repos → `/follow-tool-hk`

## Rules

### 1. Read-Only

- do not rebase, amend or rewrite history in this skill
- offer suggestions only — rewrite via `/refactor-commit` when the user asks

### 2. Repo Convention

- use the types/scopes the repo actually uses from `git log` — do not force a standard set when the repo has its own
- if the repo does not use conventional commits at all → report quality only, do not flag format

### 3. Actionable

- every flag must have a suggested rewrite or a clear reason
- do not flag bot commits (`dependabot`, `renovate`) unless the repo enforces the format

- Use /list-git-commit if needed
- Use /refactor-commit if needed
- Use /follow-tool-hk if needed (only repos not using moonrepo — moon repos use `vcs.hooks`)

- Use /git-commit if needed

## Expected Outcome

- know the compliance rate and which commits break format/quality
- suggested messages ready to use
- know whether to `/refactor-commit` or set up a commitlint hook
