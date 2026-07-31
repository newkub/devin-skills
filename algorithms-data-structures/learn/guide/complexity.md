# Complexity

## Time และ Space Complexity Analysis

### Time Complexity

### Common Patterns

| Pattern | Complexity | Example |
|---------|-------------|---------|
| **Single Loop** | O(n) | Linear search |
| **Nested Loops** | O(n²) | Bubble sort |
| **Binary Search** | O(log n) | Binary search |
| **Divide and Conquer** | O(n log n) | Merge sort |
| **Recursion** | O(branches^depth) | Tree traversal |

### Analysis Examples

**Example 1: Single Loop**

```	ypescript\n// TypeScript/Bun example\n```

**Example 2: Nested Loops**

```	ypescript\n// TypeScript/Bun example\n```

**Example 3: Binary Search**

```	ypescript\n// TypeScript/Bun example\n```

### Recursive Complexity

### Master Theorem

T(n) = aT(n/b) + f(n)

| Case | Condition | Complexity |
|------|-----------|-------------|
| **1** | f(n) = O(n^c) where c < log_b(a) | O(n^log_b(a)) |
| **2** | f(n) = O(n^log_b(a)) | O(n^log_b(a) log n) |
| **3** | f(n) = O(n^c) where c > log_b(a) | O(f(n)) |

**Example - Merge Sort**:

```
T(n) = 2T(n/2) + O(n)
a = 2, b = 2, f(n) = O(n)
log_b(a) = log_2(2) = 1
c = 1 = log_b(a)
Case 2: O(n log n)
```

### Space Complexity

### Auxiliary Space

**Example 1: Iterative**

```	ypescript\n// TypeScript/Bun example\n```

**Example 2: Recursive**

```	ypescript\n// TypeScript/Bun example\n```

### Data Structure Space

| Data Structure | Space Complexity |
|----------------|------------------|
| **Array** | O(n) |
| **Linked List** | O(n) |
| **Hash Table** | O(n) |
| **Binary Tree** | O(n) |
| **Graph (Adjacency List)** | O(V + E) |
| **Graph (Adjacency Matrix)** | O(V²) |

### Trade-offs

### Time vs Space

**Example - Fibonacci**:

```	ypescript\n// TypeScript/Bun example\n```

### Amortized Analysis

**Dynamic Array (ArrayList)**:

- Append: O(1) amortized
- Insert at beginning: O(n)
- Access by index: O(1)

**Explanation**:
- Occasional resize: O(n)
- But happens rarely (doubling size)
- Average over many operations: O(1)

### Best, Average, Worst Case

| Algorithm | Best | Average | Worst |
|-----------|------|---------|-------|
| **Linear Search** | O(1) | O(n) | O(n) |
| **Binary Search** | O(1) | O(log n) | O(log n) |
| **Quick Sort** | O(n log n) | O(n log n) | O(n²) |
| **Merge Sort** | O(n log n) | O(n log n) | O(n log n) |
| **Bubble Sort** | O(n) | O(n²) | O(n²) |

### Lower Bounds

### Comparison Sort Lower Bound

**Theorem**: Comparison-based sorting requires Ω(n log n) comparisons

**Proof Sketch**:
- n! possible permutations
- Each comparison eliminates at most half
- Need log(n!) comparisons
- log(n!) = Ω(n log n)

**Implications**:
- Cannot beat O(n log n) with comparison-based sorting
- Non-comparison sorts (radix, counting) can be O(n)

### Space-Time Trade-off

**Example - Hash Table**:

| Operation | Time | Space |
|-----------|------|-------|
| **Small Table** | O(n) worst case | O(n) |
| **Large Table** | O(1) average | O(n) |

**Trade-off**: More space → better time complexity

### Practical Considerations

### Constant Factors

Big O ignores constants, but they matter in practice:

```	ypescript\n// TypeScript/Bun example\n```

### Cache Effects

Cache locality affects actual performance:

```	ypescript\n// TypeScript/Bun example\n```


