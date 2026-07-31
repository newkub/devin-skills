# Metavariables

การใช้ metavariables สำหรับ capture AST nodes

## What are Metavariables?

Metavariables คือตัวแปรที่ใช้ capture ทุก AST node ใน pattern:
- ขึ้นต้นด้วย `$`
- สามารถใช้ใน fix template
- Capture ค่าของ matched nodes

## Basic Usage

### Single Metavariable
```yaml
pattern: console.log($ARG)
fix: console.warn($ARG)
```

### Multiple Metavariables
```yaml
pattern: $FUNC($ARG1, $ARG2)
fix: $FUNC($ARG2, $ARG1)  # Swap arguments
```

### Nested Metavariables
```yaml
pattern: $OBJ.$PROP($ARG)
```

## Metavariable Types

### Simple Capture
```yaml
pattern: $VAR
```

### Typed Capture
```yaml
pattern: $FUNC: identifier
```

### List Capture
```yaml
pattern: [$A, $B, $C]
```

## Using in Fix Templates

### Direct Substitution
```yaml
pattern: console.log($MSG)
fix: logger.info($MSG)
```

### Multiple Uses
```yaml
pattern: $A && $A()
fix: $A?.()
```

### Transformation
```yaml
pattern: new $CLASS($ARG)
fix: $CLASS.create($ARG)
```

## Naming Conventions

### Descriptive Names
```yaml
pattern: $FUNC_NAME($ARG1, $ARG2)  # Good
pattern: $A($B, $C)                 # Less clear
```

### Context-Aware Names
```yaml
pattern: $OBJ.$PROP  # Clear context
pattern: $A.$B       # Ambiguous
```

## Advanced Patterns

### Ellipsis
```yaml
pattern: {
  $KEY: $VALUE,
  ...
}
```

### Optional Metavariables
```yaml
pattern: $FUNC($ARG, ...)
```

## Best Practices

1. **Use Descriptive Names**: ตั้งชื่อให้สื่อความหมาย
2. **Reuse in Fix**: ใช้ metavariables ใน fix template
3. **Test Coverage**: ทดสอบกับหลายๆ test cases
4. **Avoid Over-Capture**: จำกัด scope ด้วย kind constraints
