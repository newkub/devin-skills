# Share Configs

แชะ configs ทั่ว organization

## Principle

ใช้ remote configs เพื่อ maintain consistency ทั่ว organization

## Why Share Configs?

1. **Consistency**: ทุก project ใช้ config เดียวกัน
2. **Centralized Management**: Update config ที่เดียว
3. **Best Practices**: Share best practices ทั่ว organization
4. **Reduced Maintenance**: ลด maintenance overhead

## How to Share

### Create Remote Config
สร้าง config repository:
```bash
git init lefthook-config
```

### Add Config
สร้าง `config.yml`:
```yaml
pre-commit:
  parallel: true
  commands:
    lint:
      run: bun run lint
```

### Host Config
Host config บน GitHub/GitLab:
```yaml
# URL
https://raw.githubusercontent.com/my-org/lefthook-config/main/config.yml
```

### Use Remote Config
ใช้ remote config ใน projects:
```yaml
extends:
  - https://raw.githubusercontent.com/my-org/lefthook-config/main/config.yml
```

## Override Local

### Override Remote Config
Override remote config locally เมื่อจำเป็น:
```yaml
extends:
  - https://raw.githubusercontent.com/my-org/lefthook-config/main/config.yml

pre-commit:
  commands:
    local-command:
      run: bun run local
```

## Best Practices

1. **Version Configs**: ใช้ versioned configs
2. **Document**: Document config usage
3. **Test Locally**: ทดสอบ config บน local
4. **Review**: Review config changes ก่อน deploy
