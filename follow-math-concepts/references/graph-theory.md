# Graph Theory

## Goal

Understand graph theory: nodes, edges, directed/undirected graphs, trees, DAGs, paths, cycles, connectivity, and their use in dependencies, workflows, and data structures

## Scope

- Use for dependency analysis, task scheduling, networks, trees
- Covers graph representations, traversals, topological sort, shortest path
- Includes cycles, connected components, bipartite graphs

## Execute

### 1. Define Graph

> Goal: identify the graph of the problem

1. Identify the nodes: tasks, files, packages, services
2. Identify the edges: dependencies, calls, references
3. Decide directed vs undirected, weighted vs unweighted
4. Choose a representation: adjacency list, adjacency matrix, edge list

### 2. Analyze Properties

> Goal: find the key properties

1. Find cycles with DFS or union-find
2. Find connected components
3. Check bipartiteness with BFS 2-coloring
4. Find each node's in-degree/out-degree

### 3. Traversal And Search

> Goal: walk the graph

1. BFS for shortest path in an unweighted graph
2. DFS for topological sort and cycle detection
3. Dijkstra for shortest path in a weighted graph
4. Topological sort for a DAG

### 4. Apply To Dependencies

> Goal: analyze dependencies

1. Build the dependency graph from `package.json` or `moon.yml`
2. Find circular dependencies
3. Find the topological order for build / deploy
4. Find the impacted nodes when one node changes

### 5. Map To Code

> Goal: apply it in code

1. Use a graph for the monorepo project graph
2. Use a tree for the DOM, AST, file system
3. Use a DAG for the CI/CD pipeline
4. Use shortest path for routing

## Rules

### 1. Representation Choice

- Adjacency list suits sparse graphs
- Adjacency matrix suits dense graphs
- Edge list suits Kruskal/union-find

### 2. Cycle Detection

- Use DFS with 3 colors (white, gray, black) for directed graphs
- Use union-find for undirected graphs
- Always report the cycle path when found

### 3. Code Mapping

- `Map<Node, Set<Node>>` for an adjacency list
- Use a queue/stack for BFS/DFS
- Use a library like `graphlib` when needed

- Use /follow-math-concepts if needed
- Use /deep-review-codebase if needed
- Use /follow-monorepo if needed

## Expected Outcome

- Able to build a graph from the problem
- Able to find cycles, paths, components
- Able to do a topological sort
- Able to apply it in dependencies and workflows
