# Storage Troubleshooting

## Problem: Disk Space Full

**Symptoms**:
- Cannot write data
- WAL files accumulating
- Database crashes

**Causes**:
1. Large tables
2. Unvacuumed dead tuples
3. WAL not archived

**Solutions**:

```sql
-- PostgreSQL: Vacuum database
VACUUM FULL;

-- PostgreSQL: Archive WAL
ALTER SYSTEM SET archive_mode = on;
ALTER SYSTEM SET archive_command = 'cp %p /archive/%f';

-- Drop old data
DELETE FROM logs WHERE created_at < NOW() - INTERVAL '30 days';
```

## Problem: Table Bloat

**Symptoms**:
- Large table size
- Slow queries
- Disk space waste

**Causes**:
1. Many updates/deletes
2. No vacuuming
3. Large rows

**Solutions**:

```sql
-- PostgreSQL: Vacuum table
VACUUM ANALYZE users;

-- PostgreSQL: Reindex table
REINDEX TABLE users;

-- PostgreSQL: Cluster table
CLUSTER users USING idx_users_email;
```
