# Time Complexity Reference

## Big-O Notation

| Notation | Name | Example |
|---|---|---|
| `O(1)` | Constant | Array index access |
| `O(log n)` | Logarithmic | Binary search |
| `O(n)` | Linear | Single loop |
| `O(n log n)` | Linearithmic | Merge sort, heap sort |
| `O(n^2)` | Quadratic | Nested loops, bubble sort |
| `O(2^n)` | Exponential | Recursive Fibonacci |
| `O(n!)` | Factorial | Permutations |

## Common Algorithm Complexities

### Sorting

| Algorithm | Best | Average | Worst | Space |
|---|---|---|---|---|
| Quick sort | `O(n log n)` | `O(n log n)` | `O(n^2)` | `O(log n)` |
| Merge sort | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(n)` |
| Heap sort | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(1)` |
| Insertion sort | `O(n)` | `O(n^2)` | `O(n^2)` | `O(1)` |

### Searching

| Algorithm | Best | Average | Worst | Space |
|---|---|---|---|---|
| Binary search | `O(1)` | `O(log n)` | `O(log n)` | `O(1)` |
| Linear search | `O(1)` | `O(n)` | `O(n)` | `O(1)` |
| Hash table lookup | `O(1)` | `O(1)` | `O(n)` | `O(n)` |

### Graph

| Algorithm | Time | Space |
|---|---|---|
| BFS | `O(V + E)` | `O(V)` |
| DFS | `O(V + E)` | `O(V)` |
| Dijkstra | `O((V + E) log V)` | `O(V)` |
| A* | `O(E)` | `O(V)` |

## Analysis Guidelines

- Always state best/average/worst case
- Compute space complexity including input and auxiliary space
- Identify bottlenecks and hot paths
- Consider amortized complexity for data structures (e.g. dynamic arrays)
- Consider cache-friendly access patterns (locality of reference)

## Source

- https://www.bigocheatsheet.com/
- https://en.wikipedia.org/wiki/Big_O_notation
- CLRS: Introduction to Algorithms
