# Documentation Best Practices

## Best Practices สำหรับ Documentation

### Document Schema

```sql
-- ✅ Good: เพิ่ม comments
COMMENT ON TABLE users IS 'User accounts';
COMMENT ON COLUMN users.email IS 'User email address (unique)';
```

### ใช้ Naming Conventions

```sql
-- ✅ Good: Naming สม่ำเสมอ
CREATE TABLE user_profiles (
    user_id INTEGER,
    first_name VARCHAR(50),
    last_name VARCHAR(50)
);

-- ❌ Bad: Naming ไม่สม่ำเสมอ
CREATE TABLE userprofiles (
    UserID INTEGER,
    fname VARCHAR(50),
    lname VARCHAR(50)
);
```
