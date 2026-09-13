# Git CLI

## Install

```sh
git --version # or package manager
```

## Version

- Latest: `2.55.0` (verified 2026-09-13)
- Repository: https://git-scm.com/
- Docs: https://git-scm.com/docs

## Commands

| commands | description | default | options |
|---|---|---|---|
| `git init` | Initialize repo | — | (none) |
| `git clone <repo>` | Clone repo | — | --depth, --branch, --recurse-submodules |
| `git add [paths]` | Stage changes | — | -A, --all, -p, --patch, -f, --force |
| `git commit` | Commit staged changes | — | -m, --message, -a, --all, --amend, --no-edit |
| `git push` | Push to default remote | — | -u, --set-upstream, --force-with-lease, --tags |
| `git pull` | Fetch and merge | — | --rebase, --ff-only, --no-ff |
| `git status` | Show working tree status | — | --short, --branch |
| `git log` | Show commit log | — | --oneline, --graph, --all, -n, --author |
| `git diff` | Show unstaged changes | — | --staged, --cached, --stat |
| `git checkout <ref>` | Switch branch or restore files | — | -b, --detach, --force |
| `git switch <branch>` | Switch branch (modern) | — | -c, --create, --detach |
| `git restore <file>` | Restore file from index/commit | — | --staged, --source |
| `git merge <branch>` | Merge branch | — | --ff, --no-ff, --squash, --abort |
| `git rebase <branch>` | Rebase current branch | — | -i, --continue, --abort |
| `git stash` | Stash changes temporarily | — | push, pop, apply, list, drop |
| `git cherry-pick <commit>` | Apply specific commit | — | -n, --no-commit, --continue |
| `git revert <commit>` | Create inverse commit | — | --no-edit, -n |
| `git tag` | List/create tags | — | -a, -m, -d, --list |
| `git clean` | Remove untracked files | — | -f, -d, -n (dry run), -x |
| `git remote` | Manage remotes | — | -v, add, remove, prune, rename |
| `git fetch` | Fetch from remote | — | --all, --prune, --tags |
| `git worktree` | Manage worktrees | — | add, list, remove |
| `git bisect` | Binary search for bad commit | — | start, bad, good, reset |
| `git blame <file>` | Show per-line authorship | — | -L, -w |

See also: [git-commands.md](git-commands.md) (full reference), [git-config.md](git-config.md) (config options), [git-libraries.md](git-libraries.md) (programmatic APIs)

## Examples

```sh
git add -A
```
```sh
git commit -m "feat: add x"
```
```sh
git push -u origin main
```
