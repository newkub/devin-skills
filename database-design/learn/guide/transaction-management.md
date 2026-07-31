# Transaction Management

## Two-Phase Commit

**How it works**:
1. **Prepare phase**: Coordinator asks participants to prepare
2. **Commit phase**: Coordinator asks participants to commit

**Example**:

```
Coordinator: "Prepare to commit?"
Participant 1: "Ready"
Participant 2: "Ready"
Coordinator: "Commit"
Participant 1: "Committed"
Participant 2: "Committed"
```

## Savepoints

**How it works**:
1. Create savepoint within transaction
2. Rollback to savepoint if needed
3. Continue transaction

**Example**:

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
SAVEPOINT sp1;
UPDATE accounts SET balance = balance - 50 WHERE id = 1;
ROLLBACK TO sp1;  -- Rollback only second update
COMMIT;
```
