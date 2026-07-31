# Storage Mechanisms

## Page-Based Storage

**How it works**:
1. Data stored in fixed-size pages (typically 8KB)
2. Pages organized in B-tree
3. Pages cached in memory

**Example**:

```
Page 1: [Row 1, Row 2, Row 3]
Page 2: [Row 4, Row 5, Row 6]
...
```

## B-Tree Structure

**How it works**:
1. Root node points to intermediate nodes
2. Intermediate nodes point to leaf nodes
3. Leaf nodes contain actual data

**Example**:

```
          [Root]
         /      \
   [Node 1]   [Node 2]
   /    \      /    \
[Leaf] [Leaf] [Leaf] [Leaf]
```
