---
name: git-search
description: Search git history, commits, diffs, and agent blame with git and ctx
argument-hint: "[commit|code|content|blame|file|remote]"
related:
  - follow-tool-ctx-rs
  - follow-tool-git
  - check-git-logs
  - git-file-history
  - report-diff-in-web
  - git-bisect
  - deep-debug
  - report
---

## Goal

Find the commit, change, file, or line that explains a behavior — commit-message search, pickaxe diff search, revision content search, line history, and agent attribution through `ctx blame`

## Scope

- Covers `git log`, `git grep`, `git blame`, `git log -L`, `git show`, and `gh api` for remote GitHub repos
- Boundary: current working-tree files → `/code-search`; browsing a file's log commit-by-commit until a condition matches → `/check-git-logs`; indexed agent session recall → `/follow-tool-ctx-rs`; state-changing git work → `/follow-tool-git`
- Read-only — never checkout, restore, or rewrite during a search
- References: [git](references/git.md) · [ctx-blame](references/ctx-blame.md)

## Execute

### 1. Define The Search

> Goal: pick the narrowest scope that can answer the question

1. Classify: `commit-message`, `code` (added or removed diff), `content` (a revision's tree), `blame` (line authorship), `file` (path history), or `remote`
2. State the repo path, branch/range, and time window
3. Phrase the target as one concrete string or regex before running anything

### 2. Search Commit Messages

> Goal: find changes described in commit history

1. `git log --all --grep='<pattern>' --oneline`; add `--regexp-ignore-case`, `--author`, `--since`, `--until`
2. Inspect a hit: `git show <sha> --stat`, then `git show <sha>`
3. Follow only one path: `git log --follow --oneline -- <path>`

### 3. Search Code Changes (Pickaxe)

> Goal: find commits that added or removed a string

1. Exact string in diffs → `git log --all -S'<string>' --oneline`
2. Regex on changed lines → `git log --all -G'<regex>' --oneline`
3. Limit the path: `git log -S'<string>' --oneline -- <path>`
4. `-S` counts occurrences; `-G` matches any changed line — choose deliberately

### 4. Search Content At A Revision

> Goal: find text inside a commit, branch, or tag

1. `git grep -n '<pattern>' <rev>`
2. Multiple terms: `git grep -n -e '<a>' -e '<b>' <rev>`
3. Limit the path: `git grep -n '<pattern>' <rev> -- <path>`
4. Deleted branch → search the last commit that contained it, not the working tree

### 5. Trace Line History And Blame

> Goal: identify which commit and which agent session produced a line range

1. `git blame -L <start>,<end> -- <file>`
2. Follow renames: `git log --follow -L <start>,<end>:<file>`
3. Open the commit: `git show <sha> -- <file>`
4. Agent attribution → `ctx blame file <path> --lines <start>:<end>`; see `references/ctx-blame.md` and `/follow-tool-ctx-rs`

### 6. Remote Repositories

> Goal: search a GitHub repo that is not cloned locally

1. Confirm access: `gh repo view <owner/repo>`
2. Commits: `gh api 'repos/<owner>/<repo>/commits?per_page=100'` then filter; follow pagination
3. Code search: `gh api 'search/code?q=<pattern>+repo:<owner>/<repo>'`
4. File tree: `gh api 'repos/<owner>/<repo>/git/trees/HEAD?recursive=1'`
5. Deep-history or large-repo search → clone locally; faster and not rate-limited

### 7. Report

> Goal: present evidence in the order it will be acted on

1. Run `/report` with columns: No. · Commit SHA · Date · Author · Scope · Match
2. Order newest first; include path and line with each snippet
3. State the pattern, range, and path filters used
4. Route the next step: `/git-bisect`, `/git-file-history`, `/report-diff-in-web history`, `/follow-tool-git`, or `/deep-debug`

## Rules

### 1. Query Discipline

- Start with the narrowest scope (file, line range, path) and widen only when nothing is found
- `-S` for an exact string whose occurrence count changed; `-G` for regex on changed lines
- Always state branch or range; `--all` is a scope decision, not a default for huge repos

### 2. Read-Only Safety

- Never run checkout, restore, reset, rebase, or clean during a search
- If a result suggests restoring code → stop and route to `/follow-tool-git` with a backup step
- Redact secrets or private data before reporting

### 3. Remote Limits

- The GitHub API is rate-limited and its search index may lag — paginate deliberately
- Remote code search is not a full-history pickaxe; say so when using it

### 4. Attribution

- `git blame` names the commit and author of a line
- `ctx blame` names the agent session and its evidence class: proven, possible, conflict, or missing
- Never present possible attribution as proven; never present commit authorship as agent authorship

## Expected Outcome

- The commit, diff, file, or line that answers the question, with SHA evidence
- Local and remote searches both supported with their limits stated
- Agent attribution comes from `ctx blame` with its confidence reported
- A report table ordered by recency with a next action
