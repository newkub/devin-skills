# Git CLI

## Install

```sh
git --version # or package manager
```

## Version

- Latest
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
| `git merge <branch>` | Merge branch | — | --ff, --no-ff, --squash |
| `git rebase <branch>` | Rebase current branch | — | -i, --continue, --abort |
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
