# Queueing Theory

## Goal

Understand queueing theory: Little's law, utilization, M/M/1, waiting time, and their application in capacity planning, latency budget, concurrency sizing, backpressure

## Scope

- Use for systems where arriving requests wait for service: server, connection pool, message queue, UI event loop
- Covers arrival/service processes, Little's law, M/M/1 and variants, utilization cliff
- Applied in sizing threads/pools, setting timeouts, explaining latency spikes before saturation

## Execute

### 1. Describe The Queue

> Goal: identify the components of a queueing system

1. arrival process: rate `λ` (requests/sec) — Poisson arrivals are common (M)
2. service process: rate `μ` (services/sec), service time = `1/μ` — exponential (M) or deterministic (D)
3. servers `c`, queue capacity, discipline: FIFO/LIFO/priority, drop policy (tail drop, head drop)
4. Write Kendall notation: `M/M/1`, `M/M/c`, `M/D/1`, `M/G/1`

### 2. Apply Little's Law

> Goal: relate queue length to latency — usable even without knowing the distribution

1. `L = λ · W` — number of jobs in the system = arrival rate × average time in the system
2. Use in reverse: needing concurrency `L` at latency `W` → sized pool = `λ · W` + headroom
3. Example: 1000 req/s × 20ms = on average 20 concurrent jobs in the system → pool ≥ 20-30
4. Use to check metrics: if throughput and latency don't match the queue depth → a hidden queue exists

### 3. Analyze M/M/1 And Utilization

> Goal: understand the nonlinear latency before saturation

1. utilization `ρ = λ / μ` (must be < 1 for the system to be stable)
2. average time in the system `W = 1 / (μ - λ)` — as `ρ → 1` latency shoots up like `1/(1-ρ)`
3. average queue length `L_q = ρ² / (1-ρ)` — the waiting part, not the service part
4. Key lesson: a system at 90% load isn't just 1.8x slower than at 50% — it's many times slower

### 4. Extend To Real Systems

> Goal: tune the model closer to reality

1. `M/M/c`: multiple servers → utilization per server drops, latency improves nonlinearly (Erlang-C)
2. long-tailed service times (heavy tail) → variance dominates: `M/G/1` (P-K formula) — P99 service time matters more than the mean
3. finite queue + drop → loss rate (Erlang-B); retry storms inflate `λ` beyond reality → positive feedback
4. every hop (network + server) has its own queue — think of latency as an end-to-end budget

### 5. Map To Code

> Goal: apply in software

1. pool sizing: connection/thread/worker pool = `λ·W` + headroom — verify with a load test
2. set timeouts from the latency budget, not arbitrarily; check `ρ` before scaling out
3. backpressure: when `ρ → 1`, signal (429, queue full) instead of accepting and stalling
4. batching and buffering = raise effective `μ` but increase `W` — a throughput vs latency tradeoff
5. a load test must measure P50/P95/P99 against the model — the mean lies near saturation

## Rules

### 1. Assumption Honesty

- The Poisson assumption breaks when clients retry heavily or traffic is bursty/seasonal — measure reality before extrapolating
- Little's law always holds (steady state) — use it as the first sanity check
- Don't extrapolate M/M/1 when service times are heavy-tailed → use P99-based reasoning

### 2. Stability First

- Only `ρ < 1` — beyond that the queue grows unbounded and every metric breaks
- Add capacity before adding load expectations — the cliff is nearer than intuition suggests
- Measure queue depth directly when possible (it is the ground truth signal)

### 3. Code Mapping

- Use a library for Erlang-C/B when doing serious capacity planning
- Use /run-bench to check real behavior, not just the model
- The model is a guide, the benchmark is the judge

- Use /follow-math-concepts (probability, statistics, markov-chains) if needed
- Use /deep-optimize if needed

## Expected Outcome

1. Able to explain why latency spikes before saturation via `1/(1-ρ)`
2. Able to size pools/concurrency with Little's law
3. Able to set timeout/backpressure/thresholds based on model + measurement
4. Able to choose the queue discipline and capacity correctly per the SLA
