# Best Practices

## Commit Messages

### Conventional Commits

ใช้ format มาตรฐาน:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **ci**: CI/CD changes
- **build**: Build system changes

### Examples

```
feat(auth): add login functionality

Implement user authentication with JWT tokens.
Includes login form, token validation, and session management.

Closes #123
```

```
fix(api): resolve null pointer exception

Handle null response from API endpoint gracefully.
Add proper error handling and user feedback.

Fixes #456
```

## Branching Strategy

### Git Flow

```
main (production)
  ↑
develop (integration)
  ↑
feature/* (new features)
release/* (release preparation)
hotfix/* (production fixes)
```

### GitHub Flow

```
main (production)
  ↑
feature/* (new features)
```

### Trunk-Based Development

```
main (production)
  ↑
short-lived feature branches
```

## Atomic Commits

แต่ละ commit ควร:
- ทำสิ่งเดียว (single responsibility)
- เล็กและ focused
- สามารถ review ได้ง่าย
- สามารถ revert ได้โดยไม่กระทบอย่างอื่น

❌ **Bad:**
```
feat: add user system and fix login bug and update docs
```

✅ **Good:**
```
feat(user): add user registration
fix(auth): resolve login timeout
docs: update API documentation
```

## Commit Frequency

- Commit บ่อยๆ (small, frequent commits)
- ไม่ควรรอจน feature ใหญ่เสร็จ
- Commit ทุกครั้งที่มี logical unit เสร็จ
- ช่วยให้ debug และ revert ง่ายขึ้น

## Branch Naming

ใช้ naming convention ที่ชัดเจน:

```
feature/description
bugfix/description
hotfix/description
release/version
docs/description
refactor/description
```

Examples:
```
feature/user-authentication
bugfix/login-timeout
hotfix/security-patch
release/v1.2.0
docs/api-readme
refactor/user-service
```

## Pull Request Guidelines

### Title
- ใช้ conventional commit format
- อธิบายสิ่งที่ PR ทำอย่างชัดเจน
- ไม่ยาวเกินไป

### Description
- อธิบาย why และ what
- รวม screenshots ถ้าเกี่ยวกับ UI
- Link ไปยัง issues ที่เกี่ยวข้อง
- Checklist สำหรับ review

### Review
- Request review จากทีมที่เกี่ยวข้อง
- ไม่ merge เองถ้ามี reviewers
- Address comments ทั้งหมด
- Squash commits ก่อน merge

## .gitignore

เพิ่มไฟล์ที่ไม่ควร track:

```
# Dependencies
node_modules/
vendor/

# Build outputs
dist/
build/
*.exe
*.dll

# Environment files
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
bun-debug.log*
yarn-debug.log*
```

## Security

- ไม่ commit secrets (API keys, passwords)
- ใช้ environment variables
- ใช้ `.env.example` เป็น template
- Scan secrets ด้วย tools
- Use signed commits สำหรับ critical projects

## Backup

- Push ไป remote บ่อยๆ
- ใช้ multiple remotes
- Tag releases
- Backup .git directory
- Use GitHub/GitLab backup features
