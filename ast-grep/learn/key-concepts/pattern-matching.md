# Pattern Matching

การ match patterns ด้วย AST-based approach

## What is Pattern Matching?

ast-grep ใช้ AST (Abstract Syntax Tree) แทน text matching ทำให้:
- Match code structure ไม่ใช่ text เท่านั้น
- เข้าใจ syntax และ semantics ของ code
- Handle formatting และ whitespace อัตโนมัติ

## Basic Patterns

### Exact Match
```yaml
pattern: console.log("hello")
```

### Metavariables
ใช้ `$VAR` สำหรับ capture ทุก AST node:
```yaml
pattern: console.log($ARG)
```

### Multiple Metavariables
```yaml
pattern: $FUNC($ARG1, $ARG2)
```

## Pattern Examples

### Function Calls
```yaml
pattern: console.log($ARG)
```

### Variable Declaration
```yaml
pattern: const $NAME = $VALUE
```

### Object Properties
```yaml
pattern: $OBJ.$PROP
```

### Conditional Expressions
```yaml
pattern: $A ? $B : $C
```

## Strictness Levels

### Smart (Default)
Balance ระหว่าง precision และ recall

### AST
Strict AST matching, ignore formatting

### CST
Include comments และ whitespace

### Relaxed
More flexible matching

## Pattern vs Regex

| Pattern | Regex |
|---------|-------|
| Match structure | Match text |
| Language-aware | Language-agnostic |
| Handle formatting | Sensitive to formatting |
| Semantic matching | Syntactic matching |

## Best Practices

1. **Start Simple**: เริ่มจาก basic patterns
2. **Use Descriptive Names**: ตั้งชื่อ metavariables ให้ชัดเจน
3. **Test Patterns**: ทดสอบ patterns กับ real code
4. **Combine with Kind**: ใช้ kind constraints เพื่อ precision
