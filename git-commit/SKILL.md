---
name: git-commit
description: Commit every changed file with conventional commits
argument-hint: "[scope]"
related:
  - run-check
  - run-verify
  - follow-tool-hk
  - list-git
  - refactor-commit
  - deep-review-codebase
  - ship

---
## Goal

Commit every changed file in the global devin skills directory following the conventional commits standard

## Scope

- variants: no-verify/selected-files/at-devin-global-skills/commit-quality live in workflows; `and-push` was moved out to the top-level `/git-commit-and-push`; `at-devin-global-skills` has a top-level alias `/git-commit-at-devin-global-skills`

Use only for committing changes in `C:\Users\Veerapong\AppData\Roaming\devin\skills`

- if you want pre-commit validation before committing in devin global skills, use `/git-commit at-devin-global-skills`

## Execute

### Workflows

| Domain                   | Workflow |
|--------------------------|----------|
| `no-verify`              | `## Merged Details → no-verify` — commit skipping pre-commit hooks with `--no-verify` |
| `selected-files`         | `## Merged Details → selected-files` — commit only selected files, never `git add .` |
| `and-push`               | `/git-commit-and-push` — the real top-level skill (commit + push + resolve CI/CD) |
| `at-devin-global-skills` | `## Merged Details → at-devin-global-skills` — pre-commit validation for devin global skills (alias: `/git-commit-at-devin-global-skills`) |
| `commit-quality`          | `## Merged Details → commit-quality` — lint commit messages against conventional commits |

### 1. Navigate To Global Devin Skills

> Goal: Navigate To Global Devin Skills

Change directory to the global devin skills

1. Change directory to `C:\Users\Veerapong\AppData\Roaming\devin\skills`
2. Verify you are in the correct directory with `pwd`

### 2. Check Git Status

> Goal: Check Git Status

Check the repository status

1. Run `git status --porcelain` to see all modified files
2. Verify you are in the correct repository

### 3. Stage All Changes

> Goal: Stage All Changes

Stage every changed file

1. Run `git add .` to stage all files
2. Verify with `git diff --cached` that the staged files are correct

### 4. Determine Commit Type

> Goal: Determine Commit Type

Pick the appropriate conventional commit type

1. See the Commit Types part of Rules
2. Choose the type per the change:
   - feat: add a new skill
   - fix: fix a skill
   - docs: edit documentation or descriptions
   - refactor: refactor a skill
   - chore: improve configuration or structure

### 5. Write Commit Message

> Goal: Write Commit Message

Write the commit message following the conventional commits format

1. See the Commit Message Format and Body parts of Rules
2. Use the `<type>: <subject>` pattern
3. keep the subject short, no more than 72 characters
4. use imperative mood (e.g. add not added)
5. English only
   - if the content or context makes you think in another language, translate the subject and body into English before committing

### 6. Execute Commit

> Goal: Execute Commit

Perform the commit

1. Run `git commit -m "<message>"` or `git commit`
2. Check the result from git commit
3. If there is an error: fix it and try again

### 7. Verify Commits

> Goal: Verify Commits

Verify the commits are correct

1. Run `git log --oneline -5` to see the latest commits
2. Check that commit messages follow conventional commits and are in English
3. Check that no uncommitted files remain
4. Run `git status` to confirm the working directory is clean

## Rules

### Commit Message Format

Use the conventional commits pattern

- Use the `<type>: <subject>` pattern
- the subject should not start with a capital letter or end with a period
- short and concise, no more than 72 characters
- use imperative mood (e.g. add not added)
- English only
  - if the content or context makes you think in another language, translate the subject and body into English before committing

### Commit Types

Choose the type that fits the change

- feat: add a new skill
- fix: fix a skill
- docs: edit documentation or descriptions
- refactor: refactor a skill
- chore: improve configuration or structure

### Body

Explain the reason and extra context

- explain the reason and context
- separate from the subject with a blank line
- use bullet points for multiple items

