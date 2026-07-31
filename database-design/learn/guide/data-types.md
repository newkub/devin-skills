# Data Types

## Choosing Appropriate Types

| Use Case | Type | Example |
|----------|------|---------|
| **ID** | SERIAL/BIGINT | id SERIAL PRIMARY KEY |
| **Money** | DECIMAL | price DECIMAL(10,2) |
| **Text** | VARCHAR/TEXT | name VARCHAR(100) |
| **Boolean** | BOOLEAN | is_active BOOLEAN |
| **Date/Time** | TIMESTAMP/TIMESTAMPTZ | created_at TIMESTAMP |
| **JSON** | JSONB | attributes JSONB |

**Example**:

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) CHECK (price > 0),
    in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    attributes JSONB
);
```
