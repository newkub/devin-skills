# Git History Safety Best Practices

Guidance for rewriting history, recovering work, and using dangerous commands safely — rebase, reset, revert, reflog

## Recommended Patterns

### 1. Rebase only your own branches

```bash
git rebase main              # move the feature branch onto the latest main
git rebase -i HEAD~3         # squash/reword the last 3 commits
```

- Golden rule: never rebase commits already pushed that others may build on — changed hashes wreck other people's history
- rebase before merge for linear history (if the team agrees)
- Many conflicts: `git rebase --abort` always works — don't push through when unsure

### 2. Revert for shared history, reset for local

| Situation | Use |
|---|---|
| wrong commit, not pushed yet | `git reset --soft HEAD~1` (keeps changes staged) |
| wrong commit already pushed | `git revert <sha>` — creates an inverse commit, no history rewrite |
| discard all working-tree changes | `git restore .` + `git clean -nd` (always dry-run first) |

- `git reset --hard` = permanent deletion — dry-run via `git stash` or a WIP commit first
- `git revert` is always safe on shared branches since it is a new commit

### 3. Reflog is the safety net

```bash
git reflog                   # every HEAD movement is recorded
git reset --hard HEAD@{3}    # go back to before a broken rebase
```

- reflog keeps ~90 days of HEAD movements — a wrong rebase/over-far reset is always recoverable
- Before a big rebase/reset: `git branch backup/xxx` or note the HEAD sha — recovery is harder without the original point

### 4. Bisect to find the bad commit

```bash
git bisect start
git bisect bad HEAD
git bisect good v1.0.0
# git checks out the midpoint — test, then mark good/bad until found
git bisect run npm test      # automate: bisect itself until the failing commit
git bisect reset
```

- `git bisect run <script>` automates the bisect — script exit 0 = good, non-zero = bad

## Do / Don't

| Do | Don't |
|---|---|
| `git push --force-with-lease` when a pushed branch must be rewritten | `git push --force` (silently overwrites others' work) |
| create a backup branch before an interactive rebase | rebase -i with no way back |
| use `git revert` to fix a commit on a shared branch | `git reset --hard` + force push on a shared branch |
| `git cherry-pick -n` when you want to review before committing | cherry-pick straight in and stack conflicts |
| run tests after rebase/merge/cherry-pick | assume code still works because the rebase succeeded |

## Common Pitfalls

- Force push overwriting a teammate's work: always use `--force-with-lease` — a bare `--force` never checks remote state
- Stuck mid-conflict in a rebase: `git status` shows you are mid-rebase — never make a normal commit during a rebase; use `--continue`/`--abort`/`--skip`
- `reset --hard` then files missing: untracked files are not in the reflog — permanently lost; commit or stash them first
- Mixing merge and rebase: rebase feature → main while someone merges main → feature → duplicate commits; agree on one strategy per branch
- Cherry-pick across branches creates duplicates: on merge-back git sees the same content in 2 commits — usually harmless but history reads badly

## Recovery Playbook

```bash
# find a commit lost by rebase/reset
git reflog
git reset --hard <sha>

# recover a file deleted in an old commit
git checkout <sha> -- path/to/file
git restore --source=<sha> path/to/file

# undo a merge not yet pushed
git merge --abort            # if still mid-merge
git reset --hard ORIG_HEAD   # if the merge completed
```
