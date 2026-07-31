# Index Structures

## B-Tree Index

**How it works**:
1. Balanced tree structure
2. O(log n) search
3. Supports range queries

**Example**:

```
Index on email:
[alex@example.com] -> [Page 1, Row 1]
[bob@example.com] -> [Page 2, Row 1]
[john@example.com] -> [Page 3, Row 1]
```

## Hash Index

**How it works**:
1. Hash function maps keys to buckets
2. O(1) average search
3. Supports equality only

**Example**:

```
Hash on id:
hash(1) -> Bucket 1 -> [Row 1]
hash(2) -> Bucket 2 -> [Row 2]
```
