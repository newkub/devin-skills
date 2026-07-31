# Best Practices

แนวทางปฏิบัติที่ดีสำหรับการใช้งาน ast-grep

## Rule Writing

### Start Simple
เริ่มจาก atomic rules ก่อน:
```yaml
rule:
  pattern: console.log($ARG)
```

### Use Metavariables Wisely
ตั้งชื่อ metavariables ให้ชัดเจน:
```yaml
pattern: $PROP && $PROP()  # Good
pattern: $A && $A()       # Less clear
```

### Test Driven
เขียน test cases ก่อนเขียน rules:
```yaml
test:
  - valid: foo?.()
  - invalid: foo && foo()
```

### Incremental Development
เริ่มจาก simple patterns แล้วค่อยเพิ่มความซับซ้อน:
1. Start with pattern
2. Add kind constraints
3. Add relational rules
4. Add composite rules

## Rule Organization

### Group by Category
จัด rules ตาม category:
```
rules/
  ├── performance/
  ├── security/
  ├── style/
  └── best-practices/
```

### Use Descriptive IDs
ตั้งชื่อ id ให้สื่อความหมาย:
```yaml
id: no-console-log-in-production  # Good
id: ncl                           # Bad
```

### Document Rules
เขียน message ที่ชัดเจน:
```yaml
message: "Avoid console.log in production, use logger instead"
```

## Performance

### Optimize Patterns
ใช้ kind constraints เพื่อลด search space:
```yaml
rule:
  kind: call_expression
  pattern: console.log($ARG)
```

### Use Specific Scopes
กำหนด files/ignores อย่างชัดเจน:
```yaml
files:
  - "src/**/*.ts"
ignores:
  - "src/**/*.test.ts"
```

### Cache Results
ใช้ `--json` output สำหรับ caching:
```bash
ast-grep scan --json > results.json
```

## Testing

### Cover Edge Cases
ทดสอบทุก edge cases:
```yaml
test:
  - valid: foo?.()
  - valid: bar?.()
  - invalid: foo && foo()
  - invalid: bar && bar()
```

### Use Snapshot Testing
สำหรับ complex fixes:
```yaml
test:
  - snapshot: complex-fix.test.ts
```

### Continuous Testing
รัน tests อัตโนมัติ:
```bash
ast-grep test --watch
```

## Integration

### CI/CD
เพิ่มใน CI pipeline:
```yaml
- name: Run ast-grep
  run: bunx ast-grep scan
```

### Pre-commit Hooks
ใช้ pre-commit hooks:
```bash
bunx ast-grep scan --staged
```

### Editor Integration
ติดตั้ง editor extensions สำหรับ real-time feedback

## Common Pitfalls

### Overly Broad Patterns
หลีกเลี่ยง patterns ที่กว้างเกินไป:
```yaml
# Bad - matches too much
pattern: $A

# Good - specific pattern
pattern: console.log($A)
```

### Missing Test Cases
อย่าลืม test cases:
```yaml
# Always include tests
test:
  - valid: ...
  - invalid: ...
```

### Ignoring Context
ใช้ relational rules สำหรับ context:
```yaml
rule:
  pattern: $VAR
  inside:
    kind: function_declaration
```
