# Rule Types

ประเภทของ ast-grep rules

## Atomic Rules

### pattern
Match code syntax:
```yaml
rule:
  pattern: console.log($ARG)
```

### kind
Match AST node type:
```yaml
rule:
  kind: call_expression
```

### regex
Match text with regex:
```yaml
rule:
  regex: console\.(log|warn|error)
```

### nthChild
Match by position:
```yaml
rule:
  nthChild: 0  # First child
```

### range
Match by range:
```yaml
rule:
  range:
    start: 0
    end: 10
```

## Relational Rules

### inside
Match inside another node:
```yaml
rule:
  pattern: $VAR
  inside:
    kind: function_declaration
```

### has
Match containing another node:
```yaml
rule:
  has:
    pattern: console.log($ARG)
```

### precedes
Match before another node:
```yaml
rule:
  pattern: $A
  precedes:
    pattern: $B
```

### follows
Match after another node:
```yaml
rule:
  pattern: $B
  follows:
    pattern: $A
```

## Composite Rules

### all
All conditions must match:
```yaml
rule:
  all:
    - pattern: $VAR
    - kind: identifier
```

### any
Any condition must match:
```yaml
rule:
  any:
    - pattern: console.log
    - pattern: console.warn
```

### not
Condition must not match:
```yaml
rule:
  not:
    pattern: console.log
```

### matches
Match pattern:
```yaml
rule:
  matches: console\.(log|warn)
```

## Combining Rules

### Nested Composition
```yaml
rule:
  all:
    - pattern: $FUNC($ARG)
    - not:
        has:
          pattern: console.log
```

### Relational + Atomic
```yaml
rule:
  pattern: $VAR
  inside:
    kind: function_declaration
  kind: identifier
```

## Rule Priority

Rules จะถูก evaluate ตามลำดับ:
1. Atomic rules ก่อน
2. Relational rules ต่อไป
3. Composite rules สุดท้าย

## Best Practices

1. **Start Atomic**: เริ่มจาก atomic rules
2. **Compose Gradually**: ค่อยๆ เพิ่มความซับซ้อน
3. **Test Each Layer**: ทดสอบแต่ละ layer ของ rules
4. **Use Relational for Context**: ใช้ relational rules สำหรับ context
