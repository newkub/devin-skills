# Parallel Execution

การรัน commands พร้อมกันใน Lefthook

## What is Parallel Execution?

Parallel execution คือการรันหลาย commands พร้อมกัน:
- เพิ่มประสิทธิภาพ
- ลดเวลาที่ใช้
- ใช้ CPU หลาย cores พร้อมกัน

## Sequential vs Parallel

### Sequential
```yaml
pre-commit:
  parallel: false
  commands:
    lint:
      run: bun run lint
    test:
      run: bun test
```
รัน lint ก่อน test

### Parallel
```yaml
pre-commit:
  parallel: true
  commands:
    lint:
      run: bun run lint
    test:
      run: bun test
```
รัน lint และ test พร้อมกัน

## Performance Benefits

### Sequential
```
Time: 10s (lint) + 15s (test) = 25s
```

### Parallel
```
Time: max(10s, 15s) = 15s
```

## When to Use Parallel

### Use Parallel When
- Commands ไม่ dependent กัน
- Commands ใช้ resources ต่างกัน
- Commands สามารถรันพร้อมกันได้

### Use Sequential When
- Commands dependent กัน
- Commands ใช้ resources เดียวกัน
- Commands ต้องรันตามลำดับ

## Configuration

### Enable Parallel
```yaml
pre-commit:
  parallel: true
```

### Disable Parallel
```yaml
pre-commit:
  parallel: false
```

## Example

### Full Stack Parallel
```yaml
pre-commit:
  parallel: true
  commands:
    lint:
      run: bun run lint
    format:
      run: bun run format
    typecheck:
      run: bun run typecheck
```

## Best Practices

1. **Use Parallel**: เปิด parallel execution เมื่อเป็นไปได้
2. **Check Dependencies**: ตรวจสอบว่า commands ไม่ dependent กัน
3. **Monitor Resources**: ตรวจสอบ resource usage
4. **Test Locally**: ทดสอบ parallel execution บน local
