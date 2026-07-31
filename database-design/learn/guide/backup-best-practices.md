# Backup Best Practices

## Best Practices สำหรับ Backup and Recovery

### Regular Backups

```bash
# ✅ Good: Automated backups
pg_dump -U user -h localhost mydb > backup_$(date +%Y%m%d).sql

# ❌ Bad: ไม่มี backups
# Data loss risk
```

### Test Backups

```bash
# ✅ Good: Test restore
psql -U user -h localhost testdb < backup_20231201.sql

# ตรวจสอบ data integrity
```
