# Optimization

## Goal

Understand optimization: finding min/max under constraints with linear programming, greedy, dynamic programming, gradient descent, and their application in resource allocation, scheduling, ML

## Scope

- Use for resource allocation, scheduling, routing, hyperparameter tuning problems
- Covers objective function, constraints, feasible region
- Introduces linear programming, integer programming, gradient descent, DP

## Execute

### 1. Formulate Problem

> Goal: write the problem in math form

1. Identify the decision variables
2. Identify the objective function (minimize or maximize)
3. Identify the constraints (equations/inequalities)
4. Identify the domain: continuous, integer, binary

### 2. Choose Optimization Method

> Goal: pick the suitable method

1. Linear programming: objective and constraints are linear
2. Integer programming: variables are integers
3. Greedy: act locally optimal step by step
4. Dynamic programming: split into repeating subproblems
5. Gradient descent: for a continuous objective

### 3. Linear Programming

> Goal: solve an LP problem

1. Write the problem in standard form
2. Use the simplex algorithm or a library
3. Check the feasible region
4. Find the optimal value at a corner point

### 4. Dynamic Programming

> Goal: solve a problem with DP

1. Identify the optimal substructure
2. Identify the overlapping subproblems
3. Build the recurrence
4. Choose top-down or bottom-up
5. Reduce space if keeping the whole table isn't needed

### 5. Map To Code

> Goal: apply in software

1. Split server resources to minimize latency
2. Find the shortest path with Dijkstra (graph optimization)
3. Tune hyperparameters with gradient descent
4. Do capacity planning with LP

## Rules

### 1. Problem Type First

- Identify continuous vs discrete
- Identify linear vs non-linear
- Identify convexity if present

### 2. Constraint Handling

- Check feasibility before optimizing
- Separate hard constraints from soft constraints
- Use a penalty for soft constraints

### 3. Code Mapping

- Use libraries such as `glpk`, `scipy.optimize` for LP
- Use a DP table when subproblems repeat
- Use gradient methods when the objective is differentiable

- Use /follow-math-concepts if needed
- Use /follow-goal if needed
- Use /follow-software-engineering if needed
- Use /follow-parallel if needed

## Expected Outcome

- Able to formulate an optimization problem
- Able to choose the suitable method
- Able to use basic LP, DP, gradient descent
- Able to apply it in resource allocation and scheduling
