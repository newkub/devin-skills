# Common Pitfalls

## 1. Forgetting to Index

```sql
-- ❌ Bad: No index on foreign key
CREATE TABLE orders (
    user_id INTEGER  -- No index
);

-- ✅ Good: Index foreign key
CREATE TABLE orders (
    user_id INTEGER
);
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

## 2. Using SELECT *

```sql
-- ❌ Bad: Select all columns
SELECT * FROM users WHERE id = 1;

-- ✅ Good: Select only needed columns
SELECT id, name, email FROM users WHERE id = 1;
```

## 3. Not Using Transactions

```sql
-- ❌ Bad: No transaction
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
-- May fail halfway

-- ✅ Good: Use transaction
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

## 4. Ignoring Backups

```bash
# ❌ Bad: No backups
# Data loss risk

# ✅ Good: Regular backups
pg_dump -U user -h localhost mydb > backup_$(date +%Y%m%d).sql
```
