# Data Integrity Troubleshooting

## Problem: Orphaned Records

**Symptoms**:
- Foreign key violations
- Data inconsistencies
- Broken relationships

**Causes**:
1. Missing foreign key constraints
2. Manual data manipulation
3. Bugs in application code

**Solutions**:

```sql
-- ✅ Good: Add foreign key constraint
ALTER TABLE orders 
ADD CONSTRAINT fk_orders_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- ✅ Good: Clean up orphaned records
DELETE FROM orders 
WHERE user_id NOT IN (SELECT id FROM users);
```

## Problem: Duplicate Data

**Symptoms**:
- Duplicate records
- Unique constraint violations
- Data inconsistency

**Causes**:
1. Missing unique constraints
2. Race conditions
3. Application bugs

**Solutions**:

```sql
-- ✅ Good: Add unique constraint
ALTER TABLE users 
ADD CONSTRAINT uq_users_email UNIQUE (email);

-- ✅ Good: Remove duplicates
DELETE FROM users u1
WHERE EXISTS (
    SELECT 1 FROM users u2 
    WHERE u2.email = u1.email AND u2.id < u1.id
);
```
