# Remote Configs

การใช้ remote configs ใน Lefthook

## What are Remote Configs?

Remote configs คือ configuration ที่มาจาก remote repositories:
- Share configs ทั่ว organization
- Maintain consistency
- Centralized management

## Usage

### Extend from Remote
```yaml
extends:
  - https://raw.githubusercontent.com/my-org/lefthook-config/main/config.yml
```

### Multiple Remotes
```yaml
extends:
  - https://raw.githubusercontent.com/my-org/lefthook-config/main/lint.yml
  - https://raw.githubusercontent.com/my-org/lefthook-config/main/test.yml
```

## Override Local

### Override Remote Config
```yaml
extends:
  - https://raw.githubusercontent.com/my-org/lefthook-config/main/config.yml

pre-commit:
  commands:
    local-command:
      run: bun run local
```

## Benefits

### Consistency
- ทุก project ใช้ config เดียวกัน
- Maintain standards ทั่ว organization
- Reduce configuration drift

### Centralized Management
- Update config ที่เดียว
- Apply changes ทั้ง organization
- Reduce maintenance

### Sharing
- Share best practices
- Share common hooks
- Share tool configurations

## Security

### HTTPS Only
ใช้ HTTPS เท่านั้น:
```yaml
extends:
  - https://raw.githubusercontent.com/my-org/lefthook-config/main/config.yml
```

### Validate URLs
ตรวจสอบ URLs:
- ใช้ trusted sources
- ใช้ versioned URLs
- ใช้ checksums

## Best Practices

1. **Use HTTPS**: ใช้ HTTPS เท่านั้น
2. **Version Configs**: ใช้ versioned configs
3. **Test Locally**: ทดสอบ remote config บน local
4. **Document**: Document remote config usage
