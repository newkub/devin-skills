# Schema Evolution

## Migrations

### Add Column

```sql
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
```

### Rename Column

```sql
ALTER TABLE users RENAME COLUMN name TO full_name;
```

### Drop Column

```sql
ALTER TABLE users DROP COLUMN old_column;
```

### Add Index

```sql
CREATE INDEX idx_users_email ON users(email);
```

### Add Foreign Key

```sql
ALTER TABLE orders 
ADD CONSTRAINT fk_orders_user 
FOREIGN KEY (user_id) REFERENCES users(id);
```

## Backward Compatibility

1. Add new columns with defaults
2. Use nullable columns initially
3. Migrate data before removing old columns
4. Test migrations on staging first
