# Features

## Features ของ Database Types

### Relational Databases

| Feature | Description | Benefit |
|---------|-------------|---------|
| **ACID Transactions** | Atomic, Consistent, Isolated, Durable | Data integrity |
| **SQL Support** | Standardized query language | Interoperability |
| **Foreign Keys** | Referential integrity | Data consistency |
| **Indexes** | Fast lookups | Performance |
| **Views** | Virtual tables | Data abstraction |
| **Stored Procedures** | Server-side logic | Performance, security |

### PostgreSQL

| Feature | Description | Use Case |
|---------|-------------|----------|
| **JSONB** | Binary JSON with indexing | Semi-structured data |
| **Full-Text Search** | Built-in search | Search applications |
| **Array Types** | Native array support | Multi-value fields |
| **Extensions** | PostGIS, pgcrypto | Specialized features |
| **MVCC** | Multi-version concurrency | High concurrency |
| **Table Partitioning** | Horizontal partitioning | Large tables |

### MySQL

| Feature | Description | Use Case |
|---------|-------------|----------|
| **InnoDB** | ACID-compliant storage | Transactional workloads |
| **MyISAM** | Fast reads | Read-only workloads |
| **Replication** | Master-slave replication | High availability |
| **Query Cache** | Cache query results | Read-heavy workloads |
| **Partitioning** | Table partitioning | Large tables |

### NoSQL Databases

### MongoDB

| Feature | Description | Benefit |
|---------|-------------|---------|
| **Document Model** | JSON-like documents | Flexible schema |
| **Horizontal Scaling** | Sharding built-in | Scalability |
| **Aggregation Pipeline** | Complex queries | Data processing |
| **Change Streams** | Real-time updates | Event-driven apps |
| **Geospatial Queries** | Location-based queries | Location services |
| **GridFS** | File storage | Large files |

### Redis

| Feature | Description | Use Case |
|---------|-------------|----------|
| **In-Memory Storage** | Fast data access | Caching |
| **Data Structures** | Strings, lists, sets, hashes | Various use cases |
| **Pub/Sub** | Message passing | Real-time apps |
| **Transactions** | Multi-command atomic | Complex operations |
| **Persistence** | RDB/AOF | Durability |
| **Clustering** | Distributed Redis | High availability |

### Cassandra

| Feature | Description | Benefit |
|---------|-------------|---------|
| **Linear Scalability** | Add nodes for more capacity | High scalability |
| **No Single Point of Failure** | Peer-to-peer architecture | High availability |
| **Tunable Consistency** | Choose consistency level | Flexibility |
| **Multi-DC Replication** | Cross-datacenter replication | Disaster recovery |
| **Wide Column Store** | Efficient for time-series | Time-series data |

### Advanced Features

### Materialized Views

**Definition**: Pre-computed query results

**Example**:

```sql
CREATE MATERIALIZED VIEW user_order_counts AS
SELECT user_id, COUNT(*) as order_count
FROM orders
GROUP BY user_id;

-- Refresh periodically
REFRESH MATERIALIZED VIEW user_order_counts;
```

### Common Table Expressions (CTE)

**Definition**: Temporary result set

**Example**:

```sql
WITH user_stats AS (
    SELECT user_id, COUNT(*) as order_count
    FROM orders
    GROUP BY user_id
)
SELECT u.name, us.order_count
FROM users u
JOIN user_stats us ON u.id = us.user_id;
```

### Window Functions

**Definition**: Perform calculations across rows

**Example**:

```sql
SELECT 
    user_id,
    order_date,
    amount,
    SUM(amount) OVER (PARTITION BY user_id ORDER BY order_date) as running_total
FROM orders;
```

### Triggers

**Definition**: Automatic actions on data changes

**Example**:

```sql
CREATE TRIGGER update_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
```

### Stored Procedures

**Definition**: Pre-compiled SQL code

**Example**:

```sql
CREATE PROCEDURE get_user_orders(user_id INTEGER)
LANGUAGE SQL
AS $$
SELECT * FROM orders WHERE user_id = user_id;
$$;
```

### Full-Text Search

**Definition**: Text search with ranking

**Example**:

```sql
-- PostgreSQL
CREATE INDEX idx_products_fts ON products USING gin(to_tsvector('english', name));

SELECT * FROM products
WHERE to_tsvector('english', name) @@ to_tsquery('english', 'laptop');
```

### JSON Support

**Definition**: Store and query JSON data

**Example**:

```sql
-- PostgreSQL
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    attributes JSONB
);

-- Query JSON
SELECT * FROM products
WHERE attributes->>'color' = 'red';

-- Index JSON
CREATE INDEX idx_products_attributes ON products USING gin(attributes);
```

### Partitioning

**Definition**: Split table into smaller parts

**Example**:

```sql
-- PostgreSQL
CREATE TABLE orders (
    id SERIAL,
    order_date DATE,
    amount DECIMAL
) PARTITION BY RANGE (order_date);

CREATE TABLE orders_2023 PARTITION OF orders
    FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');
```

### Replication

### Streaming Replication

**Feature**: Real-time data copying

**Benefits**:
- High availability
- Read scaling
- Disaster recovery

### Logical Replication

**Feature**: Row-level replication

**Benefits**:
- Selective replication
- Cross-database replication
- Data migration
