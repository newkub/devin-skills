# Atomic First

เริ่มจาก atomic rules ก่อนเสมอ

## Principle

เมื่อเขียน ast-grep rules, เริ่มจาก atomic rules (pattern, kind) ก่อน แล้วค่อยเพิ่มความซับซ้อนด้วย relational และ composite rules

## Why Atomic First?

1. **Simplicity**: Atomic rules ง่ายต่อการเขียนและทำความเข้าใจ
2. **Testability**: ง่ายต่อการ test และ debug
3. **Performance**: Atomic rules มักจะเร็วกว่า
4. **Maintainability**: ง่ายต่อการ maintain และ modify

## Example

### Step 1: Start with Pattern
```yaml
rule:
  pattern: console.log($ARG)
```

### Step 2: Add Kind Constraint
```yaml
rule:
  pattern: console.log($ARG)
  kind: call_expression
```

### Step 3: Add Relational Rule
```yaml
rule:
  pattern: console.log($ARG)
  kind: call_expression
  not:
    inside:
      kind: test_block
```

### Step 4: Add Composite Rule
```yaml
rule:
  all:
    - pattern: console.log($ARG)
    - kind: call_expression
    - not:
        inside:
          kind: test_block
```

## Benefits

### Faster Development
- เริ่มจาก simple patterns
- ค่อยๆ เพิ่มความซับซ้อน
- ทดสอบแต่ละ step

### Better Debugging
- ง่ายต่อการ isolate ปัญหา
- ทราบว่า rule ไหนทำงานไม่ถูกต้อง
- แก้ไขได้รวดเร็ว

### Improved Performance
- Atomic rules มักจะเร็วกว่า
- ลด search space ด้วย kind constraints
- Optimize ได้ง่ายกว่า

## Common Mistakes

### Starting Too Complex
```yaml
# Bad - too complex from start
rule:
  all:
    - pattern: $A
    - kind: identifier
    - inside:
        kind: function_declaration
    - not:
        has:
          pattern: console.log
```

### Skipping Atomic Rules
```yaml
# Bad - skip pattern, go straight to relational
rule:
  inside:
    kind: function_declaration
```

## Best Practices

1. **Start Simple**: เริ่มจาก pattern หรือ kind
2. **Test Each Step**: ทดสอบแต่ละ step
3. **Add Gradually**: ค่อยๆ เพิ่มความซับซ้อน
4. **Document**: เขียน comment สำหรับแต่ละ layer
