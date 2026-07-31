# MVCC (Multi-Version Concurrency Control)

### How it works:
1. Multiple versions of rows exist
2. Readers see consistent snapshot
3. Writers don't block readers

**Example**:

```sql
-- Transaction 1 (read)
BEGIN;
SELECT * FROM users WHERE id = 1;  -- Sees version 1

-- Transaction 2 (write)
BEGIN;
UPDATE users SET name = 'Jane' WHERE id = 1;  -- Creates version 2
COMMIT;

-- Transaction 1 (read again)
SELECT * FROM users WHERE id = 1;  -- Still sees version 1
COMMIT;
```
