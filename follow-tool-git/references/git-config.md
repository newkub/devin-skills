# Configuration Reference

## Git Configuration Options

### Configuration Levels

| Level | Command | File Path |
|-------|---------|-----------|
| System | `git config --system` | `/etc/gitconfig` |
| Global | `git config --global` | `~/.gitconfig` |
| Local | `git config --local` | `.git/config` |

### User Identity

| Option | Command | Description |
|--------|---------|-------------|
| Username | `git config --global user.name "Name"` | ชื่อสำหรับ commits |
| Email | `git config --global user.email "email"` | Email สำหรับ commits |
| Signing key | `git config --global user.signingkey <id>` | GPG key สำหรับ signing |

### Editor

| Option | Command |
|--------|---------|
| VS Code | `git config --global core.editor "code --wait"` |
| Vim | `git config --global core.editor "vim"` |
| Neovim | `git config --global core.editor "nvim"` |
| Nano | `git config --global core.editor "nano"` |
| Sublime | `git config --global core.editor "subl -w"` |

### Line Endings

| OS | Command |
|----|---------|
| Windows | `git config --global core.autocrlf true` |
| macOS/Linux | `git config --global core.autocrlf input` |

### Aliases

```bash
# Status & Info
git config --global alias.st "status"
git config --global alias.sp "status -s"
git config --global alias.cl "clean"

# Branching
git config --global alias.co "checkout"
git config --global alias.cb "checkout -b"
git config --global alias.br "branch"
git config --global alias.brd "branch -d"
git config --global alias.brD "branch -D"

# Commit
git config --global alias.cm "commit"
git config --global alias.cma "commit --amend"
git config --global alias.cms "commit -S"

# Remote
git config --global alias.rem "remote"
git config --global alias.pull "pull --rebase"

# Log
git config --global alias.lg "log --oneline --graph --decorate"
git config --global alias.lga "log --oneline --graph --decorate --all"
git config --global alias.last "log -1 HEAD"

# Diff
git config --global alias.d "diff"
git config --global alias.dc "diff --cached"
git config --global alias.dw "diff --word-diff"

# Reset
git config --global alias.unstage "reset HEAD --"
git config --global alias.undo "reset --soft HEAD^"

# Stash
git config --global alias.stash-list "stash list"
git config --global alias.stash-pop "stash pop"
```

### Colors

| Option | Command |
|--------|---------|
| Enable colors | `git config --global color.ui auto` |
| Disable colors | `git config --global color.ui never` |
| Colored diff | `git config --global color.diff auto` |
| Colored branch | `git config --global color.branch auto` |
| Colored status | `git config --global color.status auto` |

### Push

| Option | Command | Default |
|--------|---------|---------|
| Current branch | `git config --global push.default current` | simple |
| Matching branches | `git config --global push.default matching` | manual |
| Upstream | `git config --global push.default upstream` | GitHub |
| Nothing | `git config --global push.default nothing` | none |

### Pull

| Option | Command |
|--------|---------|
| Rebase by default | `git config --global pull.rebase true` |
| Merge by default | `git config --global pull.rebase false` |
| FF only | `git config --global pull.ff only` |

### Merge

| Option | Command |
|--------|---------|
| Fast-forward only | `git config --global merge.ff false` |
| Always create merge commit | `git config --global merge.commit yes` |
| Include renames | `git config --global merge.rename true` |

### Rebase

| Option | Command |
|--------|---------|
| Auto-stash | `git config --global rebase.autostash true` |
| Auto-squash | `git config --global rebase.autosquash true` |

### Credential

| Option | Command | Description |
|--------|---------|-------------|
| Cache | `git config --global credential.helper cache` | เก็บ 15 นาที |
| Store | `git config --global credential.helper store` | เก็บถาวร |
| Manager | `git config --global credential.helper manager` | Windows |
| Timeout | `git config --global credential.helper "cache --timeout 3600"` | 1 ชม. |

### Other Useful Options

```bash
# Default branch name
git config --global init.defaultBranch main

# Exclude large files
git config --global filter.lfs.clean "git-lfs clean -- %f"
git config --global filter.lfs.smudge "git-lfs smudge -- %f"
git config --global filter.lfs.process "git-lfs filter-process"

# Ignore case in paths
git config --global core.ignorecase false

# Add files automatically
git config --global add.rename true

# Show changed files in log
git config --global log.decorate auto

# Use -/+ instead of -> for renames
git config --global diff.renameLimit 2000

# Pager settings
git config --global core.pager "less -FRX"

# Abort on merge conflicts
git config --global merge.conflictstyle "merge"
git config --global merge.tool "code"

#rerere (reuse recorded resolutions)
git config --global rerere.enabled true

# Show untracked files
git config --global status.showUntrackedFiles all
```

### Viewing Configuration

```bash
# Show all config
git config --list

# Show specific config
git config user.name
git config user.email
git config core.editor

# Show config with origin
git config --show-origin user.name
git config --list --show-origin

# Edit global config
git config --global --edit

# Edit local config
git config --local --edit
```
