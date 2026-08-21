# Integration

การรวมกับ tools อื่นๆ

## ESLint

### Basic Integration
```yaml
pre-commit:
  commands:
    eslint:
      run: bun run lint
      files: git diff --name-only --cached
      glob: "*.js"
```

### ESLint with Fix
```yaml
pre-commit:
  commands:
    eslint:
      run: bun run lint --fix
      files: git diff --name-only --cached
      glob: "*.js"
```

## Prettier

### Basic Integration
```yaml
pre-commit:
  commands:
    prettier:
      run: bun run format
      files: git diff --name-only --cached
      glob: "*.{js,ts,css,md}"
```

### Prettier with Check
```yaml
pre-commit:
  commands:
    prettier:
      run: bun run format --check
      files: git diff --name-only --cached
      glob: "*.{js,ts,css,md}"
```

## Commitlint

### Basic Integration
```yaml
commit-msg:
  commands:
    commitlint:
      run: bunx commitlint --edit $1
```

### Commitlint with Lint
```yaml
commit-msg:
  commands:
    commitlint:
      run: bunx commitlint --edit $1
      pass_filenames: false
```

## Jest

### Basic Integration
```yaml
pre-commit:
  commands:
    test:
      run: bun test
```

### Jest with Coverage
```yaml
pre-commit:
  commands:
    test:
      run: bun test --coverage
```

## TypeScript

### Type Check
```yaml
pre-commit:
  commands:
    typecheck:
      run: bun run typecheck
      files: git diff --name-only --cached
      glob: "*.ts"
```

## Husky Migration

### From Husky
ถ้ามี Husky อยู่แล้ว:
```bash
# Uninstall Husky
bun uninstall husky

# Install Lefthook
bun add -D lefthook
bunx lefthook install
```

### Convert Config
แปลง Husky config เป็น Lefthook:
```yaml
# package.json (Husky)
"husky": {
  "hooks": {
    "pre-commit": "bun run lint"
  }
}

# lefthook.yml (Lefthook)
pre-commit:
  commands:
    lint:
      run: bun run lint
```

## CI/CD Integration

### GitHub Actions
```yaml
- name: Run Lefthook
  run: bunx lefthook run pre-commit
```

### GitLab CI
```yaml
script:
  - bunx lefthook run pre-commit
```

## Multiple Tools

### Combine ESLint + Prettier
```yaml
pre-commit:
  parallel: true
  commands:
    eslint:
      run: bun run lint
      files: git diff --name-only --cached
      glob: "*.js"
    prettier:
      run: bun run format
      files: git diff --name-only --cached
      glob: "*.{js,ts,css,md}"
```

### Full Stack
```yaml
pre-commit:
  parallel: true
  commands:
    eslint:
      run: bun run lint
      files: git diff --name-only --cached
      glob: "*.{js,ts}"
    prettier:
      run: bun run format
      files: git diff --name-only --cached
      glob: "*.{js,ts,css,md}"
    typecheck:
      run: bun run typecheck
      files: git diff --name-only --cached
      glob: "*.ts"
```
