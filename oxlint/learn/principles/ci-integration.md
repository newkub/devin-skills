# CI Integration

## Description

เชื่อมต่อ Oxlint กับ CI/CD pipelines

## GitHub Actions

### Basic Setup

```yaml
name: Lint

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: bun ci
      - run: npx oxlint
```

### With Auto-fix

```yaml
- run: npx oxlint --fix
- run: git diff
- run: git config --global user.name "CI"
- run: git config --global user.email "ci@example.com"
- run: git commit -am "Auto-fix lint issues"
- run: git push
```

## GitLab CI

```yaml
lint:
  image: node:20
  script:
    - bun ci
    - npx oxlint
```

## Best Practices

1. **Fail Fast**: Fail CI บน lint errors
2. **Auto-fix**: Use auto-fix ใน CI
3. **Cache Dependencies**: Cache node_modules
4. **Report Results**: Report lint results
