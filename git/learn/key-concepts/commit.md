# Commit

## Definition

Commit คือ snapshot ของ project ในช่วงเวลาหนึ่ง:
- มี unique ID (SHA-1 hash)
- มี author, timestamp, และ commit message
- บันทึกการเปลี่ยนแปลงทั้งหมด
- สามารถ revert กลับได้ทุกเมื่อ

## Commit Structure

```
commit abc123def456...
Author: John Doe <john@example.com>
Date:   Mon Jan 1 12:00:00 2024 +0700

    Add user authentication

    Implement JWT-based authentication with login form
    and token validation.
```

## Creating Commits

```bash
# Stage all changes
git add .

# Stage specific file
git add filename.txt

# Commit with message
git commit -m "Add feature"

# Commit with detailed message
git commit -m "Add feature

Detailed description of what was changed
and why it was necessary."

# Amend last commit
git commit --amend

# Amend last commit message
git commit --amend -m "New message"
```

## Commit Message Format

### Conventional Commits

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation
- **style**: Formatting
- **refactor**: Code refactoring
- **perf**: Performance
- **test**: Tests
- **chore**: Maintenance

### Example

```
feat(auth): add login functionality

Implement user authentication with JWT tokens.
Includes login form, token validation, and session management.

Closes #123
```

## Viewing Commits

```bash
# View commit history
git log

# View commit with diff
git log -p

# View specific commit
git show abc123

# View commit stats
git log --stat

# View graph
git log --graph --oneline
```

## Reverting Commits

```bash
# Revert commit (create new commit)
git revert abc123

# Reset to commit (destructive)
git reset --hard abc123

# Reset to commit (keep changes)
git reset --soft abc123
```

## Best Practices

- Atomic commits (ทำสิ่งเดียวต่อ commit)
- Meaningful messages
- Commit บ่อยๆ
- Review ก่อน commit
- ไม่ commit broken code
- ไม่ commit sensitive data
