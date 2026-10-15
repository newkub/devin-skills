---
name: git-submodule
description: Manage git submodules — add/init/update/sync and pin commits correctly
argument-hint: "[add|init|update|status] [path]"
related:
  - convert-git-submodules
  - delete-git-submodules
  - git-push
  - git-commit
  - resolve-errors
---

## Goal

Keep submodules healthy — correct clone/init/update — with clearly pinned commits and no superproject pointer drift

## Scope

- `git submodule add`, `init`, `update`, `status`, `sync`, `foreach`
- workflows: cloning a repo that has submodules, adding a new submodule, updating a pin, fixing drift
- convert a skills repo into a submodule → `/convert-git-submodules`; remove → `/delete-git-submodules`

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

## Rules

- always push the submodule before the superproject — the pointer must reference an already-pushed commit
- the superproject stores only a commit sha — "update the submodule" = commit a new pointer in the superproject
- changes inside a submodule do not appear in the superproject diff until you `git add` it
- never edit a submodule and forget to push — `git push --recurse-submodules=check` guards against forgetting
- Use /resolve-errors if needed

## Expected Outcome

- submodules init/update exactly on their pins, no drift (`status` shows no `+`/`-`)
- after adding/editing a submodule, the pointer is committed in the superproject in the right order
