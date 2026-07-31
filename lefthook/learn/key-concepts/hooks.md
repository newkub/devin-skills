# Hooks

Git hooks ใน Lefthook

## What are Hooks?

Hooks คือ scripts ที่รันเมื่อ Git events เกิดขึ้น:
- pre-commit: รันก่อน commit
- pre-push: รันก่อน push
- commit-msg: ตรวจสอบ commit message
- post-commit: รันหลังจาก commit
- และอื่นๆ

## Standard Hooks

### pre-commit
รันก่อน commit:
```yaml
pre-commit:
  commands:
    lint:
      run: bun run lint
```

ใช้สำหรับ:
- Linting
- Formatting
- Quick tests

### pre-push
รันก่อน push:
```yaml
pre-push:
  commands:
    test:
      run: bun test
```

ใช้สำหรับ:
- Full test suite
- Integration tests
- Build verification

### commit-msg
ตรวจสอบ commit message:
```yaml
commit-msg:
  commands:
    conventional-commit:
      run: bunx commitlint --edit $1
```

ใช้สำหรับ:
- Commit message validation
- Conventional commits
- Commit message formatting

### post-commit
รันหลังจาก commit:
```yaml
post-commit:
  commands:
    notify:
      run: bun run notify
```

ใช้สำหรับ:
- Notifications
- Logging
- Documentation updates

## Custom Hooks

### pre-rebase
รันก่อน rebase:
```yaml
pre-rebase:
  commands:
    check:
      run: bun run check
```

### post-rewrite
รันหลังจาก rewrite:
```yaml
post-rewrite:
  commands:
    notify:
      run: bun run notify
```

## Hook Execution Order

1. pre-commit
2. prepare-commit-msg
3. commit-msg
4. post-commit
5. pre-push
6. post-checkout
7. post-merge

## Best Practices

1. **Use pre-commit**: สำหรับ quick checks
2. **Use pre-push**: สำหรับ full tests
3. **Use commit-msg**: สำหรับ message validation
4. **Keep Fast**: Hooks ควรเร็ว
