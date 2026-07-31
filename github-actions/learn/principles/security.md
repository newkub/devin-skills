# Security

## หลักการความปลอดภัย

### 1. ใช้ Secrets อย่างถูกต้อง

เก็บค่า sensitive ใน repository secrets ไม่ใส่ใน workflow file

```yaml
# ❌ Bad
- run: curl -H "Authorization: Bearer my-token" api.example.com

# ✅ Good
- run: curl -H "Authorization: Bearer ${{ secrets.API_TOKEN }}" api.example.com
```

### 2. ตั้งค่า Permissions

จำกัด permissions อย่างเหมาะสม

```yaml
permissions:
  contents: read
  pull-requests: write
```

### 3. ใช้ Verified Actions

ใช้ actions จาก verified creators เท่านั้น

### 4. Pin Action Versions

ใช้ specific version แทน @latest

```yaml
- uses: actions/checkout@v4  # ✅ Good
- uses: actions/checkout@latest  # ❌ Bad
```

### 5. ตรวจสอบ Dependencies

ใช้ Dependabot สำหรับ auto-update dependencies
