# Configuration Reference

## lefthook.yml Configuration Options

### Top-level Options

| Option | Type | Description |
|--------|------|-------------|
| `extends` | array | Array of config files to extend |
| `pre-commit` | object | Pre-commit hook configuration |
| `commit-msg` | object | Commit message hook configuration |
| `pre-push` | object | Pre-push hook configuration |
| `post-commit` | object | Post-commit hook configuration |
| `pre-rebase` | object | Pre-rebase hook configuration |
| `post-merge` | object | Post-merge hook configuration |
| `post-checkout` | object | Post-checkout hook configuration |

### Hook Object Options

| Option | Type | Description |
|--------|------|-------------|
| `commands` | object | Command definitions |
| `scripts` | object | Script definitions |
| `parallel` | boolean | Enable parallel execution |
| `pipe` | boolean | Enable pipe mode |
| `tags` | array | Tags for filtering |
| `root` | string | Override root directory |

### Command Options

| Option | Type | Description |
|--------|------|-------------|
| `run` | string | Command to run (required) |
| `glob` | string | File filter pattern |
| `exclude` | string | File exclusion pattern |
| `env` | object | Environment variables |
| `cwd` | string | Working directory |
| `priority` | number | Execution order (lower = first) |
| `tags` | array | Tags for filtering |
| `interactive` | boolean | Enable interactive mode |
| `timeout` | number | Timeout in seconds |

### Script Options

| Option | Type | Description |
|--------|------|-------------|
| `runner` | string | Script runner (bash, ruby, python, node) |
| `script` | string | Inline script content |
| `file` | string | Path to script file |

### Variables

| Variable | Description |
|----------|-------------|
| `{staged_files}` | List of staged files |
| `{staged_files\|path\|ext}` | Filter by extension |
| `{0}`, `{1}` | Command arguments |
| `$ENV_VAR` | Environment variable |

### Complete Configuration Schema

```yaml
# lefthook.yml

# Extend other configs
extends:
  - ./lefthook.shared.yml
  - https://example.com/lefthook.yml

# Hook configurations
pre-commit:
  parallel: true
  commands:
    eslint:
      run: npx eslint {staged_files}
      glob: "*.{js,ts,jsx,tsx}"
      exclude: "*.test.js"
      priority: 1
      tags: [frontend, lint]
      
    prettier:
      run: npx prettier --check {staged_files}
      glob: "*.{js,ts,json,css,md}"
      priority: 2
      tags: [frontend, format]
      
  scripts:
    setup:
      runner: bash
      script: ./scripts/setup.sh

commit-msg:
  commands:
    commitlint:
      run: npx commitlint --edit {1}
      priority: 1

pre-push:
  parallel: true
  commands:
    test:
      run: bun run test:ci
      env:
        CI: "true"
      timeout: 300
      tags: [ci]
      
    build:
      run: bun run build
      timeout: 120
      tags: [ci]
```

### Environment Variables in Config

```yaml
commands:
  lint:
    run: bun run lint
    env:
      NODE_ENV: test
      CI: "true"
      CUSTOM_VAR: "value"
```

### Timeout Configuration

```yaml
commands:
  slow-test:
    run: bun run test
    timeout: 600  # 10 minutes
    
  fast-check:
    run: bun run check
    timeout: 30  # 30 seconds
```

### Tags and Filtering

```yaml
# lefthook.yml
pre-commit:
  commands:
    lint:
      run: bun run lint
      tags: [frontend, ci]
      
    backend-lint:
      run: bun run lint:backend
      tags: [backend, ci]
```

### Multiple Config Files

```
lefthook.yml          # Base configuration
lefthook.local.yml    # Local overrides (gitignored)
lefthook.shared.yml   # Shared team config
```

### Remote Configuration

```yaml
# lefthook.yml
extends:
  - https://raw.githubusercontent.com/org/repo/main/lefthook.yml
  - ./custom-hooks.yml
```

### Validation

```bash
# Validate configuration
lefthook validate

# Dump merged config
lefthook dump
```