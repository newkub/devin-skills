# Troubleshooting

การแก้ปัญหาที่พบบ่อยใน Scalar API Designer

## Common Issues

### Schema Validation Errors

#### Problem: Schema validation fails

**Error Message:**
```
Error: Schema validation failed
```

**Solutions:**

1. ตรวจสอบ syntax ของ GraphQL schema
```graphql
# ❌ ผิด
type User {
  id: ID
  name
}

# ✅ ถูก
type User {
  id: ID!
  name: String!
}
```

2. ตรวจสอบ type definitions
```bash
scalar validate schema.graphql
```

3. ตรวจสอบ circular references
```graphql
# ตรวจสอบว่าไม่มี circular dependencies
type A {
  b: B
}

type B {
  a: A  # อาจทำให้เกิดปัญหา
}
```

### Mock Server Issues

#### Problem: Mock server not responding

**Error Message:**
```
Error: Mock server failed to start
```

**Solutions:**

1. ตรวจสอบ port ที่ใช้งาน
```yaml
mock:
  port: 4000  # เปลี่ยน port ถ้า conflict
```

2. ตรวจสอบ mock rules
```bash
scalar mock validate
```

3. เริ่ม mock server ใหม่
```bash
scalar mock restart
```

#### Problem: Mock data not generated correctly

**Solutions:**

1. ตรวจสอบ field types ใน mock rules
```yaml
mock:
  rules:
    - type: User
      fields:
        id: uuid        # ✅ ถูก
        name: integer   # ❌ ผิด - ใช้ firstName แทน
```

2. ใช้ custom resolvers สำหรับ fields ที่ซับซ้อน
```javascript
export default {
  User: {
    customField: () => generateCustomData(),
  },
};
```

### Documentation Issues

#### Problem: Documentation not updating

**Solutions:**

1. สร้างเอกสารใหม่
```bash
scalar docs build --force
```

2. ตรวจสอบ documentation sources
```yaml
documentation:
  sources:
    - type: schema
      path: "./schema.graphql"  # ตรวจสอบ path
```

3. Clear cache
```bash
scalar cache clear
scalar docs build
```

### Performance Issues

#### Problem: Scalar runs slowly

**Solutions:**

1. ลดขนาด schema
```graphql
# แยก schema ที่ใหญ่เป็นหลายไฟล์
# base.graphql
# users.graphql
# posts.graphql
```

2. ปิด features ที่ไม่ใช้
```yaml
features:
  mock: true
  docs: true
  validation: false  # ปิดถ้าไม่จำเป็น
```

3. เพิ่ม resources
```yaml
performance:
  memory: "2GB"
  cpu: "2"
```

## Integration Issues

### Git Integration

#### Problem: Git hooks not working

**Solutions:**

1. ตรวจสอบ Git hooks
```bash
# ตรวจสอบ hooks ใน .git/hooks/
ls .git/hooks/
```

2. ติดตั้ง hooks ใหม่
```bash
scalar git install-hooks
```

3. ตรวจสอบ permissions
```bash
chmod +x .git/hooks/pre-commit
```

### CI/CD Integration

#### Problem: CI pipeline fails

**Solutions:**

1. ตรวจสอบ Scalar CLI version
```bash
scalar --version
```

2. ติดตั้ง dependencies ใน CI
```yaml
# .github/workflows/scalar.yml
- name: Install Scalar
  run: bun install -g @scalar/cli
```

3. ตรวจสอบ environment variables
```yaml
env:
  SCALAR_API_KEY: ${{ secrets.SCALAR_API_KEY }}
```

## Debugging

### Enable Debug Mode

เปิด debug mode เพื่อดู logs โดยละเอียด

```bash
scalar --debug
```

### View Logs

ตรวจสอบ logs ใน directory

```bash
# Linux/Mac
tail -f ~/.scalar/logs/scalar.log

# Windows
type %USERPROFILE%\.scalar\logs\scalar.log
```

### Validate Configuration

ตรวจสอบ configuration files

```bash
scalar config validate
```

## Getting Help

### Documentation

- [Scalar Documentation](https://docs.scalar.com)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)

### Community

- [Scalar Discord](https://discord.gg/scalar)
- [GitHub Issues](https://github.com/scalar/scalar/issues)

### Support

- Email: support@scalar.com
- Twitter: @scalarhq

## Checklist

ก่อนรายงานปัญหา:

- [ ] ตรวจสอบ Scalar version
- [ ] อัปเดตเป็น version ล่าสุด
- [ ] ตรวจสอบ configuration files
- [ ] ลอง restart Scalar
- [ ] เปิด debug mode และดู logs
- [ ] ค้นหาใน documentation และ issues
