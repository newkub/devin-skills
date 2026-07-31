# Replication Mechanisms

## Master-Slave

**How it works**:
1. Master handles writes
2. Slaves replicate from master
3. Reads can go to slaves

**Example**:

```
Write: Master -> WAL -> Slaves
Read: Slaves -> Data
```

## Master-Master

**How it works**:
1. Multiple masters handle writes
2. Changes replicated between masters
3. Conflict resolution needed

**Example**:

```
Master 1: Write -> WAL -> Master 2
Master 2: Write -> WAL -> Master 1
```
