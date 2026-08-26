---
name: follow-math-optimization
description: หาค่า min/max ภายใต้ constraints ด้วย linear programming, gradient descent, dynamic programming
argument-hint: "[problem]"
related:
  - follow-math-linear-algebra
  - follow-math-algorithm-complexity
  - follow-goal
  - follow-software-engineering
  - follow-parallel
  - follow-math-concepts
---

## Goal

เข้าใจ optimization: หาค่า min/max ภายใต้ constraints ด้วย linear programming, greedy, dynamic programming, gradient descent และประยุกต์ใช้ใน resource allocation, scheduling, ML

## Scope

- ใช้สำหรับปัญหา resource allocation, scheduling, routing, hyperparameter tuning
- ครอบคลุม objective function, constraints, feasible region
- แนะนำ linear programming, integer programming, gradient descent, DP

## Execute

### 1. Formulate Problem

> Goal: เขียนปัญหาเป็น math form

1. ระบุ decision variables
2. ระบุ objective function (minimize หรือ maximize)
3. ระบุ constraints (equations/inequalities)
4. ระบุ domain: continuous, integer, binary

### 2. Choose Optimization Method

> Goal: เลือกวิธีทีเหมาะสม

1. Linear programming: objective และ constraints เป็น linear
2. Integer programming: variables เป็น integer
3. Greedy: ทำ locally optimal ทีละขั้น
4. Dynamic programming: แบ่ง subproblems ซ้ำ
5. Gradient descent: สำหรับ continuous objective

### 3. Linear Programming

> Goal: แก้ LP ปัญหา

1. เขียนปัญหาเป็น standard form
2. ใช้ simplex algorithm หรือ library
3. ตรวจ feasible region
4. หา optimal value ที่ corner point

### 4. Dynamic Programming

> Goal: แก้ปัญหาด้วย DP

1. ระบุ optimal substructure
2. ระบุ overlapping subproblems
3. สร้าง recurrence
4. เลือก top-down หรือ bottom-up
5. ลด space ถ้าไม่จำเป็นเก็บทั้ง table

### 5. Map To Code

> Goal: ประยุกต์ใน software

1. แบ่ง server resources ให้ latency ต่ำสุด
2. หา shortest path ด้วย Dijkstra (graph optimization)
3. ปรับ hyperparameters ด้วย gradient descent
4. ทำ capacity planning ด้วย LP

## Rules

### 1. Problem Type First

- ระบุ continuous vs discrete
- ระบุ linear vs non-linear
- ระบุ convexity ถ้ามี

### 2. Constraint Handling

- ตรวจ feasibility ก่อน optimize
- แยก hard constraints กับ soft constraints
- ใช้ penalty สำหรับ soft constraints

### 3. Code Mapping

- ใช้ libraries เช่น `glpk`, `scipy.optimize` สำหรับ LP
- ใช้ DP table ถ้า subproblems ซ้ำ
- ใช้ gradient ถ้ามี differentiable objective

## Expected Outcome

- สามารถ formulate optimization problem
- สามารถเลือกวิธีทีเหมาะสม
- สามารถใช้ LP, DP, gradient descent พื้นฐาน
- สามารถประยุกต์ใน resource allocation และ scheduling
