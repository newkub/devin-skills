---
name: cleanup-disk-computer
description: Delete unnecessary files and caches on the machine by running the global mise cleanup task
argument-hint: "[target]"
related:
  - report-idea-cleanup-files-in-computer
  - follow-tool-mise
  - alternative
  - delete
  - report
  - run-clean
  - run-cleanup
---

## Goal

Run the global `mise run cleanup` task to reclaim disk space from caches, temp files, logs, and old artifacts

## Scope

- The task lives in the global mise config (`~/.config/mise/config.toml` or `~/.config/mise.toml`)
- If `[tasks.cleanup]` exists → inspect it, then run it as-is
- If it does not exist → create it from the template in step 3, then run it
- Never delete source code, configs, secrets, or personal files

## Execute

### 1. Detect The Global Task

> Goal: find mise, the global config, and the existing `[tasks.cleanup]` body

1. Run `mise --version`; stop and report if mise is missing
2. Run the tool registry check `mise config ls` (or `mise config`) to locate the global config file
3. Check for the task: `mise tasks ls | grep -x 'cleanup'`
4. Record the task body: `mise tasks info cleanup`, or read the `[tasks.cleanup]` block in the global config
5. If no task exists → go to step 3; otherwise skip to step 2

### 2. Preview Before Running

> Goal: show exactly what will be deleted and get confirmation before any deletion

1. Show the resolved task body (every command that will execute) — the task has no `--dry-run` flag, so the body is the preview
2. List the commands that are unavailable on this machine (e.g. `devp`, `scoop`, `uv`, `pnpm`) — the task should skip them gracefully
3. Check free space before: `Get-PSDrive C,D` on Windows; `df -h` on macOS/Linux
4. Summarize what will be cleaned and ask for confirmation unless the run is already authorized
5. If declined → stop and report without running

### 3. Create The Task Only When Missing

> Goal: Add `[tasks.cleanup]` to the global mise config — never overwrite an existing one

1. Detect available package managers: `bun`, `pnpm`, `npm`, `pip`, `uv`, `scoop`, `cargo`, `mise`
2. Keep only the cleanup commands whose tool exists; use each tool's own command:

   | Tool | Command |
   | --- | --- |
   | mise | `mise cache clear`, `mise prune --yes` |
   | bun | `bun pm cache rm` |
   | npm | `npm cache clean --force` |
   | pnpm | `pnpm store prune` |
   | uv | `uv cache clean` |
   | pip | `python -m pip cache purge` |
   | scoop | `scoop cleanup *`, `scoop cache rm *` |
   | cargo | `cargo sweep -r ~` (only if `cargo-sweep` is installed) |

3. Write the block to the global config with the platform shell (`pwsh -NoProfile -Command` on Windows):

   ```toml
   [tasks.cleanup]
   description = "clean development artifacts and caches"
   shell = "pwsh -NoProfile -Command"
   run = '''
   <detected commands, one per line>
   '''
   ```

4. Re-run `mise tasks ls` to confirm the task is registered

### 4. Run Cleanup

> Goal: execute the confirmed task and record every command outcome

1. Execute `mise run cleanup`
2. Capture the exit code and the output of each command in the task
3. Continue on individual failures; record every skipped or failed command
4. Stop only when `mise` itself cannot start the task

### 5. Validate

> Goal: prove the space was reclaimed without breaking installed tools

1. Check free space after with the same command used in step 2 and compute the delta
2. Run `mise ls` to confirm installed tools are intact
3. Report: commands run, space reclaimed, commands skipped or failed, exit code
4. For a deeper breakdown use `/report` or `/report-idea-cleanup-files-in-computer`

## Rules

### 1. Existing Task Wins

- If `[tasks.cleanup]` exists, run it as-is; do not rewrite or "improve" it
- Edit the task only when the user explicitly asks
- Never edit a project-level `mise.toml`; only the global config

### 2. Preview And Confirm

- Always show the task body (or the generated commands) before running
- Never run a destructive cleanup without confirmation, unless the user already authorized this run in the same request
- No `rm -rf` on cache directories — always use the tool's own cleanup command

### 3. Safe Targets

- Delete only caches, temp files, logs, and old artifacts
- Never delete source code, `.env`, secrets, credentials, or personal files
- Never delete system directories such as `C:\Windows` or `C:\Program Files`
- Never delete `.mise` files or `~/.local/share/mise` directly

### 4. Determinism

- Same task body and machine state → same commands run
- Report skipped tools instead of installing them during cleanup
- If mise or the global config is unavailable → stop and report the resolved paths

- Use `/follow-tool-mise` if needed
- Use `/alternative` when choosing cleanup commands
- Use `/run-clean` for project-scoped build artifacts and cache
- Use `/run-cleanup` if needed

## Expected Outcome

- The global `[tasks.cleanup]` is detected and run via `mise run cleanup`
- If missing, the task is created from the template and registered
- A report lists commands run, space reclaimed, and failures
- No source files, configs, secrets, or system directories touched
