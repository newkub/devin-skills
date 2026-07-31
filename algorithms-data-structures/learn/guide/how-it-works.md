# How It Works

## Algorithms และ Data Structures ทำงานอย่างไร

### Sorting Algorithms

### Bubble Sort

**How it works**:
1. Compare adjacent elements
2. Swap if they're in wrong order
3. Repeat until no swaps needed

**Visualization**:

```
Pass 1: [5, 1, 4, 2, 8]
         [1, 5, 4, 2, 8]
         [1, 4, 5, 2, 8]
         [1, 4, 2, 5, 8]
         [1, 4, 2, 5, 8]

Pass 2: [1, 4, 2, 5, 8]
         [1, 2, 4, 5, 8]
         [1, 2, 4, 5, 8]
         [1, 2, 4, 5, 8]
```

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### Merge Sort

**How it works**:
1. Divide array into halves
2. Recursively sort each half
3. Merge sorted halves

**Visualization**:

```
[5, 1, 4, 2, 8]
     ↓ divide
[5, 1, 4] [2, 8]
     ↓ divide
[5, 1] [4] [2] [8]
     ↓ sort
[1, 5] [4] [2] [8]
     ↓ merge
[1, 4, 5] [2, 8]
     ↓ merge
[1, 2, 4, 5, 8]
```

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### Quick Sort

**How it works**:
1. Choose pivot element
2. Partition array around pivot
3. Recursively sort partitions

**Visualization**:

```
[5, 1, 4, 2, 8]
     ↓ pivot = 5
[1, 4, 2] [5] [8]
     ↓ pivot = 2
[1] [2] [4] [5] [8]
     ↓ merge
[1, 2, 4, 5, 8]
```

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### Searching Algorithms

### Binary Search

**How it works**:
1. Compare target with middle element
2. If equal, return index
3. If target < middle, search left half
4. If target > middle, search right half

**Visualization**:

```
[1, 2, 3, 4, 5, 6, 7, 8, 9]
     ↓ target = 6
[1, 2, 3, 4] [5] [6, 7, 8, 9]
     ↓ 6 > 5
[6] [7, 8, 9]
     ↓ 6 == 6
Found at index 5
```

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### Graph Traversal

### BFS (Breadth-First Search)

**How it works**:
1. Start from source node
2. Visit all neighbors
3. Add neighbors to queue
4. Repeat until queue empty

**Visualization**:

```
     A
    / \
   B   C
  / \   \
 D   E   F

BFS Order: A → B → C → D → E → F
```

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### DFS (Depth-First Search)

**How it works**:
1. Start from source node
2. Visit one neighbor
3. Recursively visit its neighbors
4. Backtrack when no unvisited neighbors

**Visualization**:

```
     A
    / \
   B   C
  / \   \
 D   E   F

DFS Order: A → B → D → E → C → F
```

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### Dynamic Programming

### Fibonacci with Memoization

**How it works**:
1. Check if result already computed
2. If yes, return cached result
3. If no, compute and cache result

**Visualization**:

```
fib(5)
  ↓
fib(4) + fib(3)
  ↓       ↓
fib(3) + fib(2) + fib(2) + fib(1)
  ↓       ↓       ↓       ↓
fib(2) + fib(1) + fib(1) + fib(0) + ...
```

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### Knapsack Problem

**How it works**:
1. Create DP table
2. For each item, consider including or excluding it
3. Fill table with maximum value

**Visualization**:

```
Items: (weight, value)
      A: (2, 3)
      B: (3, 4)
      C: (4, 5)
      D: (5, 6)

Capacity: 5

DP Table:
   0  1  2  3  4  5
0  0  0  0  0  0  0
A  0  0  3  3  3  3
B  0  0  3  4  4  7
C  0  0  3  4  5  7
D  0  0  3  4  5  7
```

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### Hash Tables

### Hash Function

**How it works**:
1. Take key as input
2. Apply hash function
3. Return index in array

**Example**:

```	ypescript\n// TypeScript/Bun example\n```

### Collision Resolution

**Chaining**:
- Each bucket contains linked list
- Multiple keys can map to same bucket

**Open Addressing**:
- Find next available slot
- Linear probing, quadratic probing, double hashing

**Example**:

```	ypescript\n// TypeScript/Bun example\n```

