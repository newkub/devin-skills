# Best Practices

แนวทางปฏิบัติที่ดีสำหรับการใช้งาน Lefthook

## Configuration

### Use Parallel Execution
เปิด parallel execution เพื่อความเร็ว:
```yaml
pre-commit:
  parallel: true
  commands:
    lint:
      run: bun run lint
    test:
      run: bun test
```

### Filter Files
ใช้ files/glob patterns เพื่อ filter:
```yaml
pre-commit:
  commands:
    lint:
      run: bun run lint
      glob: "*.ts"
```

### Skip When Needed
ใช้ skip conditions:
```yaml
pre-commit:
  skip:
    - merge
    - rebase
```

## Hook Design

### Keep Hooks Fast
- ใช้ parallel execution
- Filter files
- ใช้ caching

### Use Appropriate Hooks
- pre-commit: lint, format, quick tests
- pre-push: full test suite
- commit-msg: commit message validation

### Group Related Commands
จัดกลุ่ม commands ที่เกี่ยวข้องกัน:
```yaml
pre-commit:
  groups:
    - name: quality
      run: bun run lint && bun run format
```

## Remote Configs

### Share Configs
ใช้ remote configs สำหรับ sharing:
```yaml
extends:
  - https://raw.githubusercontent.com/my-org/lefthook-config/main/config.yml
```

### Override Locally
Override configs locally เมื่อจำเป็น:
```yaml
extends:
  - https://raw.githubusercontent.com/my-org/lefthook-config/main/config.yml

pre-commit:
  commands:
    local-command:
      run: bun run local
```

## Error Handling

### Fail Fast
ให้ hooks fail เมื่อมี error:
```yaml
pre-commit:
  commands:
    lint:
      run: bun run lint
```

### Provide Clear Messages
ให้ error messages ชัดเจน:
```yaml
pre-commit:
  commands:
    lint:
      run: bun run lint
      fail_text: "Linting failed. Please fix lint errors before committing."
```

## Performance

### Use Caching
ใช้ caching เมื่อเป็นไปได้:
```yaml
pre-commit:
  commands:
    lint:
      run: bun run lint
      cache: true
```

### Incremental Execution
Execute เฉพาะสิ่งที่เปลี่ยน:
```yaml
pre-commit:
  commands:
    lint:
      run: bun run lint
      files: git diff --name-only --cached
```

## Common Pitfalls

### Too Many Hooks
หลีกเลี่ยง hooks ที่เยอะเกินไป:
- ใช้ parallel execution
- จัดกลุ่ม commands
- ใช้ file filtering

### Slow Hooks
หลีกเลี่ยง hooks ที่ช้า:
- Optimize commands
- Use caching
- Filter files

### No Skip Conditions
อย่าลืม skip conditions:
- Skip merge commits
- Skip rebase
- Skip specific branches
