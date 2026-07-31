# Replication Troubleshooting

## Problem: Replication Lag

**Symptoms**:
- Slave not up to date
- Stale data reads
- Inconsistent data

**Causes**:
1. Heavy write load
2. Network latency
3. Slave underpowered

**Solutions**:

```sql
-- PostgreSQL: Check replication lag
SELECT lag FROM pg_stat_replication;

-- MySQL: Check replication lag
SHOW SLAVE STATUS;
```

## Problem: Replication Broken

**Symptoms**:
- Slave not replicating
- Error in replication log
- Data divergence

**Causes**:
1. Network issues
2. Schema changes
3. Data conflicts

**Solutions**:

```bash
# PostgreSQL: Rebuild replica
pg_basebackup -h master -D /var/lib/postgresql/data -P -v

# MySQL: Rebuild replica
mysqldump --all-databases --master-data=2 | mysql -h slave
```
