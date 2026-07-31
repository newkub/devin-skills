# Compose Rules

ใช้ composite rules สำหรับ combine multiple conditions

## Principle

ใช้ composite rules (all, any, not, matches) สำหรับ combine multiple atomic และ relational rules เพื่อสร้าง logic ที่ซับซ้อน

## Composite Rule Types

### all
All conditions must match:
```yaml
rule:
  all:
    - pattern: $VAR
    - kind: identifier
    - not:
        pattern: console
```

### any
Any condition must match:
```yaml
rule:
  any:
    - pattern: console.log
    - pattern: console.warn
    - pattern: console.error
```

### not
Condition must not match:
```yaml
rule:
  pattern: console.log($ARG)
  not:
    inside:
      kind: test_block
```

### matches
Match pattern with regex:
```yaml
rule:
  matches: console\.(log|warn|error)
```

## Composition Patterns

### AND Logic
```yaml
rule:
  all:
    - pattern: $FUNC($ARG)
    - kind: call_expression
    - not:
        has:
          pattern: console
```

### OR Logic
```yaml
rule:
  any:
    - pattern: console.log
    - pattern: console.warn
    - pattern: console.error
```

### NOT Logic
```yaml
rule:
  pattern: $VAR
  not:
    - pattern: console
    - pattern: window
```

### Nested Composition
```yaml
rule:
  all:
    - pattern: $FUNC($ARG)
    - any:
        - kind: call_expression
        - kind: new_expression
    - not:
        inside:
          kind: test_block
```

## Best Practices

### Use all for AND
```yaml
# Good
rule:
  all:
    - pattern: $VAR
    - kind: identifier
```

### Use any for OR
```yaml
# Good
rule:
  any:
    - pattern: console.log
    - pattern: console.warn
```

### Use not for Negation
```yaml
# Good
rule:
  pattern: $VAR
  not:
    pattern: console
```

### Nest for Complex Logic
```yaml
# Good - nested composition
rule:
  all:
    - pattern: $FUNC($ARG)
    - any:
        - kind: call_expression
        - kind: new_expression
```

## Common Patterns

### Match Specific Context
```yaml
rule:
  all:
    - pattern: console.log($ARG)
    - inside:
        kind: function_declaration
```

### Exclude Specific Context
```yaml
rule:
  pattern: console.log($ARG)
  not:
    inside:
      kind: test_block
```

### Match Multiple Patterns
```yaml
rule:
  any:
    - pattern: console.log
    - pattern: console.warn
    - pattern: console.error
```

## Performance Considerations

### Order Matters
```yaml
# Good - fast patterns first
rule:
  all:
    - kind: call_expression
    - pattern: console.log($ARG)
```

### Avoid Deep Nesting
```yaml
# Bad - too deep
rule:
  all:
    - all:
        - all:
            - pattern: $A
```

### Use Specific Patterns
```yaml
# Good - specific
rule:
  pattern: console.log($ARG)

# Bad - too broad
rule:
  pattern: $A
```