- Use /run-check if needed
- Use /run-verify if needed
- Use /follow-tool-hk if needed (only repos not using moonrepo — moon repos use `vcs.hooks`)
- Use /list-git-commit if needed
- Use /refactor-commit if needed
- Use /deep-review-codebase if needed
- Use /ship if needed

## Merged Details

### at-devin-global-skills

##### Goal

Commit every changed file in the devin global skills repo after `review-devin-global-harness`, `deep-validate` and `review-devin-global-harness` pass the criteria

##### Scope

Use for `%APPDATA%\devin\skills` on Windows or `~/.devin/skills` on Unix

- a wrapper around `/git-commit` that adds pre-commit validation for devin global skills
- not a tool for push, deploy or merge — if you need to push, use `/git-commit-and-push` afterwards
- does not fix code itself — if validation finds Critical/High, stop and hand over to `/resolve-errors`

##### Execute

###### 1. Navigate And Check Status

> Goal: verify you are in the correct repo and there are real changes

1. Change the working directory to `%APPDATA%\devin\skills`
2. Run `git status --porcelain`
3. If there are no changes to commit → stop and report `no changes to commit`

###### 2. Review Devin Global Skills

> Goal: check conventions and cross-skill consistency

1. Run `/review-devin-global-harness`
2. Record findings, severity and category
3. If there are Critical or High → stop, report, recommend `/resolve-errors`

###### 3. Deep Validate

> Goal: detailed correctness check of the changed skills

1. Run `/deep-validate` on the changed scope
2. Record findings with severity
3. If there are Critical or High → stop, report, recommend `/resolve-errors`

###### 4. Check Skill References

> Goal: find broken references and circular dependencies between skills

1. Run `/review-devin-global-harness`
2. If broken references are found → stop, recommend `/update-references` and wait for the user to fix
3. Run `/follow-tool-madge` if `related` was edited
4. If it passes → continue

###### 5. Stage Changes

> Goal: prepare files for a safe commit

1. Run `git diff --name-only` to see the files to stage
2. Run `git add .` inside `%APPDATA%\devin\skills`
3. Run `git diff --cached --stat` to review
4. If there are out-of-scope files or files that should not be committed → separate them first

###### 6. Commit

> Goal: create the commit following conventional commits

1. Run `/git-commit`
2. If `git-commit` fails → read the error, fix, then retry
3. If you need to scope to one specific skill → use `/git-commit selected-files` instead

###### 7. Verify

> Goal: confirm the commit is correct and the working directory is clean

1. Run `git log --oneline -5`
2. Run `git status --porcelain`
3. If the working directory is clean → report success
4. If files remain → report and recommend the next action via `/suggest-next-action`

##### Rules

###### 1. Repo Scope

- use only in the devin global skills repo
- never commit files outside `%APPDATA%\devin\skills` or `~/.devin/skills`

###### 2. Validation Gate

- must pass `/review-devin-global-harness`, `/deep-validate` and `/review-devin-global-harness` before committing
- if there are Critical/High findings, stop and hand over to `/resolve-errors`
- never use `--no-verify` to bypass validation

###### 3. Commit Discipline

- use `/git-commit` to keep the conventional commits standard
- subject no more than 72 characters
- English only in the commit message

###### 4. Post-Commit

- if you need to push, use `/git-commit-and-push`
- if you need to refactor history, use `/refactor-commit`
- if there are findings after committing, use `/resolve-errors`

- Use `/run-check` if needed
- Use `/report` if you want a summary
- Always use `/suggest-next-action` when finishing

##### Expected Outcome

- every changed skill is reviewed/validated/references checked before committing
- the commit is created with conventional commits
- the working directory is clean
- no Critical/High findings left behind
- a summary report of validation and commit exists

### commit-quality

##### Goal

Check that commit messages in the repo follow conventional commits and are high quality — find malformed, vague, over-long, or intent-less messages

##### Scope

- applies to the current repo's git history or a given range (`HEAD~10`, `main..feature`)
- covers format checks (type, scope, subject) and quality heuristics (imperative, specificity)
- Read-only: report only, no history rewrite

##### Execute

###### 1. Select Commit Range

> Goal: know which commits to check

