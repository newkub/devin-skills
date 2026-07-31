# Algorithms

## Algorithms ที่ใช้บ่อย

### Sorting Algorithms

### Comparison-Based Sorting

#### Bubble Sort

**Description**: Repeatedly swap adjacent elements if in wrong order

**Complexity**:
- Time: O(n²) worst/average, O(n) best
- Space: O(1)
- Stable: Yes

**When to use**:
- Small datasets
- Nearly sorted data
- Educational purposes

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

#### Insertion Sort

**Description**: Build sorted array one element at a time

**Complexity**:
- Time: O(n²) worst/average, O(n) best
- Space: O(1)
- Stable: Yes

**When to use**:
- Small datasets
- Nearly sorted data
- Online sorting

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

#### Merge Sort

**Description**: Divide and conquer, merge sorted halves

**Complexity**:
- Time: O(n log n) all cases
- Space: O(n)
- Stable: Yes

**When to use**:
- Large datasets
- Stable sort required
- External sorting

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

#### Quick Sort

**Description**: Partition around pivot, recursively sort partitions

**Complexity**:
- Time: O(n log n) average, O(n²) worst
- Space: O(log n)
- Stable: No

**When to use**:
- General purpose sorting
- Average case performance important
- In-place sorting needed

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### Searching Algorithms

#### Linear Search

**Description**: Check each element sequentially

**Complexity**:
- Time: O(n)
- Space: O(1)

**When to use**:
- Unsorted data
- Small datasets
- Simple implementation

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

#### Binary Search

**Description**: Divide search space in half each iteration

**Complexity**:
- Time: O(log n)
- Space: O(1)

**When to use**:
- Sorted data
- Large datasets
- Frequent searches

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### Graph Algorithms

#### BFS (Breadth-First Search)

**Description**: Level-by-level traversal

**Complexity**:
- Time: O(V + E)
- Space: O(V)

**When to use**:
- Shortest path (unweighted)
- Level-order traversal
- Connected components

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

#### DFS (Depth-First Search)

**Description**: Explore as deep as possible before backtracking

**Complexity**:
- Time: O(V + E)
- Space: O(V)

**When to use**:
- Path finding
- Cycle detection
- Topological sort

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

#### Dijkstra's Algorithm

**Description**: Shortest path with non-negative weights

**Complexity**:
- Time: O((V + E) log V)
- Space: O(V)

**When to use**:
- Shortest path with weights
- Navigation systems
- Network routing

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### Dynamic Programming

#### Fibonacci (Memoization)

**Description**: Cache results to avoid recomputation

**Complexity**:
- Time: O(n)
- Space: O(n)

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

#### Knapsack Problem

**Description**: Maximize value with weight constraint

**Complexity**:
- Time: O(nW) where n = items, W = capacity
- Space: O(nW)

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### String Algorithms

#### KMP (Knuth-Morris-Pratt)

**Description**: Pattern matching with preprocessing

**Complexity**:
- Time: O(n + m) where n = text, m = pattern
- Space: O(m)

**When to use**:
- Pattern matching
- String search
- Text processing

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### Greedy Algorithms

#### Activity Selection

**Description**: Select maximum value activities

**Complexity**:
- Time: O(n log n) with sorting
- Space: O(n)

**When to use**:
- Scheduling problems
- Optimization with greedy choice property

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

