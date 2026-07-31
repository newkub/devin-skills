# Features

## Features ของ Algorithms และ Data Structures

### Data Structure Features

### Arrays

| Feature | Description | Use Case |
|---------|-------------|----------|
| **Random Access** | O(1) access by index | Fast lookups |
| **Cache Friendly** | Contiguous memory | Better performance |
| **Fixed Size** | Size determined at creation | Known-size data |
| **Simple Implementation** | Easy to understand | Basic operations |

### Linked Lists

| Feature | Description | Use Case |
|---------|-------------|----------|
| **Dynamic Size** | Grow/shrink at runtime | Unknown-size data |
| **Efficient Insert/Delete** | O(1) at head | Frequent modifications |
| **No Wasted Space** | Only allocate needed memory | Memory efficiency |
| **Sequential Access** | Must traverse from head | Sequential processing |

### Stacks

| Feature | Description | Use Case |
|---------|-------------|----------|
| **LIFO Order** | Last in, first out | Undo operations |
| **O(1) Operations** | Push and pop are constant | Fast operations |
| **Recursion Support** | Call stack implementation | Recursive algorithms |
| **Expression Evaluation** | Parse mathematical expressions | Compilers |

### Queues

| Feature | Description | Use Case |
|---------|-------------|----------|
| **FIFO Order** | First in, first out | Task scheduling |
| **O(1) Operations** | Enqueue and dequeue constant | Fast operations |
| **BFS Support** | Natural for breadth-first search | Graph traversal |
| **Buffering** | Producer-consumer patterns | Async processing |

### Hash Tables

| Feature | Description | Use Case |
|---------|-------------|----------|
| **O(1) Average Case** | Fast insert, delete, search | Caching, lookups |
| **Key-Value Pairs** | Associate keys with values | Dictionaries |
| **Flexible Keys** | Various key types | General purpose |
| **Collision Handling** | Manage hash collisions | Robust implementation |

### Trees

### Binary Search Trees

| Feature | Description | Use Case |
|---------|-------------|----------|
| **Ordered Data** | Maintains sorted order | Sorted collections |
| **O(log n) Search** | Fast search (balanced) | Quick lookups |
| **Dynamic Operations** | Insert/delete efficiently | Changing datasets |
| **Range Queries** | Find elements in range | Database indexes |

### Heaps

| Feature | Description | Use Case |
|---------|-------------|----------|
| **Priority Queue** | Always access min/max | Task scheduling |
| **O(1) Peek** | Access min/max constant | Priority operations |
| **O(log n) Insert/Delete** | Efficient modifications | Dynamic priorities |
| **Heap Sort** | In-place sorting | Memory-constrained sorting |

### Graphs

### Graph Features

| Feature | Description | Use Case |
|---------|-------------|----------|
| **Relationships** | Model connections | Social networks |
| **Path Finding** | Find shortest paths | Navigation |
| **Cycles Detection** | Detect circular dependencies | Dependency resolution |
| **Connectivity** | Determine connected components | Network analysis |

### Algorithm Features

### Sorting Algorithms

| Algorithm | Stable | In-Place | Adaptive | Best For |
|-----------|--------|----------|----------|-----------|
| **Bubble Sort** | Yes | Yes | Yes | Nearly sorted data |
| **Insertion Sort** | Yes | Yes | Yes | Small datasets |
| **Merge Sort** | Yes | No | No | Large datasets |
| **Quick Sort** | No | Yes | Yes | General purpose |
| **Heap Sort** | No | Yes | No | Memory constraints |

### Searching Algorithms

| Algorithm | Requires Sorted | Data Structure | Best For |
|-----------|----------------|----------------|----------|
| **Linear Search** | No | Any | Small datasets |
| **Binary Search** | Yes | Array | Large sorted datasets |
| **Hash Search** | No | Hash Table | Fast lookups |
| **Interpolation Search** | Yes | Array | Uniformly distributed data |

### Graph Algorithms

| Algorithm | Graph Type | Use Case |
|-----------|-----------|----------|
| **BFS** | Any | Shortest path (unweighted) |
| **DFS** | Any | Path finding, cycle detection |
| **Dijkstra** | Weighted (non-negative) | Shortest path |
| **Bellman-Ford** | Weighted (any) | Negative weights |
| **Floyd-Warshall** | Weighted | All pairs shortest path |
| **Kruskal** | Weighted | Minimum spanning tree |
| **Prim** | Weighted | Minimum spanning tree |

### Dynamic Programming Features

| Technique | Use Case | Optimization |
|-----------|----------|-------------|
| **Memoization** | Recursive problems | Avoid recomputation |
| **Tabulation** | Iterative problems | Bottom-up approach |
| **Space Optimization** | Memory constraints | Reduce space complexity |
| **State Compression** | Large state spaces | Reduce state representation |

### Advanced Features

### Parallel Algorithms

| Feature | Description | Use Case |
|---------|-------------|----------|
| **Parallel Sort** | Sort with multiple threads | Large datasets |
| **Parallel BFS** | Traverse graph in parallel | Large graphs |
| **MapReduce** | Process data in parallel | Big data |

### Approximation Algorithms

| Feature | Description | Use Case |
|---------|-------------|----------|
| **Approximation Ratio** | Guarantee solution quality | NP-hard problems |
| **Heuristics** | Rule-based solutions | Complex problems |
| **Randomized Algorithms** | Use randomness | Monte Carlo methods |

### Online Algorithms

| Feature | Description | Use Case |
|---------|-------------|----------|
| **No Future Knowledge** | Process data as it arrives | Streaming data |
| **Competitive Ratio** | Compare to optimal solution | Online optimization |
| **Adaptive** | Adjust to data patterns | Dynamic environments |
