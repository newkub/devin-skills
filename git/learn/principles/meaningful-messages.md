# Meaningful Messages

## Definition

Meaningful commit message คือ:
- อธิบายสิ่งที่ commit ทำอย่างชัดเจน
- ใช้ format มาตรฐาน
- ให้ context เพียงพอ
- ช่วยในการ review และ debugging

## Conventional Commits

### Format

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

### Scopes

Scopes คือ module หรือ component ที่ได้รับผลกระทบ:
- auth, user, api, ui, database, etc.
- ใช้เพื่อ categorize changes
- ไม่บังคับ แต่แนะนำ

### Subject

- ใช้ imperative mood ("add" ไม่ใช่ "added")
- ไม่ต้องมี period ท้าย
- ไม่เกิน 50 characters
- อธิบายสิ่งที่ commit ทำ

### Body

- อธิบาย what และ why
- ไม่ต้องอธิบาย how
- แต่ละบรรทัดไม่เกิน 72 characters
- ใช้ bullet points สำหรับหลายจุด

### Footer

- Reference issues
- Breaking changes
- Co-authored-by

## Examples

### Good Examples

```
feat(auth): add login functionality

Implement JWT-based authentication with login form
and token validation. Includes session management
and automatic token refresh.

Closes #123
```

```
fix(api): resolve null pointer exception

Handle null response from API endpoint gracefully.
Add proper error handling and user feedback.

Fixes #456
```

```
docs: update API documentation

Add examples for new endpoints and clarify
authentication requirements.

BREAKING CHANGE: API v1 is deprecated
```

### Bad Examples

```
update
```
- ไม่ชัดเจนว่า update อะไร

```
fix bug
```
- ไม่บอกว่า bug อะไร
- ไม่มี context

```
add stuff and fix things
```
- ทำหลายอย่างใน commit เดียว
- ไม่ชัดเจน

```
feat: add user authentication system with login form and registration and password reset and email verification and token management and session handling
```
- Subject ยาวเกินไป
- ทำหลายอย่างใน commit เดียว

## Guidelines

### 1. Be Specific
❌ "fix bug"
✅ "fix(auth): resolve login timeout"

### 2. Explain Why
❌ "add function"
✅ "add(validate): implement email validation to prevent invalid addresses"

### 3. Use Imperative Mood
❌ "added feature"
✅ "add(feature): implement new feature"

### 4. Keep Subject Short
❌ "implement user authentication system with login and registration"
✅ "feat(auth): add user authentication"

### 5. Reference Issues
❌ "fix bug"
✅ "fix(api): resolve null pointer (Fixes #123)"

## Templates

### Feature
```
feat(scope): description

Detailed description of the feature.
Explain why it's needed and how it works.

Closes #123
```

### Bug Fix
```
fix(scope): description

Explain the bug and how it was fixed.
Include context about the issue.

Fixes #456
```

### Documentation
```
docs(scope): description

Describe what documentation was added
or updated and why.

Ref #789
```

### Breaking Change
```
feat(scope): description

Description of the change.

BREAKING CHANGE: Describe what breaks and migration path
```

## Best Practices

1. **Write in Present Tense**: "add" ไม่ใช่ "added"
2. **Keep Subject Short**: ไม่เกิน 50 characters
3. **Capitalize Subject**: ตัวอักษรแรกตัวใหญ่
4. **No Period in Subject**: ไม่ใส่ period ท้าย subject
5. **Use Body for Details**: อธิบายรายละเอียดใน body
6. **Reference Issues**: Link ไปยัง issues ที่เกี่ยวข้อง
7. **Review Before Commit**: Check message ก่อน commit
