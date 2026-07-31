# Key Concept

## Algorithms และ Data Structures Fundamentals

### Complexity Analysis

### Big O Notation

Big O ใช้วัด efficiency ของ algorithms:

| Notation | Description | Example |
|-----------|-------------|---------|
| **O(1)** | Constant time | Array access |
| **O(log n)** | Logarithmic | Binary search |
| **O(n)** | Linear | Linear search |
| **O(n log n)** | Linearithmic | Merge sort |
| **O(n²)** | Quadratic | Bubble sort |
| **O(2ⁿ)** | Exponential | Recursive Fibonacci |
| **O(n!)** | Factorial | Permutations |

**Example**:

```	ypescript\n// TypeScript/Bun example\n```

### Space Complexity

Space complexity วัด memory usage:

| Notation | Description | Example |
|-----------|-------------|---------|
| **O(1)** | Constant space | Variables |
| **O(n)** | Linear space | Array of size n |
| **O(n²)** | Quadratic space | 2D array |
| **O(log n)** | Logarithmic space | Recursion depth |

**Example**:

```	ypescript\n// TypeScript/Bun example\n```

### Data Structures

### Arrays

**Characteristics**:
- O(1) access by index
- O(n) search
- O(n) insert/delete (at beginning)
- Fixed size (static arrays)

**Example**:

```	ypescript\n// TypeScript/Bun example\n```

### Linked Lists

**Characteristics**:
- O(n) access by index
- O(1) insert/delete at head
- Dynamic size
- Extra memory for pointers

**Example**:

```	ypescript\n// TypeScript/Bun example\n```

### Stacks

**Characteristics**:
- LIFO (Last In, First Out)
- O(1) push and pop
- Used for recursion, expression evaluation

**Example**:

```	ypescript\n// TypeScript/Bun example\n```

### Queues

**Characteristics**:
- FIFO (First In, First Out)
- O(1) enqueue and dequeue
- Used for BFS, task scheduling

**Example**:

```	ypescript\n// TypeScript/Bun example\n```

### Hash Tables

**Characteristics**:
- O(1) average case for insert, delete, search
- O(n) worst case (collisions)
- Used for caching, fast lookups

**Example**:

```	ypescript\n// TypeScript/Bun example\n```

### Trees

### Binary Trees

**Characteristics**:
- Hierarchical structure
- O(log n) search (if balanced)
- O(n) worst case (unbalanced)

**Example**:

```	ypescript\n// TypeScript/Bun example\n```

### Binary Search Trees (BST)

**Properties**:
- Left subtree < node
- Right subtree > node
- O(log n) search (balanced)

**Example**:

```	ypescript\n// TypeScript/Bun example\n```

### Graphs

### Graph Representations

**Adjacency Matrix**:
- O(1) edge check
- O(V²) space
- Good for dense graphs

**Adjacency List**:
- O(V + E) space
- O(degree) edge check
- Good for sparse graphs

**Example**:

```	ypescript\n// TypeScript/Bun example\n```

### Sorting Algorithms

### Comparison-Based Sorting

| Algorithm | Time (Best) | Time (Average) | Time (Worst) | Space | Stable |
|-----------|-------------|----------------|-------------|-------|---------|
| **Bubble Sort** | O(n) | O(n²) | O(n²) | O(1) | Yes |
| **Insertion Sort** | O(n) | O(n²) | O(n²) | O(1) | Yes |
| **Merge Sort** | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| **Quick Sort** | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| **Heap Sort** | O(n log n) | O(n log n) | O(n log n) | O(1) | No |

### Searching Algorithms

| Algorithm | Time (Best) | Time (Average) | Time (Worst) | Space | Prerequisite |
|-----------|-------------|----------------|-------------|-------|--------------|
| **Linear Search** | O(1) | O(n) | O(n) | O(1) | None |
| **Binary Search** | O(1) | O(log n) | O(log n) | O(1) | Sorted array |
| **Hash Search** | O(1) | O(1) | O(n) | O(n) | Hash table |

### Graph Algorithms

### Traversal

| Algorithm | Time | Space | Use Case |
|-----------|------|-------|----------|
| **BFS** | O(V + E) | O(V) | Shortest path (unweighted) |
| **DFS** | O(V + E) | O(V) | Path finding, cycle detection |

### Shortest Path

| Algorithm | Time | Space | Use Case |
|-----------|------|-------|----------|
| **Dijkstra** | O((V + E) log V) | O(V) | Non-negative weights |
| **Bellman-Ford** | O(VE) | O(V) | Negative weights |
| **Floyd-Warshall** | O(V³) | O(V²) | All pairs shortest path |

### Dynamic Programming

### Key Concepts

1. **Overlapping Subproblems**: Same subproblems solved multiple times
2. **Optimal Substructure**: Optimal solution can be constructed from optimal solutions of subproblems
3. **Memoization**: Cache results of expensive function calls

**Example - Fibonacci**:

```	ypescript\n// TypeScript/Bun example\n```

