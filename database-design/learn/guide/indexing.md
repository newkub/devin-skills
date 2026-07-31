# Indexing

## Indexing Strategies

### Index Types

### B-Tree Index

**Purpose**: Range queries, equality queries, sorting

**When to use**:
- WHERE clauses with =, <, >, <=, >=
- ORDER BY clauses
- JOIN conditions

**Example**:

```sql
CREATE INDEX idx_users_email ON users(email);

-- Query uses index
SELECT * FROM users WHERE email = 'john@example.com';
SELECT * FROM users WHERE email LIKE 'john%';
SELECT * FROM users ORDER BY email;
```

### Hash Index

**Purpose**: Equality queries only

**When to use**:
- WHERE clauses with =
- Not for range queries or sorting

**Example**:

```sql
CREATE INDEX idx_users_id_hash ON users USING HASH (id);

-- Query uses index
SELECT * FROM users WHERE id = 1;

-- Query does NOT use index
SELECT * FROM users WHERE id > 1;
```

### GIN Index (PostgreSQL)

**Purpose**: Array values, JSONB, full-text search

**When to use**:
- Array contains queries
- JSONB key/value queries
- Full-text search

**Example**:

```sql
-- Array index
CREATE INDEX idx_users_tags ON users USING GIN(tags);

-- Query uses index
SELECT * FROM users WHERE tags @> ARRAY['admin'];

-- JSONB index
CREATE INDEX idx_products_attributes ON products USING GIN(attributes);

-- Query uses index
SELECT * FROM products WHERE attributes @> '{"color": "red"}';
```

### GiST Index (PostgreSQL)

**Purpose**: Geospatial data, full-text search

**When to use**:
- PostGIS spatial queries
- Trigram similarity

**Example**:

```sql
-- PostGIS index
CREATE INDEX idx_locations_geom ON locations USING GIST(geom);

-- Query uses index
SELECT * FROM locations WHERE ST_DWithin(geom, ST_MakePoint(-73.9, 40.7), 1000);
```

### Composite Indexes

### When to Use

- Queries filter on multiple columns
- Columns often used together
- Order matters (most selective first)

**Example**:

```sql
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

-- Query uses index
SELECT * FROM orders 
WHERE user_id = 1 AND created_at > '2023-01-01';

-- Query uses partial index (user_id)
SELECT * FROM orders WHERE user_id = 1;

-- Query does NOT use index (wrong order)
SELECT * FROM orders WHERE created_at > '2023-01-01';
```

### Partial Indexes

### When to Use

- Index only subset of data
- Reduce index size
- Filtered queries

**Example**:

```sql
-- Index only active users
CREATE INDEX idx_users_active ON users(email) 
WHERE is_active = true;

-- Query uses index
SELECT * FROM users WHERE is_active = true AND email = 'john@example.com';

-- Query does NOT use index
SELECT * FROM users WHERE email = 'john@example.com';
```

### Covering Indexes

### When to Use

- Index includes all columns needed
- Avoid table access
- Faster queries

**Example**:

```sql
-- Covering index
CREATE INDEX idx_orders_covering ON orders(user_id, created_at) 
INCLUDE (total, status);

-- Query uses only index (no table access)
SELECT user_id, created_at, total, status 
FROM orders 
WHERE user_id = 1;
```

### Index Maintenance

### When to Rebuild

- Index fragmentation
- Many updates/deletes
- Performance degradation

**Example**:

```sql
-- PostgreSQL
REINDEX INDEX idx_users_email;

-- MySQL
ANALYZE TABLE users;
OPTIMIZE TABLE users;
```

### Index Statistics

**Update Statistics**:

```sql
-- PostgreSQL
ANALYZE users;

-- MySQL
ANALYZE TABLE users;
```

### Index Best Practices

### 1. Index Foreign Keys

```sql
-- ✅ Good: Index foreign keys
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- ❌ Bad: No index on foreign key
-- JOIN queries will be slow
```

### 2. Don't Over-Index

```sql
-- ✅ Good: Index only what's needed
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_name ON users(name);

-- ❌ Bad: Index everything
-- Too many indexes slow down writes
```

### 3. Use EXPLAIN to Verify

```sql
-- Check if index is used
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'john@example.com';

-- Look for:
-- - Index Scan (good)
-- - Seq Scan (bad, unless table is small)
```

### 4. Consider Write vs Read Ratio

- **Read-heavy**: More indexes OK
- **Write-heavy**: Fewer indexes

### 5. Monitor Index Usage

```sql
-- PostgreSQL: Check unused indexes
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0;

-- Drop unused indexes
DROP INDEX idx_unused_index;
```

### Index on Expressions

### When to Use

- Query uses computed values
- Function-based queries

**Example**:

```sql
-- Index on lowercase email
CREATE INDEX idx_users_email_lower ON users (LOWER(email));

-- Query uses index
SELECT * FROM users WHERE LOWER(email) = 'john@example.com';
```

### Index on JSONB

### When to Use

- Query JSONB data
- Key/value lookups

**Example**:

```sql
-- GIN index on JSONB
CREATE INDEX idx_products_attributes ON products USING GIN(attributes);

-- Query uses index
SELECT * FROM products WHERE attributes @> '{"color": "red"}';

-- Index on specific key
CREATE INDEX idx_products_color ON products ((attributes->>'color'));

-- Query uses index
SELECT * FROM products WHERE attributes->>'color' = 'red';
```

### Unique Indexes

### When to Use

- Enforce uniqueness
- Business constraints

**Example**:

```sql
-- Unique index on email
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Unique index on composite columns
CREATE UNIQUE INDEX idx_orders_user_product ON orders(user_id, product_id);
```

### Concurrent Index Creation

### When to Use

- Create index without locking table
- Production systems

**Example**:

```sql
-- PostgreSQL
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);

-- Note: Cannot use CONCURRENTLY in transaction
```
