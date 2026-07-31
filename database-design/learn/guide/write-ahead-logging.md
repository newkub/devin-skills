# Write-Ahead Logging (WAL)

**How it works**:
1. Changes written to log before data pages
2. Log flushed to disk on commit
3. Data pages written later

**Benefits**:
- Durability
- Crash recovery
- Point-in-time recovery

**Example**:

```
Transaction:
1. Write to WAL: UPDATE users SET name = 'John' WHERE id = 1
2. Flush WAL to disk
3. Commit
4. Write to data pages (later)
```
