# Use Affected

ใช้ --affected เพื่อ efficiency

## Principle

ใช้ --affected เพื่อรัน tasks เฉพาะใน projects ที่มีการเปลี่ยนแปลง

## Why Use Affected?

1. **Efficiency**: รัน tasks เฉพาะที่จำเป็น
2. **Time Saving**: ลดเวลาที่ใช้
3. **Resource Saving**: ลด resource usage

## Usage

### Basic Usage
```bash
bunx moon run build --affected
```

### Affected Projects
moon detect affected projects:
- Projects ที่มีการเปลี่ยนแปลง
- Projects ที่ dependent กัน
- Projects ที่มี dependency เปลี่ยน

## Examples

### Build Affected
```bash
bunx moon run build --affected
```

### Test Affected
```bash
bunx moon run test --affected
```

### All Tasks Affected
```bash
bunx moon run --affected
```

## Best Practices

1. **Use Affected**: ใช้ --affected อย่างสม่ำเสมอ
2. **Combine with Caching**: ใช้กับ caching เพื่อ performance
3. **Test Locally**: Test affected detection บน local
4. **Monitor**: Monitor affected detection accuracy
