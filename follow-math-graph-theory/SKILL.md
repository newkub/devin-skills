---
name: follow-math-graph-theory
description: ใช้ graphs, trees, DAGs, paths, cycles ใน dependencies, workflows, และ data structures
argument-hint: "[problem]"
related:
  - follow-math-discrete-math
  - follow-algorithms
  - follow-data-structures
  - follow-monorepo
  - follow-tool-moonrepo
  - follow-math-concepts
---

## Goal

เข้าใจ graph theory: nodes, edges, directed/undirected graphs, trees, DAGs, paths, cycles, connectivity และประยุกต์ใช้ใน dependencies, workflows, data structures

## Scope

- ใช้สำหรับ dependency analysis, task scheduling, network, trees
- ครอบคลุม graph representations, traversals, topological sort, shortest path
- แนะนำ cycles, connected components, bipartite graphs

## Execute

### 1. Define Graph

> Goal: ระบุ graph ของปัญหา

1. ระบุ nodes: tasks, files, packages, services
2. ระบุ edges: dependencies, calls, references
3. ระบุ directed vs undirected, weighted vs unweighted
4. เลือก representation: adjacency list, adjacency matrix, edge list

### 2. Analyze Properties

> Goal: หาคุณสมบัติสำคัญ

1. หา cycles ด้วย DFS หรือ union-find
2. หา connected components
3. ตรวจ bipartite ด้วย BFS 2-coloring
4. หา in-degree/out-degree ของแต่ละ node

### 3. Traversal And Search

> Goal: เดินไปตาม graph

1. BFS สำหรับ shortest path ใน unweighted graph
2. DFS สำหรับ topological sort, cycle detection
3. Dijkstra สำหรับ shortest path ใน weighted graph
4. Topological sort สำหรับ DAG

### 4. Apply To Dependencies

> Goal: วิเคราะห์ dependencies

1. สร้าง dependency graph จาก `package.json` หรือ `moon.yml`
2. หา circular dependencies
3. หา topological order สำหรับ build / deploy
4. หา impacted nodes เมื่อแก้ไข node หนึ่ง

### 5. Map To Code

> Goal: ประยุกต์ใน code

1. ใช้ graph สำหรับ monorepo project graph
2. ใช้ tree สำหรับ DOM, AST, file system
3. ใช้ DAG สำหรับ CI/CD pipeline
4. ใช้ shortest path สำหรับ routing

## Rules

### 1. Representation Choice

- adjacency list เหมาะกับ graph sparse
- adjacency matrix เหมาะกับ graph dense
- edge list เหมาะกับ Kruskal/union-find

### 2. Cycle Detection

- ใช้ DFS 3 colors (white, gray, black) สำหรับ directed graph
- ใช้ union-find สำหรับ undirected graph
- ต้องรายงาน cycle path เมื่อพบ

### 3. Code Mapping

- `Map<Node, Set<Node>>` สำหรับ adjacency list
- ใช้ queue/stack สำหรับ BFS/DFS
- ใช้ library เช่น `graphlib` ถ้าจำเป็น

## Expected Outcome

- สามารถสร้าง graph จากปัญหา
- สามารถหา cycles, paths, components
- สามารถทำ topological sort
- สามารถประยุกต์ใน dependencies และ workflows
