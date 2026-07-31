# Test Before Publish

ทดสอบก่อน publish packages

## Principle

ทดสอบ packages อย่างเหมาะสมก่อน publish เพื่อความมั่นใจในคุณภาพ

## Why Test Before Publish?

1. **Quality Assurance**: รับประกันคุณภาพ
2. **Catch Issues**: จับ issues ก่อน publish
3. **User Trust**: สร้างความไว้วางใจ
4. **Reduce Rollbacks**: ลดความจำเป็นต้อง rollback

## Testing Checklist

### Build Test
```bash
# Build packages
bun run build

# Verify build output
ls dist/
```

### Unit Tests
```bash
# Run unit tests
bun test

# Verify all tests pass
```

### Integration Tests
```bash
# Run integration tests
bun test:integration

# Verify all tests pass
```

### Linting
```bash
# Run linter
bun run lint

# Verify no lint errors
```

### Type Checking
```bash
# Run type check
bun run typecheck

# Verify no type errors
```

## Workflow

### Before Versioning
```bash
# 1. Run tests
bun test

# 2. Run lint
bun run lint

# 3. Run typecheck
bun run typecheck

# 4. Build
bun run build

# 5. Version
bunx changeset version
```

### Before Publishing
```bash
# 1. Build versioned packages
bun run build

# 2. Run tests on built packages
bun test

# 3. Verify changelog
cat CHANGELOG.md

# 4. Publish
bunx changeset publish
```

## CI/CD Integration

### Automated Testing
```yaml
- name: Test
  run: bun test

- name: Lint
  run: bun run lint

- name: Type Check
  run: bun run typecheck

- name: Build
  run: bun run build
```

### Pre-publish Checks
```yaml
- name: Pre-publish Test
  run: bun test

- name: Pre-publish Build
  run: bun run build

- name: Publish
  run: bunx changeset publish
```

## Best Practices

1. **Test Locally**: Test บน local ก่อน
2. **Run Full Suite**: Run tests ทั้งหมด
3. **Verify Build**: Verify build output
4. **Review Changelog**: Review changelog ก่อน publish

## Common Mistakes

### Skipping Tests
อย่า skip tests:
- Run tests ทุกครั้ง
- ใช้ CI/CD automation
- ไม่ publish ถ้า tests fail

### Partial Testing
อย่า test เฉพาะบางส่วน:
- Run full test suite
- Test ทั้ง unit และ integration
- Test ทั้ง lint และ typecheck

### Publishing Without Build
อย่า publish โดยไม่ build:
- Build ก่อน publish
- Verify build output
- Test built packages
