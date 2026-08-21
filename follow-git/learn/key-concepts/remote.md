# Remote

## Definition

Remote คือ repository บน server:
- ใช้สำหรับ collaboration
- Backup และ sharing
- CI/CD integration
- Code review ผ่าน Pull Requests

## Common Remotes

- **GitHub**: git@github.com:user/repo.git
- **GitLab**: git@gitlab.com:user/repo.git
- **Bitbucket**: git@bitbucket.org:user/repo.git

## Adding Remotes

```bash
# Add remote
git remote add origin https://github.com/user/repo.git

# Add remote with SSH
git remote add origin git@github.com:user/repo.git

# Add multiple remotes
git remote add upstream https://github.com/original/repo.git
git remote add fork https://github.com/yourname/repo.git
```

## Viewing Remotes

```bash
# List remotes
git remote

# List remotes with URLs
git remote -v

# Show remote details
git remote show origin
```

## Removing Remotes

```bash
# Remove remote
git remote remove origin

# Rename remote
git remote rename origin new-origin
```

## Pushing to Remote

```bash
# Push current branch
git push origin main

# Push all branches
git push --all origin

# Push with upstream tracking
git push -u origin main

# Force push (dangerous)
git push --force origin main

# Force with lease (safer)
git push --force-with-lease origin main
```

## Pulling from Remote

```bash
# Pull current branch
git pull origin main

# Pull with rebase
git pull --rebase origin main

# Fetch without merging
git fetch origin

# Fetch all remotes
git fetch --all
```

## Syncing with Upstream

```bash
# Fetch upstream
git fetch upstream

# Merge upstream changes
git merge upstream/main

# Or rebase
git rebase upstream/main
```

## Remote Branches

```bash
# List remote branches
git branch -r

# Checkout remote branch
git checkout -b local-branch origin/remote-branch

# Track remote branch
git branch --set-upstream-to=origin/main main
```

## Best Practices

- ใช้ SSH แทน HTTPS สำหรับ security
- Push บ่อยๆ เพื่อ backup
- ไม่ force push บน shared branches
- ใช้ upstream สำหรับ open source
- Review ก่อน push
- ใช้ branch protection rules
