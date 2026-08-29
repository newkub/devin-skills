# Git Branch CLI

## Install

```sh
git --version
```

## Version

- Latest
- Repository: https://git-scm.com/
- Docs: https://git-scm.com/docs/git-branch

## Commands

| commands | description | default | options |
|---|---|---|---|
| `git branch` | List local branches | — | -a, --all, -r, --remotes, -vv, --sort |
| `git branch <name>` | Create branch | — | (none) |
| `git branch -d <name>` | Delete merged branch | — | -D, --delete --force |
| `git branch -m <old> <new>` | Rename branch | — | (none) |
| `git branch -c <old> <new>` | Copy branch | — | (none) |
| `git switch <branch>` | Switch to branch | — | -c, --create, --orphan |
| `git checkout -b <branch>` | Create and switch branch | — | --track |
## Examples

```sh
git branch -a
```
```sh
git switch -c feature/x
```
```sh
git branch -d old-branch
```
