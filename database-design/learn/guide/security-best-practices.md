# Security Best Practices

## Best Practices สำหรับ Security

### ใช้ Parameterized Queries

```typescript
// ✅ Good: Parameterized query
const user = await prisma.user.findUnique({
  where: { email: userEmail }
});

// ❌ Bad: String concatenation (SQL injection risk)
const user = await prisma.$queryRawUnsafe(
  `SELECT * FROM users WHERE email = '${userEmail}'`
);
```

### ใช้ Least Privilege

```sql
-- ✅ Good: Grant เฉพาะ permissions ที่จำเป็น
GRANT SELECT, INSERT ON mytable TO myuser;

-- ❌ Bad: Grant ทุก permissions
GRANT ALL PRIVILEGES ON ALL TABLES TO myuser;
```

### เข้ารหัสข้อมูลที่ละเอียด

```sql
-- ✅ Good: เข้ารหัส columns ที่ละเอียด
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    password_hash VARCHAR(255),  -- Hashed password
    encrypted_data TEXT  -- Encrypted data
);
```
