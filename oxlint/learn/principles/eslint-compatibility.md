# ESLint Compatibility

## Definition

Oxlint มี ESLint compatibility สูง:
- 800+ ESLint compatible rules
- Similar configuration format
- Similar CLI interface
- Easy migration

## Migration from ESLint

### Replace ESLint with Oxlint

```bash
# Remove ESLint
bun uninstall eslint

# Install Oxlint
bun install -D oxlint
```

### Update Config

```json
// .eslintrc.json → .oxlintrc.json
{
  "rules": {
    "no-console": "off",
    "no-debugger": "error"
  }
}
```

### Update Scripts

```json
// package.json
{
  "scripts": {
    "lint": "oxlint",
    "lint:fix": "oxlint --fix"
  }
}
```

## Differences

### Performance
- Oxlint: 50-100x faster
- ESLint: Slower

### Features
- Oxlint: Multi-file analysis, type-aware
- ESLint: Single-file, limited type-aware

### Ecosystem
- Oxlint: Growing ecosystem
- ESLint: Mature ecosystem

## Best Practices

1. **Test Migration**: Test migration ก่อน full switch
2. **Compare Results**: Compare results กับ ESLint
3. **Gradual Migration**: Migrate gradually
4. **Keep ESLint**: Keep ESLint สำหรับ plugins ที่ Oxlint ไม่รองรับ
