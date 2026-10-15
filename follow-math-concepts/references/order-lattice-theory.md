# Order And Lattice Theory

## Goal

Understand order theory and lattices: partial orders, posets, monotonic functions, fixed points, join/meet, and their application in type systems, versioning, concurrency/CRDT, database dependencies

## Scope

- Use for work with a non-linear "greater/less than" concept: subtyping, semver, DAG ordering, consistency
- Covers partial/total order, Hasse diagram, upper/lower bounds, sup/inf, lattice, fixed points
- Applied in type hierarchy, migration ordering, eventual consistency, dependency resolution

## Execute

### 1. Distinguish Total vs Partial Order

> Goal: know how comparable the data is

1. total order: every pair is comparable (`<=` on numbers) → sorts into a single line
2. partial order: some pairs are incomparable, e.g. subset `⊆`, divisibility, DAG reachability, semver pre-release
3. properties: reflexive, antisymmetric, transitive — check before claiming an "order"
4. Draw the Hasse diagram: skip reflexive/transitive edges, keep only covers

### 2. Work With Bounds

> Goal: find shared supersets/subsets

1. upper bound of S: every element in S is `<=` b; least upper bound (supremum/join `⊔`) = the smallest bound
2. lower bound and infimum (meet `⊓`) — in a lattice every pair has a join + meet
3. incomparable doesn't mean no bound: `{a}` and `{b}` have join = `{a,b}` in the power set lattice
4. map: join of states = merged state, meet of requirements = the shared satisfiable condition

### 3. Recognize Lattices In CS

> Goal: use join/meet structure in real work

1. set family (union/intersection), divisor lattice (lcm/gcd), type lattice (`|`/`&` or subtype join/meet)
2. semver + dependency resolution: candidate versions form a poset — the resolver finds compatible meets
3. CRDT merge = join on a state lattice — monotonicity makes merges lossless (conflict-free because an upper bound always exists)
4. control flow / abstract interpretation: values from each branch are meet-ed at the join point

### 4. Use Monotonicity And Fixed Points

> Goal: reason about growth and recursion

1. monotone function: `x <= y ⇒ f(x) <= f(y)` — more input data must not reduce the result (index, cache version, eventual consistency)
2. Knaster-Tarski: a monotone function on a complete lattice always has a least fixed point
3. converge from bottom: `⊥, f(⊥), f(f(⊥)), ...` — this is the semantics of recursive definitions and Datalog/Prolog evaluation
4. map: type inference = finding the fixed point of a constraint function; dataflow analysis = iterate until a fixed point

### 5. Map To Code

> Goal: apply in software

1. sort by total order when everything is comparable — when partial → arrange as a DAG/topological order instead (`graph-theory`)
2. migration/dependency ordering is a poset — use topological sort, check whether incomparable pairs really can run in parallel
3. designing merge/reconcile logic → make state a lattice + updates monotone → conflict-free by construction
4. subtyping/assignability = an order on types — understand this level to fix type system errors

## Rules

### 1. Don't Force Totality

- Trying to sort/compare a partial order with a total comparator = wrong data (throws away incomparability)
- A non-transitive comparator makes sort results unstable/unpredictable — check antisymmetry + transitivity

### 2. Fixed Point Discipline

- Iteration must be monotone on a bounded lattice → convergence guaranteed; otherwise it may oscillate
- Set an iteration budget + detect no-progress instead of an unbounded loop

### 3. Code Mapping

- posets: use DAG tools (topological sort) from `graph-theory`
- test lattice/merge logic with property-based testing (`/follow-lib-fast-check`): commutativity, associativity, idempotence of join

- Use /follow-math-concepts (set-theory, graph-theory, category-theory) if needed
- Use /deep-review-codebase if needed

## Expected Outcome

1. Distinguish total vs partial order and choose the right structure for the task
2. Use join/meet/bound to explain merge, dependency, and types
3. Use monotonicity + fixed points to reason about recursion/consistency
4. Design a conflict-free merge using lattice properties
