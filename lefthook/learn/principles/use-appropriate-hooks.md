# Use Appropriate Hooks

ใช้ hooks ที่เหมาะสมกับ task

## Principle

ใช้ hooks ที่เหมาะสมกับ task เพื่อความมีประสิทธิภาพ

## Hook Types

### pre-commit
ใช้สำหรับ quick checks:
- Linting
- Formatting
- Quick tests
- File validation

**Example:**
```yaml
pre-commit:
  commands:
    lint:
      run: bun run lint
    format:
      run: bun run format
```

### pre-push
ใช้สำหรับ full tests:
- Full test suite
- Integration tests
- Build verification
- Security checks

**Example:**
```yaml
pre-push:
  commands:
    test:
      run: bun test
    build:
      run: bun run build
```

### commit-msg
ใช้สำหรับ message validation:
- Commit message validation
- Conventional commits
- Commit message formatting
- Ticket reference

**Example:**
```yaml
commit-msg:
  commands:
    conventional-commit:
      run: bunx commitlint --edit $1
```

## When to Use Each Hook

### pre-commit
- Quick checks (< 30s)
- Local validation
- Code quality

### pre-push
- Full tests (< 5 min)
- Integration tests
- Build verification

### commit-msg
- Message validation
- Formatting
- Reference checks

## Common Mistakes

### Running Full Tests in pre-commit
อย่ารัน full tests ใน pre-commit:
- ใช้ pre-commit สำหรับ quick checks
- ใช้ pre-push สำหรับ full tests
- ใช้ CI สำหรับ comprehensive tests

### No Hooks
อย่าไม่ใช้ hooks:
- ใช้ pre-commit สำหรับ basic validation
- ใช้ pre-push สำหรับ quality assurance
- ใช้ commit-msg สำหรับ consistency

## Best Practices

1. **pre-commit**: Quick checks only
2. **pre-push**: Full tests
3. **commit-msg**: Message validation
4. **Keep Fast**: Hooks ควรเร็ว
