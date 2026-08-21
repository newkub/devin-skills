# Features

Features ทั้งหมดของ Lefthook

## Core Features

### Fast Execution
- เขียนด้วย Go (รวดเร็ว)
- Parallel execution
- Efficient file watching

### Multi-Language Support
- Node.js
- Ruby
- Python
- Go
- และอื่นๆ

### Remote Configs
- Extend from remote repositories
- Share configs ทั่ว organization
- Maintain consistency

### File Filtering
- GLOB patterns
- Git diff patterns
- Conditional execution

## Hook Types

### Standard Hooks
- pre-commit
- pre-push
- commit-msg
- post-commit
- post-merge
- post-checkout

### Custom Hooks
- pre-rebase
- post-rewrite
- และอื่นๆ

## Configuration Features

### Parallel Execution
```yaml
pre-commit:
  parallel: true
```

### Skip Execution
```yaml
pre-commit:
  skip:
    - merge
    - rebase
```

### Stage Staged
```yaml
pre-commit:
  commands:
    lint:
      run: bun run lint
      stage_fixed: true
```

## Advanced Features

### Group Commands
```yaml
pre-commit:
  groups:
    - name: quality
      run: bun run lint && bun run test
```

### Run Conditions
```yaml
pre-commit:
  commands:
    lint:
      run: bun run lint
      only: "src/**/*.ts"
```

### Environment Variables
```yaml
pre-commit:
  commands:
    lint:
      run: bun run lint
      env:
        NODE_ENV: test
```

## Integration Features

### CI/CD Integration
- Compatible with GitHub Actions
- Compatible with GitLab CI
- Compatible with CircleCI

### Tool Integration
- ESLint
- Prettier
- Commitlint
- Jest
- และอื่นๆ

## Additional Features

### Hook Output
- Colored output
- Progress indicators
- Error reporting

### Configuration Validation
- Validate lefthook.yml
- Error messages
- Suggestions

### Performance
- Caching
- Incremental execution
- Smart file watching
