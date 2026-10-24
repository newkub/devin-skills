---
name: git-submodule
description: Manage git submodules — add, init, update, list, remove with correctly pinned commits
argument-hint: "[add|init|update|list|remove] [path]"
related:
  - convert-git-submodules
  - git-commit
  - resolve-errors
  - report
---

## Goal

Keep submodules healthy — correct add/init/update, complete listing, safe removal — with clearly pinned commits and no superproject pointer drift

## Scope

Dispatch by argument:

| Argument | Flow |
|---|---|
| `add <url> <path>` (default) | steps 1, 3–4 |
| `init` / `update` | step 2 |
| `list` | step 5 — read-only submodule table |
| `remove <path>` | step 6 — full removal flow |
| convert a repo into a submodule | → `/convert-git-submodules` |

## Execute

### 1. Assess State

> Goal: know which state the submodules are in

1. `git submodule status` — `-` prefix = not yet init'ed, `+` = HEAD does not match the pin, ` ` = matches
2. `cat .gitmodules` — review the path/url mappings
3. if a submodule has pending changes → handle them inside it (it is its own repo)

### 2. Init And Update

> Goal: submodules checkout exactly the superproject's pins

```bash
git submodule update --init --recursive   # first clone / after pull
git submodule update --remote <path>      # move to remote tip (changes the pin)
git submodule foreach 'git status'        # check every one
```

1. always after clone/pull: `git submodule update --init --recursive`
2. `--remote` = change the pin to the remote tip — that is a decision, not a sync; commit the pointer in the superproject afterwards

### 3. Add Submodule

> Goal: the new submodule is tracked correctly

1. `git submodule add <url> <path>` — verify `.gitmodules` + `.git/modules/` were created
2. commit both `.gitmodules` and the gitlink (directory entry) together — never split them
3. use a URL collaborators can access (HTTPS for public, SSH per the repo convention)

### 4. Work Inside Submodule

> Goal: after editing inside the submodule, the superproject pin is updated

1. `cd <submodule>` → it is an independent repo: branch, commit, push as usual
2. back in the superproject: `git add <submodule>` to pin the new commit, then commit
3. push order: submodule first → then superproject — a superproject pointer to a commit missing on the remote = broken clones

### 5. List Submodules (mode `list`)

> Goal: a complete read-only inventory — path, URL, branch, commit, status

1. `git submodule status --recursive` — record `SHA`, `path`, commit message; `-` prefix → mark `(not initialized)`; no `.gitmodules` → report "no submodules" and stop
2. `git config --file .gitmodules --get-regexp url` — map each URL to its path by submodule name
3. for each path: `git -C <path> rev-parse --abbrev-ref HEAD` — detached HEAD → mark `detached`
4. for each path: `git -C <path> status --porcelain` — mark `clean` or `dirty` with the count of modified/untracked files
5. report via `/report` with columns `No. | Path | URL | Branch | Commit | Status` (bullet list when few entries)
6. never modify anything and use `git -C <path>` instead of `cd`

### 6. Remove Submodule (mode `remove`)

> Goal: completely remove the submodule from `.gitmodules`, `.git/config`, `.git/modules`, and the working tree

1. safety checks first: `git -C <path> status --porcelain` must be clean (stop and ask if not); grep the repo for other references to `<path>`; in a monorepo check no other workspace uses it
2. `git submodule deinit -f <path>` — always deinit before anything else
3. remove the submodule entry from `.gitmodules` and from `.git/config`; if no submodules remain, delete `.gitmodules` entirely
4. `git rm -f <path>` — verify the working-tree folder is gone
5. remove `.git/modules/<path>` — Windows `Remove-Item .git/modules/<path> -Recurse -Force`, macOS/Linux `rm -rf .git/modules/<path>` — only after the working tree is removed
6. commit the removal via `/git-commit`, then run `git gc` as the final step
7. verify: `git submodule status` lists nothing for the path and no references remain

## Rules

### 1. Pin Discipline

- always push the submodule before the superproject — the pointer must reference an already-pushed commit
- the superproject stores only a commit sha — "update the submodule" = commit a new pointer in the superproject
- changes inside a submodule do not appear in the superproject diff until you `git add` it
- never edit a submodule and forget to push — `git push --recurse-submodules=check` guards against forgetting

### 2. Removal Safety

- removal is destructive: preview the four targets (`.gitmodules`, `.git/config`, `.git/modules`, working tree) and confirm before executing
- never remove a submodule with uncommitted changes — handle them inside it first
- order of operations is fixed: deinit → config files → `git rm -f` → `.git/modules` → commit → `git gc`
- complete cleanup or it is not done: every part removed, `git gc` runs last

- Use /convert-git-submodules if the target is a repo to convert, not a submodule to manage
- Use /resolve-errors if needed
- Use /report if needed

## Expected Outcome

- submodules init/update exactly on their pins, no drift (`status` shows no `+`/`-`)
- after adding/editing a submodule, the pointer is committed in the superproject in the right order
- `list` returns the full table with no side effects
- `remove` leaves no references in `.gitmodules`, `.git/config`, `.git/modules`, or the working tree
