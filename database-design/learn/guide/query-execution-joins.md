# Query Execution Joins

## Nested Loop Join

**How it works**:
1. For each row in outer table
2. Scan inner table for matches
3. O(n*m) complexity

**Example**:

```sql
SELECT * FROM users u
JOIN orders o ON u.id = o.user_id;

-- Execution:
for each user in users:
    for each order in orders:
        if user.id == order.user_id:
            return (user, order)
```

## Hash Join

**How it works**:
1. Build hash table from smaller table
2. Probe hash table with larger table
3. O(n + m) complexity

**Example**:

```sql
-- Build hash table from users
hash_table = {user.id: user for user in users}

-- Probe with orders
for order in orders:
    if order.user_id in hash_table:
        return (hash_table[order.user_id], order)
```

## Merge Join

**How it works**:
1. Sort both tables on join key
2. Merge sorted lists
3. O(n log n + m log m) complexity

**Example**:

```sql
-- Sort users by id
users_sorted = sort(users, by=id)

-- Sort orders by user_id
orders_sorted = sort(orders, by=user_id)

-- Merge
while users_sorted and orders_sorted:
    if users_sorted[0].id == orders_sorted[0].user_id:
        return (users_sorted[0], orders_sorted[0])
    elif users_sorted[0].id < orders_sorted[0].user_id:
        users_sorted.pop(0)
    else:
        orders_sorted.pop(0)
```
