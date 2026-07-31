# Configuration

การตั้งค่า Lefthook

## lefthook.yml

Configuration file หลักของ Lefthook

## Basic Structure

```yaml
pre-commit:
  parallel: true
  commands:
    command-name:
      run: command
```

## Hook Configuration

### pre-commit
```yaml
pre-commit:
  parallel: true
  commands:
    lint:
      run: bun run lint
```

### pre-push
```yaml
pre-push:
  commands:
    test:
      run: bun test
```

### commit-msg
```yaml
commit-msg:
  commands:
    conventional-commit:
      run: bunx commitlint --edit $1
```

## Command Options

### run
Command ที่จะ execute:
```yaml
commands:
  lint:
    run: bun run lint
```

### files
Pattern สำหรับ file filtering:
```yaml
commands:
  lint:
    run: bun run lint
    files: git diff --name-only --cached
```

### glob
GLOB pattern สำหรับ file matching:
```yaml
commands:
  lint:
    run: bun run lint
    glob: "*.ts"
```

### skip
Skip conditions:
```yaml
pre-commit:
  skip:
    - merge
    - rebase
```

## Advanced Configuration

### Parallel Execution
```yaml
pre-commit:
  parallel: true
  commands:
    lint:
      run: bun run lint
    test:
      run: bun test
```

### Sequential Execution
```yaml
pre-commit:
  parallel: false
  commands:
    lint:
      run: bun run lint
    test:
      run: bun test
```

### Remote Configs
```yaml
extends:
  - https://raw.githubusercontent.com/my-org/lefthook-config/main/config.yml
```

## Environment Variables

### Set Environment Variables
```yaml
pre-commit:
  commands:
    lint:
      run: bun run lint
      env:
        NODE_ENV: test
```

### Use Environment Variables
```yaml
pre-commit:
  commands:
    lint:
      run: bun run lint
      env:
        PATH: $PATH:/usr/local/bin
```

## Best Practices

1. **Use Parallel**: เปิด parallel execution
2. **Filter Files**: ใช้ files/glob patterns
3. **Skip When Needed**: ใช้ skip conditions
4. **Use Remote Configs**: Share configs ทั่ว organization
