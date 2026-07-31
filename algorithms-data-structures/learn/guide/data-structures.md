# Data Structures

## Data Structures ที่ใช้บ่อย

### Linear Data Structures

### Arrays

**Characteristics**:
- Contiguous memory
- O(1) access by index
- O(n) search
- Fixed size (static arrays)

**Operations**:

| Operation | Time | Space |
|-----------|------|-------|
| **Access** | O(1) | O(1) |
| **Search** | O(n) | O(1) |
| **Insert (end)** | O(1) amortized | O(1) |
| **Insert (beginning)** | O(n) | O(1) |
| **Delete** | O(n) | O(1) |

**Use Cases**:
- Random access needed
- Known size
- Memory efficiency important

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### Linked Lists

**Characteristics**:
- Non-contiguous memory
- O(n) access by index
- O(1) insert/delete at head
- Dynamic size

**Operations**:

| Operation | Time | Space |
|-----------|------|-------|
| **Access** | O(n) | O(1) |
| **Search** | O(n) | O(1) |
| **Insert (head)** | O(1) | O(1) |
| **Delete (head)** | O(1) | O(1) |
| **Insert (tail)** | O(n) | O(1) |

**Use Cases**:
- Frequent insertions/deletions
- Unknown size
- Memory fragmentation acceptable

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### Doubly Linked Lists

**Characteristics**:
- Bidirectional traversal
- O(1) insert/delete at both ends
- More memory (two pointers)

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### Stacks

**Characteristics**:
- LIFO (Last In, First Out)
- O(1) push and pop
- Used for recursion, expression evaluation

**Operations**:

| Operation | Time | Space |
|-----------|------|-------|
| **Push** | O(1) | O(1) |
| **Pop** | O(1) | O(1) |
| **Peek** | O(1) | O(1) |
| **isEmpty** | O(1) | O(1) |

**Use Cases**:
- Undo operations
- Expression evaluation
- Function call stack
- Backtracking

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### Queues

**Characteristics**:
- FIFO (First In, First Out)
- O(1) enqueue and dequeue
- Used for BFS, task scheduling

**Operations**:

| Operation | Time | Space |
|-----------|------|-------|
| **Enqueue** | O(1) | O(1) |
| **Dequeue** | O(1) | O(1) |
| **Peek** | O(1) | O(1) |
| **isEmpty** | O(1) | O(1) |

**Use Cases**:
- Task scheduling
- BFS traversal
- Buffering
- Producer-consumer

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### Priority Queues

**Characteristics**:
- Elements have priorities
- Always access highest/lowest priority
- Implemented with heaps

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### Hash Tables

**Characteristics**:
- O(1) average case operations
- O(n) worst case (collisions)
- Key-value pairs

**Operations**:

| Operation | Time (Average) | Time (Worst) | Space |
|-----------|----------------|---------------|-------|
| **Insert** | O(1) | O(n) | O(1) |
| **Delete** | O(1) | O(n) | O(1) |
| **Search** | O(1) | O(n) | O(1) |

**Use Cases**:
- Caching
- Fast lookups
- Implementing sets/dictionaries
- Symbol tables

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### Trees

### Binary Trees

**Characteristics**:
- Hierarchical structure
- Each node has at most 2 children
- O(log n) search (if balanced)

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### Binary Search Trees (BST)

**Characteristics**:
- Left subtree < node
- Right subtree > node
- O(log n) search (balanced)

**Operations**:

| Operation | Time (Average) | Time (Worst) |
|-----------|----------------|---------------|
| **Search** | O(log n) | O(n) |
| **Insert** | O(log n) | O(n) |
| **Delete** | O(log n) | O(n) |

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### Heaps

**Characteristics**:
- Complete binary tree
- Parent >= children (max heap) or <= children (min heap)
- O(1) access to min/max
- O(log n) insert/delete

**Operations**:

| Operation | Time | Space |
|-----------|------|-------|
| **Peek** | O(1) | O(1) |
| **Insert** | O(log n) | O(1) |
| **Extract** | O(log n) | O(1) |

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### Graphs

### Graph Representations

**Adjacency List**:

```	ypescript\n// TypeScript/Bun example\n```

**Adjacency Matrix**:

```	ypescript\n// TypeScript/Bun example\n```