1. take `range` from the argument — default: `HEAD~20..HEAD` or commits not yet pushed
2. run `git log --format='%h|%s|%an|%ad' <range>` to pull the messages
3. skip merge commits and bot commits per the repo's convention

###### 2. Check Format Compliance

> Goal: matches the conventional commits spec

1. Pattern: `<type>(<scope>)?: <subject>` — types: `feat`, `fix`, `docs`, `refactor`, `chore`, `test`, `perf`, `build`, `ci`, `style`
2. Flag `bad-format` if the pattern does not match
3. Flag `bad-type` if the type is not in the list the repo uses
4. Flag `long-subject` if the subject exceeds 72 characters
5. Flag `capitalized`/`trailing-dot` per convention

###### 3. Check Message Quality

> Goal: the message conveys the real intent

1. Flag `vague` for subjects like `update`, `fix bug`, `changes`, `wip`, `misc`
2. Flag `non-imperative` when past tense is used (`added`, `fixed`)
3. Flag `no-context` when the commit is large (diff spans many files) but the subject is too short and has no body
4. Flag `mismatch` when the type does not match the diff (e.g. `docs:` but source code was edited)

###### 4. Suggest Rewrites

> Goal: propose better messages

1. for flagged commits → draft a conventional message from the diff summary
2. use `git show --stat <sha>` to understand the real change
3. suggest `<type>(<scope>): <imperative subject>` per commit

###### 5. Report

> Goal: summarize quality and the fix approach

1. build a `/report` with columns: `No.`, `SHA`, `Message`, `Issues`, `Suggested`
2. summarize the compliance rate and issue breakdown
3. recommend `/refactor-commit` if a rewrite is needed (only commits not yet pushed)
4. recommend `commitlint` + git hooks if continuous enforcement is wanted — repos with `.moon/workspace.yml` → moon's `vcs.hooks` (`/follow-tool-moonrepo` Step 7); other repos → `/follow-tool-hk`

##### Rules

###### 1. Read-Only

- do not rebase, amend or rewrite history in this skill
- offer suggestions only — rewrite via `/refactor-commit` when the user asks

###### 2. Repo Convention

- use the types/scopes the repo actually uses from `git log` — do not force a standard set when the repo has its own
- if the repo does not use conventional commits at all → report quality only, do not flag format

###### 3. Actionable

- every flag must have a suggested rewrite or a clear reason
- do not flag bot commits (`dependabot`, `renovate`) unless the repo enforces the format

- Use /list-git-commit if needed
- Use /refactor-commit if needed
- Use /follow-tool-hk if needed (only repos not using moonrepo — moon repos use `vcs.hooks`)

- Use /git-commit if needed

##### Expected Outcome

- know the compliance rate and which commits break format/quality
- suggested messages ready to use
- know whether to `/refactor-commit` or set up a commitlint hook

### no-verify

##### Goal

Commit the changed files while skipping pre-commit hooks with `git commit --no-verify`

##### Scope

Use when pre-commit hooks fail, are slow, or block an intended commit — always requires user confirmation first

##### Execute

###### 1. Check Status

> Goal: check the files to commit

1. Run `git status --short`
2. Run `git diff --cached --name-only` to see staged files
3. If nothing is staged yet → stop and ask to stage first

###### 2. Verify Reason

> Goal: confirm `--no-verify` is genuinely needed

1. ask the user why the hooks must be bypassed
2. if the bypass is because pre-commit failed → record the reason for fixing later
3. if the user does not confirm → use `/git-commit` instead

###### 3. Review Staged Diff

> Goal: verify correctness before committing

1. Run `git diff --cached --stat`
2. If unrelated files are present → separate them first
3. Review the draft message

###### 4. Execute Commit

> Goal: commit while skipping hooks

1. if there is a message from the user run `git commit --no-verify -m "<message>"`
2. if there is no message → run `git commit --no-verify` then edit in the editor
3. check the exit code

###### 5. Post-Commit

> Goal: verify and plan the hook fix

1. Run `git log --oneline -3`
2. Run `git status --short`
3. if the bypass was because a hook failed → create a TODO to fix via `/run-check` or `/run-verify` later

