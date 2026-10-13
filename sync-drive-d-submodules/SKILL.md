---
name: sync-drive-d-submodules
description: Sync and update git submodules in the D drive against their remote repositories
argument-hint: "[scope]"
related:
  - convert
  - delete
  - list-git

---

## Goal

Safely sync and update all git submodules in the D drive to their latest remote version

## Scope

For syncing and updating git submodules across multiple repositories in the D drive only

## Execute

### 1. Scan Drive D For Submodules

> Goal: Scan Drive D For Submodules

Find all repositories in drive D that contain git submodules

1. Use `find` or `fd` to locate `.gitmodules` files in D:\
2. Keep only paths under drive D (`D:` or `/mnt/d` for WSL)
3. Verify that each repository actually has active submodules
4. Build a list of the repositories that need updating

### 2. Validate Submodule Status

> Goal: Validate Submodule Status

Check the current status of each submodule

1. Run `git submodule status` to see the current commit
2. Verify the submodules have no uncommitted changes
3. Verify no submodule is in a detached HEAD state with local changes
4. Record the pre-update state so you can roll back if needed

### 3. Find Matching Submodules

> Goal: Find Matching Submodules

Find identical submodules shared across multiple repos in the D drive

1. Inspect each repo's submodules via `.gitmodules`
2. Compare submodule URLs across repos
3. Identify submodules that need syncing and have matching URLs

### 4. Update Submodules Remote

> Goal: Update Submodules Remote

Update submodules to their latest remote version

1. Run `git submodule update --remote --recursive` to fetch the latest changes
2. Run `git submodule update --init --recursive` to initialize new submodules
3. Verify each submodule updated successfully with no conflicts
4. If there are conflicts, report them and skip to the next one

### 5. Verify Updates

> Goal: Verify Updates

Confirm the submodules were updated correctly

1. Run `git submodule status` again to confirm the new commits
2. Verify the submodules can initialize and update
3. Test build or run tests if available
4. Report the result for each repository update

### 6. Commit Changes

> Goal: Commit Changes

Commit submodule updates if desired

1. Review changes with `git status`
2. Use `git add <submodule-path>` to stage changes
3. Write a commit message describing the update
4. Push changes to the remote if needed

### Subagents

> Goal: parallelize sync when there are multiple independent submodules

- Use the `submodule-syncer` profile (see `## Subagents` below) in Step 4 when drive D has multiple submodules/repos that can be updated independently — spawn one per submodule via `/use-subagents`, then merge the statuses (updated/skipped/conflict/error) before verify and commit in Steps 5-6
- If a submodule has nested dependencies that must be updated in order → run sequentially, don't spawn

## Rules

### 1. Drive D Scope Only

- Operate only on repositories located in drive D
- Filter paths starting with `D:` or `/mnt/d` (WSL)
- Never touch repositories on other drives without permission
- Verify the drive letter before every execution

### 2. Safety First

- Always check for uncommitted changes before updating
- If local changes are found, skip and report
- Never use `--force` flags unless truly necessary
- Create a backup or stash changes when needed

### 3. Recursive Updates

- Always use the `--recursive` flag for complex submodule trees
- Check nested submodules at each level
- Report issues specific to nested submodules clearly

### 4. Batch Processing

- Use loops to process each repository
- Show progress while working
- Give a final summary of all results when done
- Never stop the whole batch because one repository failed

### 5. Error Handling

- Handle detached HEAD states
- Handle merge conflicts in submodules
- Handle network errors
- Use retries for failed updates

- Use /convert-git-submodules if needed
- Use /delete-git-submodules if needed
- Use /list-git-submodules if needed

## Subagents

> Goal: independent work that can be spawned in parallel — profiles live in this section, no separate files needed

### submodule-syncer — sync a single git submodule in drive D to its latest remote and report its status

- **Inputs**: `repo-path` (path of the repo on drive D, e.g. `D:\projects\app`), `submodule-path` (path of the single submodule within the repo, e.g. `libs/shared`), `branch` (optional — the remote branch to track, e.g. `main` — defaults per `.gitmodules`), `commit` (optional — `true` if the parent wants the update staged/committed in the main repo)
- **Tools**: `exec` — git commands `git submodule status`, `git submodule update --remote`, `git status`, `git diff`; `read` — read `.gitmodules` and config; `edit`/`write` forbidden — everything goes through git commands only
- **Execute**:
  1. Confirm `repo-path` is on drive D (`D:` or `/mnt/d`) — otherwise return `error` immediately
  2. Record the pre-update state: `git submodule status <submodule-path>` and check for uncommitted changes in the submodule
  3. If the submodule has local changes or a detached HEAD with pending work → return `skipped` with a reason, never force
  4. Run `git submodule update --remote <submodule-path>` and check for conflicts
  5. Verify: `git submodule status` again, confirm the new commit and that the main repo shows the pointer diff
  6. If `commit` = `true` → `git add <submodule-path>` with a commit message describing the update (no push)
- **Output**: status table `| No. | Submodule | Repo | Before | After | Status |` — `status`: `updated`/`already-current`/`skipped`/`conflict`/`error` with details; state the committed status `staged`/`committed`/`uncommitted` per the `commit` input; on `conflict`/`error` → attach the git output, the cause, and rollback advice
- **Constraints**: responsible for one submodule only, never touch other submodules/repos; drive D only — paths outside drive D return `error`; no `--force`, `git checkout -f`, or discarding local changes — on finding changes, return `skipped`; never push to remote — the parent decides to push after merging results; on network error → retry up to 2 rounds then return `error`

## Expected Outcome

- All git submodules in drive D updated to their latest remote version
- All matching repos updated and synced
- No data lost or corrupted during the update
- Changes committed and pushed
- Result reported for each repository update