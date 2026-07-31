# Debugging Tips

## 1. Enable Query Logging

```sql
-- PostgreSQL
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_duration = on;

-- MySQL
SET GLOBAL general_log = 'ON';
SET GLOBAL slow_query_log = 'ON';
```

## 2. Monitor Connections

```sql
-- PostgreSQL
SELECT count(*) FROM pg_stat_activity;

-- MySQL
SHOW PROCESSLIST;
```

## 3. Check Locks

```sql
-- PostgreSQL
SELECT * FROM pg_locks;

-- MySQL
SHOW ENGINE INNODB STATUS;
```

## 4. Analyze Slow Queries

```sql
-- PostgreSQL
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- MySQL
SELECT * FROM mysql.slow_log
ORDER BY query_time DESC
LIMIT 10;
```