##### Rules

###### 1. No Automatic Add

- never use `git add .` in this skill
- commit only files that are already staged

###### 2. User Confirmation

- ask the user before using `--no-verify`
- explain the risk: hooks will not run and the commit may bring unchecked files into the repo

###### 3. Message Format

- use conventional commits like `/git-commit`
- subject no more than 72 characters
- use English

###### 4. Post-Commit Discipline

- if a hook failed there must be a fix plan
- use `/run-check` or `/run-verify` afterwards to verify
- never use `--no-verify` to hide an error that must be fixed

- Use `/git-commit` when hooks work normally
- Use `/git-commit selected-files` when you want to commit specific files
- Use `/git-commit-and-push` when you want to push at the same time
- Use `/run-check` or `/run-verify` before `--no-verify` when possible
- Use `/resolve-errors` when a hook fails and the root cause must be fixed
- Use `/refactor-commit` if history needs adjusting

##### Expected Outcome

- staged files committed without running pre-commit hooks
- the user confirmed the bypass
- a conventional-commits message exists
- a plan to check or fix the hooks later exists
- the working directory is clean for the intended commit files

### selected-files

##### Goal

Commit only selected files, without using `git add .`

##### Scope

- use when you want to commit only some files from the working directory
- do not stage every file automatically
- supports selection by pattern or user confirmation

##### Execute

###### 1. List Changed Files

> Goal: know which files changed

1. Run `git status --short` to see modified, staged, untracked
2. Run `git diff --name-only` for modified
3. Group files by category: skills, docs, config, scripts
4. Identify pre-existing/unrelated files that should not be committed

###### 2. Select Files To Commit

> Goal: pick only the files you want to commit

1. if the user gives an argument (pattern/path) → filter by the pattern
2. if none is given → show the list and let the user choose with `ask_user_question`
3. support multi-select
4. skip unrelated untracked files unless the user selects them

###### 3. Stage Selected Files

> Goal: prepare the selected files for commit

1. Run `git add <file1> <file2> ...` for only the selected files
2. do not use `git add .` or `git add -A`
3. verify with `git diff --cached --name-only`

###### 4. Determine Commit Type

> Goal: pick the conventional commit type

1. See the Commit Types part of Rules
2. Choose per the change:
   - `feat` for a new skill
   - `fix` for a fix
   - `docs` for documentation
   - `refactor` for a refactor
   - `chore` for config/structure
   - `test` for tests

###### 5. Write Commit Message

> Goal: write the commit message

1. Use the `<type>(<scope>): <subject>` pattern
2. subject no more than 72 characters
3. state the scope from the directory/type of the files
4. if there are many files from multiple scopes → separate with `,` or split commits

###### 6. Execute Commit

> Goal: commit the selected files

1. Run `git commit -m "<message>"`
2. check the exit code
3. if there is an error → fix and try again

###### 7. Verify

> Goal: confirm the commit is correct

1. Run `git log --oneline -3`
2. Run `git status --short` to see files not yet committed
3. check that no unrelated files were staged

##### Rules

###### 1. No Add All

- never use `git add .` or `git add -A`
- stage file by file per the selection
- if unsure → ask the user

###### 2. User Confirmation

- if there is no argument, ask before staging
- show the file list before committing
- let the user confirm the message

###### 3. Scope Clarity

- one commit should stay within one scope
- if there are multiple scopes, split commits
- state the scope in the message

###### 4. Conventional Commits

- use the correct type
- subject in imperative mood
- no leading capital, no trailing period

- Use /git-commit if needed
- Use /git-commit-and-push if needed
- Use /git-push if needed
- Use /refactor-commit if needed
- Use /deep-validate if needed

##### Expected Outcome

- only the selected files are committed
- unrelated files remain in the working directory
- commit message is clear and follows conventional commits
- a report of committed files and remaining files exists

## Expected Outcome

- commit messages that follow conventional commits and are entirely in English
- git history that is easy to read and follow
- every changed file in the global devin skills is committed
- the working directory is clean
