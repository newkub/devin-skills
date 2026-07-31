# Sharding

## Horizontal Sharding

**How it works**:
1. Split data by key (e.g., user_id)
2. Each shard has subset of data
3. Router directs queries to correct shard

**Example**:

```
Shard 1: user_id % 3 == 0
Shard 2: user_id % 3 == 1
Shard 3: user_id % 3 == 2
```

## Vertical Sharding

**How it works**:
1. Split tables by columns
2. Each shard has different tables
3. Join across shards if needed

**Example**:

```
Shard 1: users (id, name, email)
Shard 2: user_profiles (id, bio, avatar)
```
