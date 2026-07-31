# Database Design

## CAP Theorem

**Consistency**: All nodes see same data simultaneously

**Availability**: Every request receives response

**Partition Tolerance**: System continues despite network partitions

**Trade-offs**:

| System | Choice | Use Case |
|--------|--------|----------|
| **CP** | Consistency + Partition | Financial systems |
| **AP** | Availability + Partition | Social media feeds |
| **CA** | Consistency + Availability | Single-node systems |

## Database Types

**Relational (SQL)**:
- Structured data
- ACID transactions
- Complex relationships

**NoSQL**:
- Document: MongoDB, CouchDB
- Key-Value: Redis, DynamoDB
- Column: Cassandra, HBase
- Graph: Neo4j, ArangoDB

**Selection Criteria**:

| Factor | SQL | NoSQL |
|--------|-----|-------|
| **Schema** | Fixed | Flexible |
| **Scaling** | Vertical | Horizontal |
| **Transactions** | ACID | Eventual consistency |
| **Query** | Complex queries | Simple queries |
| **Data Size** | TB scale | PB scale |

## Database Indexing

**Index Types**:

```sql
-- B-Tree Index (default)
CREATE INDEX idx_user_email ON users(email);

-- Composite Index
CREATE INDEX idx_user_name_email ON users(name, email);

-- Unique Index
CREATE UNIQUE INDEX idx_user_email ON users(email);

-- Partial Index
CREATE INDEX idx_active_users ON users(email) WHERE active = true;
```

**Index Trade-offs**:
- **Pros**: Faster reads
- **Cons**: Slower writes, more storage
