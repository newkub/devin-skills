# Rules System

## Definition

Oxlint rules system คือระบบ linting rules ที่:
- มี 800+ rules
- ESLint compatible
- Categorized by type
- Configurable severity

## Rule Categories

### Correctness
- ตรวจสอบ correctness issues
- Examples: no-debugger, no-undef, no-unused-vars

### Suspicious
- ตรวจสอบ suspicious code
- Examples: no-console, no-alert, eqeqeq

### Performance
- ตรวจสอบ performance issues
- Examples: no-loop-func, no-delete-var

### Style
- ตรวจสอบ style issues
- Examples: semi, quotes, indent

### Restriction
- ตรวจสอบ restrictions
- Examples: no-eval, no-implied-eval

### Nursery
- Experimental rules
- May change in future
- Use with caution

## Rule Configuration

### Enable/Disable Rules

```json
{
  "rules": {
    "no-console": "off",
    "no-debugger": "error",
    "no-unused-vars": "warn"
  }
}
```

### Severity Levels

- `error`: Error (default)
- `warn`: Warning
- `off`: Disabled

## Best Practices

1. **Start with Defaults**: ใช้ default rules ก่อน
2. **Customize Gradually**: Customize ทีละน้อย
3. **Review Rules**: Review rules ก่อน disable
4. **Use Categories**: ใช้ categories สำหรับ bulk configuration
