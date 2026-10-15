# Markov Chains

## Goal

Understand Markov chains: states, transition matrix, stationary distribution, random walks, and their application in cache modeling, PageRank, retry, load balancing, MCMC sampling

## Scope

- Use for systems where the next state depends only on the current state (memoryless)
- Covers transition matrix, Chapman-Kolmogorov, stationary distribution, absorbing states
- Applied in cache hit/miss, connection state, leader election, ranking, sampling

## Execute

### 1. Define States And Transitions

> Goal: model the system as a Markov chain

1. Identify the state space: cache hit/miss, connected/disconnected, idle/busy
2. Check the Markov property: P(next | history) = P(next | current) — if false, expand the state so memory lives in the state
3. Write the transition matrix `P` where `P[i][j] = P(next=j | now=i)` — each row sums to 1
4. multi-step: `Pⁿ` gives the probability after n steps (Chapman-Kolmogorov = matrix power)

### 2. Compute Stationary Distribution

> Goal: find the long-run behavior

1. The stationary distribution `π` satisfies `πP = π` and sums to 1
2. In an ergodic chain (irreducible + aperiodic) → `π` is the unique limit distribution, independent of the start state
3. Compute: power iteration (`π ← πP` repeatedly) or solve a linear system
4. Interpret as the fraction of time the system spends in each state, e.g. idle 80%, busy 20%

### 3. Classify Chain Properties

> Goal: know what the chain looks like

1. irreducible: every state reaches every other — no getting stuck in a subset
2. absorbing state: once in, can't leave — use to model failure-terminal, game over
3. periodic: returns to the same state in a rhythm → no direct limit distribution, must use the Cesàro average
4. Check in code: a retry loop with fixed sleep may create a periodic pattern that biases measurement

### 4. Apply Ranking And Sampling

> Goal: use algorithms based on the stationary distribution

1. PageRank = random walk on the link graph + a damping factor for ergodicity
2. MCMC (Metropolis-Hastings, Gibbs): build a chain whose `π` is the target when direct sampling is impossible
3. Markov decision process: add actions + rewards → dynamic programming / RL

### 5. Map To Code

> Goal: apply in software

1. cache modeling: hit/miss as a 2-state chain → long-run hit rate from `π`
2. connection pool / circuit breaker: closed→open→half-open→closed as a chain — predict the time fraction per state
3. retry: exponential backoff changes the transition probabilities — calculate the success chance before the timeout budget
4. load balancer: session affinity = a transition matrix that is non-homogeneous per user → must include the node's state too

## Rules

### 1. Markov Property Check First

- If the dependency spans more than 1 step → expand the state (e.g. fold "prev status" into the state), then use the matrix
- Don't assume memoryless for systems with a FIFO queue that remembers order

### 2. Matrix Hygiene

- Every row of `P` must sum to 1 — verify with a test
- Check aperiodicity before interpreting the stationary distribution as a long-run fraction
- Power iteration converges slowly when the spectral gap is small — look at mixing time

### 3. Code Mapping

- Use a matrix library (`numpy`); don't manual-loop in a hot path
- Monte Carlo simulation verifies the analytic result when the chain is large
- Obtain transition probabilities from logs/measured frequency, not guesses

- Use /follow-math-concepts (probability, linear-algebra) if needed
- Use /deep-debug if needed

## Expected Outcome

1. Model a stateful system as a Markov chain with a correct transition matrix
2. Find the stationary distribution and interpret it as long-run behavior
3. Use PageRank/MCMC concepts correctly for the right real-world task
4. Check that the assumptions (memoryless, ergodic) hold in your own case
