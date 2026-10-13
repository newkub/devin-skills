---
name: update-project-all-drive-d
description: Update all projects on drive D via pull/fetch/submodule sync and project-file updates based on state
argument-hint: "[filter]"
allowed-tools:
  - exec
  - find_file_by_name
  - ask_user_question
  - grep
  - read
related:
  - list-projects-git-in-drive-d
  - search
  - sync-drive-d-submodules
  - update-project
  - check-should-update
  - follow-parallel
  - use-subagents
  - report
  - ask-me
---

## Goal

Bring every git repository under `D:\` up to date safely, covering `git fetch`, `git pull --ff-only`, `git submodule update`, and `/update-project` according to state

## Scope

Use when you want to sync/update every project in `D:\` in one pass. Supports a `filter` by name/keyword and restricts writes to repositories eligible for update, without destroying local data

## Execute

### 1. List Target Projects

> Goal: Identify the projects to update

1. If the user gives a `filter` → run `/search-project-in-drive-d <filter>` to narrow down projects
2. If none is given → run `/list-projects-git-in-drive-d` to get the full list
3. Confirm at least 1 project was listed; if none → stop and report
4. Ask the user with `/ask-me` whether to update all projects or select some

### 2. Choose Update Mode

> Goal: Determine the update level

1. Ask the user to choose a mode:
   - `quick` — `git fetch` + `git pull --ff-only` (default)
   - `submodules` — also runs `git submodule update --init --recursive`
   - `full` — also runs `/update-project` after pull (only repos with `package.json`, `.devin`, or `AGENTS.md`)
2. If the user does not answer → use `quick` and report the choice

### 3. Check Status Per Project

> Goal: Check status before updating

1. For each project run `git status --porcelain` and `git branch --show-current`
2. Run `git rev-parse --abbrev-ref HEAD` to see the branch
3. Run `git rev-list --left-right --count HEAD...@{upstream}` to see behind/ahead
4. Record: project, branch, dirty, behind, ahead

### 4. Pull Updates

> Goal: Pull remote updates for ready projects

1. Skip dirty projects (with uncommitted changes) and report them
2. Skip projects not on `main`, `master`, or the user-specified default branch
3. For projects that are clean and behind:
   - Run `git fetch --prune`
   - Run `git pull --ff-only` or `git merge --ff-only @{upstream}`
4. If there are conflicts → stop for that project and report so the user resolves them manually

### 5. Sync Submodules (If Mode = submodules/full)

> Goal: Bring submodules up to date

1. If the project has `.gitmodules` → run `git submodule update --init --recursive`
2. If the project has changes in submodules → skip and report
3. Record status after update

### 6. Run Project Update (If Mode = full)

> Goal: Sync project docs/config/rules via `/update-project`

1. If the project has `package.json`, `.devin`, or `AGENTS.md` → run `/update-project`
2. If none → skip
3. Record whether the project received a project update

### 7. Report Summary

> Goal: Summarize the update results

1. Use `/report` with columns: No., Project, Path, Branch, Before, After, Action, Status
2. Show projects that updated successfully, were skipped, or errored
3. Give a count for each category
4. Run `/suggest-next-action`

### Subagents

> Goal: Parallelize updates when there are many projects

- Use the `project-updater` profile (see `## Subagents` below) when there are more than 5 independent projects — spawn one per project via `/use-subagents`, passing `project-path` and the same `mode`, then merge the update reports before the summary

## Rules

### 1. Drive D Scope Only

- Work only on paths starting with `D:\` or `/mnt/d` (WSL)
- Do not touch other drives without permission
- Verify the drive letter before every execute

### 2. Safety First

- Never force pull or use `git push --force`
- Do not modify projects with uncommitted changes
- Do not modify projects that are not on the default branch without asking the user
- Ask the user before `full` mode, since it may modify project docs/config files

### 3. Parallel Execution

- If there are more than 5 projects → use `/follow-parallel` or `/use-subagents` to process in parallel
- Each subagent handles one project or a group of projects
- Merge results before reporting

### 4. Idempotency

- The skill can be re-run without extra side effects
- If a project is already at latest → no pull needed

### 5. No Auto Commit

- This skill does not commit or push for the user
- If a project has changes from a pull → inform the user
- To commit, use `/git-commit` or `/ship-to-dev-branch` separately per project

- Use /sync-drive-d-submodules if needed
- Use /check-should-update if needed

## Subagents

> Goal: Independent work that can be spawned in parallel — profiles live in this section itself, no separate files needed

### project-updater — Update one project dir on drive D (pull, submodules, checks) and return an update report

- **Inputs**: `project-path` (absolute path of the project, e.g. `D:\projects\my-app`), `mode` (`quick` = fetch+pull / `submodules` = includes submodule sync / `full` = includes `/update-project`), `default-branch` (optional — branches allowed to pull, default `main`/`master`)
- **Tools**: `exec` — git commands `git status --porcelain`, `git fetch --prune`, `git pull --ff-only`, `git submodule update --init --recursive`, `git rev-list`, `git branch --show-current`, `git rev-parse`; `read`/`find_file_by_name` — check `package.json`, `.gitmodules`, `.devin`, `AGENTS.md`
- **Execute**:
  1. Verify `project-path` starts with `D:\` and is a git repo — if not, return `skipped`
  2. Run `git status --porcelain` and `git branch --show-current` — record dirty state and branch
  3. Run `git rev-list --left-right --count HEAD...@{upstream}` — record behind/ahead
  4. If dirty or not on the default branch → skip pull and return `skipped` with a reason
  5. If clean and behind → `git fetch --prune` then `git pull --ff-only`; conflicts → return `error` for the user to resolve manually
  6. In `submodules`/`full` mode with `.gitmodules` → `git submodule update --init --recursive`
  7. In `full` mode with `package.json`/`.devin`/`AGENTS.md` → run `/update-project`
  8. Record before/after commit hashes
- **Output**: a per-project field table `| Field | Value |` — Project, Path, Branch, Before, After, Action (`pull`/`pull+submodules`/`pull+update-project`/`skipped`), Status (`updated`/`skipped`/`error`/`already-latest`); give a reason when `skipped` or `error`
- **Constraints**: Scoped to `D:\` only — never touch other drives; no force pull, no `git push --force`, never `git push`/`git reset --hard`/`git clean`, never commit or push for the user; do not touch projects that are dirty or off the default branch; responsible for a single project — never touch other projects; idempotent — a project already at latest returns `already-latest` with nothing further

## Expected Outcome

- Every project under `D:\` is scanned
- Every clean project on its default branch is pulled to the latest remote
- Submodules are synced if mode `submodules` or `full` was chosen
- Project docs/config are updated if mode `full` was chosen
- No project with uncommitted changes is force-updated
- A summary report of every project's status as a table

