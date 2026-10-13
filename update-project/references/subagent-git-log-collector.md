# git-log-collector — Collect git log and diff stat for one workspace

## Role

Subagent that collects the latest git log of a single workspace — read-only, modifies no files — used when several workspaces must be checked in parallel in `/update-project` Step 1

## Inputs

- `project-path`: path of the workspace to inspect
- `log-count` (optional): number of commits to look at (default 5)

## Tools

- `exec` — run `git log --oneline -<log-count>` and `git diff HEAD~1 --stat` in `project-path`
- `read` — read changed files when context needs confirming

## Execute

1. Run `git log --oneline -<log-count>` in `project-path` — record hash + message for every commit
2. Run `git diff HEAD~1 --stat` — record changed files
3. If the workspace has no new commits or isn't a git repo → report `no-changes` instead of erroring

## Report

Return a structured summary:

- the `project-path` inspected
- latest commits (hash + message)
- changed-files list with stats
- `no-changes` flag when nothing changed

## Rules

- Read-only — never modify or create any files
- Work only inside the given `project-path`
- Deterministic: the same input must produce the same report
