# Features

## Core Features

### Distributed Version Control
- ทุกคนมี full copy ของ repository
- ทำงาน offline ได้
- ไม่มี single point of failure
- Fast local operations

### Branching and Merging
- Cheap และ fast branch creation
- Easy merge ด้วย automatic merge
- Advanced conflict resolution
- Multiple branch strategies

### Staging Area
- Selective commits
- Review ก่อน commit
- Partial commits
- Amend commits

### History Tracking
- Complete history ของทุกการเปลี่ยนแปลง
- Blame ดูว่าใครแก้อะไร
- Bisect หา bug
- Revert การเปลี่ยนแปลง

## Advanced Features

### Rebasing
- Rewrite history
- Clean linear history
- Interactive rebase
- Squash commits

### Stashing
- Save work in progress
- Switch branches โดยไม่ commit
- Multiple stashes
- Apply stashes

### Tagging
- Mark important commits
- Release versions
- Lightweight vs annotated tags
- Signed tags

### Submodules
- Include other repositories
- Track dependencies
- Nested repositories
- Independent versioning

### Hooks
- Automate workflows
- Pre-commit checks
- Post-commit actions
- Custom scripts

### LFS (Large File Storage)
- Store large files efficiently
- Binary files
- Media files
- Reduce repository size

## Collaboration Features

### Pull Requests
- Code review
- Discussion
- CI/CD integration
- Approval workflows

### Forking
- Contribute to open source
- Independent development
- Sync with upstream
- Custom workflows

### Protected Branches
- Enforce rules
- Required reviews
- Status checks
- Prevent force push

## Performance Features

### Shallow Clones
- Clone without full history
- Faster clone
- Less disk space
- Good for CI/CD

### Partial Clone
- Clone specific files
- On-demand fetching
- Reduce bandwidth
- Large monorepos

### Pack Files
- Compressed storage
- Efficient transfer
- Delta compression
- Garbage collection
