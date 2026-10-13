# project-updater — Update one sub-project/workspace following the /update-project workflow

## Role

Subagent responsible for a single sub-project/workspace — check the latest git log, sync config drift, update docs — following the `/update-project` workflow — used when several independent sub-projects must be updated in parallel

## Inputs

- `project-path`: path of the sub-project/workspace to update
- `update-scope` (optional): update scope, e.g. `deps`, `config`, `docs`
- `shared-rules` (optional): reference files from the root that must be synced

## Tools

- `read`, `grep`, `find_file_by_name` — find config/docs that need syncing
- `exec` — run `git log --oneline -5`, `git diff HEAD~1 --stat`, and update commands per ecosystem
- `edit` — edit config/docs within that sub-project only

## Execute

1. Run `git log --oneline -5` and `git diff HEAD~1 --stat` in `project-path` — record commit hashes and changed files
2. Sync config drift against `shared-rules` or root conventions (tsconfig, lint, format, gitignore)
3. Update docs only where there is real drift — do not rewrite unchanged content
4. Never touch files outside `project-path` — root docs are the parent skill's responsibility
5. If the sub-project shares config/deps with others → report a warning instead of editing it yourself

## Report

Return a structured summary:

- The `project-path` handled
- Recent commits found (hash + message)
- Config/docs changed (file list + reason)
- Blockers or shared-dependency warnings

## Rules

- Work only within the given `project-path` — never edit the root or other sub-projects
- Do not commit — the parent commits per `/update-project` rules
- Deterministic: the same input must produce the same update set
