# Test Driven

เขียน test cases ก่อนเขียน rules

## Principle

ใช้ test-driven development สำหรับ ast-grep rules: เขียน test cases ก่อน แล้วค่อยเขียน rules ให้ผ่าน tests

## Why Test Driven?

1. **Clarity**: Test cases ชัดเจนว่า rule ควรทำอะไร
2. **Safety**: ป้องกัน regressions
3. **Documentation**: Test cases เป็น documentation
4. **Confidence**: มั่นใจว่า rules ทำงานถูกต้อง

## Test Structure

### Valid Cases
Code ที่ควรไม่ match:
```yaml
test:
  - valid: foo?.()
  - valid: bar?.()
```

### Invalid Cases
Code ที่ควร match:
```yaml
test:
  - invalid: foo && foo()
  - invalid: bar && bar()
```

## Example

### Step 1: Write Test Cases
```yaml
id: no-double-negation
language: ts
test:
  - valid: !!value
  - valid: !!(value)
  - invalid: value
```

### Step 2: Write Rule
```yaml
rule:
  pattern: !!$VAR
```

### Step 3: Verify
```bash
ast-grep test
```

## Test Patterns

### Edge Cases
```yaml
test:
  - valid: foo?.()
  - valid: bar?.()
  - valid: baz?.()
  - invalid: foo && foo()
  - invalid: bar && bar()
  - invalid: baz && baz()
```

### Context Variations
```yaml
test:
  - valid: |
      function test() {
        console.log("test");
      }
  - invalid: |
      function prod() {
        console.log("prod");
      }
```

### Language Variations
```yaml
test:
  - valid: const x = 1;
  - valid: let x = 1;
  - invalid: var x = 1;
```

## Snapshot Testing

สำหรับ complex fixes:
```yaml
test:
  - snapshot: complex-fix.test.ts
```

## Best Practices

### Cover All Cases
```yaml
# Good - comprehensive
test:
  - valid: case1
  - valid: case2
  - invalid: case3
  - invalid: case4
```

### Use Descriptive Names
```yaml
# Good - descriptive
test:
  - valid: optional-chaining.ts
  - invalid: double-check.ts
```

### Test Fix Behavior
```yaml
# Good - test fix
test:
  - invalid: foo && foo()
  - fix: foo?.()
```

### Continuous Testing
```bash
# Watch mode
ast-grep test --watch
```

## Common Mistakes

### Missing Test Cases
```yaml
# Bad - no tests
rule:
  pattern: console.log($ARG)
```

### Insufficient Coverage
```yaml
# Bad - only one case
test:
  - valid: foo?.()
```

### Unclear Tests
```yaml
# Bad - unclear
test:
  - valid: case1
  - invalid: case2
```

## Workflow

1. **Write Test Cases**: กำหนด valid และ invalid cases
2. **Run Tests**: ตรวจสอบว่า tests fail
3. **Write Rule**: เขียน rule ให้ผ่าน tests
4. **Verify**: รัน tests อีกครั้ง
5. **Refine**: ปรับปรุง rule ถ้าจำเป็น
