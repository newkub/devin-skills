# Keep Hooks Fast

รักษา hooks ให้เร็ว

## Principle

Hooks ควรเร็วเพื่อไม่รบกวน developer experience

## Why Keep Hooks Fast?

1. **Developer Experience**: Hooks ช้าทำให้ developer ไม่สบาย
2. **Efficiency**: Hooks เร็วทำให้ workflow มีประสิทธิภาพ
3. **Adoption**: Hooks เร็วทำให้ team ยอมรับ

## Strategies

### Use Parallel Execution
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
```yaml
pre-commit:
  commands:
    lint:
      run: bun run lint
      files: git diff --name-only --cached
      glob: "*.ts"
```

### Use Caching
```yaml
pre-commit:
  commands:
    lint:
      run: bun run lint
      cache: true
```

## Common Performance Issues

### Too Many Commands
หลีกเลี่ยง commands ที่เยอะ:
- จัดกลุ่ม commands
- ใช้ parallel execution
- ใช้ file filtering

### Slow Commands
หลีกเลี่ยง commands ที่ช้า:
- Optimize commands
- Use caching
- Filter files

### No File Filtering
อย่าลืม file filtering:
- ใช้ files pattern
- ใช้ glob pattern
- ใช้ skip conditions

## Best Practices

1. **Use Parallel**: เปิด parallel execution
2. **Filter Files**: ใช้ files/glob patterns
3. **Use Caching**: ใช้ caching เมื่อเป็นไปได้
4. **Monitor Performance**: ตรวจสอบ performance อย่างสม่ำเสมอ
