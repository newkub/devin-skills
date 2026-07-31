# Query Processing

## Parser

**How it works**:
1. Parse SQL query
2. Validate syntax
3. Build parse tree

**Example**:

```sql
SELECT * FROM users WHERE id = 1;
```

**Parse Tree**:
```
SELECT
├── *
└── FROM users
    └── WHERE id = 1
```

## Optimizer

**How it works**:
1. Generate multiple execution plans
2. Estimate costs using statistics
3. Choose lowest cost plan

**Example**:

```sql
-- Query can use index or full table scan
SELECT * FROM users WHERE email = 'john@example.com';

-- Optimizer chooses based on:
-- - Index existence
-- - Table size
-- - Selectivity
```

## Executor

**How it works**:
1. Execute chosen plan
2. Access data pages
3. Return results
